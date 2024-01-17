<template>
    <wwEditorInputRow
        label="Function name"
        type="query"
        placeholder="hello"
        bindable
        required
        :model-value="functionName"
        @update:modelValue="setArgs({ functionName: $event })"
    />
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
        label="Body"
        type="code"
        bindable
        :model-value="body"
        @update:modelValue="setArgs({ body: $event })"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';

export default {
    components: { Expandable },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided' }) },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: false,
            isLoading: false,
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
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
    },
};
</script>
