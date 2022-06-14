export default {
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/SettingsEdit.vue'),
                summary: () => import('./src/components/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.projectUrl && !!settings.publicData.apiKey;
                },
            },
            {
                label: 'Realtime tables',
                icon: 'data',
                edit: () => import('./src/components/RealtimeEdit.vue'),
                summary: () => import('./src/components/RealtimeSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.realtimeTables;
                },
            },
        ],
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid({ table }) {
                return !!table;
            },
            modes: ['dynamic'],
        },
    },
    actions: [
        {
            name: 'Select',
            code: 'select',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Select.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Insert',
            code: 'insert',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Insert.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Update',
            code: 'update',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Update.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Upsert',
            code: 'upsert',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Upsert.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Delete',
            code: 'delete',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Delete.vue'),
            /* wwEditor:end */
        },
    ],
};
