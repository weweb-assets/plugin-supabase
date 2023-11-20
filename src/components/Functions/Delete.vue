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
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <QueryModifiers
                    :model-value="modifiers"
                    @update:modelValue="setArgs({ modifiers: $event })"
                    selectLabel="Return deleted rows"
                    :columns="tablePropertiesOptions"
                />
                <div class="flex items-center mb-2" :class="{ 'text-stale-400': lockedAutoSync }">
                    <wwEditorInputSwitch
                        :model-value="isRealtime || (autoSync && modifiers.select && !modifiers.csv)"
                        @update:modelValue="setArgs({ autoSync: $event })"
                        :disabled="lockedAutoSync"
                    />
                    <div class="label-3 ml-2">Auto update the related collections</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="It will use the returned data to update the collection without performing another request. Always `true` when realtime is enabled on the table but it will use data received from supabase events instead."
                        class="ml-auto"
                    />
                </div>
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';
import QueryModifiers from '../Utils/QueryModifiers.vue';

export default {
    components: { Expandable, QueryModifiers },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => {} },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: false,
            definitions: {},
            isLoading: false,
        };
    },
    computed: {
        table() {
            return this.args.table;
        },
        autoSync() {
            return this.args.autoSync ?? true;
        },
        modifiers() {
            return {
                // Support legacy config
                select: { mode: 'guided', fields: [] },
                maybeSingle: true,
                ...(this.args.modifiers || {}),
            };
        },
        primaryData() {
            return this.args.primaryData || {};
        },
        isRealtime() {
            return this.plugin.settings.publicData.realtimeTables[this.table];
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
                    required:
                        this.definitions[this.table].required &&
                        this.definitions[this.table].required.includes(propertyName),
                }));
        },
        lockedAutoSync() {
            return this.isRealtime || !this.modifiers.select || this.modifiers.csv;
        },
    },
    mounted() {
        this.definitions = this.plugin.doc.definitions || {};
        if (!this.args.table) this.setArgs({ autoSync: false, modifiers: { select: false, maybeSingle: false } });
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, primaryData: {} });
        },
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
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
                this.refreshFields();
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        refreshFields() {
            // clear removed fields
            const primaryData = { ...this.args.primaryData };
            for (const key in primaryData) {
                if (!this.tableProperties.includes(key)) delete primaryData[key];
            }
            this.setPrimaryData(primaryData);
        },
    },
};
</script>
