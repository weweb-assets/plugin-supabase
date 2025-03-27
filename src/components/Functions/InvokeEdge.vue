<template>
    <wwEditorFormRow label="Function" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select a function"
                required
                :model-value="functionName"
                :options="functionsOptions"
                @update:modelValue="setArgs({ functionName: $event })"
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
    <wwEditorInputRow
        v-if="method !== 'GET'"
        label="Body"
        type="code"
        bindable
        :model-value="body"
        @update:modelValue="setArgs({ body: $event })"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
import { version } from 'vue';
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
            definition: null,
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
    },
    watch: {
        functionName(value) {
            if(value) {
                await this.loadDefinition(value);
                if(this.definition?.sample) {
                    this.setArgs({
                        method: this.definition.sample.method || 'POST',
                        body: this.definition.sample.body || null,
                        headers: this.definition.sample.headers || [],
                        queries: this.definition.sample.queries || [],
                    });
                }
            }
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        async fetchFunctions() {
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({ method: 'GET', path: '/edge' });
                this.functionsOptions = data?.data.map(func => ({ label: func.name, value: func.slug, version: func.version }));
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
            }
        },
        async loadDefinition(slug) {
            this.isLoading = true
            const { data } = await this.plugin.requestAPI({
                method: 'GET',
                path: `/edge/${value}/versions/${this.functionsOptions.find(f => f.value === slug).version}/config.json`,
            });
            this.definition = JSON.parse(data?.data?.['config.json'] || '{}');
            this.isLoading = false;
        },
    },
    async created() {
        await this.fetchFunctions();
        if (this.action.type && this.action.type.startsWith(wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction-')) {
            const edgeSlug = this.action.type.replace(wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction-', '');
            this.$emit('update:type', wwLib.wwPlugins.supabase.id + '-invokeEdgeFunction');
            await this.$nextTick();
            this.$emit('update:args', {
                ...this.action,
                functionName: edgeSlug,
            });
        }
    },
};
</script>
