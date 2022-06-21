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
            placeholder="id,
supplier:supplier_id ( name ),
purchaser:purchaser_id ( name )"
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
        primaryProperties() {
            if (!this.definitions[this.database.table]) return [];
            return Object.keys(this.definitions[this.database.table].properties)
                .filter(propertyName =>
                    (this.definitions[this.database.table].properties[propertyName].description || '').includes('<pk/>')
                )
                .map(propertyName => ({ name: propertyName }));
        },
        tableProperties() {
            if (!this.definitions[this.database.table]) return [];
            return Object.keys(this.definitions[this.database.table].properties).map(propertyName => ({
                name: propertyName,
            }));
        },
        tablePropertiesOptions() {
            return this.tableProperties.map(property => ({
                label: property.name,
                value: property.name,
            }));
        },
    },
    watch: {
        definitions: {
            immediate: true,
            handler() {
                this.setProp(
                    'primaryData',
                    this.primaryProperties.map(primaryProperty => primaryProperty.name)
                );
            },
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
