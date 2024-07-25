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
        label="Event"
        tooltip="The event name you want to define"
        required
        bindable
        small
        :model-value="event"
        @update:modelValue="setEvent"
    />
    <wwEditorInputRow
        type="query"
        label="Payload"
        placeholder="Payload"
        bindable
        small
        :model-value="payload"
        @update:modelValue="setPayload"
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
        event() {
            return this.args.event || '';
        },
        payload() {
            return this.args.payload || '';
        },
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
        setEvent(event) {
            this.$emit('update:args', { ...this.args, event });
        },
        setPayload(payload) {
            this.$emit('update:args', { ...this.args, payload });
        },
    },
};
</script>
