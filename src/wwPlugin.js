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
                const { data, error } = await this.instance.from(collection.config.table).select();
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
    async select({ table }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) wwUtils.log({ label: 'Table select', preview: table });
        /* wwEditor:end */
        return this.instance.from(table).select();
    },
    async insert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table insert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        return this.instance.from(table).insert([data]);
    },
    async update({ table, id, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table update', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        return this.instance.from(table).update(data).match({ id });
    },
    async upsert({ table, data = {} }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table upsert', preview: table });
            wwUtils.log({ label: 'Payload', preview: data });
        }
        /* wwEditor:end */
        return this.instance.from(table).upsert(data);
    },
    async delete({ table, id }, wwUtils) {
        /* wwEditor:start */
        if (!this.instance) throw new Error('Invalid Supabase configuration.');
        if (wwUtils) {
            wwUtils.log({ label: 'Table delete', preview: table });
            wwUtils.log({ label: 'ID', preview: id });
        }
        /* wwEditor:end */
        return this.instance.from(table).delete().match({ id });
    },
    onSubscribe(payload) {
        const collections = Object.values(wwLib.$store.getters['data/getCollections']).filter(
            collection =>
                collection.pluginId === 'f9ef41c3-1c53-4857-855b-f2f6a40b7186' &&
                collection.config.table === payload.table
        );

        switch (payload.eventType) {
            case 'INSERT':
                for (const collection of collections)
                    wwLib.$store.dispatch('data/setCollection', {
                        ...collection,
                        total: collection.total + 1,
                        data: [...collection.data, payload.new],
                    });
            case 'UPDATE':
                for (const collection of collections) {
                    const itemIndex = collection.data.findIndex(item => item.id === payload.old.id);
                    const data = [...collection.data];
                    data.splice(itemIndex, 1, payload.new);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, data });
                }
            case 'UPSERT':
                for (const collection of collections) {
                    const itemIndex = collection.data.findIndex(item => item.id === payload.old.id);
                    const data = [...collection.data];
                    itemIndex !== -1 ? data.splice(itemIndex, 1, payload.new) : data.push(payload.new);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, data });
                }
            case 'DELETE':
                for (const collection of collections) {
                    const itemIndex = collection.data.findIndex(item => item.id === payload.old.id);
                    const data = [...collection.data];
                    data.splice(itemIndex, 1);
                    wwLib.$store.dispatch('data/setCollection', { ...collection, total: collection.total - 1, data });
                }
        }
    },
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/?apikey=${apiKey}`);
    return data;
};
/* wwEditor:end */
