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
        label="Paths"
        type="array"
        bindable
        required
        :model-value="paths"
        @update:modelValue="setArgs({ paths: $event })"
        @add-item="setArgs({ paths: [...paths, ''] })"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item"
                label="Path"
                placeholder="Enter a file path"
                required
                small
                bindable
                @update:modelValue="setItem"
            />
        </template>
    </wwEditorInputRow>
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
        paths() {
            return this.args.paths || [];
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
    },
};
</script>
