<template>
    <wwEditorInputRow
        :label="property.name"
        :placeholder="property.default !== undefined ? 'Default: ' + property.default : 'Enter a value'"
        :type="property.type === 'onoff' ? 'radio' : property.type"
        :choices="booleanChoices"
        :required="property.required"
        :model-value="inputValue"
        @update:modelValue="setValue"
        bindable
    />
</template>

<script>
// A distinct UI value keeps an omitted boolean separate from explicit false/null.
const UNSET = '__ww_supabase_unset__';

export default {
    props: {
        property: { type: Object, required: true },
        modelValue: { default: undefined },
    },
    emits: ['update:modelValue'],
    computed: {
        inputValue() {
            return this.property.type === 'onoff' && this.modelValue === undefined ? UNSET : this.modelValue;
        },
        booleanChoices() {
            return [
                { label: 'Not set', value: UNSET },
                { label: 'On', value: true },
                { label: 'Off', value: false },
                { label: 'Null', value: null },
            ];
        },
    },
    methods: {
        setValue(value) {
            this.$emit('update:modelValue', this.property.type === 'onoff' && value === UNSET ? undefined : value);
        },
    },
};
</script>
