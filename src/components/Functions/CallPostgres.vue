<template>
    <wwEditorInputRow
        label="Function name"
        type="query"
        placeholder="hello_world"
        bindable
        required
        :model-value="functionName"
        @update:modelValue="setArgs({ functionName: $event })"
    />
    <wwEditorInputRow
        label="Arguments"
        type="array"
        :model-value="params"
        bindable
        @update:modelValue="setArgs({ params: $event })"
        @add-item="setArgs({ params: [...(params || []), {}] })"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Property key"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Property value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <Expandable class="mt-3" :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <QueryModifiers :model-value="modifiers" @update:modelValue="setArgs('modifiers', $event)" />
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';
import QueryModifiers from '../Utils/QueryModifiers.vue';

export default {
    components: { Expandable, QueryModifiers },
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => ({ fieldsMode: 'guided' }) },
    },
    emits: ['update:args'],
    data() {
        return {
            isAdvancedOpen: false,
            isLoading: false,
        };
    },
    computed: {
        functionName() {
            return this.args.functionName;
        },
        params() {
            return this.args.params || [];
        },
        modifiers() {
            return this.args.modifiers;
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
    },
};
</script>
