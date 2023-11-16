<template>
    <wwEditorFormRow label="Modifiers">
        <template #append-label>
            <a
                class="ww-editor-link ml-auto"
                href="https://supabase.com/docs/reference/javascript/using-modifiers"
                target="_blank"
            >
                See documentation
            </a>
        </template>
        <wwEditorInputRow
            label="Order"
            type="onoff"
            small
            :model-value="!!modifiers.order"
            @update:modelValue="toggleModifier('order')"
        />
        <wwEditorInputRow
            label="Limit"
            type="onoff"
            small
            :model-value="!!modifiers.limit"
            @update:modelValue="toggleModifier('limit')"
        />
        <div v-if="modifiers.limit" class="flex flex-col ww-box mb-3 p-2" style="box-shadow: unset">
            <wwEditorInputRow
                label="Count"
                type="number"
                bindable
                small
                :model-value="modifiers.limit.count"
                @update:modelValue="setModifierSettings('limit', { count: $event })"
            />
        </div>
        <wwEditorInputRow
            label="Range"
            type="onoff"
            small
            :model-value="!!modifiers.range"
            @update:modelValue="toggleModifier('range')"
        />
        <div v-if="modifiers.range" class="flex flex-col ww-box mb-3 p-2" style="box-shadow: unset">
            <wwEditorInputRow
                label="From"
                type="number"
                bindable
                small
                :model-value="modifiers.range.from"
                @update:modelValue="setModifierSettings('range', { from: $event })"
            />
            <wwEditorInputRow
                label="To"
                type="number"
                bindable
                small
                :model-value="modifiers.range.to"
                @update:modelValue="setModifierSettings('range', { to: $event })"
            />
        </div>
        <wwEditorInputRow
            label="Single"
            type="onoff"
            small
            :model-value="!!modifiers.single"
            @update:modelValue="toggleModifier('single')"
        />
        <wwEditorInputRow
            label="Maybe single"
            type="onoff"
            small
            :model-value="!!modifiers.maybeSingle"
            @update:modelValue="toggleModifier('maybeSingle')"
        />
        <wwEditorInputRow
            label="CSV"
            type="onoff"
            small
            :model-value="!!modifiers.csv"
            @update:modelValue="toggleModifier('csv')"
        />
        <wwEditorInputRow
            label="Explain"
            type="onoff"
            bindable
            small
            :model-value="!!modifiers.explain"
            @update:modelValue="toggleModifier('explain')"
        />
        <div v-if="modifiers.explain" class="flex flex-col ww-box mb-3 p-2" style="box-shadow: unset">
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
                :model-value="modifiers.explain.wal"
                @update:modelValue="setModifierSettings('explain', { wal: $event })"
            />
        </div>
    </wwEditorFormRow>
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
            this.modifiers = { ...this.modifiers, modifier: modifier ? false : {} };
        },
        setModifierSettings(modifier, settings) {
            this.modifiers = { ...this.modifiers, modifier: { ...this.modifiers[modifier], ...settings } };
        },
    },
};
</script>
