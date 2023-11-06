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
            </div>
            <div class="flex items-center mt-2">
                <wwEditorInputSwitch :model-value="returnData" @update:modelValue="setArgs({ returnData: $event })" />
                <div class="label-3 ml-2">Return data</div>
            </div>
            <div class="flex items-center mt-2" v-if="returnData">
                <wwEditorInputSwitch :model-value="autoSync" @update:modelValue="setArgs({ autoSync: $event })" />
                <div class="label-3 ml-2">Sync related collections</div>
            </div>
            <wwEditorFormRow label="Fields" required v-if="returnData">
                <wwEditorInputRadio
                    class="mb-2"
                    :model-value="returnFieldsMode"
                    :choices="fieldsModeChoices"
                    small
                    @update:modelValue="setArgs({ returnFieldsMode: $event })"
                />
                <wwEditorInput
                    v-if="fieldsMode === 'guided'"
                    type="select"
                    multiple
                    :options="tablePropertiesOptions"
                    :model-value="returnDataFields"
                    placeholder="All fields"
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
            return this.args.returnData || false;
        },
        autoSync() {
            return this.args.autoSync || false;
        },
        returnFieldsMode() {
            return this.args.returnFieldsMode;
        },
        returnDataFields() {
            return this.args.returnDataFields || [];
        },
        returnDataFieldsAdvanced() {
            return this.args.returnDataFieldsAdvanced;
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
                    required:
                        this.definitions[this.table].required &&
                        this.definitions[this.table].required.includes(propertyName),
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
