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
        placeholder="Enter a folder path"
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
                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Limit"
                            type="number"
                            placeholder="100"
                            bindable
                            small
                            :model-value="options.limit"
                            @update:modelValue="setOptions('limit', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The number of files you want to be returned. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-list)"
                        class="ml-2"
                    />
                </div>

                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Offset"
                            type="number"
                            placeholder="0"
                            bindable
                            small
                            :model-value="options.offset"
                            @update:modelValue="setOptions('offset', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The starting position. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-list)"
                        class="ml-2"
                    />
                </div>
                <div class="flex items-center">
                    <div class="w-100 -full">
                        <wwEditorInputRow
                            label="Search"
                            type="query"
                            bindable
                            small
                            :model-value="options.search"
                            @update:modelValue="setOptions('search', $event)"
                        />
                    </div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The starting position. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-list)"
                        class="ml-2"
                    />
                </div>
                <div class="flex items-center mb-2">
                    <wwEditorInputSwitch
                        :model-value="options.sortBy"
                        @update:modelValue="toggleOptions('sortBy', { order: 'asc', column: '' })"
                        :disabled="mode === 'multiple'"
                    />
                    <div class="label-3 ml-2">Sort By</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="The column to sort by. Can be any column inside a FileObject. [See documentation](https://supabase.com/docs/reference/javascript/storage-from-list)"
                        class="ml-2"
                    />
                </div>
                <div
                    v-if="options.sortBy"
                    class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0"
                    style="box-shadow: unset"
                >
                    <wwEditorInputRow
                        label="Column"
                        type="query"
                        bindable
                        small
                        :model-value="options.sortBy.column"
                        @update:modelValue="setOptions('sortBy', { column: $event, order: options.sortBy.order })"
                    />
                    <wwEditorInputRow
                        label="Order"
                        type="select"
                        :options="[
                            { label: 'ASC', value: 'asc', default: true },
                            { label: 'DESC', value: 'desc' },
                        ]"
                        bindable
                        small
                        :model-value="options.sortBy.order"
                        @update:modelValue="setOptions('sortBy', { column: options.sortBy.column, order: $event })"
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
        toggleOptions(option, defaultValue) {
            this.$emit('update:args', {
                ...this.args,
                options: { ...this.options, [option]: this.options[option] ? false : defaultValue },
            });
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
