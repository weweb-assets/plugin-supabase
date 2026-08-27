<template>
    <wwEditorInputRow
        type="query"
        label="Channel"
        placeholder="Channel name"
        tooltip="Can be anything you define, it's the name of the channel you want to listen to"
        bindable
        small
        required
        :model-value="channel"
        @update:modelValue="setChannel"
    />

    <wwEditorInputRow
        type="select"
        label="Type"
        required
        tooltip="The type of events you want to receive in this channel"
        small
        :options="[
            { label: 'Database changes', value: 'postgres_changes' },
            { label: 'Broadcast', value: 'broadcast' },
        ]"
        :model-value="type"
        @update:modelValue="setType"
    />
    <wwEditorInputRow
        v-if="type === 'postgres_changes'"
        type="select"
        label="Event"
        tooltip="The type of updates you want to listen to"
        :options="[
            { label: 'All events', value: '*' },
            { label: 'INSERT', value: 'INSERT' },
            { label: 'UPDATE', value: 'UPDATE' },
            { label: 'DELETE', value: 'DELETE' },
        ]"
        bindable
        small
        :model-value="event"
        @update:modelValue="setEvent"
    />
    <wwEditorInputRow
        v-if="type === 'broadcast'"
        label="Event"
        type="query"
        placeholder="*"
        tooltip="The specific event name you want to listen to, default to all events"
        bindable
        small
        :model-value="event"
        @update:modelValue="setEvent"
    />
    <wwEditorInputRow
        v-if="type === 'postgres_changes'"
        type="query"
        label="Schema"
        placeholder="*"
        tooltip="The schema you want to listen to, default to all schema. By default only the public schema can be listened to, [learn more](https://supabase.com/docs/guides/realtime/postgres-changes#private-schemas)."
        bindable
        small
        :model-value="schema"
        @update:modelValue="setSchema"
    />
    <wwEditorInputRow
        v-if="type === 'postgres_changes'"
        label="Table"
        type="select"
        placeholder="All tables"
        bindable
        small
        tooltip="The table you want to listen to, default to all tables"
        :model-value="table"
        :options="tablesOptions"
        @update:modelValue="setTable"
    />
    <wwEditorInputRow
        v-if="type === 'postgres_changes' && table"
        type="query"
        label="Filter"
        tooltip="The filter you want to apply, [see supabase documentation](https://supabase.com/docs/guides/realtime/postgres-changes#available-filters)"
        bindable
        small
        :model-value="filter"
        @update:modelValue="setFilter"
    />
    <wwEditorInputRow
        v-if="type === 'broadcast'"
        type="onoff"
        label="Listen self"
        tooltip="Define if you want your own events to be received"
        bindable
        small
        :model-value="self"
        @update:modelValue="setSelf"
    />
    <wwEditorInputRow
        type="onoff"
        label="Listen presence"
        tooltip="Define if you want to receive presence events"
        bindable
        small
        :model-value="presence"
        @update:modelValue="setPresence"
    />
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    data() {
        return {
            isLoading: false,
            definitions: {},
        };
    },
    computed: {
        channel() {
            return this.args.channel || '';
        },
        type() {
            return this.args.type ?? 'postgres_changes';
        },
        event() {
            return this.args.event ?? '';
        },
        schema() {
            return this.args.schema ?? '';
        },
        table() {
            return this.args.table ?? null;
        },
        filter() {
            return this.args.filter ?? '';
        },
        self() {
            return this.args.self ?? false;
        },
        presence() {
            return this.args.presence ?? false;
        },
        tablesOptions() {
            return [
                { label: 'All tables', value: null },
                ...Object.keys(this.definitions).map(tableName => ({
                    label: tableName,
                    value: tableName,
                })),
            ];
        },
    },
    mounted() {
        this.fetchTables();
        if (!this.args.type) {
            this.setType('postgres_changes');
        }
    },
    methods: {
        setChannel(channel) {
            this.$emit('update:args', { ...this.args, channel });
        },
        setType(type) {
            this.$emit('update:args', {
                ...this.args,
                type,
                event: '*',
                schema: null,
                table: null,
                filter: null,
                self: false,
                presence: false,
            });
        },
        setEvent(event) {
            this.$emit('update:args', { ...this.args, event });
        },
        setSchema(schema) {
            this.$emit('update:args', { ...this.args, schema });
        },
        setTable(table) {
            this.$emit('update:args', { ...this.args, table });
        },
        setFilter(filter) {
            this.$emit('update:args', { ...this.args, filter });
        },
        setSelf(self) {
            this.$emit('update:args', { ...this.args, self });
        },
        setPresence(presence) {
            this.$emit('update:args', { ...this.args, presence });
        },
        async fetchTables() {
            try {
                this.isLoading = true;
                await this.plugin.fetchDoc();
                this.definitions = this.plugin.doc?.definitions || {};
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
