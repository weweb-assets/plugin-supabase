<template>
    <div class="flex items-center body-2 mb-2" v-if="settings.publicData.realtimeTables">
        <wwEditorIcon name="data" class="mr-2" />
        <div class="text-ellipsis">{{ realtimeTables.join(',') || 'None' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    computed: {
        realtimeTables() {
            return Object.keys(this.settings.publicData.realtimeTables).filter(
                tableName => this.settings.publicData.realtimeTables[tableName]
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
