<template>
    <slot v-if="noTransition"></slot>
    <transition v-else name="expand" @beforeEnter="beforeEnter" @enter="enter" @leave="leave" @afterEnter="afterEnter">
        <slot></slot>
    </transition>
</template>

<script>
export default {
    props: {
        noTransition: { type: Boolean, default: false },
        minHeight: { type: Number, required: false },
    },
    methods: {
        beforeEnter(element) {
            element.style.overflowY = 'hidden';
        },
        enter(element) {
            const { width } = window.getComputedStyle(element);
            const inlineWidth = element.style.width;
            element.style.width = width;
            element.style.position = 'absolute';
            element.style.visibility = 'hidden';
            element.style.height = 'auto';

            const { height } = window.getComputedStyle(element);
            element.style.width = inlineWidth;
            element.style.position = '';
            element.style.visibility = '';
            element.style.height = this.minHeight || 0;

            // Force repaint
            window.getComputedStyle(element).height;

            setTimeout(() => {
                element.style.height = height;
            });
        },
        afterEnter(element) {
            element.style.height = 'auto';
            element.style.overflowY = 'unset';
        },
        leave(element) {
            const { height } = window.getComputedStyle(element);
            element.style.height = height;
            element.style.overflowY = 'hidden';
            // Force repaint
            window.getComputedStyle(element).height;
            setTimeout(() => {
                element.style.height = this.minHeight || 0;
            });
        },
    },
};
</script>

<style lang="scss">
.expand-enter-active,
.expand-leave-active {
    will-change: height;
    transition: height 0.15s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}
</style>
