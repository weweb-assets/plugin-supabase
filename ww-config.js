export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return !!settings.publicData.projectUrl && !!settings.publicData.apiKey;
            },
        },
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid({ table }) {
                return !!table;
            },
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
