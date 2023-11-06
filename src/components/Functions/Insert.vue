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
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <div class="flex items-center mb-3">
                    <wwEditorInputSwitch
                        :model-value="returnData"
                        @update:modelValue="setArgs({ returnData: $event })"
                    />
                    <div class="label-3 ml-2">Return data</div>
                </div>
                <template v-if="returnData">
                    <div class="flex items-center mb-3">
                        <wwEditorInputSwitch
                            :model-value="returnFieldsMinimal"
                            @update:modelValue="setArgs({ returnFieldsMinimal: $event })"
                        />
                        <div class="label-3 ml-2">Return minimal data</div>
                    </div>
                    <wwEditorFormRow label="Returned fields" required>
                        <wwEditorInputRadio
                            class="mb-2"
                            :model-value="returnFieldsMode"
                            :choices="fieldsModeChoices"
                            small
                            @update:modelValue="setArgs({ returnFieldsMode: $event })"
                        />
                        <wwEditorInput
                            v-if="returnFieldsMode === 'guided'"
                            type="select"
                            multiple
                            :options="tablePropertiesOptions"
                            :model-value="returnDataFields"
                            placeholder="Minimal"
                            @update:modelValue="setArgs({ returnDataFields: $event })"
                        />
                        <wwEditorInput
                            v-else
                            type="string"
                            :model-value="returnDataFieldsAdvanced"
                            placeholder="column, linkedColumn(column)"
                            @update:modelValue="setArgs({ returnDataFieldsAdvanced: $event })"
                        />
                    </wwEditorFormRow>
                    <wwEditorInputRow
                        label="Get count"
                        type="select"
                        placeholder="None"
                        :model-value="countMode"
                        :options="[
                            { label: 'None', value: null },
                            { label: 'Exact', value: 'exact' },
                            { label: 'Planned', value: 'planned' },
                            { label: 'Estimated', value: 'estimated' },
                        ]"
                        @update:modelValue="setArgs({ countMode: $event })"
                    />
                    <div class="flex items-center mb-3">
                        <wwEditorInputSwitch
                            :model-value="autoSync"
                            @update:modelValue="setArgs({ autoSync: $event })"
                        />
                        <div class="label-3 ml-2">Use returned data to update the related collections</div>
                    </div>
                </template>
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';

export default {
    components: { Expandable },
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
        countMode() {
            return this.args.countMode || null;
        },
        returnData() {
            return this.args.returnData === undefined ? true : this.args.returnData;
        },
        autoSync() {
            return this.args.autoSync === undefined ? true : this.args.autoSync;
        },
        returnFieldsMinimal() {
            return this.args.returnFieldsMinimal || false;
        },
        returnFieldsMode() {
            return this.args.returnFieldsMode || 'guided';
        },
        returnDataFields() {
            return this.args.returnDataFields || [];
        },
        returnDataFieldsAdvanced() {
            return this.args.returnDataFieldsAdvanced;
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
    },
    mounted() {
        this.definitions = (this.plugin.doc && this.plugin.doc.definitions) || {};
        if (!this.args.table) this.setArgs({ autoSync: false, returnData: false, returnFieldsMinimal: true });
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
