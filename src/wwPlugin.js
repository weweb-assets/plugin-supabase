/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/RealtimeEdit.vue';
import './components/RealtimeSummary.vue';
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
import './components/Select.vue';
import './components/Insert.vue';
import './components/Update.vue';
import './components/Upsert.vue';
import './components/Delete.vue';
/* wwEditor:end */
import { createClient } from '@supabase/supabase-js';

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
                const { data, error } = await this.instance.from(collection.config.table).select(fields || undefined);
                return { data, error };
            } catch (err) {
                return {
                    error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
                };
            }
        } else {
            return { data: null, error: null };
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
            this.instance = createClient(projectUrl, apiKey);
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
        const { data, error } = this.instance.from(table).select(fields || undefined);
        if (error) throw error;
        return data;
    },
    async insert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table insert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        const result = await this.instance.from(table).insert([data]);
        if (!settings.publicData.realtimeTables[table]) onSubscribe({ eventType: 'INSERT' });
        return result;
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
        const result = await this.instance.from(table).update(data).match(primaryData);
        if (!settings.publicData.realtimeTables[table]) onSubscribe({ eventType: 'UPDATE' });
        return result;
    },
    async upsert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table upsert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        const result = await this.instance.from(table).upsert(data);
        if (!settings.publicData.realtimeTables[table]) onSubscribe({ eventType: 'UPSERT' });
        return result;
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
        const result = await this.instance.from(table).delete().match(primaryData);
        if (!settings.publicData.realtimeTables[table]) onSubscribe({ eventType: 'DELETE' });
        return result;
    },
    onSubscribe(payload) {
        const collections = Object.values(wwLib.$store.getters['data/getCollections']).filter(
            collection =>
                collection.pluginId === 'f9ef41c3-1c53-4857-855b-f2f6a40b7186' &&
                collection.config.table === payload.table
        );

        console.log('onSubscribe', payload);
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
                        data: [...collection.data, payload.new],
                    });
                }
            case 'UPDATE':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.new,
                        collection.config.primaryData
                    );
                    const data = [...collection.data];
                    data.splice(itemIndex, 1, payload.new);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, data });
                }
            case 'UPSERT':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.new,
                        collection.config.primaryData
                    );
                    const data = [...collection.data];
                    itemIndex !== -1 ? data.splice(itemIndex, 1, payload.new) : data.push(payload.new);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, data });
                }
            case 'DELETE':
                for (const collection of collections) {
                    const itemIndex = findIndexFromPrimaryData(
                        collection.data,
                        payload.old,
                        collection.config.primaryData
                    );
                    const data = [...collection.data];
                    data.splice(itemIndex, 1);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, total: collection.total - 1, data });
                }
        }
    },
    types: {
        integer: 'number',
        string: 'query',
    },
};

const findIndexFromPrimaryData = (data, obj, primaryData) => {
    return data.findIndex(item => {
        primaryData.every(key => item[key] === obj[key]);
    });
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/?apikey=${apiKey}`);
    return data;
};
/* wwEditor:end */
