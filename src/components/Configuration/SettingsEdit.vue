<template>
    <wwEditorFormRow required label="Project URL">
        <template #append-label>
            <a class="ww-editor-link ml-2" href="https://supabase.com/dashboard/project/_/settings/api" target="_blank">
                Find it here
            </a>
        </template>
        <wwEditorInputRow
            type="query"
            placeholder="https://your-project.supabase.co"
            :model-value="settings.publicData.projectUrl"
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
    <wwEditorInputRow
        label="Personal Access Token"
        required
        type="query"
        placeholder="sbp_bdd0********4f23"
        :model-value="settings.privateData.accessToken"
        @update:modelValue="changeAccessToken"
    >
        <template #append-label>
            <a class="ww-editor-link ml-2" href="https://supabase.com/dashboard/account/tokens" target="_blank">
                Find it here
            </a>
        </template>
    </wwEditorInputRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    mounted() {
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
                },
            });
        }
    },
    methods: {
        changeProjectUrl(projectUrl) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, projectUrl },
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
        loadInstance() {
            this.plugin.load(this.settings.publicData.projectUrl, this.settings.publicData.apiKey);
        },
    },
};
</script>
