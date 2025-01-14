export default {
    features: {
        datasource: true,
    },
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
                label: 'Realtime collections',
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
                    { label: '<', value: '$lt', acceptedTypes: ['number', 'string'] },
                    { label: '>', value: '$gt', acceptedTypes: ['number', 'string'] },
                    { label: '≤', value: '$lte', acceptedTypes: ['number', 'string'] },
                    { label: '≥', value: '$gte', acceptedTypes: ['number', 'string'] },
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
                    {
                        label: 'Starts with',
                        value: '$iLike:startsWith',
                        acceptedTypes: ['string'],
                        defaultValue: 'start',
                    },
                    { label: 'Ends with', value: '$iLike:endsWith', acceptedTypes: ['string'], defaultValue: 'end' },
                    { label: 'Is exactly', value: '$eq', acceptedTypes: ['array', 'object'] },
                    { label: 'Is empty', value: '$eq:null', acceptedTypes: ['string', 'number', 'array', 'object'] },
                    {
                        label: 'Is not empty',
                        value: '$ne:null',
                        acceptedTypes: ['string', 'number', 'array', 'object'],
                    },
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
                },
            },
        },
    },
    triggers: [
        {
            label: 'On realtime database changes',
            value: 'realtime:postgres_changes',
            event: {
                channel: '',
                data: {
                    schema: 'public',
                    table: 'My Table',
                    commit_timestamp: '2024-08-01T20:17:03.216Z',
                    eventType: 'INSERT | UPDATE | DELETE',
                    errors: null,
                    new: {},
                    old: {},
                },
            },
            conditions: [
                {
                    name: 'Channel name',
                    key: 'channel',
                    placeholder: 'Default: All channels',
                    type: 'Text',
                },
                {
                    name: 'Event type',
                    key: 'event',
                    placeholder: 'Default: All events',
                    type: 'TextSelect',
                    options: [
                        { label: 'All events', value: null },
                        { label: 'INSERT', value: 'INSERT' },
                        { label: 'UPDATE', value: 'UPDATE' },
                        { label: 'DELETE', value: 'DELETE' },
                    ],
                },
            ],
        },
        {
            label: 'On realtime presence',
            value: 'realtime:presence',
            event: {
                channel: '',
                data: {
                    event: 'join',
                    key: '9fe543c6-4530-11ef-a6c3-0a58a9feac02',
                    currentPresences: [],
                    leftPresences: [],
                    newPresences: [],
                },
            },
            conditions: [
                {
                    name: 'Channel name',
                    key: 'channel',
                    placeholder: 'Default: All channels',
                    type: 'Text',
                },
                {
                    name: 'Event type',
                    key: 'event',
                    placeholder: 'Default: All events',
                    type: 'TextSelect',
                    options: [
                        { label: 'All events', value: null },
                        { label: 'Sync', value: 'sync' },
                        { label: 'Join', value: 'join' },
                        { label: 'Leave', value: 'leave' },
                    ],
                },
            ],
        },
        {
            label: 'On realtime broadcast',
            value: 'realtime:broadcast',
            event: { channel: '', data: { event: '', payload: '' } },
            conditions: [
                {
                    name: 'Channel name',
                    key: 'channel',
                    placeholder: 'Default: All channels',
                    type: 'Text',
                },
                {
                    name: 'Event name',
                    placeholder: 'Default: All events',
                    key: 'event',
                    type: 'Text',
                },
            ],
        },
    ],
    actions: [
        {
            name: 'Database | Select',
            code: 'select',
            parameters: [],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Database/Select.vue'),
            copilot: {
                description: "Select data from a Supabase table",
                returns: "array | object",
                schema: {
                    table: {
                        type: "string",
                        description: "The table to select from",
                        bindable: true
                    },
                    fieldsMode: {
                        type: "string",
                        description: "Mode for selecting fields (guided or advanced)",
                        bindable: false
                    },
                    dataFields: {
                        type: "array",
                        description: "Array of field names to select in guided mode",
                        bindable: true
                    },
                    dataFieldsAdvanced: {
                        type: "string", 
                        description: "Custom field selection query in advanced mode",
                        bindable: true
                    },
                    filters: {
                        type: "array",
                        description: "Array of filter conditions",
                        bindable: true
                    },
                    modifiers: {
                        type: "object",
                        description: "Query modifiers like ordering and pagination",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Database | Insert',
            code: 'insert',
            parameters: [{ name: 'data', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Database/Insert.vue'),
            copilot: {
                description: "Insert new records into a Supabase table",
                returns: "object",
                schema: {
                    table: {
                        type: "string",
                        description: "The table to insert into",
                        bindable: true
                    },
                    data: {
                        type: "object",
                        description: "The data to insert",
                        bindable: true
                    },
                    mode: {
                        type: "string",
                        description: "Insert mode (single or multiple)",
                        bindable: false
                    },
                    autoSync: {
                        type: "boolean",
                        description: "Whether to automatically sync collections",
                        bindable: true
                    },
                    defaultToNull: {
                        type: "boolean",
                        description: "Whether to default missing fields to null",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Database | Update',
            code: 'update',
            parameters: [
                { name: 'primaryData', type: 'object' },
                { name: 'data', type: 'object' },
            ],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Database/Update.vue'),
            copilot: {
                description: "Update existing records in a Supabase table",
                returns: "object",
                schema: {
                    table: {
                        type: "string",
                        description: "The table to update",
                        bindable: true
                    },
                    primaryData: {
                        type: "object",
                        description: "Primary key values to identify records",
                        bindable: true
                    },
                    data: {
                        type: "object",
                        description: "The new data to update with",
                        bindable: true
                    },
                    mode: {
                        type: "string",
                        description: "Update mode (single or multiple)",
                        bindable: false
                    },
                    filters: {
                        type: "array",
                        description: "Filters for multiple update mode",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Database | Upsert',
            code: 'upsert',
            parameters: [{ name: 'data', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Database/Upsert.vue'),
            copilot: {
                description: "Insert or update records in a Supabase table",
                returns: "object",
                schema: {
                    table: {
                        type: "string",
                        description: "The table to upsert into",
                        bindable: true
                    },
                    data: {
                        type: "object",
                        description: "The data to upsert",
                        bindable: true
                    },
                    onConflict: {
                        type: "array",
                        description: "Fields to check for conflicts",
                        bindable: true
                    },
                    ignoreDuplicates: {
                        type: "boolean",
                        description: "Whether to ignore duplicate records",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Database | Delete',
            code: 'delete',
            parameters: [{ name: 'primaryData', type: 'object' }],
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Database/Delete.vue'),
            copilot: {
                description: "Delete records from a Supabase table",
                returns: "object",
                schema: {
                    table: {
                        type: "string",
                        description: "The table to delete from",
                        bindable: true
                    },
                    primaryData: {
                        type: "object",
                        description: "Primary key values to identify records to delete",
                        bindable: true
                    },
                    mode: {
                        type: "string",
                        description: "Delete mode (single or multiple)",
                        bindable: false
                    },
                    filters: {
                        type: "array",
                        description: "Filters for multiple delete mode",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | List all files',
            code: 'listFiles',
            getIsValid({ bucket }) {
                return !!bucket;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/ListFiles.vue'),
            copilot: {
                description: "List files in a Supabase storage bucket",
                returns: "array",
                schema: {
                    bucket: {
                        type: "string",
                        description: "The storage bucket name",
                        bindable: true
                    },
                    path: {
                        type: "string",
                        description: "Path prefix to filter files",
                        bindable: true
                    },
                    options: {
                        type: "object",
                        description: "Listing options like limit and search",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Upload a file',
            code: 'uploadFile',
            getIsValid({ bucket, path, file }) {
                return !!bucket && !!path && !!file;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/UploadFile.vue'),
            copilot: {
                description: "Upload a file to Supabase storage",
                returns: "object",
                schema: {
                    bucket: {
                        type: "string",
                        description: "The storage bucket name",
                        bindable: true
                    },
                    path: {
                        type: "string",
                        description: "Destination path for the file",
                        bindable: true
                    },
                    file: {
                        type: "file",
                        description: "The file to upload",
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Replace a file',
            code: 'updateFile',
            getIsValid({ bucket, path, file }) {
                return !!bucket && !!path && !!file;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/UpdateFile.vue'),
            copilot: {
                description: "Replace an existing file in Supabase storage",
                returns: "object",
                schema: {
                    bucket: {
                        type: "string",
                        description: "The storage bucket name",
                        bindable: true
                    },
                    path: {
                        type: "