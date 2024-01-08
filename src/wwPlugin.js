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
import './components/Functions/CallPostgres.vue';
import './components/Functions/InvokeEdge.vue';
/* wwEditor:end */
import { createClient, FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';

import { generateFilter } from './helpers/filters';

export default {
    instance: null,
    /* wwEditor:start */
    doc: null,
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async onLoad(settings) {
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
    async fetchCollection(collection) {
        if (collection.mode === 'dynamic') {
            try {
                const fields =
                    collection.config.fieldsMode === 'guided'
                        ? (collection.config.dataFields || []).join(', ')
                        : collection.config.dataFieldsAdvanced;
                let query = this.instance.from(collection.config.table).select(fields || undefined, { count: 'exact' });
                const filter = generateFilter(collection.filter);

                if (filter) query.or(filter);

                if (collection.limit) {
                    query.range(collection.offset, collection.offset + collection.limit - 1);
                }

                for (const sort of collection.sort) {
                    query.order(sort.key, { ascending: sort.direction === 'ASC' });
                }

                const { data, error, count } = await query;
                return { data, error, total: count };
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
                .channel('public:' + tableName)
                .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, this.onSubscribe)
                .subscribe();
        }

        // Experimental
        const collections = Object.values(wwLib.$store.getters['data/getCollections']).filter(
            collection =>
                collection.pluginId === 'f9ef41c3-1c53-4857-855b-f2f6a40b7186' &&
                Object.keys(realtimeTables).includes(collection.config.table)
        );
        for (const collection of collections) {
            this.instance
                .channel('public:' + collection.id)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: collection.config.table,
                        filter: generateFilter(collection.filter),
                    },
                    event => this.onCollectionUpdate(collection.id, event)
                )
                .subscribe();
        }
    },
    onCollectionUpdate(collectionId, event) {
        console.log(collectionId, event);
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
            maybeSingle: mode === 'single',
        });

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (autoSync) this.performAutoSync(table, 'INSERT', data);
        return modifiers?.count ? { count, data } : data;
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
            maybeSingle: mode === 'single',
        });

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (autoSync) this.performAutoSync(table, 'UPDATE', data);
        return modifiers?.count ? { count, data } : data;
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
            maybeSingle: mode === 'single',
        });

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (autoSync) this.performAutoSync(table, 'UPSERT', data);
        return modifiers?.count ? { count, data } : data;
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
            maybeSingle: mode === 'single',
        });

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (autoSync) this.performAutoSync(table, 'DELETE', data);
        return modifiers?.count ? { count, data } : data;
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
        const { data, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        return data;
    },
    async invokeEdgeFunction({ functionName, body, headers = [], method = 'POST' }, wwUtils) {
        wwUtils?.log('info', `[Supabase] Invoke an Edge function - ${functionName}`, {
            type: 'request',
            preview: { body, headers, method },
        });
        const { data, error } = await this.instance.functions.invoke(functionName, {
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
        }
        return data;
    },
    async createSignedUrl({ bucket, path, expiresIn, options }, wwUtils) {
        const query = this.instance.storage.from(bucket);
        wwUtils?.log('info', `[Supabase] Create a signed URL`, {
            type: 'request',
            preview: { bucket, path, expiresIn, options },
        });
        if (mode === 'single') {
            query.createSignedUrl(path, expiresIn, {
                download: options.download ? options.download.filename || true : false,
                transform: options.transform
                    ? {
                          width: options.transform.width,
                          height: options.transform.height,
                      }
                    : null,
            });
        } else {
            query.createSignedUrls(path, expiresIn, {
                download: options.download ? options.download.filename || true : false,
            });
        }
        const { data, error } = await query;
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
    performAutoSync(table, type, data) {
        if (!data || this.settings.publicData.realtimeTables[table]) return;
        if (typeof data === 'string') return; // csv case
        const rows = Array.isArray(data) ? data : [data];
        for (const row of rows) {
            this.onSubscribe({ table, eventType: type, [type === 'DELETE' ? 'old' : 'new']: row });
        }
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
