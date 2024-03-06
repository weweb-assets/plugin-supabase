<template>
    <wwEditorFormRow label="Enable realtime table">
        <template #append-label>
            <a class="ww-editor-link ml-2" href="https://supabase.com/docs/guides/api#realtime-api-1" target="_blank">
                Find it here
            </a>
            <button type="button" class="ww-editor-button -primary -small ml-auto" @click="fetchTables">refresh</button>
        </template>
        <div v-for="table in tablesOptions" :key="table.value" class="flex items-center mb-2">
            <wwEditorInputSwitch
                :modelValue="realtimeTables[table.value]"
                @update:modelValue="updateReatimeTable(table.value, $event)"
                small
            />
            <div class="label-2 ml-2">{{ table.label }}</div>
        </div>
    </wwEditorFormRow>
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            isLoading: false,
            definitions: {},
        };
    },
    computed: {
        tablesOptions() {
            return Object.keys(this.definitions).map(tableName => ({
                label: tableName,
                value: tableName,
            }));
        },
        realtimeTables() {
            return this.settings.publicData?.realtimeTables || {};
        },
    },
    mounted() {
        this.definitions = this.plugin?.doc?.definitions || {};
        if (!this.settings.publicData?.realtimeTables) this.changeRealtimeTables({});
    },
    methods: {
        async fetchTables() {
            try {
                this.isLoading = true;
                await this.plugin.fetchDoc();
                this.definitions = this.plugin?.doc?.definitions || {};
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        updateReatimeTable(tableName, value) {
            const realtimeTables = { ...this.realtimeTables };
            realtimeTables[tableName] = value;
            for (const key in realtimeTables) {
                if (!this.tablesOptions.find(table => table.value === key)) {
                    delete realtimeTables[key];
                }
            }
            this.changeRealtimeTables(realtimeTables);
        },
        changeRealtimeTables(realtimeTables) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, realtimeTables },
            });
            this.subscribeTables(realtimeTables);
        },
        subscribeTables(realtimeTables) {
            if (!this.settings.publicData.realtimeTables) return;
            this.plugin.subscribeTables(realtimeTables);
        },
    },
};
</script>
