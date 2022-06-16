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
        v-if="idProperty"
        label="id"
        placeholder="Enter an ID"
        :type="idType"
        required
        :model-value="id"
        @update:modelValue="setId"
        bindable
    />
    <div v-else>Table must have a column "id".</div>
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
        id() {
            return this.args.id;
        },
        tablesOptions() {
            return Object.keys(this.definitions).map(tableName => ({
                label: tableName,
                value: tableName,
            }));
        },
        idProperty() {
            return (
                this.definitions[this.table] &&
                this.definitions[this.table].properties &&
                this.definitions[this.table].properties.id
            );
        },
        idType() {
            const type = this.idProperty && this.idProperty.type;
            return type === 'string' ? 'query' : type;
        },
    },
    mounted() {
        this.definitions = this.plugin.doc.definitions || {};
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table });
        },
        setId(id) {
            this.$emit('update:args', { ...this.args, id });
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
