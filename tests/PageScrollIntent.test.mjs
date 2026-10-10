import assert from 'node:assert/strict';
import test from 'node:test';
import { PageScrollIntent } from '../app/navigation/PageScrollIntent.ts';

test('reaching the bottom during the current gesture does not advance', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(false);
  assert.equal(intent.addDistance(120, false), false);
  assert.equal(intent.addDistance(120, true), false);
});

test('a new downward gesture at the bottom advances once', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
  assert.equal(intent.addDistance(40, true), true);
  assert.equal(intent.addDistance(120, true), false);
});

test('upward input cancels the pending advance', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
  assert.equal(intent.addDistance(-10, true), false);
  assert.equal(intent.addDistance(120, true), false);
});

test('leaving the bottom cancels the pending advance', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
  assert.equal(intent.addDistance(40, false), false);
  assert.equal(intent.addDistance(120, true), false);
});

test('a new page ignores residual input until a fresh gesture starts', () => {
  const intent = new PageScrollIntent();
  assert.equal(intent.addDistance(120, true), false);
  intent.startGesture(true);
  assert.equal(intent.addDistance(120, true), true);
});

test('starting another gesture resets accumulated distance', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
});

test('reaching the top during the current gesture does not go backward', () => {
  const intent = new PageScrollIntent('up');
  intent.startGesture(false);
  assert.equal(intent.addDistance(-120, false), false);
  assert.equal(intent.addDistance(-120, true), false);
});

test('a new upward gesture at the top goes backward once', () => {
  const intent = new PageScrollIntent('up');
  intent.startGesture(true);
  assert.equal(intent.addDistance(-40, true), false);
  assert.equal(intent.addDistance(-40, true), true);
  assert.equal(intent.addDistance(-120, true), false);
});

test('downward input cancels the pending backward navigation', () => {
  const intent = new PageScrollIntent('up');
  intent.startGesture(true);
  assert.equal(intent.addDistance(-40, true), false);
  assert.equal(intent.addDistance(10, true), false);
  assert.equal(intent.addDistance(-120, true), false);
});

test('leaving the top cancels the pending backward navigation', () => {
  const intent = new PageScrollIntent('up');
  intent.startGesture(true);
  assert.equal(intent.addDistance(-40, true), false);
  assert.equal(intent.addDistance(-40, false), false);
  assert.equal(intent.addDistance(-120, true), false);
});

test('a short page selects the matching gesture direction', () => {
  const down = new PageScrollIntent('down');
  const up = new PageScrollIntent('up');
  down.startGesture(true);
  up.startGesture(true);
  assert.equal(down.addDistance(-120, true), false);
  assert.equal(up.addDistance(-120, true), true);
});

test('a previous page ignores residual upward input until a fresh gesture', () => {
  const intent = new PageScrollIntent('up');
  assert.equal(intent.addDistance(-120, true), false);
  intent.startGesture(true);
  assert.equal(intent.addDistance(-120, true), true);
});

for (const direction of ['up', 'down']) {
  test(`zero vertical movement preserves the ${direction} gesture distance`, () => {
    const intent = new PageScrollIntent(direction);
    const delta = direction === 'down' ? 40 : -40;
    intent.startGesture(true);
    assert.equal(intent.addDistance(delta, true), false);
    assert.equal(intent.addDistance(0, true), false);
    assert.equal(intent.addDistance(delta, true), true);
    assert.equal(intent.addDistance(delta, true), false);
  });
}

test('zero movement outside the boundary still cancels the gesture', () => {
  const intent = new PageScrollIntent();
  intent.startGesture(true);
  assert.equal(intent.addDistance(40, true), false);
  assert.equal(intent.addDistance(0, false), false);
  assert.equal(intent.addDistance(40, true), false);
});
