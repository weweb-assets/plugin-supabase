<template>
    <div class="ww-dropdown">
        <div
            class="ww-dropdown__header"
            :class="{ active: isActive }"
            data-hover-behavior="ignore"
            @click="isActive = !isActive"
        >
            <slot name="header" :active="isActive" />
        </div>
        <ExpandTransition v-if="!disabled" :no-transition="noTransition">
            <div v-show="isActive" v-if="!noDisplay || isActive" class="ww-dropdown__content">
                <slot name="content" :active="isActive"></slot>
            </div>
        </ExpandTransition>
    </div>
</template>

<script>
import ExpandTransition from './ExpandTransition.vue';

export default {
    components: { ExpandTransition },
    props: {
        active: { type: Boolean, default: undefined },
        noTransition: { type: Boolean, default: false },
        noDisplay: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        startOpened: { type: Boolean, default: false },
    },
    emits: ['toggle'],
    data() {
        return {
            internalActive: this.startOpened || this.active,
        };
    },
    computed: {
        isActive: {
            get() {
                if (this.active === undefined) return this.internalActive;
                return this.active;
            },
            set(value) {
                this.internalActive = value;
                this.$emit('toggle', value);
            },
        },
    },
    watch: {
        startOpened(value) {
            this.internalActive = value || this.active;
        },
    },
};
</script>

<style lang="scss">
.ww-dropdown {
    &__header {
        display: flex;
        align-items: center;
        cursor: pointer;
        &-icon {
            color: var(--ww-color-theme-dark-400);
            transition: transform 0.2s ease;
            will-change: transform, color;
        }
        &.active {
            .ww-dropdown__header-icon {
                color: var(--ww-color-theme-dark-700);
                transform: rotate(90deg);
            }
        }
    }
}
</style>
