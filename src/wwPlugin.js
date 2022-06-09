/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
// import './components/Request.vue';
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
                const { data, error } = await this.request(collection.config);
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
    async request({ table }, wwUtils) {
        if (wwUtils) {
            wwUtils.log({ label: 'Request table', preview: table });
        }
        return this.instance.from(table).select();
    },
};

/* wwEditor:start */
const getDoc = async (url, apiKey) => {
    const { data } = await axios.get(`${url}/rest/v1/?apikey=${apiKey}`);
    return data;
};
/* wwEditor:end */
