export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: [
            {
                label: 'Connection',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/ConnectionEdit.vue'),
                summary: () => import('./src/components/Configuration/ConnectionSummary.vue'),
                getIsValid(settings) {
                    return !!settings.privateData.accessToken || settings.privateData.connectionMode === 'custom';
                },
                onSave: 'onSave',
            },
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEditMultiEnv.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    // Check if using new multi-environment format
                    if (settings.publicData?.environments) {
                        // Production environment is required
                        return !!(settings.publicData.environments.production?.projectUrl && 
                                 settings.publicData.environments.production?.apiKey);
                    }
                    // Legacy format validation
                    return !!settings.publicData.projectUrl && !!settings.publicData.apiKey;
                },
                onSave: 'onSave',
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
                description: 'Select data from a Supabase table',
                returns: 'array | object',
                schema: {
                    table: {
                        type: 'string',
                        description: 'The table name to select from',
                        bindable: true,
                    },
                    fieldsMode: {
                        type: 'string',
                        description: 'Mode for selecting fields (guided or advanced)',
                        bindable: false,
                    },
                    dataFields: {
                        type: 'array',
                        description: 'Array of column names to select in guided mode, default to all',
                        bindable: true,
                    },
                    dataFieldsAdvanced: {
                        type: 'string',
                        description:
                            'Custom field selection query in advanced mode using the supabase sdk syntax, example: "name, orchestral_sections(*)"',
                        bindable: true,
                    },
                    filters: {
                        type: 'array',
                        description: `Array of filter conditions. eg: [
    {
        "fn": "eq", // Supabase filter method
        "column": "status",
        "value": "active",
        "isEnabled": true
    },
    {
        "fn": "textSearch",
        "column": "description",
        "value": {
            "__wwtype": "f",
            "code": "context.item.data?.['description']"
        },
        "options": { config: "english" }, // Optional search config
        "isEnabled": false // This filter will be ignored
    },
    {
        "fn": "or",
        "value": "type.eq.car,type.eq.truck", // Postgrest syntax for OR
        "isEnabled": true
    },
    {
        "fn": "filter",
        "column": "price",
        "operator": "gte",
        "value": 1000,
        "isEnabled": true
    }
]`,
                        bindable: true,
                    },
                    modifiers: {
                        type: 'object',
                        description: `Query modifiers like ordering and pagination, eg: {
    select: {
        mode: "guided", // Options: 'minimal', 'guided', 'advanced'
        fields: ["id", "name", "price"] // Only used if mode is 'guided'
    },
    order: {
        column: "price",
        ascending: false, // Sort by price in descending order
        nullsFirst: true // Place NULL values first
    },
    limit: {
        count: 10 // Limit results to 10
    },
    range: {
        from: 0,
        to: 9 // Equivalent to limit(10), but using range
    },
    single: false, // Don't force single result
    maybeSingle: true, // Allow maybeSingle (returns single row or null)
    csv: false, // Don't return results in CSV format
}`,
                        bindable: true,
                    },
                },
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
                description: 'Insert new records into a Supabase table',
                returns: 'object',
                schema: {
                    table: {
                        type: 'string',
                        description: 'The table name to insert into',
                        bindable: true,
                    },
                    data: {
                        type: 'object',
                        description: 'The data to insert',
                        bindable: true,
                    },
                    mode: {
                        type: 'string',
                        description: 'Insert mode (single or multiple)',
                        bindable: false,
                    },
                    autoSync: {
                        type: 'boolean',
                        description: 'Whether to automatically sync collections',
                        bindable: true,
                    },
                    defaultToNull: {
                        type: 'boolean',
                        description: 'Whether to default missing fields to null',
                        bindable: true,
                    },
                },
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
                description: 'Update existing records in a Supabase table',
                returns: 'object',
                schema: {
                    table: {
                        type: 'string',
                        description: 'The table name to update',
                        bindable: true,
                    },
                    primaryData: {
                        type: 'object',
                        description: 'Primary key values to identify records',
                        bindable: true,
                    },
                    data: {
                        type: 'object',
                        description: 'The new data to update with',
                        bindable: true,
                    },
                    mode: {
                        type: 'string',
                        description: 'Update mode (single or multiple)',
                        bindable: false,
                    },
                    filters: {
                        type: 'array',
                        description: `Array of filter conditions for multiple update mode. eg: [
    {
        "fn": "eq", // Supabase filter method
        "column": "status",
        "value": "active",
        "isEnabled": true
    },
    {
        "fn": "textSearch",
        "column": "description",
        "value": {
            "__wwtype": "f",
            "code": "context.item.data?.['description']"
        },
        "options": { config: "english" }, // Optional search config
        "isEnabled": false // This filter will be ignored
    },
    {
        "fn": "or",
        "value": "type.eq.car,type.eq.truck", // Postgrest syntax for OR
        "isEnabled": true
    },
    {
        "fn": "filter",
        "column": "price",
        "operator": "gte",
        "value": 1000,
        "isEnabled": true
    }
]`,
                        bindable: true,
                    },
                },
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
                description: 'Insert or update records in a Supabase table',
                returns: 'object',
                schema: {
                    table: {
                        type: 'string',
                        description: 'The table name to upsert into',
                        bindable: true,
                    },
                    data: {
                        type: 'object',
                        description: 'The data to upsert',
                        bindable: true,
                    },
                    onConflict: {
                        type: 'array',
                        description: 'Fields to check for conflicts',
                        bindable: true,
                    },
                    ignoreDuplicates: {
                        type: 'boolean',
                        description: 'Whether to ignore duplicate records',
                        bindable: true,
                    },
                },
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
                description: 'Delete records from a Supabase table',
                returns: 'object',
                schema: {
                    table: {
                        type: 'string',
                        description: 'The table name to delete from',
                        bindable: true,
                    },
                    primaryData: {
                        type: 'object',
                        description: 'Primary key values to identify records to delete',
                        bindable: true,
                    },
                    mode: {
                        type: 'string',
                        description: 'Delete mode (single or multiple)',
                        bindable: false,
                    },
                    filters: {
                        type: 'array',
                        description: `Array of filter conditions for multiple delete mode. eg: [
    {
        "fn": "eq", // Supabase filter method
        "column": "status",
        "value": "active",
        "isEnabled": true
    },
    {
        "fn": "textSearch",
        "column": "description",
        "value": {
            "__wwtype": "f",
            "code": "context.item.data?.['description']"
        },
        "options": { config: "english" }, // Optional search config
        "isEnabled": false // This filter will be ignored
    },
    {
        "fn": "or",
        "value": "type.eq.car,type.eq.truck", // Postgrest syntax for OR
        "isEnabled": true
    },
    {
        "fn": "filter",
        "column": "price",
        "operator": "gte",
        "value": 1000,
        "isEnabled": true
    }
]`,
                        bindable: true,
                    },
                },
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
                description: 'List files in a Supabase storage bucket',
                returns: 'array',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Path prefix to filter files',
                        bindable: true,
                    },
                    options: {
                        type: 'object',
                        description: 'Listing options like limit and search',
                        bindable: true,
                    },
                },
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
                description: 'Upload a file to Supabase storage',
                returns: 'object',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Destination path for the file',
                        bindable: true,
                    },
                    file: {
                        type: 'file',
                        description: 'The file to upload',
                        bindable: true,
                    },
                    options: {
                        type: 'object',
                        description: 'Upload options like cacheControl and contentType',
                        bindable: true,
                    },
                },
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
                description: 'Replace an existing file in Supabase storage',
                returns: 'object',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Path of the file to replace',
                        bindable: true,
                    },
                    file: {
                        type: 'file',
                        description: 'The new file',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Move a file',
            code: 'moveFile',
            getIsValid({ bucket, path, newPath }) {
                return !!bucket && !!path && !!newPath;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/MoveFile.vue'),
            copilot: {
                description: 'Move a file to a new location in Supabase storage',
                returns: 'object',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Current path of the file',
                        bindable: true,
                    },
                    newPath: {
                        type: 'string',
                        description: 'New path for the file',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Copy a file',
            code: 'copyFile',
            getIsValid({ bucket, path, newPath }) {
                return !!bucket && !!path && !!newPath;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/CopyFile.vue'),
            copilot: {
                description: 'Copy a file to a new location in Supabase storage',
                returns: 'object',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Path of the file to copy',
                        bindable: true,
                    },
                    newPath: {
                        type: 'string',
                        description: 'Destination path for the copy',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Delete files',
            code: 'deleteFiles',
            getIsValid({ paths }) {
                return !!paths;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/DeleteFiles.vue'),
            copilot: {
                description: 'Delete one or more files from Supabase storage',
                returns: 'object',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    paths: {
                        type: 'array',
                        description: 'Array of file paths to delete',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Create signed URL',
            code: 'createSignedUrl',
            getIsValid({ bucket, path, expiresIn }) {
                return !!bucket && !!path && !!expiresIn;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/CreateSignedUrl.vue'),
            copilot: {
                description: 'Create a temporary signed URL for file access',
                returns: 'string',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Path to the file',
                        bindable: true,
                    },
                    expiresIn: {
                        type: 'number',
                        description: 'Expiration time in seconds',
                        bindable: true,
                    },
                    options: {
                        type: 'object',
                        description: 'Options for download and transformation',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Storage | Retrieve public URL',
            code: 'getPublicUrl',
            getIsValid({ bucket, path }) {
                return !!bucket && !!path;
            },
            isAsync: false,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Storage/GetPublicUrl.vue'),
            copilot: {
                description: 'Get the public URL for a file',
                returns: 'string',
                schema: {
                    bucket: {
                        type: 'string',
                        description: 'The storage bucket name',
                        bindable: true,
                    },
                    path: {
                        type: 'string',
                        description: 'Path to the file',
                        bindable: true,
                    },
                    options: {
                        type: 'object',
                        description: 'Options for download and transformation',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Realtime | Subscribe to channel',
            code: 'subscribeToChannel',
            getIsValid({ channel, type }) {
                return !!channel && !!type;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Realtime/SubscribeChannel.vue'),
            copilot: {
                description: 'Subscribe to a realtime channel',
                returns: 'void',
                schema: {
                    channel: {
                        type: 'string',
                        description: 'Channel name to subscribe to',
                        bindable: true,
                    },
                    type: {
                        type: 'string',
                        description: 'Subscription type (postgres_changes or broadcast)',
                        bindable: false,
                    },
                    event: {
                        type: 'string',
                        description: 'Event type to listen for',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Realtime | Unsubscribe from channel',
            code: 'unsubscribeFromChannel',
            getIsValid({ channel }) {
                return !!channel;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Realtime/UnsubscribeChannel.vue'),
            copilot: {
                description: 'Unsubscribe from a realtime channel',
                returns: 'void',
                schema: {
                    channel: {
                        type: 'string',
                        description: 'Channel name to unsubscribe from',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Realtime | Broadcast a message',
            code: 'sendMessageToChannel',
            getIsValid({ channel, event }) {
                return !!channel && !!event;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Realtime/BroadcastMessage.vue'),
            copilot: {
                description: 'Broadcast a message to a channel',
                returns: 'void',
                schema: {
                    channel: {
                        type: 'string',
                        description: 'Channel to broadcast to',
                        bindable: true,
                    },
                    event: {
                        type: 'string',
                        description: 'Event name',
                        bindable: true,
                    },
                    payload: {
                        type: 'any',
                        description: 'Message payload',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Realtime | Update presence state',
            code: 'updateChannelState',
            getIsValid({ channel, state }) {
                return !!channel && !!state;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/Realtime/UpdateState.vue'),
            copilot: {
                description: 'Update presence state in a channel',
                returns: 'void',
                schema: {
                    channel: {
                        type: 'string',
                        description: 'Channel to update state in',
                        bindable: true,
                    },
                    state: {
                        type: 'any',
                        description: 'New presence state',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Call a Postgres function',
            code: 'callPostgresFunction',
            getIsValid({ functionName }) {
                return !!functionName;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/CallPostgres.vue'),
            copilot: {
                description: 'Call a Postgres database function',
                returns: 'any',
                schema: {
                    functionName: {
                        type: 'string',
                        description: 'Name of the function to call',
                        bindable: true,
                    },
                    params: {
                        type: 'array',
                        description: 'Function parameters',
                        bindable: true,
                    },
                    modifiers: {
                        type: 'object',
                        description: 'Query modifiers',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
        {
            name: 'Invoke an Edge function',
            code: 'invokeEdgeFunction',
            getIsValid({ functionName }) {
                return !!functionName;
            },
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Functions/InvokeEdge.vue'),
            copilot: {
                description: 'Invoke a Supabase Edge Function',
                returns: 'any',
                schema: {
                    functionName: {
                        type: 'string',
                        description: 'It must be the **slug** of the Edge Function',
                        bindable: true,
                    },
                    method: {
                        type: 'string',
                        description: 'HTTP method to use',
                        bindable: true,
                    },
                    headers: {
                        type: 'array',
                        description: 'Request headers',
                        bindable: true,
                    },
                    queries: {
                        type: 'array',
                        description: 'Query parameters',
                        bindable: true,
                    },
                    body: {
                        type: 'any',
                        description: 'Request body',
                        bindable: true,
                    },
                },
            },
            /* wwEditor:end */
        },
    ],
};
