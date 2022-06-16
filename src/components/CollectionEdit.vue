<template>
    <div class="flex items-center">
        <div class="w-100 -full">
            <wwEditorInputRow
                label="Table"
                type="select"
                placeholder="Select a table"
                required
                :model-value="database.table"
                :options="tablesOptions"
                @update:modelValue="setProp('table', $event)"
            />
        </div>
        <button type="button" class="ww-editor-button -small -primary ml-2 mt-3" @click="fetchTables">refresh</button>
    </div>
    <wwEditorFormRow label="Fields" required v-if="database.table">
        <wwEditorInputRadio
            class="mb-2"
            :model-value="database.fieldsMode"
            :choices="fieldsModeChoices"
            small
            @update:modelValue="setProp('fieldsMode', $event)"
        />
        <wwEditorInput
            v-if="database.fieldsMode === 'guided'"
            type="select"
            multiple
            :options="tablePropertiesOptions"
            :model-value="database.dataFields"
            placeholder="All fields"
            @update:modelValue="setProp('dataFields', $event)"
        />
        <wwEditorInput
            v-else
            type="string"
            :model-value="database.dataFieldsAdvanced"
            placeholder="column, linkedColumn(column)"
            @update:modelValue="setProp('dataFieldsAdvanced', $event)"
        />
    </wwEditorFormRow>
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            isLoading: false,
            definitions: {},
            fieldsModeChoices: [
                { label: 'Guided', value: 'guided', default: true },
                { label: 'Advanced', value: 'advanced' },
            ],
        };
    },
    computed: {
        database() {
            return {
                table: null,
                fieldsMode: 'guided',
                dataFields: [],
                dataFieldsAdvanced: '',
                ...this.config,
            };
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
    },
    methods: {
        async fetchTables() {
            try {
                this.isLoading = true;
                await this.plugin.fetchDoc();
                this.definitions = this.plugin.doc.definitions || {};
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        setProp(key, value) {
            this.$emit('update:config', { ...this.database, [key]: value });
        },
    },
};
</script>
