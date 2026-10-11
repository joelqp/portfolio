import assert from 'node:assert/strict';
import test from 'node:test';
import { ScrollPageTransition } from '../app/navigation/ScrollPageTransition.ts';

function createCoordinator({ animated = true, startThrows = false } = {}) {
  const events = [];
  const transitions = [];
  const actions = {
    navigate: (path) => events.push(['navigate', path]),
    position: (edge) => events.push(['position', edge]),
    prepare: (direction) => events.push(['prepare', direction]),
    release: () => events.push(['release']),
  };
  if (animated) {
    actions.start = (update) => {
      if (startThrows) throw new Error('Unavailable capture');
      let finish, fail;
      const finished = new Promise((resolve, reject) => { finish = resolve; fail = reject; });
      const handle = { finished, skipTransition: () => events.push(['skip']) };
      transitions.push({ update, handle, finish, fail });
      return handle;
    };
  }
  return { coordinator: new ScrollPageTransition(actions), events, transitions };
}

for (const [direction, edge] of [['forward', 'top'], ['backward', 'bottom']]) {
  test(`${direction} captures the destination only after its route and edge commit`, async () => {
    const { coordinator, transitions, events } = createCoordinator();
    assert.equal(coordinator.navigate('/profile', direction), true);
    assert.deepEqual(events, [['prepare', direction]]);
    const updated = transitions[0].update();
    assert.deepEqual(events.at(-1), ['navigate', '/profile']);
    let updateFinished = false;
    updated.then(() => { updateFinished = true; });
    await Promise.resolve();
    assert.equal(updateFinished, false);
    coordinator.commit('/profile');
    await updated;
    assert.deepEqual(events.at(-1), ['position', edge]);
    assert.equal(coordinator.busy, true);
    assert.equal(coordinator.navigate('/build', 'forward'), false);
    transitions[0].finish();
    await transitions[0].handle.finished;
    assert.equal(coordinator.busy, false);
    assert.deepEqual(events.at(-1), ['release']);
  });

  test(`${direction} falls back directly without preparing an animation`, () => {
    const { coordinator, events } = createCoordinator({ animated: false });
    coordinator.navigate('/profile', direction);
    assert.deepEqual(events, [['navigate', '/profile']]);
    coordinator.commit('/profile');
    assert.deepEqual(events, [['navigate', '/profile'], ['position', edge], ['release']]);
    assert.equal(coordinator.busy, false);
  });
}

test('a menu navigation cancels a pending route capture without restoring its scroll edge', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  const updated = transitions[0].update();
  coordinator.commit('/contact');
  await updated;
  assert.equal(coordinator.busy, false);
  assert.equal(events.some(([name]) => name === 'position'), false);
  assert.deepEqual(events.slice(-2), [['skip'], ['release']]);
});

test('cancellation before the browser update prevents a stale route navigation', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  coordinator.cancel();
  await transitions[0].update();
  assert.equal(events.some(([name]) => name === 'navigate'), false);
});

test('a menu click to the same pending destination cancels before the capture update', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  coordinator.commit('/profile');
  await transitions[0].update();
  assert.equal(events.some(([name]) => name === 'navigate'), false);
  assert.equal(events.some(([name]) => name === 'position'), false);
  assert.equal(coordinator.busy, false);
});

test('a new navigation on the committed destination interrupts the effect', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  const updated = transitions[0].update();
  coordinator.commit('/profile');
  await updated;
  coordinator.commit('/profile');
  assert.equal(coordinator.busy, false);
  assert.equal(events.filter(([name]) => name === 'position').length, 1);
});

test('an obsolete finished animation cannot release or unlock its replacement', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  coordinator.cancel();
  coordinator.navigate('/contact', 'forward');
  const releaseCount = events.filter(([name]) => name === 'release').length;
  transitions[0].finish();
  await transitions[0].handle.finished;
  assert.equal(coordinator.busy, true);
  assert.equal(events.filter(([name]) => name === 'release').length, releaseCount);
  coordinator.cancel();
});

test('capture rejection releases the effect and permits another gesture', async () => {
  const { coordinator, transitions, events } = createCoordinator();
  coordinator.navigate('/profile', 'forward');
  const updated = transitions[0].update();
  coordinator.commit('/profile');
  await updated;
  transitions[0].fail(new Error('Capture failed'));
  await transitions[0].handle.finished.catch(() => {});
  assert.equal(coordinator.busy, false);
  assert.deepEqual(events.at(-1), ['release']);
});

test('a synchronously unavailable API navigates once and keeps the edge destination', () => {
  const { coordinator, events } = createCoordinator({ startThrows: true });
  coordinator.navigate('/profile', 'backward');
  coordinator.commit('/profile');
  assert.equal(events.filter(([name]) => name === 'navigate').length, 1);
  assert.deepEqual(events.at(-2), ['position', 'bottom']);
  assert.equal(coordinator.busy, false);
});
