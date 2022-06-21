<template>
    <wwEditorInputRow
        label="Project URL"
        required
        type="query"
        placeholder="https://your-project.supabase.co"
        :model-value="settings.publicData.projectUrl"
        @update:modelValue="changeProjectUrl"
    />
    <wwEditorInputRow
        label="Public API key"
        required
        type="query"
        placeholder="ey********"
        :model-value="settings.publicData.apiKey"
        @update:modelValue="changeApiKey"
    />
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
        loadInstance() {
            this.plugin.load(this.settings.publicData.projectUrl, this.settings.publicData.apiKey);
        },
    },
};
</script>
