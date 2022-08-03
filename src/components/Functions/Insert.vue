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
    <template v-if="table">
        <wwEditorInputRow
            label="Fields"
            type="select"
            required
            multiple
            :options="tablePropertiesOptions"
            :model-value="dataFields"
            placeholder="All fields"
            @update:modelValue="setDataFields"
        />
        <wwEditorInputRow
            v-for="property of tablePropertiesFiltered"
            :key="property.name"
            :label="property.name"
            :placeholder="`${property.default ? `Default: ${property.default}` : 'Enter a value '}`"
            :type="property.type"
            :required="property.required"
            :model-value="data[property.name]"
            @update:modelValue="setData({ ...data, [property.name]: $event })"
            bindable
        />
    </template>
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => {} },
    },
    emits: ['update:args'],
    data() {
        return {
            definitions: {},
            isLoading: false,
        };
    },
    computed: {
        table() {
            return this.args.table;
        },
        dataFields() {
            return this.args.dataFields || [];
        },
        data() {
            return this.args.data || {};
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
        tablePropertiesFiltered() {
            return this.tableProperties.filter(
                property => !this.dataFields.length || this.dataFields.includes(property.name)
            );
        },
        tablePropertiesOptions() {
            return this.tableProperties.map(property => ({
                label: property.name,
                value: property.name,
            }));
        },
    },
    mounted() {
        this.definitions = (this.plugin.doc && this.plugin.doc.definitions) || {};
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, dataFields: [], data: {} });
        },
        setDataFields(dataFields) {
            this.$emit('update:args', { ...this.args, dataFields });
            this.$nextTick(() => this.setData({ ...this.data }));
        },
        setData(data) {
            for (const dataKey in data) {
                if (!this.tablePropertiesFiltered.find(field => field.name === dataKey)) {
                    delete data[dataKey];
                }
            }
            for (const field of this.tablePropertiesFiltered) {
                if (!data[field.name]) delete data[field.name];
            }
            this.$emit('update:args', { ...this.args, data });
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
