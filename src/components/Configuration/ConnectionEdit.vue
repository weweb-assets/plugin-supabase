<template>
    <button class="ww-editor-button -secondary" @click="connect">
        <wwEditorIcon name="logos/supabase" class="ww-editor-button-icon -left" />
        Connect Supabase
    </button>
    <span class="my-2">Or</span>
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
            projects: [],
            isLoading: false,
        };
    },
    methods: {
        changeAccessToken(accessToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, accessToken },
            });
        },
        connect() {
            this.isLoading = true;
            const clientId = '609eb9b4-60cb-462f-92ab-5a5eb180f666';
            const redirectUri = window.location.origin + window.location.pathname;
            window.localStorage.setItem('supabase_oauth', true);
            window.location.href = `https://api.supabase.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        },
    },
};
</script>
