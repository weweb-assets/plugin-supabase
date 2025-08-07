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

        <!-- Clear Environment Button for optional environments -->
        <div v-if="env !== 'production' && isEnvironmentConfigured(env)" class="flex justify-end mb-2">
            <button 
                type="button" 
                class="ww-editor-button -tertiary -small -alert"
                @click="clearEnvironment(env)"
                title="Clear this environment's configuration"
            >
                <wwEditorIcon name="trash" small />
                <span class="ml-1">Clear configuration</span>
            </button>
        </div>

        <!-- Only show select/create options in OAuth mode -->
        <wwEditorFormRow class="w-100" v-if="isOAuthMode(env)">
            <wwEditorInputRadio
                v-model="selectModes[env]"
                :disabled="isComingUp"
                :choices="[
                    { label: 'Select a project', value: 'select' },
                    { label: 'Create a project', value: 'create' },
                ]"
            />
        </wwEditorFormRow>

        <!-- Custom mode message -->
        <div v-if="!isOAuthMode(env)" class="mb-3 p-2 bg-secondary rounded">
            <div class="body-sm content-secondary">
                <wwEditorIcon name="info-circle" small class="mr-1" />
                Manual configuration mode - Enter your Supabase project details below
            </div>
        </div>

        <!-- Select/Custom mode configuration -->
        <template v-if="selectModes[env] === 'select' || !isOAuthMode(env)">
            <!-- OAuth mode: Show project selector -->
            <div class="flex items-center" v-if="isOAuthMode(env)">
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
            
            <!-- OAuth mode: Toggle to show manual settings -->
            <button
                v-if="isOAuthMode(env)"
                @click="showSettings[env] = !showSettings[env]"
                class="ww-editor-button -secondary -small mb-2"
                type="button"
            >
                {{ showSettings[env] ? 'Close' : 'Open' }} settings
            </button>
            
            <!-- Show manual settings: Always visible in custom mode, toggleable in OAuth mode -->
            <template v-if="showSettings[env] || !isOAuthMode(env)">
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
        
        <!-- Create Project UI (only in OAuth mode) -->
        <template v-else-if="selectModes[env] === 'create' && isOAuthMode(env)">
            <div v-if="isComingUp" class="body-md flex items-center p-2">
                <wwLoaderSmall loading class="mr-2" />
                <div>We're now preparing your database. Please wait a few moments, it may take up to 1 minute.</div>
            </div>
            <template v-else>
                <wwEditorInputRow 
                    label="Project name" 
                    type="query" 
                    placeholder="My new project" 
                    required
                    v-model="newProjects[env].name" 
                />
                <wwEditorInputRow 
                    label="Organization" 
                    type="select" 
                    placeholder="Select an organization" 
                    required
                    v-model="newProjects[env].organizationId"
                    :options="organizations.map(org => ({ label: org.name, value: org.id }))" 
                />
                <wwEditorInputRow 
                    label="Hosting region" 
                    type="select" 
                    placeholder="us-east-1" 
                    required
                    v-model="newProjects[env].region" 
                    :options="[
                        { label: 'us-east-1', value: 'us-east-1' },
                        { label: 'us-west-1', value: 'us-west-1' },
                        { label: 'eu-west-1', value: 'eu-west-1' },
                        { label: 'eu-central-1', value: 'eu-central-1' },
                        { label: 'ap-southeast-1', value: 'ap-southeast-1' },
                        { label: 'ap-northeast-1', value: 'ap-northeast-1' },
                    ]" 
                />
                <wwEditorFormRow label="Database password" required>
                    <div class="flex items-center">
                        <wwEditorInputText 
                            :type="showDbPass ? 'text' : 'password'"
                            placeholder="Enter your database password"
                            :style="{ '-webkit-text-security': showDbPass ? 'none' : 'disc' }" 
                            large
                            v-model="newProjects[env].dbPass" 
                            class="w-full" 
                        />
                        <button 
                            type="button" 
                            class="ww-editor-button -secondary -small -icon ml-2"
                            @click="showDbPass = !showDbPass"
                        >
                            <wwEditorIcon :name="showDbPass ? '16/eye' : '16/eye-off'" medium />
                        </button>
                    </div>
                </wwEditorFormRow>
                <button 
                    class="ww-editor-button -primary" 
                    @click="createProject(env)" 
                    type="button"
                >
                    Create project for {{ capitalize(env) }}
                </button>
            </template>
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
            organizations: [],
            newProjects: {
                production: {
                    name: '',
                    region: 'us-east-1',
                    organizationId: '',
                    dbPass: '',
                },
                staging: {
                    name: '',
                    region: 'us-east-1',
                    organizationId: '',
                    dbPass: '',
                },
                editor: {
                    name: '',
                    region: 'us-east-1',
                    organizationId: '',
                    dbPass: '',
                }
            },
        };
    },
    watch: {
        selectModes: {
            async handler(newModes) {
                // Check if any environment switched to 'create' mode
                for (const env of this.environments) {
                    if (newModes[env] === 'create' && this.organizations.length === 0) {
                        await this.fetchOrganizations();
                        // Initialize new project data for this environment
                        this.newProjects[env] = {
                            name: `WeWeb - ${wwLib.$store.getters['websiteData/getDesignInfo'].name} (${this.capitalize(env)})`,
                            region: 'us-east-1',
                            organizationId: this.organizations[0]?.id || '',
                            dbPass: wwLib.wwUtils.getUid(),
                        };
                    }
                }
            },
            deep: true
        },
        'settings.privateData.connectionMode': {
            handler(newMode, oldMode) {
                console.log('[SettingsEditMultiEnv] Global connection mode changed:', {
                    oldMode,
                    newMode,
                    settings: this.settings
                });
                
                // When global connection mode changes, update all environments to match
                if (newMode && oldMode !== undefined && newMode !== oldMode) {
                    this.syncConnectionModeToAllEnvironments(newMode);
                }
            },
            immediate: true
        }
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
        
        // Check if any environment is connected and has a project URL
        const hasConnection = this.environments.some(env => this.isConnected(env));
        const hasConfiguredProject = this.environments.some(env => {
            const config = this.getCurrentEnvConfig(env);
            return config?.projectUrl;
        });
        
        if (hasConnection && hasConfiguredProject) {
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
            // OAuth connection is shared across all environments
            // Check if any environment has an access token
            const hasToken = this.environments.some(e => {
                const privateConfig = this.getCurrentEnvPrivateConfig(e);
                return privateConfig?.accessToken;
            });
            console.log(`[isConnected] Checking connection for ${env}: ${hasToken}`, {
                envConfigs: this.environments.map(e => ({
                    env: e,
                    accessToken: this.getCurrentEnvPrivateConfig(e)?.accessToken
                }))
            });
            return hasToken;
        },
        
        isOAuthMode(env) {
            // Check if we're in OAuth mode (not custom mode)
            // First check environment-specific config
            const envConfig = this.getCurrentEnvPrivateConfig(env);
            console.log(`[isOAuthMode] Checking mode for ${env}:`, {
                envConnectionMode: envConfig?.connectionMode,
                globalConnectionMode: this.settings.privateData?.connectionMode,
                hasAccessToken: this.isConnected(env),
                envConfig,
                globalPrivateData: this.settings.privateData
            });
            
            if (envConfig?.connectionMode) {
                const isOAuth = envConfig.connectionMode === 'oauth';
                console.log(`[isOAuthMode] Using env-specific mode for ${env}: ${envConfig.connectionMode} -> OAuth: ${isOAuth}`);
                return isOAuth;
            }
            
            // Fallback to global connection mode (for backward compatibility)
            const globalMode = this.settings.privateData?.connectionMode;
            if (globalMode) {
                const isOAuth = globalMode === 'oauth';
                console.log(`[isOAuthMode] Using global mode for ${env}: ${globalMode} -> OAuth: ${isOAuth}`);
                return isOAuth;
            }
            
            // Default to OAuth if connected with access token, custom otherwise
            const defaultOAuth = this.isConnected(env);
            console.log(`[isOAuthMode] Using default for ${env}: hasToken: ${defaultOAuth} -> OAuth: ${defaultOAuth}`);
            return defaultOAuth;
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
            const connectionMode = this.settings.privateData?.connectionMode || 'custom';
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
                            connectionMode: connectionMode,
                            accessToken: this.settings.privateData?.accessToken || '',
                            refreshToken: this.settings.privateData?.refreshToken || '',
                            apiKey: this.settings.privateData?.apiKey || '',
                            databasePassword: this.settings.privateData?.databasePassword || '',
                            connectionString: this.settings.privateData?.connectionString || ''
                        }
                    }
                }
            };
            // Keep global connection mode for ConnectionEdit component
            newSettings.privateData.connectionMode = connectionMode;
            this.$emit('update:settings', newSettings);
        },
        
        async changeProjectUrl(projectUrl, env) {
            // Skip if no project URL is provided
            if (!projectUrl) {
                this.updateEnvironmentConfig(env, {
                    publicData: { projectUrl: '', apiKey: '' },
                    privateData: { apiKey: '', connectionString: '' }
                });
                return;
            }
            
            let apiKey = this.getCurrentEnvConfig(env).apiKey;
            let privateApiKey = this.getCurrentEnvPrivateConfig(env).apiKey;
            let connectionString = this.getCurrentEnvPrivateConfig(env).connectionString;
            
            if (this.isConnected(env)) {
                const projectData = await this.fetchProject(
                    projectUrl.replace('https://', '').replace('.supabase.co', '')
                );
                
                if (projectData) {
                    // Get the JWT keys (anon and service_role)
                    apiKey = projectData.apiKeys?.find(key => key.name === 'anon')?.api_key || apiKey;
                    privateApiKey = projectData.apiKeys?.find(key => key.name === 'service_role')?.api_key || privateApiKey;
                    connectionString = projectData.pgbouncer?.connection_string || connectionString;
                }
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
            // Get current connection mode (inherit from global if not set for environment)
            const currentEnvPrivateConfig = this.getCurrentEnvPrivateConfig(env);
            const connectionMode = currentEnvPrivateConfig?.connectionMode || 
                                  this.settings.privateData?.connectionMode || 
                                  'custom';
            
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
                            connectionMode, // Always preserve the connection mode
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
        
        clearEnvironment(env) {
            // Only allow clearing optional environments
            if (env === 'production') {
                return;
            }
            
            // Confirm before clearing
            if (!confirm(`Are you sure you want to clear the ${env} environment configuration? This will remove all settings for this environment.`)) {
                return;
            }
            
            // Clear the environment configuration
            const newSettings = {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    environments: {
                        ...this.settings.publicData?.environments,
                        [env]: {
                            projectUrl: '',
                            apiKey: '',
                            customDomain: ''
                        }
                    }
                },
                privateData: {
                    ...this.settings.privateData,
                    environments: {
                        ...this.settings.privateData?.environments,
                        [env]: {
                            connectionMode: 'custom',
                            accessToken: '',
                            refreshToken: '',
                            apiKey: '',
                            databasePassword: '',
                            connectionString: ''
                        }
                    }
                }
            };
            
            // Reset the select mode and hide settings
            this.selectModes[env] = 'select';
            this.showSettings[env] = false;
            
            this.$emit('update:settings', newSettings);
        },
        
        syncConnectionModeToAllEnvironments(mode) {
            console.log('[syncConnectionModeToAllEnvironments] Syncing mode to all environments:', mode);
            
            const newSettings = {
                ...this.settings,
                privateData: {
                    ...this.settings.privateData,
                    environments: {
                        ...this.settings.privateData?.environments
                    }
                }
            };
            
            // Update connection mode for all configured environments
            this.environments.forEach(env => {
                if (newSettings.privateData.environments?.[env]) {
                    newSettings.privateData.environments[env] = {
                        ...newSettings.privateData.environments[env],
                        connectionMode: mode
                    };
                    
                    // Clear access tokens when switching to custom mode
                    if (mode === 'custom') {
                        newSettings.privateData.environments[env].accessToken = '';
                        newSettings.privateData.environments[env].refreshToken = '';
                    }
                }
            });
            
            // Also clear global tokens when switching to custom
            if (mode === 'custom') {
                newSettings.privateData.accessToken = '';
                newSettings.privateData.refreshToken = '';
            }
            
            this.$emit('update:settings', newSettings);
        },
        
        async refreshProjects() {
            // Use access token from any connected environment
            const accessToken = this.environments
                .map(env => this.getCurrentEnvPrivateConfig(env).accessToken)
                .find(token => token);
                
            if (!accessToken) {
                // No access token, skip refresh
                return;
            }
            
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({
                    method: 'POST',
                    path: '/projects/list',
                    data: { accessToken },
                });
                this.projects = data?.data || [];
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.warn('Failed to refresh projects:', error);
                // Don't throw, just log the error
            }
        },
        
        async fetchProject(projectId) {
            if (!projectId) {
                return null;
            }
            
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
                console.warn(`Failed to fetch project ${projectId}:`, error);
                // Return null instead of throwing
                return null;
            }
        },
        
        async fetchOrganizations() {
            this.isLoading = true;
            try {
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({
                    method: 'GET',
                    path: '/organizations',
                });
                this.organizations = data?.data || [];
                // Update default org for all new projects
                if (this.organizations.length > 0) {
                    for (const env of this.environments) {
                        if (!this.newProjects[env].organizationId) {
                            this.newProjects[env].organizationId = this.organizations[0].id;
                        }
                    }
                }
                this.isLoading = false;
                return this.organizations;
            } catch (error) {
                this.isLoading = false;
                throw error;
            }
        },
        
        async createProject(env) {
            this.isLoading = true;
            try {
                const newProject = this.newProjects[env];
                
                // Clear current config for this environment
                this.updateEnvironmentConfig(env, {
                    publicData: { projectUrl: '', apiKey: '' },
                    privateData: {
                        apiKey: '',
                        connectionString: '',
                        databasePassword: '',
                    }
                });
                
                const { data } = await wwLib.wwPlugins.supabase.requestAPI({
                    method: 'POST',
                    path: '/projects',
                    data: {
                        name: newProject.name,
                        organization_id: newProject.organizationId,
                        region: newProject.region,
                        db_pass: newProject.dbPass,
                    },
                });
                
                this.isLoading = false;
                this.isComingUp = true;
                const projectId = data?.data.id;
                const projectUrl = `https://${data?.data.id}.supabase.co`;

                // Poll for project to be ready
                let interval = setInterval(async () => {
                    await this.refreshProjects();
                    if (this.projects.find(project => project.id === data?.data.id)?.status === 'ACTIVE_HEALTHY') {
                        clearInterval(interval);

                        const projectData = await this.fetchProject(projectId);
                        if (projectData) {
                            const apiKey = projectData.apiKeys?.find(key => key.name === 'anon')?.api_key;
                            const privateApiKey = projectData.apiKeys?.find(key => key.name === 'service_role')?.api_key;
                            const connectionString = projectData.pgbouncer?.connection_string;
                            const databasePassword = newProject.dbPass;
                            
                            this.updateEnvironmentConfig(env, {
                                publicData: { projectUrl, apiKey },
                                privateData: {
                                    apiKey: privateApiKey,
                                    connectionString: connectionString,
                                    databasePassword,
                                }
                            });
                            
                            this.isComingUp = false;
                            this.selectModes[env] = 'select';
                        }
                    }
                }, 5000);
            } catch (error) {
                this.isLoading = false;
                this.isComingUp = false;
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