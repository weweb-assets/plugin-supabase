<template>
    <div class="mb-1">Table: {{ config.table || '-' }}</div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
    },
};
</script>
