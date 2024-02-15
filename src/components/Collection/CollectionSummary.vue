<template>
    <div class="supabase-collection-summary">
        <div class="label-sm content-primary">Table</div>
        <div class="body-sm content-secondary truncate">{{ config.table || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.supabase-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);
}
</style>
