export default {
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.projectUrl && !!settings.publicData.apiKey;
                },
            },
            {
                label: 'Realtime tables',
                icon: 'data',
                edit: () => import('./src/components/Realtime/SettingsEdit.vue'),
                summary: () => import('./src/components/Realtime/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.realtimeTables;
                },
            },
        ],
        collection: {
            edit: () => import('./src/components/Collection/CollectionEdit.vue'),
            summary: () => import('./src/components/Collection/CollectionSummary.vue'),
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
            edit: () => import('./src/components/Functions/Select.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Insert',
            code: 'insert',
            parameters: [{ name: 'data', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Insert.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Update',
            code: 'update',
            parameters: [
                { name: 'primaryData', type: 'object' },
                { name: 'data', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Update.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Upsert',
            code: 'upsert',
            parameters: [{ name: 'data', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Upsert.vue'),
            /* wwEditor:end */
        },
        {
            name: 'Delete',
            code: 'delete',
            parameters: [{ name: 'primaryData', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Delete.vue'),
            /* wwEditor:end */
        },
    ],
};
