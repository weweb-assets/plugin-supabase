<template>
    <div class="flex items-center caption-m">
        <wwEditorIcon name="link" class="mr-2"></wwEditorIcon>
        {{ settings.publicData.projectUrl }}
    </div>
    <div class="flex items-center caption-m">
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
