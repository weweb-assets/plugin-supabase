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
    data() {
        return {
            isKeyVisible: false,
        };
    },
    methods: {
        changeProjectUrl(projectUrl) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, projectUrl },
            });
            this.loadInstance();
        },
        changeapiKey(apiKey) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, apiKey },
            });
            this.loadInstance();
        },
        loadInstance() {
            if (!this.settings.publicData.projectUrl || !this.settings.publicData.apiKey) return;
            this.plugin.load(this.settings.publicData.projectUrl, this.settings.publicData.apiKey);
        },
    },
};
</script>

<style lang="scss" scoped>
.airtable-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-blue-500);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
    }
    &__radio-label {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
