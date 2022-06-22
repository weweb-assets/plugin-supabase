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
            v-for="property of tableProperties"
            :key="property.name"
            :label="property.name"
            placeholder="Enter a value"
            :type="property.type"
            :required="property.required"
            :model-value="primaryData[property.name]"
            @update:modelValue="setPrimaryData({ ...primaryData, [property.name]: $event })"
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
        primaryData() {
            return this.args.primaryData || {};
        },
        tablesOptions() {
            return Object.keys(this.definitions).map(tableName => ({
                label: tableName,
                value: tableName,
            }));
        },
        tableProperties() {
            if (!this.definitions[this.table]) return [];
            return Object.keys(this.definitions[this.table].properties)
                .filter(propertyName =>
                    (this.definitions[this.table].properties[propertyName].description || '').includes('<pk/>')
                )
                .map(propertyName => ({
                    name: propertyName,
                    type: this.plugin.types[this.definitions[this.table].properties[propertyName].type] || 'object',
                    required: this.definitions[this.table].required.includes(propertyName),
                }));
        },
    },
    mounted() {
        this.definitions = this.plugin.doc.definitions || {};
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, primaryData: {} });
        },
        setPrimaryData(primaryData) {
            for (const primaryDataKey in primaryData) {
                if (!this.tableProperties.find(field => field.name === primaryDataKey)) {
                    delete primaryData[primaryDataKey];
                }
            }
            for (const field of this.tableProperties) {
                if (!primaryData[field.name]) delete primaryData[field.name];
            }
            this.$emit('update:args', { ...this.args, primaryData });
        },
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
    },
};
</script>
