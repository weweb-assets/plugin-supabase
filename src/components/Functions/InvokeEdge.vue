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
    <wwEditorFormRow>
        <div class="flex items-center">
            <wwEditorInputSwitch :model-value="useStreaming" @update:modelValue="setUseStreaming" />
            <div class="body-sm ml-2">Stream response</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="The response will be streamed in real-time. You can use the stream variable to receive the data. This requires the edge function to support streaming responses."
                class="ml-auto"
            />
        </div>
    </wwEditorFormRow>
    <wwEditorInputRow
        v-if="useStreaming"
        label="Stream variable"
        placeholder="Select an array variable"
        type="select"
        :actions="[{ icon: 'plus', label: 'Create variable', onAction: createWwVariable }]"
        :options="wwVariableOptions"
        :model-value="streamVariableId"
        @update:modelValue="setArgs({ streamVariableId: $event })"
        @action="action => action?.onAction()"
        required
        tooltip="The array variable that will receive the stream data"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';

export default {
    components: { Expandable },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided', useStreaming: false }) },
    },
    emits: ['update:args'],
    setup() {
        const { website: websiteVariables, components: componentVariables } = wwLib.wwVariable.useEditorVariables();

        return { websiteVariables, componentVariables };
    },
    data() {
        return {
            isAdvancedOpen: false,
            isLoading: false,
            functionsOptions: [],
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
        useStreaming() {
            return this.args.useStreaming || false;
        },
        streamVariableId() {
            return this.args.streamVariableId;
        },
        wwVariables() {
            return [
                ...(this.websiteVariables ? Object.values(this.websiteVariables) : []),
                ...(this.componentVariables ? Object.values(this.componentVariables) : []),
            ].filter(variable => {
                if (variable.componentType === 'libraryComponent') return false;
                return true;
            });
        },
        wwVariableOptions() {
            return this.wwVariables
                .filter(variable => variable.type === 'array')
                .map(variable => {
                    const labelPrefix = variable.componentType
                        ? wwLib.wwElement.getComponentLabel(variable.componentType, variable.componentUid)
                        : null;

                    const label = labelPrefix ? `${labelPrefix} - ${variable.name}` : variable.name;

                    return {
                        label,
                        value: variable.id,
                        icon: variable.type,
                    };
                });
        },
    },
    mounted() {
        this.fetchFunctions();
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        async fetchFunctions() {
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({ method: 'GET', path: '/edge' });
                this.functionsOptions = data?.data.map(func => ({ label: func.name, value: func.slug }));
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
            }
        },
        setUseStreaming(useStreaming) {
            this.setArgs({ useStreaming });
        },
        createWwVariable() {
            wwLib.wwPopupSidebars.open({ name: 'NAVIGATOR' });
            wwLib.$emit('wwTopBar:navigator:tab', 'data');
            wwLib.$emit('wwTopBar:navigator:data:variables:set', null);
        },
    },
};
</script>
