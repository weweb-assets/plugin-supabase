<template>
    <!-- Environment Tabs -->
    <div class="environment-tabs-container">
        <wwEditorFormRow label="Environment Configuration" class="w-100">
            <div class="ww-tabs-header">
                <div
                    v-for="env in environments"
                    :key="env"
                    :class="[
                        'ww-tab-item',
                        { 'ww-tab-active': activeEnvironment === env }
                    ]"
                    @click="activeEnvironment = env"
                >
                    <span class="ww-tab-label">
                        {{ capitalize(env) }}
                    </span>
                    <span v-if="!isEnvironmentConfigured(env) && env !== 'production'" class="ww-tab-optional">
                        Optional
                    </span>
                </div>
            </div>
        </wwEditorFormRow>
    </div>

    <!-- Environment Configuration -->
    <div v-for="env in environments" :key="`config-${env}`" v-show="activeEnvironment === env">

        <wwEditorFormRow class="w-100">
            <wwEditorInputRadio
                v-if="isConnected(env)"
                v-model="selectModes[env]"
                :disabled="isComingUp"
                :choices="[
                    { label: 'Select a project', value: 'select' },
                    { label: 'Create a project', value: 'create' },
                ]"
            />
        </wwEditorFormRow>

        <template v-if="selectModes[env] === 'select' || !isConnected(env)">
            <div class="flex items-center" v-if="isConnected(env)">
                <wwEditorFormRow :required="env === 'production'" label="Project URL" class="w-100">
                    <wwEditorInput
                        type="select"
                        placeholder="https://your-project.supabase.co"
                        :model-value="getCurrentEnvConfig().projectUrl"
                        :options="projectsOptions"
                        @update:modelValue="(val) => changeProjectUrl(val, env)"
                        class="-full"
                    />
                </wwEditorFormRow>
                <button type="button" class="ww-editor-button -primary -small -icon ml-2 mt-1" @click="refreshProjects">
                    <wwEditorIcon name="refresh" medium />
                </button>
            </div>
            
            <button
                v-if="isConnected(env)"
                @click="showSettings[env] = !showSettings[env]"
                class="ww-editor-button -secondary -small mb-2"
                type="button"
            >
                {{ showSettings[env] ? 'Close' : 'Open' }} settings
            </button>
            
            <template v-if="showSettings[env] || !isConnected(env)">
                <wwEditorInputRow
                    label="Project URL"
                    type="query"
                    placeholder="https://your-project.supabase.co"
                    :required="env === 'production'"
                    :model-value="getCurrentEnvConfig().projectUrl"
                    @update:modelValue="(val) => changeProjectUrl(val, env)"
                />
                
                <wwEditorInputRow
                    label="Public API key"
                    :required="env === 'production'"
                    type="query"
                    placeholder="Enter your public API key"
                    :model-value="getCurrentEnvConfig().apiKey"
                    @update:modelValue="(val) => changeApiKey(val, env)"
                />
                
                <wwEditorFormRow label="Service role key">
                    <div class="flex items-center">
                        <wwEditorInputText
                            type="password"
                            placeholder="Enter your service role key"
                            large
                            class="w-full"
                            :style="{ '-webkit-text-security': 'disc' }"
                            :model-value="getCurrentEnvPrivateConfig().apiKey"
                            @update:modelValue="(val) => changePrivateApiKey(val, env)"
                        />
                        <wwEditorQuestionMark
                            tooltip-position="top-left"
                            forced-content="Required if you want to manage your users and roles from the Editor or restrict access to a page for a specific role."
                            class="ml-2"
                            :class="{ 'text-yellow-500': !getCurrentEnvPrivateConfig().apiKey }"
                        />
                    </div>
                </wwEditorFormRow>
            </template>
        </template>
        
        <!-- Create Project UI (same as before but per environment) -->
        <template v-else-if="selectModes[env] === 'create'">
            <!-- ... existing create project UI ... -->
        </template>
    </div>
    
    <wwLoader :loading="isLoading && !isComingUp" />
</template>

<script>
import { isEnvironmentConfigured } from '../../helpers/environmentConfig';

export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            environments: ['production', 'staging', 'editor'],
            activeEnvironment: 'production',
            selectModes: {
                production: 'select',
                staging: 'select',
                editor: 'select'
            },
            showSettings: {
                production: false,
                staging: false,
                editor: false
            },
            projects: [],
            isLoading: false,
            isComingUp: false,
            showDbPass: false,
            newProject: {
                name: '',
                region: 'us-east-1',
                organizationId: '',
                dbPass: '',
            },
            organizations: [],
        };
    },
    computed: {
        projectRef() {
            const config = this.getCurrentEnvConfig();
            return config?.projectUrl?.replace('https://', '').replace('.supabase.co', '');
        },
        projectsOptions() {
            return (
                this.projects
                    .map(project => ({
                        label: `${project.name} (${project.id}) ${project.status === 'INACTIVE' ? '#PAUSED' : ''}`,
                        value: `https://${project.id}.supabase.co`,
                    }))
                    .sort((a, b) => (a.label.includes('#PAUSED') ? 1 : 0) - (b.label.includes('#PAUSED') ? 1 : 0))
            );
        },
    },
    mounted() {
        // Initialize multi-environment structure if needed
        if (!this.settings.publicData?.environments) {
            this.migrateToMultiEnv();
        }
        
        // Check if any environment is connected
        const hasConnection = this.environments.some(env => this.isConnected(env));
        if (hasConnection) {
            this.refreshProjects();
        } else {
            this.showSettings.production = true;
        }
    },
    methods: {
        // Key detection helpers
        
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        isEnvironmentConfigured(env) {
            return isEnvironmentConfigured(this.settings, env);
        },
        
        isConnected(env) {
            const privateConfig = this.getCurrentEnvPrivateConfig(env);
            return privateConfig?.accessToken;
        },
        
        getCurrentEnvConfig(env = this.activeEnvironment) {
            if (this.settings.publicData?.environments?.[env]) {
                return this.settings.publicData.environments[env];
            }
            // Fallback to legacy format for production
            if (env === 'production' && this.settings.publicData?.projectUrl) {
                return {
                    projectUrl: this.settings.publicData.projectUrl,
                    apiKey: this.settings.publicData.apiKey,
                    customDomain: this.settings.publicData.customDomain
                };
            }
            return {};
        },
        
        getCurrentEnvPrivateConfig(env = this.activeEnvironment) {
            if (this.settings.privateData?.environments?.[env]) {
                return this.settings.privateData.environments[env];
            }
            // Fallback to legacy format for production
            if (env === 'production' && this.settings.privateData) {
                return {
                    connectionMode: this.settings.privateData.connectionMode,
                    accessToken: this.settings.privateData.accessToken,
                    refreshToken: this.settings.privateData.refreshToken,
                    apiKey: this.settings.privateData.apiKey,
                    databasePassword: this.settings.privateData.databasePassword,
                    connectionString: this.settings.privateData.connectionString
                };
            }
            return {};
        },
        
        migrateToMultiEnv() {
            // Migrate legacy config to multi-environment structure
            const newSettings = {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    environments: {
                        production: {
                            projectUrl: this.settings.publicData?.projectUrl || '',
                            apiKey: this.settings.publicData?.apiKey || '',
                            customDomain: this.settings.publicData?.customDomain || ''
                        }
                    }
                },
                privateData: {
                    ...this.settings.privateData,
                    environments: {
                        production: {
                            connectionMode: this.settings.privateData?.connectionMode || 'custom',
                            accessToken: this.settings.privateData?.accessToken || '',
                            refreshToken: this.settings.privateData?.refreshToken || '',
                            apiKey: this.settings.privateData?.apiKey || '',
                            databasePassword: this.settings.privateData?.databasePassword || '',
                            connectionString: this.settings.privateData?.connectionString || ''
                        }
                    }
                }
            };
            this.$emit('update:settings', newSettings);
        },
        
        async changeProjectUrl(projectUrl, env) {
            let apiKey = this.getCurrentEnvConfig(env).apiKey;
            let privateApiKey = this.getCurrentEnvPrivateConfig(env).apiKey;
            let connectionString = this.getCurrentEnvPrivateConfig(env).connectionString;
            
            if (this.isConnected(env)) {
                const { apiKeys, pgbouncer } = await this.fetchProject(
                    projectUrl.replace('https://', '').replace('.supabase.co', '')
                );
                
                // Try to get new format keys first, fallback to legacy
                const publishableKey = apiKeys.find(key => key.name === 'publishable')?.api_key;
                const secretKey = apiKeys.find(key => key.name === 'secret')?.api_key;
                
                apiKey = publishableKey || apiKeys.find(key => key.name === 'anon')?.api_key;
                privateApiKey = secretKey || apiKeys.find(key => key.name === 'service_role')?.api_key;
                connectionString = pgbouncer.connection_string;
            }
            
            this.updateEnvironmentConfig(env, {
                publicData: { projectUrl, apiKey },
                privateData: { apiKey: privateApiKey, connectionString }
            });
        },
        
        changeApiKey(apiKey, env) {
            this.updateEnvironmentConfig(env, {
                publicData: { apiKey }
            });
        },
        
        changePrivateApiKey(apiKey, env) {
            this.updateEnvironmentConfig(env, {
                privateData: { apiKey }
            });
        },
        
        updateEnvironmentConfig(env, updates) {
            const newSettings = {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    environments: {
                        ...this.settings.publicData?.environments,
                        [env]: {
                            ...this.getCurrentEnvConfig(env),
                            ...(updates.publicData || {})
                        }
                    }
                },
                privateData: {
                    ...this.settings.privateData,
                    environments: {
                        ...this.settings.privateData?.environments,
                        [env]: {
                            ...this.getCurrentEnvPrivateConfig(env),
                            ...(updates.privateData || {})
                        }
                    }
                }
            };
            
            // Keep legacy fields in sync for production (backward compatibility)
            if (env === 'production') {
                newSettings.publicData = {
                    ...newSettings.publicData,
                    projectUrl: newSettings.publicData.environments.production.projectUrl,
                    apiKey: newSettings.publicData.environments.production.apiKey,
                    customDomain: newSettings.publicData.environments.production.customDomain
                };
                newSettings.privateData = {
                    ...newSettings.privateData,
                    ...newSettings.privateData.environments.production
                };
            }
            
            this.$emit('update:settings', newSettings);
        },
        
        async refreshProjects() {
            this.isLoading = true;
            try {
                // Use access token from any connected environment
                const accessToken = this.environments
                    .map(env => this.getCurrentEnvPrivateConfig(env).accessToken)
                    .find(token => token);
                    
                if (!accessToken) return;
                    
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({
                    method: 'POST',
                    path: '/projects/list',
                    data: { accessToken },
                });
                this.projects = data?.data;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                throw error;
            }
        },
        
        async fetchProject(projectId) {
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({
                    method: 'GET',
                    path: '/projects/' + projectId,
                });
                this.isLoading = false;
                return data?.data;
            } catch (error) {
                this.isLoading = false;
                throw error;
            }
        },
    },
};
</script>

<style scoped>
.ww-tabs-header {
    display: flex;
    border-bottom: 2px solid var(--ww-color-border);
    gap: 0;
    width: 100%;
}

.ww-tab-item {
    position: relative;
    padding: var(--ww-spacing-02) var(--ww-spacing-04);
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--ww-color-content-secondary);
    font-weight: var(--text-medium);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ww-spacing-01);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    flex: 1;
    min-width: 0;
}

.ww-tab-item:hover {
    color: var(--ww-color-content-primary);
    background: var(--ww-color-bg-hover);
}

.ww-tab-item.ww-tab-active {
    color: var(--ww-color-content-brand);
    border-bottom-color: var(--ww-color-border-brand);
    background: transparent;
}

.ww-tab-label {
    font-size: var(--text-sm-font-size);
}

.ww-tab-optional {
    font-size: var(--text-xs-font-size);
    color: var(--ww-color-content-tertiary);
    background: var(--ww-color-bg-tertiary);
    padding: 2px 6px;
    border-radius: var(--ww-border-radius-01);
}

.ww-tab-active .ww-tab-optional {
    background: var(--ww-color-bg-brand-secondary);
    color: var(--ww-color-content-brand);
}

.environment-tabs-container {
    margin-bottom: var(--ww-spacing-05);
}
</style>