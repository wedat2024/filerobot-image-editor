const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');
const snapshot = require('./legacy-theme.json');

function loadResolver() {
  const result = esbuild.buildSync({
    entryPoints: [path.resolve(__dirname, '../resolveTheme.js')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
  });
  const module = { exports: {} };

  new Function('module', 'exports', result.outputFiles[0].text)(module, module.exports);

  return module.exports.default;
}

function expectedTheme(changes) {
  const expected = JSON.parse(JSON.stringify(snapshot.defaults));

  for (const change of changes) {
    const parent = change.path.slice(0, -1).reduce((value, key) => value[key], expected);
    parent[change.path.at(-1)] = change.value;
  }

  return expected;
}

for (const { name, inputs, expectedChanges } of snapshot.cases) {
  test(name, () => {
    const resolve = loadResolver();

    inputs.forEach((value, index) => {
      const input = JSON.parse(JSON.stringify(value));

      assert.deepEqual(resolve(input), expectedTheme(expectedChanges[index]));
      assert.deepEqual(input, value);
    });
  });
}
