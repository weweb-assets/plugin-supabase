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
        label="Path"
        type="query"
        placeholder="Enter a file path"
        required
        bindable
        :model-value="path"
        @update:modelValue="setArgs({ path: $event })"
    />
    <Expandable class="mt-3" :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <div class="flex items-center mb-2">
                    <wwEditorInputSwitch
                        :model-value="options.download"
                        @update:modelValue="toggleOptions('download')"
                    />
                    <div class="label-3 ml-2">Get a download link</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="Opening the link will download the file if set to true. Set a custom filename if you want to trigger the download with a different filename. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl)"
                        class="ml-auto"
                    />
                </div>
                <div
                    v-if="options.download"
                    class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0"
                    style="box-shadow: unset"
                >
                    <wwEditorInputRow
                        label="Custom filename"
                        type="query"
                        bindable
                        small
                        :model-value="options.download.filename"
                        @update:modelValue="setOptions('download', { filename: $event })"
                    />
                </div>
                <div class="flex items-center mb-2">
                    <wwEditorInputSwitch
                        :model-value="options.transform"
                        @update:modelValue="toggleOptions('transform')"
                        :disabled="mode === 'multiple'"
                    />
                    <div class="label-3 ml-2">Transform</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="Transform the asset before serving it to the client. Only available with single mode. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl)"
                        class="ml-auto"
                    />
                </div>
                <div
                    v-if="options.transform"
                    class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0"
                    style="box-shadow: unset"
                >
                    <wwEditorInputRow
                        label="Format"
                        type="select"
                        :options="[
                            { label: 'Optimized', value: null, default: true },
                            { label: 'Original', value: 'origin' },
                        ]"
                        bindable
                        small
                        :model-value="options.transform.format"
                        @update:modelValue="setOptions('transform', { format: $event })"
                    />
                    <wwEditorInputRow
                        label="Resize"
                        type="select"
                        :options="[
                            { label: 'None', value: null, default: true },
                            { label: 'Cover', value: 'cover' },
                            { label: 'Contain', value: 'contain' },
                            { label: 'Fill', value: 'fill' },
                        ]"
                        bindable
                        small
                        :model-value="options.transform.resize"
                        @update:modelValue="setOptions('transform', { resize: $event })"
                    />
                    <wwEditorInputRow
                        label="Quality (20-100) | paid plan"
                        type="number"
                        placeholder="Default: 80"
                        bindable
                        small
                        :model-value="options.transform.quality"
                        @update:modelValue="setOptions('transform', { quality: $event })"
                    />
                    <wwEditorInputRow
                        label="Height (px) | paid plan"
                        type="number"
                        bindable
                        small
                        :model-value="options.transform.height"
                        @update:modelValue="setOptions('transform', { height: $event })"
                    />
                    <wwEditorInputRow
                        label="Width (px) | paid plan"
                        type="number"
                        bindable
                        small
                        :model-value="options.transform.width"
                        @update:modelValue="setOptions('transform', { width: $event })"
                    />
                </div>
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../../Utils/Expandable.vue';

export default {
    components: { Expandable },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({}) },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: true,
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
        options() {
            return this.args.options || {};
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        toggleOptions(option) {
            this.$emit('update:args', {
                ...this.args,
                options: { ...this.options, [option]: this.options[option] ? false : {} },
            });
        },
        setOptions(option, value) {
            this.$emit('update:args', {
                ...this.args,
                options: {
                    ...this.options,
                    [option]: { ...this.options[option], ...value },
                },
            });
        },
    },
};
</script>
