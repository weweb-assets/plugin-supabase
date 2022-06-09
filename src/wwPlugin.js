/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
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
    async load(projectUrl, apiKey) {
        this.instance = createClient(projectUrl, apiKey);
        /* wwEditor:start */
        await this.fetchDoc(projectUrl, apiKey);
        /* wwEditor:end */
    },
    /* wwEditor:start */
    async fetchDoc(projectUrl = this.settings.publicData.projectUrl, apiKey = this.settings.publicData.apiKey) {
        this.doc = await getDoc(projectUrl, apiKey);
    },
    /* wwEditor:end */
    async select({ table }, wwUtils) {
        return this.instance.from(table).select();
    },
    async insert({ table }, wwUtils) {
        return this.instance.from(table).insert();
    },
    async update({ table }, wwUtils) {
        return this.instance.from(table).update();
    },
    async upsert({ table }, wwUtils) {
        return this.instance.from(table).upsert();
    },
    async delete({ table }, wwUtils) {
        return this.instance.from(table).delete();
    },
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/?apikey=${apiKey}`);
    return data;
};
/* wwEditor:end */
