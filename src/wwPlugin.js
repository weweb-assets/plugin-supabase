/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
import './components/Realtime/SettingsEdit.vue';
import './components/Realtime/SettingsSummary.vue';
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
import './components/Functions/Database/Select.vue';
import './components/Functions/Database/Insert.vue';
import './components/Functions/Database/Update.vue';
import './components/Functions/Database/Upsert.vue';
import './components/Functions/Database/Delete.vue';
import './components/Functions/Storage/CreateSignedUrl.vue';
import './components/Functions/Storage/GetPublicUrl.vue';
import './components/Functions/Storage/ListFiles.vue';
import './components/Functions/Storage/UploadFile.vue';
import './components/Functions/Storage/DownloadFile.vue';
import './components/Functions/Storage/UpdateFile.vue';
import './components/Functions/Storage/MoveFile.vue';
import './components/Functions/Storage/CopyFile.vue';
import './components/Functions/Storage/DeleteFiles.vue';
import './components/Functions/Realtime/SubscribeChannel.vue';
import './components/Functions/Realtime/UnsubscribeChannel.vue';
import './components/Functions/Realtime/BroadcastMessage.vue';
import './components/Functions/Realtime/UpdateState.vue';
import './components/Functions/CallPostgres.vue';
import './components/Functions/InvokeEdge.vue';
/* wwEditor:end */
import { createClient, FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';

import { generateFilter } from './helpers/filters';

export default {
    instance: null,
    channels: {},
    /* wwEditor:start */
    doc: null,
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async _onLoad(settings) {
        await this.load(settings.publicData.projectUrl, settings.publicData.apiKey);
        this.subscribeTables(settings.publicData.realtimeTables || {});
    },
    /*  Called by supabase auth plugin
     *  Allow supabase to use the supabase auth instance when available
     */
    syncInstance() {
        if (wwLib.wwPlugins.supabaseAuth && wwLib.wwPlugins.supabaseAuth.publicInstance) {
            this.instance = wwLib.wwPlugins.supabaseAuth.publicInstance;
            this.subscribeTables(wwLib.wwPlugins.supabase.settings.publicData.realtimeTables || {});
        }
    },
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async _fetchCollection(collection) {
        if (collection.mode === 'dynamic') {
            try {
                const fields =
                    collection.config.fieldsMode === 'guided'
                        ? (collection.config.dataFields || []).join(', ')
                        : collection.config.dataFieldsAdvanced;
                let query = this.instance
                    .from(collection.config.table)
                    .select(fields || undefined, { count: collection.limit ? 'exact' : null });
                const filter = generateFilter(collection.filter);

                if (filter) query.or(filter);

                if (collection.limit) {
                    query.range(collection.offset, collection.offset + collection.limit - 1);
                }

                for (const sort of collection.sort) {
                    query.order(sort.key, { ascending: sort.direction === 'ASC' });
                }

                const { data, error, count } = await query;
                return { data, error, total: count ?? data?.length };
            } catch (err) {
                return {
                    data: [],
                    error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
                };
            }
        } else {
            return { data: null, error: null, total: 0 };
        }
    },
    /*=============================================m_ÔÔ_m=============================================\
        Supabase API
    \================================================================================================*/
    subscribeTables(realtimeTables) {
        if (!this.instance) return;
        // this.instance.removeAllChannels();
        for (const tableName of Object.keys(realtimeTables)) {
            if (!realtimeTables[tableName]) continue;
            this.instance
                .channel('ww:public:' + tableName)
                .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, this.onSubscribe)
                .subscribe();
        }
    },
    async load(projectUrl, apiKey) {
        if (!projectUrl || !apiKey) return;
        try {
            this.instance =
                wwLib.wwPlugins.supabaseAuth && wwLib.wwPlugins.supabaseAuth.publicInstance
                    ? wwLib.wwPlugins.supabaseAuth.publicInstance
                    : createClient(projectUrl, apiKey);

            if (!this.instance) throw new Error('Invalid Supabase configuration.');
            /* wwEditor:start */
            await this.fetchDoc(projectUrl, apiKey);
            /* wwEditor:end */
        } catch (err) {
            this.instance = null;
            this.doc = null;
            wwLib.wwLog.error(err);
            /* wwEditor:start */
            wwLib.wwNotification.open({ text: 'Invalid Supabase configuration.', color: 'red' });
            /* wwEditor:end */
        }
    },
    /* wwEditor:start */
    async fetchDoc(projectUrl = this.settings.publicData.projectUrl, apiKey = this.settings.publicData.apiKey) {
        this.doc = await getDoc(projectUrl, apiKey);
    },
    /* wwEditor:end */
    async select({ table, fieldsMode, dataFields, dataFieldsAdvanced, filters, modifiers }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Selecting ${table}`, { type: 'request' });
        const fields = fieldsMode === 'guided' ? (dataFields || []).join(', ') : dataFieldsAdvanced;
        const query = this.instance
            .from(table)
            .select(fields || undefined, { count: modifiers?.count?.mode, head: modifiers?.count?.countOnly });
        applyFilters(query, filters);
        applyModifiers(query, modifiers);
        const { data, count, error } = await query;

        if (error) throw new Error(error.message, { cause: error });
        return modifiers?.count ? (modifiers.count.countOnly ? count : { data, count }) : data;
    },
    async insert(
        { table, data: payload = {}, autoSync = true, mode = 'single', modifiers = {}, defaultToNull = true },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Inserting inside ${table}`, { preview: payload, type: 'request' });

        const query = this.instance.from(table).insert(payload, { count: modifiers?.count?.mode, defaultToNull });

        applyModifiers(query, {
            select: { mode: 'guided', fields: [] },
            ...modifiers,
        });

        const { data, count, error } = await query;
        if (error)
            throw new Error(
                error.code === 'PGRST100'
                    ? 'Mode minimal cannot be used on this postgres version, please update your supabase instance or use another mode.'
                    : error.message,
                { cause: error }
            );
        if (autoSync) this.performAutoSync(table, 'INSERT', data);
        return this.formatReturn(data, count, mode === 'single');
    },
    async update(
        { table, primaryData = {}, data: payload = {}, autoSync = true, mode = 'single', filters = [], modifiers = {} },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (mode === 'single' && !Object.keys(primaryData).length) throw new Error('No primary key defined.');
        if (mode === 'multiple' && !filters.length) throw new Error('No filters defined.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Updating ${table}`, {
            type: 'request',
            preview: { primaryData, filters, data: payload },
        });

        const query = this.instance.from(table).update(payload, { count: modifiers?.count?.mode });
        if (mode === 'single') query.match(primaryData);
        else applyFilters(query, filters);

        applyModifiers(query, {
            select: { mode: 'guided', fields: [] },
            ...modifiers,
        });

        const { data, count, error } = await query;
        if (error)
            throw new Error(
                error.code === 'PGRST100'
                    ? 'Mode minimal cannot be used on this postgres version, please update your supabase instance or use another mode.'
                    : error.message,
                { cause: error }
            );
        if (autoSync) this.performAutoSync(table, 'UPDATE', data);
        return this.formatReturn(data, count, mode === 'single');
    },
    async upsert(
        {
            table,
            data: payload = {},
            ignoreDuplicates = false,
            onConflict = [],
            defaultToNull = true,
            autoSync = true,
            mode = 'single',
            modifiers = {},
        },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Upserting data inside ${table}`, { type: 'request', preview: payload });

        const query = this.instance.from(table).upsert(payload, {
            count: modifiers?.count?.mode,
            ignoreDuplicates,
            ...(onConflict.length ? { onConflict: onConflict.join(',') } : null),
            defaultToNull,
        });

        applyModifiers(query, {
            select: { mode: 'guided', fields: [] },
            ...modifiers,
        });

        const { data, count, error } = await query;
        if (error)
            throw new Error(
                error.code === 'PGRST100'
                    ? 'Mode minimal cannot be used on this postgres version, please update your supabase instance or use another mode.'
                    : error.message,
                { cause: error }
            );
        if (autoSync) this.performAutoSync(table, 'UPSERT', data);
        return this.formatReturn(data, count, mode === 'single');
    },
    async delete({ table, primaryData = {}, autoSync = true, mode = 'single', filters = [], modifiers = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (mode === 'single' && !Object.keys(primaryData).length) throw new Error('No primary key defined.');
        if (mode === 'multiple' && !filters.length) throw new Error('No filters defined.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Deleting from ${table}`, {
            type: 'request',
            preview: mode === 'single' ? primaryData : filters,
        });

        const query = this.instance.from(table).delete({ count: modifiers?.count?.mode });

        if (mode === 'single') query.match(primaryData);
        else applyFilters(query, filters);

        applyModifiers(query, {
            select: { mode: 'guided', fields: [] },
            ...modifiers,
        });

        const { data, count, error } = await query;
        if (error)
            throw new Error(
                error.code === 'PGRST100'
                    ? 'Mode minimal cannot be used on this postgres version, please update your supabase instance or use another mode.'
                    : error.message,
                { cause: error }
            );
        if (autoSync) this.performAutoSync(table, 'DELETE', data);
        return this.formatReturn(data, count, mode === 'single');
    },
    async callPostgresFunction({ functionName, params, modifiers }, wwUtils) {
        const query = this.instance.rpc(
            functionName,
            Array.isArray(params)
                ? params.reduce((result, item) => ({ ...result, [item.key]: item.value }), {})
                : params,
            { count: modifiers?.count?.mode, head: modifiers?.count?.countOnly }
        );
        applyModifiers(query, modifiers);
        wwUtils?.log('info', `[Supabase] Call a Postgres function - ${functionName}`, {
            type: 'request',
            preview: params,
        });
        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        return this.formatReturn(data, count);
    },
    async invokeEdgeFunction({ functionName, body, headers = [], queries = [], method = 'POST' }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Invoke an Edge function - ${functionName}`, {
            type: 'request',
            preview: { body, headers, method },
        });
        const query = Array.isArray(queries)
            ? queries
            : queries && typeof queries === 'object'
            ? Object.keys(queries).map(k => ({ key: k, value: queries[k] }))
            : [];
        const queryString = query.length
            ? query.reduce((result, item) => `${result}${item.key}=${item.value}&`, '?')
            : '';
        const { data, error } = await this.instance.functions.invoke(functionName + queryString, {
            body,
            headers: Array.isArray(headers)
                ? headers.reduce((result, item) => ({ ...result, [item.key]: item.value }), {})
                : headers,
            method,
        });

        if (error instanceof FunctionsHttpError) {
            throw new Error('Function returned an error with status code ' + error.context.status, { cause: error });
        } else if (error instanceof FunctionsRelayError) {
            throw new Error('Relay error: ' + error.message, { cause: error });
        } else if (error instanceof FunctionsFetchError) {
            throw new Error('Fetch error: ' + error.message, { cause: error });
        } else if (error) {
            throw new Error(error.message, { cause: error, data });
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    },
    async listFiles({ bucket, path, options = {} }, wwUtils) {
        wwUtils?.log('info', `[Supabase] List all files`, { type: 'request', preview: { bucket, path, options } });
        const { data, error } = await this.instance.storage.from(bucket).list(path, {
            ...(options.limit ? { limit: options.limit } : {}),
            ...(options.offset ? { offset: options.offset } : {}),
            ...(options.search ? { search: options.search } : {}),
            ...(options.sortBy ? { sortBy: options.sortBy } : {}),
        });
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async uploadFile({ bucket, path, file, options = {} }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Upload a file`, {
            type: 'request',
            preview: { bucket, path, file, options },
        });
        const { data, error } = await this.instance.storage.from(bucket).upload(path, file, {
            ...(options.cacheControl ? { cacheControl: options.cacheControl } : {}),
            ...(options.upsert ? { upsert: options.upsert } : {}),
            ...(options.contentType ? { contentType: options.contentType } : {}),
            ...(options.duplex ? { duplex: options.duplex } : {}),
        });
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async downloadFile({ bucket, path, options = { transform: null } }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Download a file`, { type: 'request', preview: { bucket, path, options } });
        const { data, error } = this.instance.storage.from(bucket).download(
            path,
            options.transform
                ? {
                      transform: {
                          ...(options.transform.format ? { format: options.transform.format } : {}),
                          ...(options.transform.quality ? { quality: options.transform.quality } : {}),
                          ...(options.transform.resize ? { resize: options.transform.resize } : {}),
                          ...(options.transform.width ? { width: options.transform.width } : {}),
                          ...(options.transform.height ? { height: options.transform.height } : {}),
                      },
                  }
                : {}
        );
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async updateFile({ bucket, path, file, options = {} }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Update a file`, {
            type: 'request',
            preview: { bucket, path, file, options },
        });
        const { data, error } = this.instance.storage.from(bucket).update(path, file, {
            ...(options.cacheControl ? { cacheControl: options.cacheControl } : {}),
            ...(options.upsert ? { upsert: options.upsert } : {}),
            ...(options.contentType ? { contentType: options.contentType } : {}),
            ...(options.duplex ? { duplex: options.duplex } : {}),
        });
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async moveFile({ bucket, path, newPath }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Move a file`, { type: 'request', preview: { bucket, path, newPath } });
        const { data, error } = await this.instance.storage.from(bucket).move(path, newPath);
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async copyFile({ bucket, path, newPath }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Copy a file`, { type: 'request', preview: { bucket, path, newPath } });
        const { data, error } = await this.instance.storage.from(bucket).copy(path, newPath);
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async deleteFiles({ bucket, paths }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Delete files`, { type: 'request', preview: { bucket, paths } });
        const { data, error } = await this.instance.storage.from(bucket).remove(Array.isArray(paths) ? paths : [paths]);
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async createSignedUrl(
        { mode = 'single', bucket, path, expiresIn, options = { download: false, transform: null } },
        wwUtils
    ) {
        let query = this.instance.storage.from(bucket);
        wwUtils?.log('info', `[Supabase] Create a signed URL`, {
            type: 'request',
            preview: { bucket, path, expiresIn, options },
        });
        if (mode === 'single') {
            query = query.createSignedUrl(path, expiresIn, {
                download: options.download ? options.download.filename || true : false,
                transform: options.transform
                    ? {
                          ...(options.transform.format ? { format: options.transform.format } : {}),
                          ...(options.transform.quality ? { quality: options.transform.quality } : {}),
                          ...(options.transform.resize ? { resize: options.transform.resize } : {}),
                          ...(options.transform.width ? { width: options.transform.width } : {}),
                          ...(options.transform.height ? { height: options.transform.height } : {}),
                      }
                    : null,
            });
        } else {
            query = query.createSignedUrls(path, expiresIn, {
                download: options.download ? options.download.filename || true : false,
            });
        }
        const { data, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    getPublicUrl({ bucket, path, options = { download: false, transform: null } }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Retrieve a public URL`, {
            type: 'request',
            preview: { bucket, path, options },
        });
        const { data, error } = this.instance.storage.from(bucket).getPublicUrl(path, {
            download: options.download ? options.download.filename || true : false,
            ...(options.transform
                ? {
                      transform: {
                          ...(options.transform.format ? { format: options.transform.format } : {}),
                          ...(options.transform.quality ? { quality: options.transform.quality } : {}),
                          ...(options.transform.resize ? { resize: options.transform.resize } : {}),
                          ...(options.transform.width ? { width: options.transform.width } : {}),
                          ...(options.transform.height ? { height: options.transform.height } : {}),
                      },
                  }
                : {}),
        });
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    onSubscribe(payload) {
        const collections = Object.values(wwLib.$store.getters['data/getCollections']).filter(
            collection =>
                collection.pluginId === 'f9ef41c3-1c53-4857-855b-f2f6a40b7186' &&
                collection.config.table === payload.table
        );

        switch (payload.eventType) {
            case 'INSERT':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.new,
                        collection.config.primaryData
                    );
                    if (itemIndex !== -1) continue;
                    wwLib.$store.dispatch('data/setCollection', {
                        ...collection,
                        total: collection.total + 1,
                        data: [...(Array.isArray(collection.data) ? collection.data : []), payload.new],
                    });
                }
                return;
            case 'UPDATE':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.new,
                        collection.config.primaryData
                    );
                    if (itemIndex === -1) continue;
                    const data = [...(Array.isArray(collection.data) ? collection.data : [])];
                    data.splice(itemIndex, 1, { ...data[itemIndex], ...payload.new });
                    wwLib.$store.dispatch('data/setCollection', { ...collection, data });
                }
                return;
            case 'UPSERT':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.new,
                        collection.config.primaryData
                    );
                    const data = [...(Array.isArray(collection.data) ? collection.data : [])];
                    const isInsert = itemIndex === -1;
                    isInsert
                        ? data.push(payload.new)
                        : data.splice(itemIndex, 1, { ...data[itemIndex], ...payload.new });
                    wwLib.$store.dispatch('data/setCollection', {
                        ...collection,
                        total: collection.total + (isInsert ? 1 : 0),
                        data,
                    });
                }
                return;
            case 'DELETE':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.old,
                        collection.config.primaryData
                    );
                    if (itemIndex === -1) continue;
                    const data = [...(Array.isArray(collection.data) ? collection.data : [])];
                    data.splice(itemIndex, 1);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, total: collection.total - 1, data });
                }
                return;
        }
    },
    subscribeToChannel({
        channel,
        type = 'postgres_changes',
        event = '*',
        schema = '*',
        table,
        filter,
        self = false,
        presence = false,
    }) {
        const _channel = this.instance.channel(channel);
        _channel.on(
            type,
            {
                event: event || '*',
                ...(type === 'postgres_changes' ? { schema: schema || '*' } : {}),
                ...(type === 'postgres_changes' && table ? { table } : {}),
                ...(type === 'postgres_changes' && filter ? { filter } : {}),
                config: { broadcast: { self } },
            },
            e => {
                wwLib.wwWorkflow.executeTrigger(this.id + '-realtime:' + type, {
                    event: { channel, data: e },
                    conditions: { channel, event: e.event || e.eventType },
                });
            }
        );
        if (presence) {
            _channel.on(
                'presence',
                {
                    event: '*',
                },
                e => {
                    wwLib.wwWorkflow.executeTrigger(this.id + '-realtime:presence', {
                        event: { channel, data: e },
                        conditions: { channel, event: e.event },
                    });
                }
            );
        }
        _channel.subscribe();
    },
    unsubscribeFromChannel({ channel }) {
        const _channel = this.instance.getChannels().find(c => c.subTopic === channel);
        if (!_channel) throw new Error('Channel not found, please subscribe to the channel before unsubscribing.');
        this.instance.removeChannel(_channel);
    },
    sendMessageToChannel({ channel, type = 'broadcast', event, payload }) {
        debugger;
        const _channel = this.instance.getChannels().find(c => c.subTopic === channel);
        if (!_channel) throw new Error('Channel not found, please subscribe to the channel before sending a message.');
        _channel.send({ type, event, payload });
    },
    updateChannelState({ channel, state }) {
        const _channel = this.instance.getChannels().find(c => c.subTopic === channel);
        if (!_channel) throw new Error('Channel not found, please subscribe to the channel before updating the state.');
        _channel.track(state);
    },
    performAutoSync(table, type, data) {
        if (!data || this.settings.publicData.realtimeTables[table]) return;
        if (typeof data === 'string') return; // csv case
        const rows = Array.isArray(data) ? data : [data];
        for (const row of rows) {
            this.onSubscribe({ table, eventType: type, [type === 'DELETE' ? 'old' : 'new']: row });
        }
    },
    formatReturn(rows, count, single = false) {
        const data = single && Array.isArray(rows) ? rows[0] || null : rows;
        return count !== null ? { data, count } : data;
    },
    types: {
        integer: 'number',
        string: 'query',
    },
};

const applyFilters = (query, filters = []) => {
    for (const filter of filters) {
        if (!filter.isEnabled) continue;
        if (filter.fn === 'textSearch') query[filter.fn](filter.column, filter.value, filter.options || {});
        else if (filter.fn === 'or') query[filter.fn](filter.value);
        else if (filter.fn === 'filter' || filter.fn === 'not')
            query[filter.fn](filter.column, filter.operator, filter.value);
        else query[filter.fn](filter.column, filter.value);
    }
};

const applyModifiers = (query, { select, order, limit, range, single, maybeSingle, csv, explain } = {}) => {
    if (select) {
        query.select(
            select.mode === 'minimal'
                ? ''
                : select.mode === 'guided'
                ? select?.fields.length
                    ? select.fields.join(', ')
                    : '*'
                : select?.fieldsAdvanced
        );
    }

    if (order && order.column)
        query.order(order.column, {
            ascending: order.ascending,
            foreignTable: order.foreignTable,
            nullsFirst: order.nullsFirst,
        });
    if (limit && limit.count) query.limit(limit.count, { foreignTable: limit.foreignTable });
    if (range && (range.from || range.to)) query.range(range.from, range.to, { foreignTable: limit.foreignTable });
    if (single) query.limit(1).single();
    if (maybeSingle) query.limit(1).maybeSingle();
    if (csv) query.csv();
    if (explain) query.explain(explain);
};

const findIndexFromPrimaryData = (data, obj, primaryData) => {
    if (!Array.isArray(data)) return -1;
    return data.findIndex(item => primaryData.every(key => item && item[key] === obj[key]));
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/`, { headers: { apiKey } });
    return data;
};
/* wwEditor:end */
