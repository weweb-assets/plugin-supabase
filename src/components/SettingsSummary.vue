<template>
    <div class="flex items-center caption-m text-ellipsis">
        <wwEditorIcon name="link" class="mr-2"></wwEditorIcon>
        {{ settings.publicData.projectUrl }}
    </div>
    <div class="flex items-center caption-m text-ellipsis">
        <wwEditorIcon name="key" class="mr-2"></wwEditorIcon>
        {{ settings.publicData.publicApiKey }}
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
};
</script>

<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
