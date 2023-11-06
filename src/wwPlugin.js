/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
import './components/Realtime/SettingsEdit.vue';
import './components/Realtime/SettingsSummary.vue';
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
import './components/Functions/Select.vue';
import './components/Functions/Insert.vue';
import './components/Functions/Update.vue';
import './components/Functions/Upsert.vue';
import './components/Functions/Delete.vue';
/* wwEditor:end */
import { createClient } from '@supabase/supabase-js';

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
    async select({ table, fieldsMode, dataFields, dataFieldsAdvanced, countMode, countOnly }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Selecting ${table}`, { type: 'request' });
        const fields = fieldsMode === 'guided' ? (dataFields || []).join(', ') : dataFieldsAdvanced;
        const { data, count, error } = await this.instance
            .from(table)
            .select(fields || undefined, { count: countMode, head: countOnly });
        if (error) throw new Error(error.message, { cause: error });
        return countMode ? (countOnly ? count : { data, count }) : data;
    },
    async insert(
        {
            table,
            data: payload = {},
            countMode = null,
            returnData = true,
            autoSync = true,
            returnFieldsMinimal = false,
            returnFieldsMode = 'guided',
            returnDataFields = [],
            returnDataFieldsAdvanced,
        },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Inserting inside ${table}`, { preview: payload, type: 'request' });

        const query = this.instance.from(table).insert([payload], { count: countMode });
        if (returnData) {
            query
                .select(
                    returnFieldsMinimal
                        ? ''
                        : returnFieldsMode === 'guided'
                        ? returnDataFields.length
                            ? returnDataFields.join(', ')
                            : '*'
                        : returnDataFieldsAdvanced
                )
                .maybeSingle();
        }

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (!returnData) return;
        if (!this.settings.publicData.realtimeTables[table] && autoSync)
            this.onSubscribe({ table, eventType: 'INSERT', new: data });
        return countMode ? { count, data } : data;
    },
    async update(
        {
            table,
            primaryData = {},
            data: payload = {},
            countMode = null,
            returnData = true,
            returnFieldsMinimal = false,
            autoSync = true,
            returnFieldsMode = 'guided',
            returnDataFields = [],
            returnDataFieldsAdvanced,
        },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (!Object.keys(primaryData).length) throw new Error('No primary key defined.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Updating ${table}`, {
            type: 'request',
            preview: { primaryData, data: payload },
        });

        const query = this.instance.from(table).update(payload, { count: countMode }).match(primaryData);
        if (returnData) {
            query
                .select(
                    returnFieldsMinimal
                        ? ''
                        : returnFieldsMode === 'guided'
                        ? returnDataFields.length
                            ? returnDataFields.join(', ')
                            : '*'
                        : returnDataFieldsAdvanced
                )
                .maybeSingle();
        }

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (!returnData) return;
        if (!this.settings.publicData.realtimeTables[table] && autoSync)
            this.onSubscribe({ table, eventType: 'UPDATE', new: data });
        return countMode ? { count, data } : data;
    },
    async upsert(
        {
            table,
            data: payload = {},
            countMode = null,
            ignoreDuplicates = false,
            onConflict = [],
            returnData = true,
            returnFieldsMinimal = false,
            autoSync = true,
            returnFieldsMode = 'guided',
            returnDataFields = [],
            returnDataFieldsAdvanced,
        },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Upserting data inside ${table}`, { type: 'request', preview: payload });

        const query = this.instance
            .from(table)
            .upsert(payload, { count: countMode, ignoreDuplicates, onConflict: onConflict.join(',') });
        if (returnData) {
            query
                .select(
                    returnFieldsMinimal
                        ? ''
                        : returnFieldsMode === 'guided'
                        ? returnDataFields.length
                            ? returnDataFields.join(', ')
                            : '*'
                        : returnDataFieldsAdvanced
                )
                .maybeSingle();
        }

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (!returnData) return;
        if (!this.settings.publicData.realtimeTables[table] && autoSync)
            this.onSubscribe({ table, eventType: 'UPSERT', new: data });
        return countMode ? { count, data } : data;
    },
    async delete(
        {
            table,
            primaryData = {},
            countMode = null,
            returnData = true,
            returnFieldsMinimal = false,
            autoSync = true,
            returnFieldsMode = 'guided',
            returnDataFields = [],
            returnDataFieldsAdvanced,
        },
        wwUtils
    ) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (!Object.keys(primaryData).length) throw new Error('No primary key defined.');
        /* wwEditor:end */
        wwUtils?.log('info', `[Supabase] Deleting from ${table}`, { type: 'request', preview: primaryData });

        const query = this.instance.from(table).delete({ count: countMode }).match(primaryData).select();
        if (returnData) {
            query
                .select(
                    returnFieldsMinimal
                        ? ''
                        : returnFieldsMode === 'guided'
                        ? returnDataFields.length
                            ? returnDataFields.join(', ')
                            : '*'
                        : returnDataFieldsAdvanced
                )
                .maybeSingle();
        }

        const { data, count, error } = await query;
        if (error) throw new Error(error.message, { cause: error });
        if (!returnData) return;
        if (!this.settings.publicData.realtimeTables[table] && autoSync)
            this.onSubscribe({ table, eventType: 'DELETE', old: data });
        return countMode ? { count, data } : data;
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
    types: {
        integer: 'number',
        string: 'query',
    },
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
