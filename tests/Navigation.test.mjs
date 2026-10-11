import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationHarness } from './helpers/navigationHarness.mjs';

function createCapture() {
  let update, finish;
  const finished = new Promise((resolve) => { finish = resolve; });
  let skipped = false;
  return {
    startViewTransition(callback) {
      update = callback;
      return {
        finished,
        ready: Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
        skipTransition() { skipped = true; },
      };
    },
    update: () => update(),
    finish: async () => { finish(); await finished; },
    get skipped() { return skipped; },
  };
}

test('scroll captures the destination at its edge and delays index entry until finished', async () => {
  const capture = createCapture();
  const harness = createNavigationHarness('usePageScrollNavigation', {
    location: { pathname: '/' }, startViewTransition: capture.startViewTransition,
  });
  harness.render();
  harness.dispatch('keydown', { key: 'PageDown' });
  assert.equal(harness.document.documentElement.attributes.get('data-scroll-transition'), 'forward');
  assert.equal(harness.navigations.length, 0);
  const updated = capture.update();
  harness.render({ pathname: '/profile', key: 'profile' }, 'PUSH');
  await updated;
  assert.equal(harness.result.current, 'profile');
  assert.equal(harness.page.scrollTop, 0);
  assert.equal(harness.navigations[0].settings.state.scrollPageEntry, 'top');
  assert.equal(harness.document.documentElement.hasAttribute('data-scroll-transition'), true);
  const wheel = harness.dispatch('wheel', { deltaY: 120, timeStamp: 1000, deltaMode: 0 });
  assert.equal(wheel.defaultPrevented, true);
  assert.equal(harness.navigations.length, 1);
  await capture.finish();
  assert.equal(harness.document.documentElement.hasAttribute('data-scroll-transition'), false);
  harness.dispose();
});

test('history interrupts the snapshot without overriding its restored position', async () => {
  const capture = createCapture();
  const harness = createNavigationHarness('usePageScrollNavigation', { startViewTransition: capture.startViewTransition });
  harness.render();
  harness.dispatch('keydown', { key: 'PageDown' });
  const updated = capture.update();
  harness.page.scrollTop = 250;
  harness.render({ pathname: '/', key: 'history' }, 'POP');
  await updated;
  assert.equal(harness.result.current, null);
  assert.equal(capture.skipped, true);
  assert.equal(harness.page.scrollTop, 250);
  assert.equal(harness.scrollCalls.length, 0);
  assert.equal(harness.document.documentElement.hasAttribute('data-scroll-transition'), false);
  harness.dispose();
});

test('backward scroll captures the final edge and carries the stable mobile reservation', async () => {
  const capture = createCapture();
  const harness = createNavigationHarness('usePageScrollNavigation', {
    location: { pathname: '/build' }, page: { scrollTop: 0 },
    startViewTransition: capture.startViewTransition,
  });
  harness.render();
  harness.dispatch('keydown', { key: 'PageUp' });
  assert.equal(harness.document.documentElement.attributes.get('data-scroll-transition'), 'backward');
  const updated = capture.update();
  harness.render({ pathname: '/profile', key: 'profile' }, 'PUSH');
  await updated;
  assert.equal(harness.page.scrollTop, 500);
  assert.equal(harness.navigations[0].settings.state.scrollPageEntry, 'bottom');
  await capture.finish();
  harness.dispose();
});

test('reduced motion bypasses an available snapshot API', () => {
  const harness = createNavigationHarness('usePageScrollNavigation', {
    reducedMotion: true,
    startViewTransition() { throw new Error('Reduced motion must bypass capture'); },
  });
  harness.render();
  harness.dispatch('keydown', { key: 'PageDown' });
  assert.equal(harness.navigations.length, 1);
  assert.equal(harness.document.documentElement.hasAttribute('data-scroll-transition'), false);
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  assert.equal(harness.page.scrollTop, 0);
  assert.equal(harness.result.current, 'build');
  harness.dispose();
});

test('scroll arrival does not programmatically focus main, and a later menu click still does', () => {
  const harness = createNavigationHarness('SiteLayout', { scrollLocationKey: 'build-scroll' });
  harness.render();
  harness.render({ pathname: '/build', key: 'build-scroll', state: { scrollPageEntry: 'top' } }, 'PUSH');
  assert.equal(harness.focusCalls.length, 0);
  harness.render({ key: 'build-menu' }, 'PUSH');
  assert.equal(harness.focusCalls.length, 1);
  assert.equal(harness.focusCalls[0].element, harness.main);
  harness.dispose();
});

test('history with saved scroll entry metadata retains normal route focus', () => {
  const harness = createNavigationHarness('SiteLayout');
  harness.render();
  harness.render({ pathname: '/build', key: 'history', state: { scrollPageEntry: 'top' } }, 'POP');
  assert.equal(harness.focusCalls.length, 1);
  assert.equal(harness.focusCalls[0].element, harness.main);
  harness.dispose();
});

test('a same-page menu click after a completed scroll clears the transient source marker', async () => {
  const capture = createCapture();
  const harness = createNavigationHarness('usePageScrollNavigation', { startViewTransition: capture.startViewTransition });
  harness.render();
  harness.dispatch('keydown', { key: 'PageDown' });
  const updated = capture.update();
  harness.render({ pathname: '/build', key: 'scroll-build' }, 'PUSH');
  await updated;
  await capture.finish();
  assert.equal(harness.result.current, 'scroll-build');
  harness.render({ key: 'build-menu', state: { scrollPageEntry: 'top' } }, 'PUSH');
  assert.equal(harness.result.current, null);
  harness.dispose();
});

test('selecting the current page again moves focus from navigation to main', () => {
  const harness = createNavigationHarness('SiteLayout');
  harness.render();
  assert.equal(harness.focusCalls.length, 0);
  harness.render({ key: 'profile-again' }, 'PUSH');
  assert.equal(harness.focusCalls.length, 1);
  assert.equal(harness.focusCalls[0].element, harness.main);
  assert.equal(harness.focusCalls[0].settings.preventScroll, true);
  harness.dispose();
});

test('changing the page moves focus to main without changing scroll position', () => {
  const harness = createNavigationHarness('SiteLayout');
  harness.render();
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  assert.equal(harness.focusCalls[0].element, harness.main);
  assert.equal(harness.focusCalls[0].settings.preventScroll, true);
  assert.equal(harness.page.scrollTop, 500);
  harness.dispose();
});

test('section navigation does not have its heading focus overwritten by the layout', () => {
  const harness = createNavigationHarness('SiteLayout');
  harness.render();
  harness.render({ hash: '#caixa', key: 'caixa' }, 'PUSH');
  assert.equal(harness.focusCalls.length, 0);
  harness.render({ hash: '', key: 'profile-again' }, 'PUSH');
  assert.equal(harness.focusCalls[0].element, harness.main);
  harness.dispose();
});

for (const key of ['PageDown', 'ArrowDown', ' ']) {
  test(`${JSON.stringify(key)} cancels native scrolling when advancing`, () => {
    const harness = createNavigationHarness('usePageScrollNavigation');
    harness.render();
    const event = harness.dispatch('keydown', { key });
    assert.equal(event.defaultPrevented, true);
    assert.equal(harness.navigations[0].pathname, '/build');
    assert.equal(harness.navigations[0].settings.preventScrollReset, true);
    harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
    assert.equal(harness.page.scrollTop, 0);
    harness.dispose();
  });
}

for (const settings of [{ key: 'PageUp' }, { key: 'ArrowUp' }, { key: ' ', shiftKey: true }]) {
  test(`${JSON.stringify(settings)} cancels native scrolling when going backward`, () => {
    const harness = createNavigationHarness('usePageScrollNavigation', { page: { scrollTop: 0 } });
    harness.render();
    const event = harness.dispatch('keydown', settings);
    assert.equal(event.defaultPrevented, true);
    assert.equal(harness.navigations[0].pathname, '/');
    assert.equal(harness.navigations[0].settings.preventScrollReset, true);
    harness.render({ pathname: '/', key: 'home' }, 'PUSH');
    assert.equal(harness.page.scrollTop, 500);
    harness.dispose();
  });
}

for (const options of [
  { page: { scrollTop: 250 } },
  { location: { pathname: '/contact' } },
]) {
  test(`native scrolling remains available without a destination: ${JSON.stringify(options)}`, () => {
    const harness = createNavigationHarness('usePageScrollNavigation', options);
    harness.render();
    const event = harness.dispatch('keydown', { key: 'PageDown' });
    assert.equal(event.defaultPrevented, false);
    assert.equal(harness.navigations.length, 0);
    harness.dispose();
  });
}

test('editable targets are excluded from keyboard, wheel and touch navigation', () => {
  const harness = createNavigationHarness('usePageScrollNavigation');
  harness.body.isContentEditable = true;
  harness.render();
  const event = harness.dispatch('keydown', { key: 'PageDown' });
  harness.dispatch('wheel', { timeStamp: 1000, deltaY: 120, deltaMode: 0 });
  harness.dispatch('touchstart', { touches: [{ clientY: 200 }] });
  harness.dispatch('touchmove', { touches: [{ clientY: 80 }] });
  assert.equal(event.defaultPrevented, false);
  assert.equal(harness.navigations.length, 0);
  harness.dispose();
});

test('non-editable descendants can navigate normally', () => {
  const harness = createNavigationHarness('usePageScrollNavigation');
  const parent = harness.createTarget({ isContentEditable: true });
  const target = harness.createTarget({ parentElement: parent, isContentEditable: false });
  harness.render();
  harness.dispatch('keydown', { key: 'PageDown', target });
  assert.equal(harness.navigations.length, 1);
  harness.dispose();
});

for (const properties of [
  { control: true },
  { overflowY: 'auto', scrollHeight: 200 },
]) {
  test(`existing control and internal scroll exclusions are preserved: ${JSON.stringify(properties)}`, () => {
    const harness = createNavigationHarness('usePageScrollNavigation');
    harness.render();
    const target = harness.createTarget(properties);
    const event = harness.dispatch('keydown', { key: 'PageDown', target });
    assert.equal(event.defaultPrevented, false);
    assert.equal(harness.navigations.length, 0);
    harness.dispose();
  });
}

test('horizontal wheel input does not cancel accumulated vertical distance', () => {
  const harness = createNavigationHarness('usePageScrollNavigation');
  harness.render();
  for (const [timeStamp, deltaY] of [[1000, 40], [1050, 0], [1100, 40]]) {
    harness.dispatch('wheel', { timeStamp, deltaY, deltaMode: 0 });
  }
  assert.equal(harness.navigations.length, 1);
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  harness.dispatch('wheel', { timeStamp: 1150, deltaY: 120, deltaMode: 0 });
  assert.equal(harness.navigations.length, 1);
  harness.dispose();
});

test('the scroll gesture hook leaves ordinary route changes to router restoration', () => {
  const harness = createNavigationHarness('usePageScrollNavigation');
  harness.render();
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  harness.render({ pathname: '/profile', key: 'initial' }, 'POP');
  assert.equal(harness.scrollCalls.length, 0);
  harness.dispose();
});

test('an unknown profile anchor returns to the top and focuses the main content', () => {
  const harness = createNavigationHarness('useProfileSectionNavigation', { location: { hash: '#unknown' } });
  harness.render();
  harness.flushFrames();
  assert.equal(harness.page.scrollTop, 0);
  assert.equal(harness.focusCalls[0].element, harness.main);
  assert.equal(harness.focusCalls[0].settings.preventScroll, true);
  harness.dispose();
});

test('a mobile profile anchor accounts for header height and focuses its heading', () => {
  const harness = createNavigationHarness('useProfileSectionNavigation', {
    location: { hash: '#caixa' }, horizontalHeader: true,
    page: { scrollHeight: 2000 },
  });
  harness.render();
  harness.flushFrames();
  assert.equal(harness.page.scrollTop, 556);
  assert.equal(harness.focusCalls[0].element, harness.heading);
  harness.dispose();
});

test('a desktop profile anchor also clears the shared top navigation', () => {
  const harness = createNavigationHarness('useProfileSectionNavigation', {
    location: { hash: '#caixa' }, headerHeight: 120,
    page: { scrollHeight: 2000 },
  });
  harness.render();
  harness.flushFrames();
  assert.equal(harness.page.scrollTop, 556);
  assert.equal(harness.focusCalls[0].element, harness.heading);
  harness.dispose();
});

for (const hash of ['#caixa', '#unknown']) {
  test(`history restoration is not overwritten by ${hash}, including the initial entry`, () => {
    const harness = createNavigationHarness('useProfileSectionNavigation', { location: { hash } });
    harness.render();
    harness.flushFrames();
    harness.render({ pathname: '/build', hash: '', key: 'build' }, 'PUSH');
    harness.page.scrollTop = 320;
    const scrollCount = harness.scrollCalls.length;
    harness.render({ pathname: '/profile', hash, key: 'initial' }, 'POP');
    harness.flushFrames();
    assert.equal(harness.page.scrollTop, 320);
    assert.equal(harness.scrollCalls.length, scrollCount);
    harness.dispose();
  });
}

test('a new anchor navigation cancels a stale pending jump', () => {
  const harness = createNavigationHarness('useProfileSectionNavigation', { location: { hash: '#caixa' } });
  harness.render();
  harness.render({ hash: '#unknown', key: 'unknown' }, 'PUSH');
  harness.flushFrames();
  assert.equal(harness.scrollCalls.length, 1);
  assert.equal(harness.page.scrollTop, 0);
  harness.dispose();
});

test('an anchor waits for panel expansion before measuring its final position', async () => {
  let finishEntry;
  const finished = new Promise((resolve) => { finishEntry = resolve; });
  const harness = createNavigationHarness('useProfileSectionNavigation', {
    location: { hash: '#caixa' }, headerHeight: 120,
    page: { scrollHeight: 2000 }, entryAnimation: { finished },
  });
  harness.render();
  harness.flushFrames();
  assert.equal(harness.scrollCalls.length, 0);
  harness.section.getBoundingClientRect = () => ({ top: 900 - harness.page.scrollTop });
  finishEntry();
  await finished;
  assert.equal(harness.page.scrollTop, 756);
  assert.equal(harness.focusCalls[0].element, harness.heading);
  harness.dispose();
});

test('leaving profile cancels an anchor waiting for panel expansion', async () => {
  let finishEntry;
  const finished = new Promise((resolve) => { finishEntry = resolve; });
  const harness = createNavigationHarness('useProfileSectionNavigation', {
    location: { hash: '#caixa' }, entryAnimation: { finished },
  });
  harness.render();
  harness.flushFrames();
  harness.render({ pathname: '/build', hash: '', key: 'build' }, 'PUSH');
  finishEntry();
  await finished;
  assert.equal(harness.scrollCalls.length, 0);
  assert.equal(harness.focusCalls.length, 0);
  harness.dispose();
});
