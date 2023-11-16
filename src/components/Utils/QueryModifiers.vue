<template>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.count" @update:modelValue="toggleModifier('count')" />
        <div class="label-3 ml-2">Count the results</div>
    </div>
    <div v-if="modifiers.count" class="flex flex-col ww-box mb-2 p-2" style="box-shadow: unset">
        <wwEditorInputRow
            label="Mode"
            type="select"
            :options="[
                { label: 'Exact', value: 'exact', default: true },
                { label: 'Planned', value: 'planned' },
                { label: 'Estimated', value: 'estimated' },
            ]"
            bindable
            small
            :model-value="modifiers.count.mode"
            @update:modelValue="setModifierSettings('count', { mode: $event })"
        />
        <wwEditorInputRow
            label="Return count only"
            type="onoff"
            bindable
            small
            :model-value="modifiers.count.countOnly"
            @update:modelValue="setModifierSettings('count', { countOnly: $event })"
        />
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.order" @update:modelValue="toggleModifier('order')" />
        <div class="label-3 ml-2">Order the results</div>
    </div>
    <div v-if="modifiers.order" class="flex flex-col ww-box mb-2 p-2" style="box-shadow: unset">
        <wwEditorInputRow
            label="Column"
            type="query"
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
            :model-value="modifiers.order.ascending ?? true"
            @update:modelValue="setModifierSettings('order', { ascending: $event })"
        />
        <wwEditorInputRow
            label="Foreign table"
            type="query"
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
            class="mb-0"
            :model-value="modifiers.order.nullsFirst"
            @update:modelValue="setModifierSettings('order', { nullsFirst: $event })"
        />
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.limit" @update:modelValue="toggleModifier('limit')" />
        <div class="label-3 ml-2">Limit the number of rows returned</div>
    </div>
    <div v-if="modifiers.limit" class="flex flex-col ww-box mb-2 p-2" style="box-shadow: unset">
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
            bindable
            small
            class="mb-0"
            :model-value="modifiers.limit.foreignTable"
            @update:modelValue="setModifierSettings('limit', { foreignTable: $event })"
        />
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.range" @update:modelValue="toggleModifier('range')" />
        <div class="label-3 ml-2">Limit the query to a range</div>
    </div>
    <div v-if="modifiers.range" class="flex flex-col ww-box mb-2 p-2" style="box-shadow: unset">
        <wwEditorInputRow
            label="From"
            type="number"
            bindable
            small
            required
            :model-value="modifiers.range.from"
            @update:modelValue="setModifierSettings('range', { from: $event })"
        />
        <wwEditorInputRow
            label="To"
            type="number"
            bindable
            small
            required
            :model-value="modifiers.range.to"
            @update:modelValue="setModifierSettings('range', { to: $event })"
        />
        <wwEditorInputRow
            label="Foreign table"
            type="query"
            bindable
            small
            class="mb-0"
            :model-value="modifiers.range.foreignTable"
            @update:modelValue="setModifierSettings('range', { foreignTable: $event })"
        />
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.single" @update:modelValue="toggleModifier('single')" />
        <div class="label-3 ml-2">Retrieve one row of data</div>
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch
            :model-value="!!modifiers.maybeSingle"
            @update:modelValue="toggleModifier('maybeSingle')"
        />
        <div class="label-3 ml-2">Retrieve zero or one row of data</div>
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.csv" @update:modelValue="toggleModifier('csv')" />
        <div class="label-3 ml-2">Retrieve as a CSV</div>
    </div>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch :model-value="!!modifiers.explain" @update:modelValue="toggleModifier('explain')" />
        <div class="label-3 ml-2">Using explain</div>
    </div>
    <div v-if="modifiers.explain" class="flex flex-col ww-box p-2" style="box-shadow: unset">
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
                { label: 'text', value: 'text', default: true },
                { label: 'json', value: 'json' },
            ]"
            bindable
            small
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
            class="mb-0"
            :model-value="modifiers.explain.wal"
            @update:modelValue="setModifierSettings('explain', { wal: $event })"
        />
    </div>
</template>

<script>
export default {
    props: {
        modelValue: { type: Object, default: () => {} },
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
    },
    methods: {
        toggleModifier(modifier) {
            this.modifiers = { ...this.modifiers, [modifier]: this.modifiers[modifier] ? false : {} };
        },
        setModifierSettings(modifier, settings) {
            this.modifiers = { ...this.modifiers, [modifier]: { ...this.modifiers[modifier], ...settings } };
        },
    },
};
</script>
