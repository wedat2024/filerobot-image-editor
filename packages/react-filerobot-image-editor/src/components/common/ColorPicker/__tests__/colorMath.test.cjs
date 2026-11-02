const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { test } = require('node:test');

const colorMath = readFile(path.join(__dirname, '..', 'colorMath.js'), 'utf8').then(
  (source) => import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`),
);

test('pointer samples retain colors observed in the frozen editor', async () => {
  const { positionHex } = await colorMath;

  assert.equal(positionHex(0, 151 / 302, 1 - 90 / 180), '#814141');
  assert.equal(positionHex(268, 151 / 302, 1 - 90 / 180), '#5f4181');
  assert.equal(positionHex(268, 229 / 302, 1 - 37 / 180), '#7831c9');
});

test('color inputs retain accepted formats and transparent callback value', async () => {
  const { initialHex, validHex, rgbText, colorPosition } = await colorMath;

  assert.equal(initialHex('rgb(18, 52, 86)'), '#123456');
  assert.equal(initialHex('rgba(0,0,0,0)'), '#00000000');
  assert.equal(initialHex('green'), '#000000');
  assert.equal(validHex('#123456'), true);
  assert.equal(validHex('#abc'), false);
  assert.equal(validHex('#zzzzzz'), false);
  assert.equal(rgbText('#00000000'), 'rgba(0,0,0,0)');
  assert.equal(rgbText('#123456'), 'rgb(18, 52, 86)');
  assert.deepEqual(colorPosition('#000000'), { hue: 0, saturation: 0, value: 0 });
});
