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
        <wwEditorFormRow label="Update by">
            <wwEditorInputRadio
                :model-value="mode"
                :choices="[
                    { label: 'Primary keys', value: 'single', default: true },
                    { label: 'Custom filters', value: 'multiple' },
                ]"
                small
                @update:modelValue="setMode"
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
        <wwEditorInputRow
            label="Fields"
            type="select"
            required
            multiple
            :options="tablePropertiesOptionsFiltered"
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
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <QueryModifiers
                    type="UPDATE"
                    selectLabel="Return updated rows"
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
        dataFields() {
            return this.args.dataFields || [];
        },
        data() {
            return this.args.data || {};
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
        tablePropertiesOptions() {
            return this.tableProperties.map(property => ({
                label: property.name,
                value: property.name,
            }));
        },
        tablePropertiesOptionsFiltered() {
            return this.tablePropertiesOptions.filter(property => !property.isPrimary || this.mode === 'multiple');
        },
        primaryProperties() {
            return this.tableProperties.filter(prop => prop.isPrimary);
        },
        tablePropertiesFiltered() {
            return this.tableProperties.filter(
                property =>
                    (!this.dataFields.length || this.dataFields.includes(property.name)) &&
                    (!property.isPrimary || this.mode === 'multiple')
            );
        },
        lockedAutoSync() {
            return this.isRealtime || !this.modifiers.select || this.modifiers.csv;
        },
    },
    mounted() {
        this.definitions = (this.plugin.doc && this.plugin.doc.definitions) || {};
        if (!this.args.table) this.setArgs({ autoSync: false, modifiers: { select: false } });
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, primaryData: {}, dataFields: [], data: {} });
        },
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        setMode(mode) {
            this.$emit('update:args', { ...this.args, mode });
            this.$nextTick(() => this.setData({ ...this.data }));
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
                if (!data[field.name] && data[field.name] !== null) delete data[field.name]; // TODO LOGIC ISSUE HERE
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
            // clear removed fields in this order as setDataFields will trigger setData with next tick too
            this.setPrimaryData({ ...this.primaryData });
            this.$nextTick(() =>
                this.setDataFields(
                    this.args.dataFields.filter(field => this.tablePropertiesFiltered.some(prop => prop.name === field))
                )
            );
        },
    },
};
</script>
