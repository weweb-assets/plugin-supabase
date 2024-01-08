<template>
    <template v-if="type !== 'SELECT'">
        <div class="flex items-center mb-2">
            <wwEditorInputSwitch :model-value="!!modifiers.select" @update:modelValue="toggleSelect" />
            <div class="label-3 ml-2">{{ selectLabel || 'Return rows' }}</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Select the returned data mode. `Minimal` returns only rows ids. `Guided` allow you to select columns from the table. `Advanced` allow you to write your own query, useful to embed relationship."
                class="ml-auto"
            />
        </div>
        <div v-if="modifiers.select" class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0" style="box-shadow: unset">
            <wwEditorInputRow label="Returned fields">
                <wwEditorInputRadio
                    :class="{ 'mb-2': modifiers?.select.mode !== 'minimal' }"
                    :model-value="modifiers?.select.mode"
                    :choices="[
                        { label: 'Minimal', value: 'minimal', default: true },
                        { label: 'Guided', value: 'guided' },
                        { label: 'Advanced', value: 'advanced' },
                    ]"
                    small
                    @update:modelValue="
                        setModifierSettings('select', {
                            mode: $event,
                            fields: modifiers?.select.fields || [],
                            advanced: modifiers?.select.advanced || '',
                        })
                    "
                />
                <wwEditorInput
                    v-if="modifiers?.select.mode === 'guided'"
                    type="select"
                    multiple
                    :options="columns"
                    :model-value="modifiers?.select.fields"
                    placeholder="All fields"
                    @update:modelValue="setModifierSettings('select', { fields: $event })"
                />
                <wwEditorInput
                    v-else-if="modifiers?.select.mode === 'advanced'"
                    type="string"
                    :model-value="modifiers?.select.fieldsAdvanced"
                    placeholder="column, linkedColumn(column)"
                    @update:modelValue="setModifierSettings('select', { fieldsAdvanced: $event })"
                />
            </wwEditorInputRow>
        </div>
    </template>
    <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.count }">
        <wwEditorInputSwitch
            :model-value="!!modifiers.count"
            @update:modelValue="toggleModifier('count', { mode: 'exact' })"
            :disabled="disabled.count"
        />
        <div class="label-3 ml-2">Count the results</div>
        <wwEditorQuestionMark
            tooltip-position="top-left"
            forced-content="It will return the query related rows count depending of the selected count algorithm.  
`exact`: Exact but slow count algorithm. Performs a 'COUNT(*)' under the hood.  
`planned`: Approximated but fast count algorithm. Uses the Postgres statistics under the hood.  
`estimated`: Uses exact count for low numbers and planned count for high numbers."
            class="ml-auto"
        />
    </div>
    <div v-if="modifiers.count" class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0" style="box-shadow: unset">
        <wwEditorInputRow
            label="Mode"
            type="select"
            :options="[
                { label: 'Exact', value: 'exact' },
                { label: 'Planned', value: 'planned' },
                { label: 'Estimated', value: 'estimated' },
            ]"
            bindable
            small
            required
            :model-value="modifiers.count.mode"
            @update:modelValue="setModifierSettings('count', { mode: $event })"
        />
        <wwEditorInputRow
            v-if="type === 'SELECT'"
            label="Return count only"
            type="onoff"
            bindable
            small
            :model-value="modifiers.count.countOnly"
            @update:modelValue="setModifierSettings('count', { countOnly: $event })"
        />
    </div>
    <template v-if="type === 'SELECT'">
        <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.order }">
            <wwEditorInputSwitch
                :model-value="!!modifiers.order"
                @update:modelValue="toggleModifier('order', { ascending: true })"
                :disabled="disabled.order"
            />
            <div class="label-3 ml-2">Order the results</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Order the query result by column. Set foreign table to order by a foreign column. [See documentation](https://supabase.com/docs/reference/javascript/order)"
                class="ml-auto"
            />
        </div>
        <div v-if="modifiers.order" class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0" style="box-shadow: unset">
            <wwEditorInputRow
                label="Column"
                type="query"
                placeholder="column or linkedColumn(column)"
                bindable
                small
                required
                :model-value="modifiers.order.column"
                @update:modelValue="setModifierSettings('order', { column: $event })"
            />
            <wwEditorInputRow
                label="Ascending"
                type="onoff"
                bindable
                small
                :model-value="modifiers.order.ascending"
                @update:modelValue="setModifierSettings('order', { ascending: $event })"
            />
            <wwEditorInputRow
                label="Foreign table"
                type="query"
                placeholder="Enter a foreign table name"
                bindable
                small
                :model-value="modifiers.order.foreignTable"
                @update:modelValue="setModifierSettings('order', { foreignTable: $event })"
            />
            <wwEditorInputRow
                label="Nulls first"
                type="onoff"
                bindable
                small
                :model-value="modifiers.order.nullsFirst"
                @update:modelValue="setModifierSettings('order', { nullsFirst: $event })"
            />
        </div>
        <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.limit }">
            <wwEditorInputSwitch
                :model-value="modifiers.limit && !disabled.limit"
                @update:modelValue="toggleModifier('limit')"
                :disabled="disabled.limit"
            />
            <div class="label-3 ml-2">Limit the number of rows</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Limit the query result by count. Set foreign table to order by a foreign column. [See documentation](https://supabase.com/docs/reference/javascript/limit)"
                class="ml-auto"
            />
        </div>
        <div
            v-if="modifiers.limit && !disabled.limit"
            class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0"
            style="box-shadow: unset"
        >
            <wwEditorInputRow
                label="Count"
                type="number"
                bindable
                small
                required
                :model-value="modifiers.limit.count"
                @update:modelValue="setModifierSettings('limit', { count: $event })"
            />
            <wwEditorInputRow
                label="Foreign table"
                type="query"
                placeholder="Enter a foreign table name"
                bindable
                small
                :model-value="modifiers.limit.foreignTable"
                @update:modelValue="setModifierSettings('limit', { foreignTable: $event })"
            />
        </div>
        <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.range }">
            <wwEditorInputSwitch
                :model-value="modifiers.range && !disabled.range"
                @update:modelValue="toggleModifier('range')"
                :disabled="disabled.range"
            />
            <div class="label-3 ml-2">Limit the query to a range</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Limit the query result by starting at an offset index (from) and ending at the given end index (to). 
Only records within this range are returned.  

This respects the query order and if there is no order clause the range could behave unexpectedly.  

The from and to values are 0-based and inclusive: range(1, 3) will include the second, third and fourth rows of the query.  

Set a foreign table to limit rows of foreign tables instead of the current table. [See documentation](https://supabase.com/docs/reference/javascript/range)"
                class="ml-auto"
            />
        </div>
        <div
            v-if="modifiers.range && !disabled.range"
            class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0"
            style="box-shadow: unset"
        >
            <wwEditorInputRow
                label="From"
                type="number"
                placeholder="Enter the start index (ex: 0)"
                bindable
                small
                required
                :model-value="modifiers.range.from"
                @update:modelValue="setModifierSettings('range', { from: $event })"
            />
            <wwEditorInputRow
                label="To"
                type="number"
                placeholder="Enter the end index (ex: 5)"
                bindable
                small
                required
                :model-value="modifiers.range.to"
                @update:modelValue="setModifierSettings('range', { to: $event })"
            />
            <wwEditorInputRow
                label="Foreign table"
                type="query"
                placeholder="Enter a foreign table name"
                bindable
                small
                :model-value="modifiers.range.foreignTable"
                @update:modelValue="setModifierSettings('range', { foreignTable: $event })"
            />
        </div>
        <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.single }">
            <wwEditorInputSwitch
                :model-value="modifiers.single && !disabled.single"
                @update:modelValue="toggleModifier('single')"
                :disabled="disabled.single"
            />
            <div class="label-3 ml-2">Retrieve one row of data</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Apply a limit to 1 and return data as a single object instead of an array of objects. Throw an error if no row is returned. [See documentation](https://supabase.com/docs/reference/javascript/single)"
                class="ml-auto"
            />
        </div>
        <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.maybeSingle }">
            <wwEditorInputSwitch
                :model-value="modifiers.maybeSingle && !disabled.maybeSingle"
                @update:modelValue="toggleModifier('maybeSingle')"
                :disabled="disabled.maybeSingle"
            />
            <div class="label-3 ml-2">Retrieve zero or one row of data</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Apply a limit to 1 and return data as a single object instead of an array of objects. [See documentation](https://supabase.com/docs/reference/javascript/maybesingle)"
                class="ml-auto"
            />
        </div>
    </template>
    <div class="flex items-center mb-2" :class="{ 'text-stale-400': disabled.csv }">
        <wwEditorInputSwitch
            :model-value="!!modifiers.csv"
            @update:modelValue="toggleModifier('csv')"
            :disabled="disabled.csv"
        />
        <div class="label-3 ml-2">Retrieve as a CSV</div>
        <wwEditorQuestionMark
            tooltip-position="top-left"
            forced-content="Return data as a string in CSV format. [See documentation](https://supabase.com/docs/reference/javascript/db-csv)"
            class="ml-auto"
        />
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch
            :model-value="!!modifiers.explain"
            @update:modelValue="toggleModifier('explain', { format: 'text' })"
        />
        <div class="label-3 ml-2">Using explain</div>
        <wwEditorQuestionMark
            tooltip-position="top-left"
            forced-content="Return data as the EXPLAIN plan for the query.  

For debugging slow queries, you can get the Postgres EXPLAIN execution plan of a query
using the explain() method. This works on any query, even for rpc() or writes.  

Explain is not enabled by default as it can reveal sensitive information about your database.
It's best to only enable this for testing environments but if you wish to enable it for production you can provide additional protection by using a pre-request function.  

Follow the [Performance Debugging Guide](https://supabase.com/docs/guides/database/debugging-performance) to enable the functionality on your project. [See documentation](https://supabase.com/docs/reference/javascript/explain)"
            class="ml-auto"
        />
    </div>
    <div v-if="modifiers.explain" class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0" style="box-shadow: unset">
        <wwEditorInputRow
            label="Analyze"
            type="onoff"
            bindable
            small
            :model-value="modifiers.explain.analyze"
            @update:modelValue="setModifierSettings('explain', { analyze: $event })"
        />
        <wwEditorInputRow
            label="Buffers"
            type="onoff"
            bindable
            small
            :model-value="modifiers.explain.buffers"
            @update:modelValue="setModifierSettings('explain', { buffers: $event })"
        />
        <wwEditorInputRow
            label="Format"
            type="select"
            :options="[
                { label: 'text', value: 'text' },
                { label: 'json', value: 'json' },
            ]"
            bindable
            small
            required
            :model-value="modifiers.explain.format"
            @update:modelValue="setModifierSettings('explain', { format: $event })"
        />
        <wwEditorInputRow
            label="Settings"
            type="onoff"
            bindable
            small
            :model-value="modifiers.explain.settings"
            @update:modelValue="setModifierSettings('explain', { settings: $event })"
        />
        <wwEditorInputRow
            label="Verbose"
            type="onoff"
            bindable
            small
            :model-value="modifiers.explain.verbose"
            @update:modelValue="setModifierSettings('explain', { verbose: $event })"
        />
        <wwEditorInputRow
            label="Wal"
            type="onoff"
            bindable
            small
            :model-value="modifiers.explain.wal"
            @update:modelValue="setModifierSettings('explain', { wal: $event })"
        />
    </div>
</template>

<script>
export default {
    props: {
        modelValue: { type: Object, default: () => {} },
        type: { type: Boolean, default: 'SELECT' },
        selectLabel: { type: String, default: '' },
        columns: { type: Array, default: [] },
    },
    emits: ['update:modelValue'],
    computed: {
        modifiers: {
            get() {
                return this.modelValue || {};
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
        disabled() {
            return {
                count: !this.modifiers.select && this.type !== 'SELECT',
                order: !this.modifiers.select && this.type !== 'SELECT',
                limit:
                    (!this.modifiers.select && this.type !== 'SELECT') ||
                    this.modifiers.single ||
                    this.modifiers.maybeSingle,
                range:
                    (!this.modifiers.select && this.type !== 'SELECT') ||
                    this.modifiers.single ||
                    this.modifiers.maybeSingle,
                single:
                    (!this.modifiers.select && this.type !== 'SELECT') ||
                    this.modifiers.maybeSingle ||
                    this.modifiers.limit ||
                    this.modifiers.range,
                maybeSingle:
                    (!this.modifiers.select && this.type !== 'SELECT') ||
                    this.modifiers.single ||
                    this.modifiers.limit ||
                    this.modifiers.range,
                csv: !this.modifiers.select && this.type !== 'SELECT',
            };
        },
    },
    methods: {
        toggleModifier(modifier, baseSettings = true) {
            this.modifiers = { ...this.modifiers, [modifier]: this.modifiers[modifier] ? false : baseSettings };
        },
        setModifierSettings(modifier, settings) {
            this.modifiers = { ...this.modifiers, [modifier]: { ...this.modifiers[modifier], ...settings } };
        },
        toggleSelect(value) {
            this.modifiers = value
                ? { ...this.modifiers, select: { mode: 'minimal' } }
                : {
                      ...this.modifiers,
                      select: false,
                      count: false,
                      order: false,
                      limit: false,
                      range: false,
                      single: false,
                      maybeSingle: false,
                      csv: false,
                  };
        },
    },
};
</script>
