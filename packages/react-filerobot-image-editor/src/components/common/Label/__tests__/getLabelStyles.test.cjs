const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');

const result = esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../getLabelStyles.js')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});
const loaded = { exports: {} };

new Function('module', 'exports', result.outputFiles[0].text)(loaded, loaded.exports);

const getLabelStyles = loaded.exports.default;
const palette = { error: '#f00', 'btn-disabled-text': '#999', 'txt-secondary': '#456' };

test('public label font overrides retain additional CSS properties and input', () => {
  const font = Object.freeze({
    fontFamily: 'Georgia', fontSize: 17, fontWeight: 500,
    letterSpacing: '3px', textTransform: 'uppercase', wordSpacing: 4,
    textDecoration: 'underline', fontVariant: 'small-caps',
  });
  const styles = getLabelStyles({ font, palette });

  for (const key of ['letterSpacing', 'textTransform', 'wordSpacing', 'textDecoration', 'fontVariant']) {
    assert.equal(styles[key], font[key]);
  }

  assert.equal(styles['--fie-label-font-size'], '17px');
  assert.equal(styles.fontSize, undefined, 'existing editor CSS must still override core typography');
  assert.equal(font.fontSize, 17);
});

test('label retains legacy disabled, font color and explicit style precedence', () => {
  assert.equal(getLabelStyles({ font: {}, palette, disabled: true })['--fie-label-color'], '#999');
  assert.equal(getLabelStyles({ font: { color: '#123' }, palette, disabled: true })['--fie-label-color'], '#123');
  assert.equal(getLabelStyles({ font: { color: '#123' }, palette, error: true })['--fie-label-color'], '#f00');

  const styles = getLabelStyles({ font: { letterSpacing: '3px' }, palette, style: { letterSpacing: '1px' } });

  assert.equal(styles.letterSpacing, '1px');
});
