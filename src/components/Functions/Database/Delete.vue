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
    <template v-if="table">
        <wwEditorFormRow label="Delete by">
            <wwEditorInputRadio
                :model-value="mode"
                :choices="[
                    { label: 'Primary keys', value: 'single', default: true },
                    { label: 'Custom filters', value: 'multiple' },
                ]"
                small
                @update:modelValue="setArgs({ mode: $event })"
            />
        </wwEditorFormRow>
        <QueryFilters
            v-if="mode === 'multiple'"
            :model-value="filters"
            @update:modelValue="setArgs({ filters: $event })"
        />
        <div v-else class="flex flex-col ww-box mb-2 pt-2 pl-2 pr-2 pb-0" style="box-shadow: unset">
            <wwEditorInputRow
                v-for="property of primaryProperties"
                :key="property.name"
                :label="property.name"
                placeholder="Enter a value"
                :type="property.type"
                :required="property.required"
                :model-value="primaryData[property.name]"
                @update:modelValue="setPrimaryData({ ...primaryData, [property.name]: $event })"
                bindable
            />
        </div>
    </template>
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <QueryModifiers
                    type="DELETE"
                    selectLabel="Return deleted rows"
                    :columns="tablePropertiesOptions"
                    :model-value="modifiers"
                    @update:modelValue="setArgs({ modifiers: $event })"
                />
                <div class="flex items-center mb-2" :class="{ 'text-stale-400': lockedAutoSync }">
                    <wwEditorInputSwitch
                        :model-value="isRealtime || (autoSync && modifiers.select && !modifiers.csv)"
                        @update:modelValue="setArgs({ autoSync: $event })"
                        :disabled="lockedAutoSync"
                    />
                    <div class="label-3 ml-2">Auto update linked collections</div>
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
import Expandable from '../../Utils/Expandable.vue';
import QueryModifiers from '../../Utils/QueryModifiers.vue';
import QueryFilters from '../../Utils/QueryFilters.vue';

export default {
    components: { Expandable, QueryModifiers, QueryFilters },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => {} },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: true,
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
        mode() {
            return this.args.mode ?? 'single';
        },
        filters() {
            return this.args.filters || [];
        },
        modifiers() {
            return {
                // Support legacy config
                select: { mode: 'guided', fields: [] },
                ...(this.args.modifiers || {}),
            };
        },
        primaryData() {
            return this.args.primaryData || {};
        },
        isRealtime() {
            if (!this.table) return false;
            return this.plugin.settings.publicData?.realtimeTables[this.table];
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
                    this.definitions[this.table].required.includes(propertyName),
                isPrimary: (this.definitions[this.table].properties[propertyName].description || '').includes('<pk/>'),
            }));
        },
        primaryProperties() {
            return this.tableProperties.filter(prop => prop.isPrimary);
        },
        tablePropertiesOptions() {
            return this.tableProperties.map(property => ({
                label: property.name,
                value: property.name,
            }));
        },
        lockedAutoSync() {
            return this.isRealtime || !this.modifiers.select || this.modifiers.csv;
        },
    },
    mounted() {
        this.definitions = this.plugin.doc.definitions || {};
        if (!this.args.table) this.setArgs({ autoSync: false, modifiers: { select: false } });
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
                if (!this.primaryProperties.find(field => field.name === primaryDataKey)) {
                    delete primaryData[primaryDataKey];
                }
            }
            for (const field of this.primaryProperties) {
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
            this.setPrimaryData({ ...this.primaryData });
        },
    },
};
</script>
