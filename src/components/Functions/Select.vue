<template>
    <div class="flex items-center">
        <div class="w-100 -full">
            <wwEditorInputRow
                label="Table"
                type="select"
                placeholder="Select a table"
                required
                :model-value="table"
                :options="tablesOptions"
                @update:modelValue="setTable"
            />
        </div>
        <button type="button" class="ww-editor-button -small -primary ml-2 mt-3" @click="fetchTables">refresh</button>
    </div>
    <wwEditorInputRow
        label="Count method"
        type="select"
        :model-value="countMethod"
        :options="[
            { label: 'No count', value: null },
            { label: 'Exact', value: 'exact' },
            { label: 'Planned', value: 'planned' },
            { label: 'Estimated', value: 'estimated' },
        ]"
        @update:modelValue="setCountMethod"
    />
    <wwEditorInputRow
        v-if="countMethod"
        label="Count only"
        type="onoff"
        :model-value="head"
        @update:modelValue="setHead"
    />
    <wwEditorFormRow label="Fields" required v-if="table">
        <wwEditorInputRadio
            class="mb-2"
            :model-value="fieldsMode"
            :choices="fieldsModeChoices"
            small
            @update:modelValue="setFieldsMode"
        />
        <wwEditorInput
            v-if="fieldsMode === 'guided'"
            type="select"
            multiple
            :options="tablePropertiesOptions"
            :model-value="dataFields"
            placeholder="All fields"
            @update:modelValue="setDataFields"
        />
        <wwEditorInput
            v-else
            type="string"
            :model-value="dataFieldsAdvanced"
            placeholder="column, linkedColumn(column)"
            @update:modelValue="setDataFieldsAdvanced"
        />
    </wwEditorFormRow>
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided' }) },
    },
    emits: ['update:args'],
    data() {
        return {
            definitions: {},
            isLoading: false,
            fieldsModeChoices: [
                { label: 'Guided', value: 'guided', default: true },
                { label: 'Advanced', value: 'advanced' },
            ],
        };
    },
    computed: {
        table() {
            return this.args.table;
        },
        countMethod() {
            return this.args.countMethod || null;
        },
        head() {
            return this.args.head || false;
        },
        fieldsMode() {
            return this.args.fieldsMode;
        },
        dataFields() {
            return this.args.dataFields;
        },
        dataFieldsAdvanced() {
            return this.args.dataFieldsAdvanced;
        },
        tablesOptions() {
            return Object.keys(this.definitions).map(tableName => ({
                label: tableName,
                value: tableName,
            }));
        },
        tableProperties() {
            if (!this.definitions[this.table]) return [];
            return Object.keys(this.definitions[this.table].properties).map(propertyName => ({
                name: propertyName,
                type: this.plugin.types[this.definitions[this.table].properties[propertyName].type] || 'object',
                required:
                    this.definitions[this.table].required &&
                    this.definitions[this.table].required.includes(propertyName) &&
                    !this.definitions[this.table].properties[propertyName].default,
                default: this.definitions[this.table].properties[propertyName].default,
            }));
        },
        tablePropertiesOptions() {
            return this.tableProperties.map(property => ({
                label: property.name,
                value: property.name,
            }));
        },
    },
    mounted() {
        this.definitions = this.plugin.doc.definitions || {};
        if (!this.args.fieldsMode) this.setFieldsMode('guided');
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, dataFields: [], dataFieldsAdvanced: '' });
        },
        setCountMethod(countMethod) {
            this.$emit('update:args', { ...this.args, countMethod });
        },
        setDefaultToNull(defaultToNull) {
            this.$emit('update:args', { ...this.args, defaultToNull });
        },
        setFieldsMode(fieldsMode) {
            this.$emit('update:args', { ...this.args, fieldsMode });
        },
        setDataFields(dataFields) {
            this.$emit('update:args', { ...this.args, dataFields });
        },
        setDataFieldsAdvanced(dataFieldsAdvanced) {
            this.$emit('update:args', { ...this.args, dataFieldsAdvanced });
        },
        async fetchTables() {
            try {
                this.isLoading = true;
                await this.plugin.fetchDoc();
                this.definitions = this.plugin.doc.definitions || {};
                this.refreshFields();
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        refreshFields() {
            // clear removed fields
            this.setDataFields(
                this.args.dataFields.filter(field => this.tableProperties.some(prop => prop.name === field))
            );
        },
    },
};
</script>
