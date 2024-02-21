<template>
    <wwEditorFormRow label="Table" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select a table"
                required
                :model-value="table"
                :options="tablesOptions"
                @update:modelValue="setTable"
            />
            <button type="button" class="ww-editor-button -primary -small -icon ml-2" @click="fetchTables">
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>
    </wwEditorFormRow>
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
    <QueryFilters :model-value="filters" @update:modelValue="setFilters" />
    <Expandable class="mt-3" :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <QueryModifiers :model-value="modifiers" @update:modelValue="setModifiers" />
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../../Utils/Expandable.vue';
import QueryFilters from '../../Utils/QueryFilters.vue';
import QueryModifiers from '../../Utils/QueryModifiers.vue';

export default {
    components: { Expandable, QueryFilters, QueryModifiers },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided' }) },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: true,
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
        fieldsMode() {
            return this.args.fieldsMode;
        },
        dataFields() {
            return this.args.dataFields;
        },
        dataFieldsAdvanced() {
            return this.args.dataFieldsAdvanced;
        },
        filters() {
            return this.args.filters;
        },
        modifiers() {
            return this.args.modifiers;
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
        setFieldsMode(fieldsMode) {
            this.$emit('update:args', { ...this.args, fieldsMode });
        },
        setDataFields(dataFields) {
            this.$emit('update:args', { ...this.args, dataFields });
        },
        setDataFieldsAdvanced(dataFieldsAdvanced) {
            this.$emit('update:args', { ...this.args, dataFieldsAdvanced });
        },
        setFilters(filters) {
            this.$emit('update:args', { ...this.args, filters });
        },
        setModifiers(modifiers) {
            this.$emit('update:args', { ...this.args, modifiers });
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
