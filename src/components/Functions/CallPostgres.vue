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
    <Expandable :active="isAdvancedOpen" @toggle="isAdvancedOpen = !isAdvancedOpen">
        <template #header>
            <wwEditorIcon class="ww-dropdown__header-icon" name="chevron-right" small />
            <div class="ml-1 label-sm">Options</div>
        </template>
        <template #content>
            <div class="mt-3">
                <wwEditorInputRow
                    label="Get count"
                    type="select"
                    placeholder="None"
                    :model-value="countMode"
                    :options="[
                        { label: 'None', value: null },
                        { label: 'Exact', value: 'exact' },
                        { label: 'Planned', value: 'planned' },
                        { label: 'Estimated', value: 'estimated' },
                    ]"
                    @update:modelValue="setArgs({ countMode: $event })"
                />
                <div class="flex items-center mt-2" v-if="countMode">
                    <wwEditorInputSwitch :model-value="countOnly" @update:modelValue="setArgs({ countOnly: $event })" />
                    <div class="label-3 ml-2">Count only</div>
                </div>
            </div>
        </template>
    </Expandable>
    <wwLoader :loading="isLoading" />
</template>

<script>
import Expandable from '../Utils/Expandable.vue';

export default {
    components: { Expandable },
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
        countMode() {
            return this.args.countMode || null;
        },
        countOnly() {
            return this.args.countOnly || false;
        },
    },
    methods: {
        setArgs(arg) {
            this.$emit('update:args', { ...this.args, ...arg });
        },
    },
};
</script>
