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
    <wwEditorFormRow required label="Private API key">
        <wwEditorInputText
            type="text"
            placeholder="ey********"
            :model-value="settings.privateData.privateApiKey"
            :style="{ '-webkit-text-security': isKeyVisible ? 'none' : 'disc' }"
            large
            @update:modelValue="changePrivateApiKey"
        />
    </wwEditorFormRow>
    <div class="flex items-center">
        <wwEditorInputSwitch v-model="isKeyVisible" />
        <span class="ml-2">Show api key</span>
    </div>
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
