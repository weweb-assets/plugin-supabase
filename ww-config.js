export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return (
                    !!settings.publicData.projectUrl &&
                    !!settings.publicData.publicApiKey &&
                    !!settings.privateData.privateApiKey
                );
            },
        },
        // collection: {
        //     edit: () => import('./src/components/CollectionEdit.vue'),
        //     summary: () => import('./src/components/CollectionSummary.vue'),
        //     getIsValid({}) {
        //         return true;
        //     },
        // },
    },
    actions: [
        // {
        //     name: 'Supabase Request',
        //     code: 'request',
        //     parameters: [],
        //     isAsync: true,
        //     /* wwEditor:start */
        //     edit: () => import('./src/components/Request.vue'),
        //     /* wwEditor:end */
        // },
    ],
};
