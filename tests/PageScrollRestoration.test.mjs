import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationHarness } from './helpers/navigationHarness.mjs';

const storageKey = 'portfolio-page-scroll-positions';

test('links start at the top and history restores each entry inside the frame', () => {
  const harness = createNavigationHarness('usePageScrollRestoration');
  harness.render();
  assert.equal(harness.page.scrollTop, 0);
  harness.page.scrollTop = 320;
  harness.dispatch('scroll');
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  assert.equal(harness.page.scrollTop, 0);
  harness.page.scrollTop = 180;
  harness.dispatch('scroll');
  harness.render({ pathname: '/profile', key: 'initial' }, 'POP');
  assert.equal(harness.page.scrollTop, 320);
  harness.render({ pathname: '/build', key: 'build' }, 'POP');
  assert.equal(harness.page.scrollTop, 180);
  assert.equal(harness.document.scrollingElement.scrollTop, 0);
  harness.dispose();
});

test('scroll destinations are preserved and anchor positioning remains with its hook', () => {
  const harness = createNavigationHarness('usePageScrollRestoration', { scrollLocationKey: 'initial' });
  harness.render();
  assert.equal(harness.page.scrollTop, 500);
  harness.scrollLocationKey.current = null;
  harness.page.scrollTop = 280;
  harness.render({ hash: '#altia', key: 'anchor' }, 'PUSH');
  assert.equal(harness.page.scrollTop, 280);
  assert.equal(harness.scrollCalls.length, 0);
  harness.dispose();
});

test('reload reads stored frame positions and pagehide saves the latest scroll', () => {
  const harness = createNavigationHarness('usePageScrollRestoration', {
    storage: { [storageKey]: JSON.stringify({ initial: 240 }) },
  });
  harness.render();
  assert.equal(harness.page.scrollTop, 240);
  harness.page.scrollTop = 350;
  harness.dispatch('scroll');
  harness.dispatch('pagehide');
  assert.equal(JSON.parse(harness.storage.get(storageKey)).initial, 350);
  harness.dispose();
});

test('restricted storage keeps in-memory history restoration functional', () => {
  const harness = createNavigationHarness('usePageScrollRestoration', {
    storageThrows: true, storage: { [storageKey]: 'invalid JSON' },
  });
  harness.render();
  harness.page.scrollTop = 220;
  harness.dispatch('scroll');
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  harness.render({ pathname: '/profile', key: 'initial' }, 'POP');
  assert.equal(harness.page.scrollTop, 220);
  harness.dispose();
});

test('leaving cancels a history restoration waiting for profile expansion', async () => {
  let finish;
  const finished = new Promise((resolve) => { finish = resolve; });
  const harness = createNavigationHarness('usePageScrollRestoration', {
    entryAnimation: { finished }, storage: { [storageKey]: JSON.stringify({ initial: 320 }) },
  });
  harness.render();
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  finish();
  await finished;
  assert.equal(harness.page.scrollTop, 0);
  harness.dispose();
});

test('scrolling during expansion prevents a late history restore from moving the visitor', async () => {
  let finish;
  const finished = new Promise((resolve) => { finish = resolve; });
  const harness = createNavigationHarness('usePageScrollRestoration', {
    entryAnimation: { finished }, storage: { [storageKey]: JSON.stringify({ initial: 320 }) },
  });
  harness.render();
  harness.page.scrollTop = 100;
  harness.dispatch('scroll');
  finish();
  await finished;
  assert.equal(harness.page.scrollTop, 100);
  harness.dispose();
});
