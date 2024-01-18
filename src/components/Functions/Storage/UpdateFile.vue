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
    <wwEditorInputRow
        label="File"
        type="query"
        required
        bindable
        :model-value="file"
        @update:modelValue="setArgs({ file: $event })"
    />
    <Expandable class="mt-3" :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Cache Control (seconds)"
                            type="query"
                            placeholder="3600"
                            bindable
                            small
                            :model-value="options.cacheControl"
                            @update:modelValue="setOptions('cacheControl', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The number of seconds the asset is cached in the browser and in the Supabase CDN. This is set in the `Cache-Control: max-age=<seconds>` header. Defaults to 3600 seconds. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-upload)"
                        class="ml-2"
                    />
                </div>

                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Content Type"
                            type="query"
                            placeholder="auto"
                            bindable
                            small
                            :model-value="options.contentType"
                            @update:modelValue="setOptions('contentType', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-upload)"
                        class="ml-2"
                    />
                </div>
                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Duplex"
                            type="query"
                            bindable
                            small
                            :model-value="options.duplex"
                            @update:modelValue="setOptions('duplex', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The duplex option is a string parameter that enables or disables duplex streaming, allowing for both reading and writing data in the same stream. It can be passed as an option to the fetch() method. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-upload)"
                        class="ml-2"
                    />
                </div>
                <!-- <div class="flex items-center">
                    <wwEditorInputSwitch
                        :model-value="options.upsert"
                        @update:modelValue="setOptions('upsert', $event)"
                    />
                    <div class="label-3 ml-2">Upsert</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="When upsert is set to true, the file is overwritten if it exists. When set to false, an error is thrown if the object already exists. Defaults to false. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-upload)"
                        class="ml-auto"
                    />
                </div> -->
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
        file() {
            return this.args.file;
        },
        options() {
            return this.args.options || {};
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        setOptions(option, value) {
            this.$emit('update:args', {
                ...this.args,
                options: {
                    ...this.options,
                    [option]: value,
                },
            });
        },
    },
};
</script>
