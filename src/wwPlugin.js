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
    // Allow supabase auth to sync both instances
    syncInstance() {
        if (wwLib.wwPlugins.supabaseAuth && wwLib.wwPlugins.supabaseAuth.instance) {
            this.instance && this.instance.removeAllSubscriptions();
            this.instance = wwLib.wwPlugins.supabaseAuth.instance;
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
        this.instance.removeAllSubscriptions();
        for (const tableName of Object.keys(realtimeTables)) {
            if (!realtimeTables[tableName]) continue;
            this.instance.from(tableName).on('*', this.onSubscribe).subscribe();
        }
    },
    async load(projectUrl, apiKey) {
        if (!projectUrl || !apiKey) return;
        try {
            this.instance =
                wwLib.wwPlugins.supabaseAuth && wwLib.wwPlugins.supabaseAuth.instance
                    ? wwLib.wwPlugins.supabaseAuth.instance
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
    async select({ table, fieldsMode, dataFields, dataFieldsAdvanced }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) wwUtils.log({ label: 'Table select', preview: table });
        /* wwEditor:end */
        const fields = fieldsMode === 'guided' ? (dataFields || []).join(', ') : dataFieldsAdvanced;
        const { data: result, error } = await this.instance.from(table).select(fields || undefined);
        if (error) throw new Error(error.message, { cause: error });
        return result;
    },
    async insert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table insert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        const { data: result, error } = await this.instance.from(table).insert([data]);
        if (error) throw new Error(error.message, { cause: error });
        if (!this.settings.publicData.realtimeTables[table])
            this.onSubscribe({ table, eventType: 'INSERT', new: result[0] });
        return result[0];
    },
    async update({ table, primaryData = {}, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (!Object.keys(primaryData).length) throw new Error('No primary key defined.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table update', preview: table });
            wwUtils.log({ label: 'Primary key', preview: primaryData });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        const { data: result, error } = await this.instance.from(table).update(data).match(primaryData);
        if (error) throw new Error(error.message, { cause: error });
        if (!this.settings.publicData.realtimeTables[table])
            this.onSubscribe({ table, eventType: 'UPDATE', new: result[0] });
        return result[0];
    },
    async upsert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table upsert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        const { data: result, error } = await this.instance.from(table).upsert(data);
        if (error) throw new Error(error.message, { cause: error });
        if (!this.settings.publicData.realtimeTables[table])
            this.onSubscribe({ table, eventType: 'UPSERT', new: result[0] });
        return result[0];
    },
    async delete({ table, primaryData = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (!Object.keys(primaryData).length) throw new Error('No primary key defined.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table delete', preview: table });
            wwUtils.log({ label: 'Primary key', preview: primaryData });
        }
        /* wwEditor:end */
        const { data: result, error } = await this.instance.from(table).delete().match(primaryData);
        if (error) throw new Error(error.message, { cause: error });
        if (!this.settings.publicData.realtimeTables[table])
            this.onSubscribe({ table, eventType: 'DELETE', old: result[0] });
        return result;
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
                    if (itemIndex !== -1) return;
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
                    if (itemIndex === -1) return;
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
                    if (itemIndex === -1) return;
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
    return data.findIndex(item => primaryData.every(key => item[key] === obj[key]));
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/?apikey=${apiKey}`);
    return data;
};
/* wwEditor:end */
