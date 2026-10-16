import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createRenderer, h, nextTick, shallowRef } from 'vue';

// Mount the real action forms, including their lifecycle, computed properties and
// watchers. Rendering is unnecessary for checking the saved workflow arguments.
async function loadForm(name) {
    const url = new URL(`../src/components/Functions/Database/${name}.vue`, import.meta.url);
    const source = await readFile(url, 'utf8');
    let script = source
        .match(/<script>([\s\S]*?)<\/script>/)[1]
        .replace(/import (\w+) from '[^']+\.vue';/g, 'const $1 = {};');
    // The plugin's .js sources are ESM compiled by the WeWeb CLI. Data URLs
    // also load them as ESM on Node 18 without changing the package module type.
    for (const [statement, path] of script.matchAll(/from '(\.[^']+)';/g)) {
        const dependency = await readFile(new URL(path, url), 'utf8');
        script = script.replace(
            statement,
            `from 'data:text/javascript;base64,${Buffer.from(dependency).toString('base64')}';`
        );
    }
    const { default: component } = await import(
        `data:text/javascript;base64,${Buffer.from(script).toString('base64')}`
    );
    return { ...component, render: () => null };
}

const renderer = createRenderer({
    createComment: () => ({}),
    insert() {},
    remove() {},
    parentNode: () => null,
    nextSibling: () => null,
});
const definitions = {
    QA: {
        properties: {
            id: { type: 'integer', description: '<pk/>' },
            boolean: { type: 'boolean' },
            other: { type: 'boolean' },
        },
    },
};
async function mountForm(name, initialArgs = {}) {
    const component = await loadForm(name);
    const args = shallowRef(initialArgs);
    const form = shallowRef();
    const app = renderer.createApp({
        render: () =>
            h(component, {
                ref: form,
                plugin: { types: { integer: 'number', boolean: 'onoff' }, doc: { definitions } },
                args: args.value,
                'onUpdate:args': value => {
                    args.value = value;
                },
            }),
    });
    app.mount({});
    await nextTick();
    return { args, form, app };
}

for (const name of ['Insert', 'Update', 'Upsert']) {
    test(`${name}: selecting a table leaves booleans omitted`, async t => {
        const { args, form, app } = await mountForm(name);
        t.after(() => app.unmount());
        form.value.setTable('QA');
        await nextTick();
        assert.deepEqual(args.value.data, {});
    });
}

for (const name of ['Insert', 'Update', 'Upsert']) {
    test(`${name}: opening a saved action never writes missing visible values`, async t => {
        const binding = { __wwtype: 'f', code: 'variables.flag' };
        for (const value of [true, false, null, binding]) {
            const { args, app } = await mountForm(name, { table: 'QA', data: { boolean: value } });
            t.after(() => app.unmount());
            assert.deepEqual(args.value.data, { boolean: value });
        }
        const { args, form, app } = await mountForm(name, {
            table: 'QA',
            dataFields: ['id'],
            data: { id: 6 },
        });
        t.after(() => app.unmount());
        assert.deepEqual(args.value.data, { id: 6 });
        form.value.setDataFields(['boolean']);
        await nextTick();
        await nextTick();
        assert.deepEqual(args.value.data, {});
        form.value.setDataFields(['id']);
        await nextTick();
        await nextTick();
        assert.deepEqual(args.value.data, {});
    });

    test(`${name}: toggles, bindings and unrelated edits preserve false`, async t => {
        const { args, form, app } = await mountForm(name, { table: 'QA', data: {} });
        t.after(() => app.unmount());
        for (const value of [true, false, null, { __wwtype: 'f', code: 'false' }, undefined]) {
            form.value.setData({ ...args.value.data, boolean: value });
            await nextTick();
            assert.deepEqual(args.value.data, value === undefined ? {} : { boolean: value });
        }
    });
}

for (const name of ['Insert', 'Upsert']) {
    test(`${name}: bulk rows and bindings are untouched; single mode keeps missing fields omitted`, async t => {
        for (const data of [[], [{ boolean: true }], { __wwtype: 'f', code: 'variables.rows' }]) {
            const { args, form, app } = await mountForm(name, { table: 'QA', mode: 'multiple', data });
            t.after(() => app.unmount());
            assert.deepEqual(args.value.data, data);
            form.value.setArgs({ mode: 'single', dataFields: [], data: {} });
            await nextTick();
            assert.deepEqual(args.value.data, {});
        }
    });
}

for (const name of ['Update', 'Delete']) {
    test(`${name}: boolean primary keys remain omitted until explicitly chosen`, async t => {
        definitions.BooleanKey = {
            properties: { key: { type: 'boolean', description: '<pk/>' }, boolean: { type: 'boolean' } },
        };
        const { args, form, app } = await mountForm(name);
        t.after(() => app.unmount());
        form.value.setTable('BooleanKey');
        await nextTick();
        assert.deepEqual(args.value.primaryData, {});
        if (name === 'Update') assert.deepEqual(args.value.data, {});

        form.value.setArgs({ mode: 'multiple', primaryData: {}, data: {} });
        await nextTick();
        assert.deepEqual(args.value.primaryData, {});
        if (name === 'Update') assert.deepEqual(args.value.data, {});
    });
}

for (const name of ['Insert', 'Upsert', 'Update']) {
    test(name + ': clearing a boolean leaves it omitted and keeps partial writes partial', async t => {
        const { args, form, app } = await mountForm(name, { table: 'QA', data: { boolean: true } });
        t.after(() => app.unmount());
        form.value.setData({ boolean: undefined });
        await nextTick();
        assert.deepEqual(args.value.data, {});
        form.value.setData({ boolean: null });
        await nextTick();
        assert.deepEqual(args.value.data, { boolean: null });
    });
}

test('boolean field represents omitted, false, null and bindings without mount writes', async t => {
    const component = await loadForm('DatabaseField');
    for (const value of [undefined, false, true, null, { __wwtype: 'f', code: 'false' }]) {
        const ref = shallowRef();
        const emitted = [];
        const app = renderer.createApp({
            render: () =>
                h(component, {
                    ref,
                    property: { name: 'flag', type: 'onoff' },
                    modelValue: value,
                    'onUpdate:modelValue': v => emitted.push(v),
                }),
        });
        app.mount({});
        t.after(() => app.unmount());
        await nextTick();
        assert.deepEqual(emitted, []);
        if (value !== undefined) assert.deepEqual(ref.value.inputValue, value);
        ref.value.setValue(false);
        ref.value.setValue(null);
        ref.value.setValue(ref.value.booleanChoices[0].value);
        assert.deepEqual(emitted, [false, null, undefined]);
    }
});
