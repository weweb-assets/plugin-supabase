<template>
    <wwEditorInputRow label="Filters" type="array" v-model="filters" @add-item="addFilter">
        <template #default="{ item, setItem }">
            <div class="flex flex-col">
                <div class="flex items-center">
                    <wwEditorInputRow
                        type="select"
                        :model-value="item.fn"
                        label="Condition"
                        :options="conditions"
                        small
                        @update:modelValue="setItem({ ...item, fn: $event })"
                    />
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        :forced-content="filters.find(f => f.fn === item.fn).description"
                        class="ml-2"
                    />
                </div>
                <wwEditorInputRow
                    v-if="item.fn !== 'or'"
                    type="query"
                    :model-value="item.column"
                    label="Column"
                    placeholder="name"
                    bindable
                    small
                    required
                    @update:modelValue="setItem({ ...item, column: $event })"
                />
                <wwEditorInputRow
                    v-if="item.fn === 'filter' || item.fn === 'not'"
                    type="query"
                    :model-value="item.operator"
                    label="Operator"
                    placeholder="is"
                    bindable
                    small
                    required
                    @update:modelValue="setItem({ ...item, operator: $event })"
                />
                <div class="flex items-center">
                    <wwEditorInputRow
                        type="query"
                        :model-value="item.value"
                        label="Value"
                        bindable
                        small
                        required
                        @update:modelValue="setItem({ ...item, value: $event })"
                    />
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        class="ml-2"
                        :forcedContent="filters.find(f => f.fn === item.fn).tooltip"
                    />
                </div>

                <wwEditorInputRow
                    v-if="item.fn === 'textSearch'"
                    type="code"
                    :model-value="item.options"
                    label="Options"
                    bindable
                    small
                    @update:modelValue="setItem({ ...item, options: $event })"
                />
            </div>
        </template>
    </wwEditorInputRow>
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
            { label: 'Column is greater than a value', value: 'gt' },
            { label: 'Column is greater than or equal to a value', value: 'gte' },
            { label: 'Column is less than a value', value: 'lt' },
            { label: 'Column is less than or equal to a value', value: 'lte' },
            { label: 'Column matches a pattern', value: 'like' },
            { label: 'Column matches a case-insensitive pattern', value: 'ilike' },
            { label: 'Column is a value', value: 'is' },
            { label: 'Column is in an array', value: 'in' },
            { label: 'Column contains every element in a value', value: 'contains' },
            { label: 'Contained by value', value: 'containedBy' },
            { label: 'Greater than a range', value: 'rangeGt' },
            { label: 'Greater than or equal to a range', value: 'rangeGte' },
            { label: 'Less than a range', value: 'rangeLt' },
            { label: 'Less than or equal to a range', value: 'rangeLte' },
            { label: 'Mutually exclusive to a range', value: 'rangeAdjacent' },
            { label: 'With a common element', value: 'overlaps' },
            { label: 'Match a string', value: 'textSearch' },
            { label: 'Match an associated value', value: 'match' },
            { label: "Don't match the filter", value: 'not' },
            { label: 'Match at least one filter', value: 'or' },
            { label: 'Match the filter', value: 'filter' },
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
            this.filters = [...this.filters, { fn: 'eq', column: null, value: { __wwType: 'f', code: '' } }];
        },
    },
};
</script>
