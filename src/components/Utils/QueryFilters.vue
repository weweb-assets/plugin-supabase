<template>
    <wwEditorFormRow label="Filters">
        <template #append-label>
            <button type="button" class="ww-editor-button -primary -small ml-auto" @click="addFilter">
                <wwEditorIcon class="ww-editor-button-icon -left" name="plus" small />
                Add filter
            </button>
        </template>
        <div
            v-for="(filter, index) in filters"
            :key="filter.fn + index"
            class="flex flex-col ww-box mb-3 p-2"
            style="box-shadow: unset"
        >
            <wwEditorFormRow>
                <div class="flex items-center">
                    <button
                        type="button"
                        class="ww-editor-button -tertiary -blue -small -icon"
                        @click="moveUpFilter(index)"
                    >
                        <wwEditorIcon class="ww-editor-button-icon -left" name="chevron-up" small />
                    </button>
                    <button
                        type="button"
                        class="ww-editor-button -tertiary -blue -small -icon ml-2"
                        @click="moveDownFilter(index)"
                    >
                        <wwEditorIcon class="ww-editor-button-icon -left" name="chevron-down" small />
                    </button>
                    <button
                        type="button"
                        class="ml-auto ww-editor-button -tertiary -red -small"
                        @click="removeFilter(index)"
                    >
                        <wwEditorIcon class="ww-editor-button-icon -left" name="trash" small />
                        Remove
                    </button>
                </div>
            </wwEditorFormRow>
            <wwEditorFormRow label="Condition">
                <template #append-label>
                    <a
                        class="ww-editor-link ml-auto"
                        :href="'https://supabase.com/docs/reference/javascript/' + filter.fn"
                        target="_blank"
                    >
                        Documentation
                    </a>
                </template>
                <div class="flex items-center">
                    <wwEditorInput
                        type="select"
                        :model-value="filter.fn"
                        :options="conditions"
                        small
                        @update:modelValue="updateFilter(index, { ...filter, fn: $event })"
                    />
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        :forced-content="conditions.find(f => f.value === filter.fn).description"
                        class="ml-2"
                    />
                </div>
            </wwEditorFormRow>
            <wwEditorInputRow
                v-if="filter.fn !== 'or' && filter.fn !== 'match'"
                type="query"
                :model-value="filter.column"
                label="Column"
                placeholder="column or linkedColumn(column)"
                bindable
                small
                required
                @update:modelValue="updateFilter(index, { ...filter, column: $event })"
            />
            <wwEditorInputRow
                v-if="filter.fn === 'filter' || filter.fn === 'not'"
                type="query"
                :model-value="filter.operator"
                label="Operator"
                placeholder="is"
                bindable
                small
                required
                @update:modelValue="updateFilter(index, { ...filter, operator: $event })"
            />
            <wwEditorFormRow label="Value" required>
                <div class="flex items-center">
                    <wwEditorInput
                        type="query"
                        :model-value="filter.value"
                        bindable
                        small
                        @update:modelValue="updateFilter(index, { ...filter, value: $event })"
                    />
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        class="ml-2"
                        :forcedContent="conditions.find(f => f.value === filter.fn).tooltip"
                    />
                </div>
            </wwEditorFormRow>
            <wwEditorInputRow
                v-if="filter.fn === 'textSearch'"
                type="code"
                :model-value="filter.options"
                label="Options"
                bindable
                small
                @update:modelValue="updateFilter(index, { ...filter, options: $event })"
            />
            <wwEditorInputRow
                type="onoff"
                :model-value="filter.isEnabled"
                label="Apply if"
                bindable
                small
                @update:modelValue="updateFilter(index, { ...filter, isEnabled: $event })"
            />
        </div>
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        modelValue: { type: Array, default: () => [] },
    },
    emits: ['update:modelValue'],
    data: () => ({
        conditions: [
            {
                label: 'Column is equal to a value',
                value: 'eq',
                description: 'Match only rows where column is equal to value.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is not equal to a value',
                value: 'neq',
                description: 'Match only rows where column is not equal to value.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is greater than a value',
                value: 'gt',
                description: 'Match only rows where column is greater than value.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is greater than or equal to a value',
                value: 'gte',
                description: 'Match only rows where column is greater than or equal to value.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is less than a value',
                value: 'lt',
                description: 'Match only rows where column is less than value.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is less than or equal to a value',
                value: 'lte',
                description: 'Match only rows where column is less than or equal to value.',
                tooltip: 'The pattern to match with',
            },
            {
                label: 'Column matches a pattern',
                value: 'like',
                description: 'Match only rows where column matches pattern case-sensitively.',
                tooltip: 'The pattern to match with',
            },
            {
                label: 'Column matches a case-insensitive pattern',
                value: 'ilike',
                description: 'Match only rows where column matches pattern case-insensitively.',
                tooltip: 'The value to filter with',
            },
            {
                label: 'Column is a value',
                value: 'is',
                description: 'Match only rows where column IS value.',
                tooltip: 'The values array to filter with',
            },
            {
                label: 'Column is in an array',
                value: 'in',
                description: 'Match only rows where column is included in the values array.',
                tooltip: 'The jsonb, array, or range value to filter with',
            },
            {
                label: 'Column contains every element in a value',
                value: 'contains',
                description:
                    'Only relevant for jsonb, array, and range columns. Match only rows where column contains every element appearing in value.',
                tooltip: 'The jsonb, array, or range value to filter with',
            },
            {
                label: 'Contained by value',
                value: 'containedBy',
                description:
                    'Only relevant for jsonb, array, and range columns. Match only rows where every element appearing in column is contained by value.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'Greater than a range',
                value: 'rangeGt',
                description:
                    'Only relevant for range columns. Match only rows where every element in column is greater than any element in range.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'Greater than or equal to a range',
                value: 'rangeGte',
                description:
                    'Only relevant for range columns. Match only rows where every element in column is either contained in range or greater than any element in range.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'Less than a range',
                value: 'rangeLt',
                description:
                    'Only relevant for range columns. Match only rows where every element in column is less than any element in range.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'Less than or equal to a range',
                value: 'rangeLte',
                description:
                    'Only relevant for range columns. Match only rows where every element in column is either contained in range or less than any element in range.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'Mutually exclusive to a range',
                value: 'rangeAdjacent',
                description:
                    'Only relevant for range columns. Match only rows where column is mutually exclusive to range and there can be no element between the two ranges.',
                tooltip: 'The range to filter with',
            },
            {
                label: 'With a common element',
                value: 'overlaps',
                description:
                    'Only relevant for array and range columns. Match only rows where column and value have an element in common.',
                tooltip: 'The array or range value to filter with',
            },
            {
                label: 'Match a string',
                value: 'textSearch',
                description:
                    'Only relevant for text and tsvector columns. Match only rows where column matches the query string in query.',
                tooltip: 'The query text to match with',
            },
            {
                label: 'Match an associated value',
                value: 'match',
                description:
                    'Match only rows where each column in query keys is equal to its associated value. Shorthand for multiple .eq()s.',
                tooltip: 'The object to filter with, with column names as keys mapped to their filter values',
            },
            {
                label: "Don't match the filter",
                value: 'not',
                description:
                    "Match only rows which doesn't satisfy the filter. It expects you to use the raw PostgREST syntax for the filter values.",
                tooltip: 'The value to filter with, following PostgREST syntax',
            },
            {
                label: 'Match at least one filter',
                value: 'or',
                description:
                    'Match only rows which satisfy at least one of the filters. It expects you to use the raw PostgREST syntax for the filter names and values.',
                tooltip: 'The filters to use, following PostgREST syntax',
            },
            {
                label: 'Match the filter',
                value: 'filter',
                description:
                    'Match only rows which satisfy the filter. This is an escape hatch - you should use the specific filter methods wherever possible. It expects you to use the raw PostgREST syntax for the filter values.',
                tooltip: 'The value to filter with, following PostgREST syntax',
            },
        ],
    }),
    computed: {
        filters: {
            get() {
                return this.modelValue || [];
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
    methods: {
        addFilter(arg) {
            this.filters = [
                ...this.filters,
                { fn: 'eq', column: null, value: { __wwtype: 'f', code: '' }, isEnabled: true },
            ];
        },
        updateFilter(index, filter) {
            const filters = [...this.filters];
            filters.splice(index, 1, filter);
            this.filters = filters;
        },
        moveUpFilter(index) {
            if (index <= 0) return;
            const filters = [...this.filters];
            const removed = filters.splice(index, 1);
            filters.splice(index - 1, 0, removed[0]);
            this.filters = filters;
        },
        moveDownFilter(index) {
            if (index >= this.filters.length - 1) return;
            const filters = [...this.filters];
            const removed = filters.splice(index, 1);
            filters.splice(index + 1, 0, removed[0]);
            this.filters = filters;
        },
        removeFilter(index) {
            const filters = [...this.filters];
            filters.splice(index, 1);
            this.filters = filters;
        },
    },
};
</script>
