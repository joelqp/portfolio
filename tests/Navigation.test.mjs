import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationHarness } from './helpers/navigationHarness.mjs';

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
