<template>
    <wwEditorFormRow class="w-100">
        <wwEditorInputRadio
            class="mb-2"
            :model-value="connectionMode"
            :choices="[
                { label: 'Use an account', value: 'connect', default: true },
                { label: 'Use access token', value: 'accessToken' },
                { label: 'Use local', value: 'local' },
            ]"
            @update:modelValue="changeConnectionMode"
        />
    </wwEditorFormRow>
    <div v-if="!connectionMode || connectionMode === 'connect'" class="flex items-center">
        <button class="ww-editor-button -secondary" @click="connect" type="button" :disabled="isOauth">
            <wwEditorIcon name="logos/supabase" class="ww-editor-button-icon -left" />
            {{ isOauth ? 'Account connected' : 'Connect Supabase' }}
        </button>
        <button v-if="isOauth" type="button" class="ww-editor-button -secondary -small -icon ml-2" @click="unlink">
            <wwEditorIcon name="unbind" medium />
        </button>
    </div>

    <wwEditorFormRow
        v-else-if="connectionMode === 'accessToken'"
        :label="isOauth ? 'Access token' : 'Personal Access Token'"
        class="w-100"
    >
        <template #append-label>
            <a class="ww-editor-link ml-2" href="https://supabase.com/dashboard/account/tokens" target="_blank">
                Find it here
            </a>
        </template>
        <wwEditorInput
            type="query"
            placeholder="sbp_bdd0********4f23"
            :model-value="settings.privateData.accessToken"
            @update:modelValue="changeAccessToken"
        ></wwEditorInput>
    </wwEditorFormRow>
    <div
        v-else-if="connectionMode === 'local'"
        class="body-sm content-warning-secondary bg-warning-secondary p-2 rounded-02"
    >
        <span>Connecting to a local supabase project disables the Back-end panel and AI assistance.</span>
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
            projects: [],
            isLoading: false,
            // keep track of the access token when switching mode
            accessToken: '',
        };
    },
    computed: {
        isOauth() {
            return this.settings.privateData.accessToken?.startsWith('sbp_oauth');
        },
        connectionMode() {
            return this.settings.privateData.connectionMode;
        },
    },
    mounted() {
        this.accessToken = this.settings.privateData.accessToken;
        if (
            !this.settings.privateData.accessToken &&
            wwLib.wwPlugins?.supabaseAuth?.settings?.privateData?.accessToken
        ) {
            this.changeAccessToken(wwLib.wwPlugins.supabaseAuth.settings.privateData.accessToken);
            this.accessToken = wwLib.wwPlugins.supabaseAuth.settings.privateData.accessToken;
        }
    },
    methods: {
        changeConnectionMode(connectionMode) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: {
                    ...this.settings.privateData,
                    connectionMode,
                    accessToken: connectionMode === 'local' ? '' : this.accessToken,
                },
            });
        },
        changeAccessToken(accessToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, accessToken },
            });
            this.accessToken = accessToken;
        },
        async connect() {
            this.isLoading = true;
            const redirectUri = window.location.origin + window.location.pathname;
            window.localStorage.setItem('supabase_oauth', true);
            const { data } = await wwAxios.post(
                `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${
                    wwLib.$store.getters['websiteData/getDesignInfo'].id
                }/supabase/authorize`,
                { redirectUri, oauthRedirectUri: wwLib.wwApiRequests._getPluginsUrl() + '/supabase/redirect' }
            );
            if (!data?.data) throw new Error('No authorization URL returned');
            window.location.href = data?.data;
        },
        unlink() {
            this.changeAccessToken('');
        },
    },
};
</script>
