<template>
    <wwEditorInputRow
        label="Project URL"
        required
        type="query"
        placeholder="https://********.supabase.co"
        :model-value="settings.publicData.projectUrl"
        @update:modelValue="changeProjectUrl"
    />
    <wwEditorInputRow
        label="Public API key"
        required
        type="query"
        placeholder="ey********"
        :model-value="settings.publicData.publicApiKey"
        @update:modelValue="changePublicApiKey"
    />
    <wwEditorInputRow
        label="Private API key"
        required
        type="query"
        placeholder="********"
        :model-value="settings.privateData.privateApiKey"
        @update:modelValue="changePrivateApiKey"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    methods: {
        changeProjectUrl(projectUrl) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, projectUrl },
            });
            this.loadInstance();
        },
        changePublicApiKey(publicApiKey) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, publicApiKey },
            });
            this.loadInstance();
        },
        changePrivateApiKey(privateApiKey) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, privateApiKey },
            });
            this.loadInstance();
        },
        loadInstance() {
            if (!this.settings.publicData.projectUrl || !this.settings.publicData.publicApiKey) return;
            this.plugin.load(this.settings.publicData.projectUrl, this.settings.publicData.publicApiKey);
        },
    },
};
</script>
