// The On/Off input displays Off for an undefined value without emitting a
// change. Persist that displayed value in the workflow's visible boolean fields.
export default {
    computed: {
        booleanDefaults() {
            const defaults = {};
            for (const [key, fields] of Object.entries(this.booleanFields)) {
                for (const field of fields) {
                    if (field.type !== 'onoff' || this.args[key]?.[field.name] !== undefined) continue;
                    defaults[key] = { ...this.args[key], ...defaults[key], [field.name]: false };
                }
            }
            return defaults;
        },
    },
    watch: {
        booleanDefaults(defaults) {
            if (!Object.keys(defaults).length) return;
            // Emit both groups together so primary-key defaults cannot overwrite
            // data defaults when the parent saves the action on the next tick.
            this.$emit('update:args', { ...this.args, ...defaults });
        },
    },
};
