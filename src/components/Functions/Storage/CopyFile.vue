<template>
    <wwEditorInputRow
        label="From bucket"
        type="query"
        placeholder="Enter a bucket name"
        bindable
        required
        :model-value="bucket"
        @update:modelValue="setArgs({ bucket: $event })"
    />
    <wwEditorInputRow
        label="From Path"
        type="query"
        placeholder="Enter a file path"
        required
        bindable
        :model-value="path"
        @update:modelValue="setArgs({ path: $event })"
    />
    <wwEditorInputRow
        label="To Path"
        type="query"
        placeholder="Enter a file path"
        required
        bindable
        :model-value="newPath"
        @update:modelValue="setArgs({ newPath: $event })"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({}) },
    },
    emits: ['update:args'],
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        bucket() {
            return this.args.bucket;
        },
        path() {
            return this.args.path || '';
        },
        newPath() {
            return this.args.newPath || '';
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
    },
};
</script>
