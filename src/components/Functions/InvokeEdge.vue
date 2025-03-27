<template>
    <wwEditorFormRow label="Function" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select a function"
                required
                :model-value="functionName"
                :options="functionsOptions"
                @update:modelValue="setFunction($event)"
            />
            <button type="button" class="ww-editor-button -primary -small -icon ml-2" @click="fetchFunctions">
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Method"
        type="select"
        placeholder="POST"
        :model-value="method"
        :options="[
            { label: 'POST', value: 'POST', default: true },
            { label: 'GET', value: 'GET' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'DELETE', value: 'DELETE' },
        ]"
        @update:modelValue="setArgs({ method: $event })"
    />
    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="headers"
        bindable
        @update:modelValue="setArgs({ headers: $event })"
        @add-item="setArgs({ headers: [...(headers || []), {}] })"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Header key"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Header value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorInputRow
        label="Queries"
        type="array"
        :model-value="queries"
        bindable
        @update:modelValue="setArgs({ queries: $event })"
        @add-item="setArgs({ queries: [...(queries || []), {}] })"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Query key"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Query value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <template v-if="method !== 'GET'">
        <wwEditorInputRadio
            v-if="fields.length"
            class="mb-2"
            :model-value="fieldsMode"
            :choices="[
                { label: 'Guided', value: true },
                { label: 'Raw body', value: false },
            ]"
            small
            @update:modelValue="setArgs({ fieldsMode: $event })"
        />
        <wwEditorInputRow
            v-if="fieldsMode"
            v-for="(field, index) in fields"
            :key="index"
            :label="field.key"
            :tooltip="field.description"
            :model-value="parsedBody[field.key]"
            type="query"
            bindable
            @update:modelValue="setField(field.key, $event)"
        />
        <wwEditorInputRow
            v-else-if="!fields.length || !fieldsMode"
            label="Body"
            type="code"
            bindable
            :model-value="body"
            @update:modelValue="setArgs({ body: $event })"
        />
    </template>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';

export default {
    components: { Expandable },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided' }) },
        action: { type: Object, default: () => ({}) },
    },
    emits: ['update:args', 'update:type'],
    data() {
        return {
            isAdvancedOpen: false,
            isLoading: false,
            functionsOptions: [],
            config: null,
        };
    },
    computed: {
        functionName() {
            return this.args.functionName;
        },
        method() {
            return this.args.method;
        },
        headers() {
            return this.args.headers || [];
        },
        queries() {
            return this.args.queries || [];
        },
        body() {
            return this.args.body;
        },
        fieldsMode() {
            return this.args.fieldsMode;
        },
        fields() {
            return this.config?.definition?.body?.fields || [];
        },
        parsedBody() {
            try {
                return JSON.parse(this.body);
            } catch (error) {
                return {};
            }
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        setField(key, value) {
            this.setArgs({ body: JSON.stringify({ ...this.parsedBody, [key]: value }) });
        },
        async setFunction(value) {
            await this.loadFunctionConfig(value);
            if (this.config?.sample) {
                this.setArgs({
                    functionName: value,
                    method: this.config.sample.method || 'POST',
                    body: JSON.stringify(this.config.sample.body) || '',
                    headers: this.config.sample.headers || [],
                    queries: this.config.sample.queries || [],
                    fieldsMode: this.config?.definition?.body?.fields?.length ? true : false,
                });
            } else {
                this.setArgs({ functionName: value });
            }
        },
        async fetchFunctions() {
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({ method: 'GET', path: '/edge' });
                this.functionsOptions = data?.data.map(func => ({
                    label: func.name,
                    value: func.slug,
                    version: func.version,
                }));
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
            }
        },
        async loadFunctionConfig(slug) {
            this.isLoading = true;
            const { data } = await this.plugin.requestAPI({
                method: 'GET',
                path: `/edge/${slug}/versions/${this.functionsOptions.find(f => f.value === slug).version}`,
            });
            this.config = JSON.parse(data?.data?.['config.json'] || '{}');
            this.isLoading = false;
        },
    },
    async created() {
        await this.fetchFunctions();
        if (this.action.type && this.action.type.startsWith(wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction-')) {
            const edgeSlug = this.action.type.replace(wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction-', '');
            await this.setFunction(edgeSlug);
            await this.$nextTick();
            this.$emit('update:type', wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction');
        } else {
            await this.loadFunctionConfig(this.functionName);
        }
    },
};
</script>
