<template>
    <wwEditorInputRow
        type="query"
        label="Channel"
        placeholder="Channel name"
        tooltip="Must be the name of a channel you already subscribed to."
        bindable
        small
        required
        :model-value="channel"
        @update:modelValue="setChannel"
    />
    <wwEditorInputRow
        type="query"
        label="Presence state"
        tooltip="The presence state you want to define. It can be anything (even an object), it will be shared with the channel members."
        required
        bindable
        small
        :model-value="state"
        @update:modelValue="setState"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        channel() {
            return this.args.channel || '';
        },
        state() {
            return this.args.state || '';
        },
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
        setState(state) {
            this.$emit('update:args', { ...this.args, state });
        },
    },
};
</script>
