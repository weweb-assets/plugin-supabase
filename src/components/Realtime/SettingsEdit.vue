<template>
    <div class="mb-3 label-sm text-blue-500 flex items-center">
        <wwEditorIcon class="mr-1" name="information-circle" small />
        This feature allow your collections to be updated in realtime automcatically. You must enable realtime on your
        tables both in WeWeb and in Supabase in order to use this feature.
    </div>
    <wwEditorFormRow label="Enable realtime table" @togglePanel="handleTogglePanel">
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
import { getCurrentSupabaseSettings } from '../../helpers/environmentConfig';

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
            panelOpen: false,
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
    watch: {
        'plugin.doc.definitions': {
            handler(definitions) {
                this.applyDefinitions(definitions);
            },
            immediate: true,
        },
        panelOpen(value) {
            if (value) {
                this.queueDocRefresh(200);
            }
        },
        settings: {
            handler() {
                this.scheduleConfigWatch();
            },
            deep: true,
        },
    },
    mounted() {
        if (!this.settings.publicData?.realtimeTables) this.changeRealtimeTables({});
        this.applyDefinitions(this.plugin?.doc?.definitions || {});
        this.scheduleConfigWatch();
        this.queueDocRefresh();
    },
    beforeUnmount() {
        if (this._refreshTimeout) {
            clearTimeout(this._refreshTimeout);
            this._refreshTimeout = null;
        }
    },
    methods: {
        scheduleConfigWatch() {
            const cfg = getCurrentSupabaseSettings('supabase');
            const snapshot = {
                projectUrl: cfg?.projectUrl || null,
                baseProjectRef: cfg?.baseProjectRef || null,
                branch: cfg?.branch || null,
                branchSlug: cfg?.branchSlug || null,
            };
            const serialized = JSON.stringify(snapshot);
            if (this._lastConfigSnapshot === serialized) return;
            const previous = this._lastConfigSnapshot ? JSON.parse(this._lastConfigSnapshot) : null;
            this._lastConfigSnapshot = serialized;
            if (previous) {
                this.queueDocRefresh(200);
            }
        },
        handleTogglePanel(isOpen) {
            this.panelOpen = isOpen;
        },
        queueDocRefresh(delay = 1000) {
            if (this._refreshTimeout) clearTimeout(this._refreshTimeout);
            this._refreshTimeout = setTimeout(async () => {
                try {
                    this.isLoading = true;
                    await this.plugin.fetchDoc();
                    this.applyDefinitions(this.plugin?.doc?.definitions || {});
                } catch (err) {
                    wwLib.wwLog.error(err);
                } finally {
                    this.isLoading = false;
                }
            }, 1000);
        },
        applyDefinitions(definitions = {}) {
            const normalized = definitions || {};
            this.definitions = normalized;

            const available = new Set(Object.keys(normalized));
            const realtimeTables = { ...this.realtimeTables };
            let mutated = false;
            for (const key of Object.keys(realtimeTables)) {
                if (!available.has(key)) {
                    delete realtimeTables[key];
                    mutated = true;
                }
            }
            if (mutated) {
                this.changeRealtimeTables(realtimeTables);
            }
        },
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
