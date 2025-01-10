<template>
    <wwEditorFormRow label="Personal Access Token">
        <template #append-label>
            <a class="ww-editor-link ml-2" href="https://supabase.com/dashboard/account/tokens" target="_blank">
                Find it here
            </a>
        </template>
        <wwEditorInputRow
            type="query"
            placeholder="sbp_bdd0********4f23"
            :model-value="settings.privateData.accessToken"
            @update:modelValue="changeAccessToken"
        ></wwEditorInputRow>
    </wwEditorFormRow>
    <wwEditorFormRow required label="Project URL">
        <template #append-label>
            <a
                v-if="!settings.privateData.accessToken"
                class="ww-editor-link ml-2"
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
            >
                Find it here
            </a>
        </template>
        <wwEditorInputRow
            v-if="!settings.privateData.accessToken"
            type="query"
            placeholder="https://your-project.supabase.co"
            :model-value="settings.publicData.projectUrl"
            @update:modelValue="changeProjectUrl"
        />
        <wwEditorInputRow
            v-else
            type="select"
            placeholder="https://your-project.supabase.co"
            :model-value="settings.publicData.projectUrl"
            :options="
                projects.map(project => ({
                    label: `${project.name} (${project.id}) ${project.status === 'INACTIVE' ? '#PAUSED' : ''}`,
                    value: `https://${project.id}.supabase.co`,
                }))
            "
            @update:modelValue="changeProjectUrl"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Public API key"
        required
        type="query"
        placeholder="ey********"
        :model-value="settings.publicData.apiKey"
        @update:modelValue="changeApiKey"
    />
    <wwEditorFormRow label="Database password">
        <template #append-label>
            <a
                class="ww-editor-link ml-2"
                href="https://supabase.com/dashboard/project/_/settings/database"
                target="_blank"
            >
                Find it here
            </a>
        </template>
        <wwEditorInputRow
            type="query"
            placeholder=""
            :model-value="settings.privateData.databasePassword"
            @update:modelValue="changeDatabasePassword"
        ></wwEditorInputRow>
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            projects: [],
        };
    },
    mounted() {
        if (this.settings.privateData.accessToken) {
            this.fetchProjects();
        }
        const isSettingsValid = this.settings.publicData.projectUrl && this.settings.publicData.apiKey;
        const isOtherPluginSettingsValid =
            wwLib.wwPlugins.supabaseAuth &&
            wwLib.wwPlugins.supabaseAuth.settings.publicData.projectUrl &&
            wwLib.wwPlugins.supabaseAuth.settings.publicData.apiKey &&
            wwLib.wwPlugins.supabaseAuth.settings.privateData.apiKey;
        if (!isSettingsValid && isOtherPluginSettingsValid) {
            this.changeProjectUrl(wwLib.wwPlugins.supabaseAuth.settings.publicData.projectUrl);
            this.changeApiKey(wwLib.wwPlugins.supabaseAuth.settings.publicData.apiKey);
            this.changeAccessToken(wwLib.wwPlugins.supabaseAuth.settings.privateData.accessToken);
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    apiKey: wwLib.wwPlugins.supabaseAuth.settings.publicData.apiKey,
                    projectUrl: wwLib.wwPlugins.supabaseAuth.settings.publicData.projectUrl,
                },
                privateData: {
                    ...this.settings.privateData,
                    accessToken: wwLib.wwPlugins.supabaseAuth.settings.privateData.accessToken,
                    databasePassword: wwLib.wwPlugins.supabaseAuth.settings.privateData.databasePassword,
                },
            });
        }
    },
    methods: {
        async changeProjectUrl(projectUrl) {
            let apiKey = this.settings.publicData.apiKey;
            if (this.settings.privateData.accessToken) {
                const { apiKeys } = await this.fetchProject(
                    projectUrl.replace('https://', '').replace('.supabase.co', '')
                );
                apiKey = apiKeys.find(key => key.name === 'anon').api_key;
            }
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, projectUrl, apiKey },
            });

            this.$nextTick(this.loadInstance);
        },
        changeApiKey(apiKey) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, apiKey },
            });
            this.$nextTick(this.loadInstance);
        },
        changeAccessToken(accessToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, accessToken },
            });
        },
        changeDatabasePassword(databasePassword) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, databasePassword },
            });
        },
        loadInstance() {
            this.plugin.load(this.settings.publicData.projectUrl, this.settings.publicData.apiKey);
        },
        async fetchProjects() {
            const { data } = await wwAxios.get(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${
                    this.$store.getters['websiteData/getDesignInfo'].id
                }/supabase/projects`
            );
            this.projects = data?.data;
        },
        async fetchProject(projectId) {
            const { data } = await wwAxios.get(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${
                    this.$store.getters['websiteData/getDesignInfo'].id
                }/supabase/projects/${projectId}`
            );
            return data?.data;
        },
    },
};
</script>
