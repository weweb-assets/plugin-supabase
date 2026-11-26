import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/wwPlugin.js', import.meta.url), 'utf8');
const fetchStart = source.indexOf('    async fetchDoc() {');
const method = source.slice(fetchStart, source.indexOf('    /* wwEditor:end */', fetchStart));
const helperStart = source.indexOf('const getDoc = async');
const helper = source.slice(helperStart, source.indexOf('/* wwEditor:end */', helperStart));

for (const privateApiKey of ['sb_secret_fixture', 'legacy-jwt', null]) {
    test(`loads schema through the appropriate transport for ${privateApiKey || 'public-only'}`, async () => {
        const calls = [];
        const config = {
            privateApiKey,
            publicApiKey: 'sb_publishable_fixture',
            projectUrl: 'https://fixture.supabase.co',
        };
        const plugin = vm.runInNewContext(`${helper}\n({${method}})`, {
            getCurrentSupabaseSettings: () => config,
            resolveRuntimeProjectUrl: value => value.projectUrl,
            maskForLog: () => '[redacted]',
            console: { warn() {} },
            window: {},
            axios: {
                get: async (...args) => {
                    calls.push(['browser', ...args]);
                    return { data: { source: 'browser' } };
                },
            },
        });
        plugin.requestAPI = async request => {
            calls.push(['server', request]);
            return { data: { data: { source: 'server' } } };
        };
        await plugin.fetchDoc();
        if (!privateApiKey) {
            assert.equal(calls.length, 0);
            return;
        }
        if (privateApiKey.startsWith('sb_secret_')) {
            assert.equal(calls[0][0], 'server');
            assert.equal(calls[0][1].path, '/legacy/supabase/schema');
            assert.equal(JSON.stringify(calls).includes('sb_secret_'), false);
            assert.equal(plugin.doc.source, 'server');
            return;
        }
        assert.equal(calls[0][0], 'browser');
        assert.equal(calls[0][2].headers.Authorization, 'Bearer legacy-jwt');
        assert.equal(plugin.doc.source, 'browser');
    });
}

test('keeps the secret-key schema proxy inside the existing editor-only block', () => {
    const published = source.replace(/\/\* wwEditor:start \*\/[\s\S]*?\/\* wwEditor:end \*\//g, '');
    assert.equal(published.includes('/legacy/supabase/schema'), false);
    assert.equal(published.includes('async select('), true);
});
