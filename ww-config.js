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
            queryConfig: {
                hasNativePagination: true,
                hasNativeSort: true,
                hasNativeFilter: true,
                filterOperators: [
                    { label: 'Is', value: '$eq', acceptedTypes: ['string', 'boolean'] },
                    { label: 'Is not', value: '$ne', acceptedTypes: ['string', 'boolean'] },
                    { label: '=', value: '$eq', acceptedTypes: ['number'] },
                    { label: '≠', value: '$ne', acceptedTypes: ['number'] },
                    { label: '<', value: '$lt', acceptedTypes: ['number'] },
                    { label: '>', value: '$gt', acceptedTypes: ['number'] },
                    { label: '≤', value: '$lte', acceptedTypes: ['number'] },
                    { label: '≥', value: '$gte', acceptedTypes: ['number'] },
                    {
                        label: 'Contains',
                        value: '$iLike:contains',
                        acceptedTypes: ['string'],
                        defaultValue: '',
                    },
                    {
                        label: 'Does not contains',
                        value: '$notILike:contains',
                        acceptedTypes: ['string'],
                        defaultValue: '',
                    },
                    { label: 'Starts with', value: '$iLike:startsWith', acceptedTypes: ['string'], defaultValue: 'start' },
                    { label: 'Ends with', value: '$iLike:endsWith', acceptedTypes: ['string'], defaultValue: 'end' },
                    { label: 'Is exactly', value: '$eq', acceptedTypes: ['array', 'object'] },
                    { label: 'Is empty', value: '$eq:null', acceptedTypes: ['string', 'number', 'array', 'object'] },
                    { label: 'Is not empty', value: '$ne:null', acceptedTypes: ['string', 'number', 'array', 'object'] },
                    { label: 'Is in', value: '$in', acceptedTypes: ['string', 'number'], defaultValue: [] },
                    { label: 'Is not in', value: '$notIn', acceptedTypes: ['string', 'number'], defaultValue: [] },
                    { label: 'Has any of', value: '$overlap', acceptedTypes: ['array'], defaultValue: [] },
                    { label: 'Has none of', value: '$notOverlap', acceptedTypes: ['array'], defaultValue: [] },
                    { label: 'Has all of', value: '$contains', acceptedTypes: ['array'], defaultValue: [] },
                ],
                typeDefaultOperator: {
                    string: '$iLike:contains',
                    number: '$eq',
                    object: '$has',
                    array: '$contains',
                    boolean: '$eq',
                }
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
