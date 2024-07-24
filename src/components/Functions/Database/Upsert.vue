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
        <wwEditorFormRow label="Insert mode">
            <wwEditorInputRadio
                :model-value="mode"
                :choices="[
                    { label: 'Single', value: 'single', default: true },
                    { label: 'Multiple', value: 'multiple' },
                ]"
                small
                @update:modelValue="
                    setArgs({
                        mode: $event,
                        dataFields: [],
                        data: $event === 'single' ? {} : [],
                    })
                "
            />
        </wwEditorFormRow>
        <wwEditorInputRow
            v-if="mode === 'multiple'"
            label="Rows"
            type="array"
            bindable
            :binding-validation="{
                type: 'array',
                tooltip: 'An array containing multiple objects to upsert. `[' + formatHelper + ']`',
            }"
            :model-value="data"
            @update:modelValue="setData"
            @add-item="setData([...data, { __wwtype: 'f', code: null }])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item"
                    label="Row"
                    placeholder="Bind an object"
                    small
                    bindable
                    :binding-validation="{
                        type: 'object',
                        tooltip: 'An object to upsert. `[' + formatHelper + ']`',
                    }"
                    @update:modelValue="setItem"
                    @add-item="setData([...(Array.isArray(data) ? data : []), { __wwtype: 'f', code: null }])"
                />
            </template>
        </wwEditorInputRow>
        <template v-else>
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
    </template>
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <wwEditorFormRow label="On conflict">
                    <div class="flex">
                        <wwEditorInput
                            type="select"
                            multiple
                            :options="tablePropertiesOptions"
                            :model-value="onConflict"
                            placeholder="Unique field(s)"
                            @update:modelValue="setArgs({ onConflict: $event })"
                        />
                        <wwEditorQuestionMark
                            tooltip-position="top-left"
                            forced-content="Select UNIQUE column(s) to specify how duplicate rows are determined. Two rows are duplicates if all the `On conflict` columns are equal."
                            class="ml-2"
                        />
                    </div>
                </wwEditorFormRow>
                <div class="flex items-center mb-2">
                    <wwEditorInputSwitch
                        :model-value="ignoreDuplicates"
                        @update:modelValue="setArgs({ ignoreDuplicates: $event })"
                    />
                    <div class="label-3 ml-2">Ignore duplicates</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="If `true`, duplicate rows are ignored. If `false`, duplicate rows are merged with existing rows."
                        class="ml-auto"
                    />
                </div>
                <div class="flex items-center mb-2">
                    <wwEditorInputSwitch
                        :model-value="defaultToNull"
                        @update:modelValue="setArgs({ defaultToNull: $event })"
                    />
                    <div class="label-3 ml-2">Default to null</div>
                    <wwEditorQuestionMark
                        tooltip-position="top-left"
                        forced-content="Make missing fields default to `null`. Otherwise, use the default value for the column. Only applies for multiple upserts."
                        class="ml-auto"
                    />
                </div>
                <QueryModifiers
                    type="UPSERT"
                    selectLabel="Return upserted rows"
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

export default {
    components: { Expandable, QueryModifiers },
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
        ignoreDuplicates() {
            return this.args.ignoreDuplicates ?? false;
        },
        defaultToNull() {
            return this.args.defaultToNull ?? true;
        },
        onConflict() {
            return this.args.onConflict ?? [];
        },
        modifiers() {
            return {
                // Support legacy config
                select: { mode: 'guided', fields: [] },
                ...(this.args.modifiers || {}),
            };
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
        lockedAutoSync() {
            return this.isRealtime || !this.modifiers.select || this.modifiers.csv;
        },
        formatHelper() {
            return '{ ' + this.tablePropertiesOptions.map(prop => prop.value + ': null').join(', ') + ' }';
        },
    },
    mounted() {
        this.definitions = (this.plugin.doc && this.plugin.doc.definitions) || {};
        if (!this.args.table) this.setArgs({ autoSync: false, modifiers: { select: false } });
    },
    methods: {
        setTable(table) {
            this.$emit('update:args', { ...this.args, table, dataFields: [], data: {} });
        },
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
        setDataFields(dataFields) {
            this.$emit('update:args', { ...this.args, dataFields });
            this.$nextTick(() => this.setData({ ...this.data }));
        },
        setData(data) {
            if (this.mode === 'single') {
                for (const dataKey in data) {
                    if (!this.tablePropertiesFiltered.find(field => field.name === dataKey)) {
                        delete data[dataKey];
                    }
                }
                for (const field of this.tablePropertiesFiltered) {
                    if (!data[field.name]) delete data[field.name];
                }
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
