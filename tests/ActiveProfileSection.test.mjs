import assert from 'node:assert/strict';
import test from 'node:test';
import { getActiveProfileSection } from '../app/navigation/getActiveProfileSection.ts';
import { createNavigationHarness } from './helpers/navigationHarness.mjs';

const sectionTops = { caixa: 200, altia: 700, aia: 1200, education: 1700, technologies: 1900 };

function selectAtScroll(scrollTop, atBottom = false) {
  const positions = Object.entries(sectionTops).map(([id, top]) => ({ id, top: top - scrollTop }));
  return getActiveProfileSection(positions, 24, atBottom);
}

test('the introduction does not mark a section before its title reaches the reading edge', () => {
  assert.equal(selectAtScroll(0), null);
  assert.equal(selectAtScroll(174), null);
  assert.equal(selectAtScroll(176), 'caixa');
});

test('the marker changes at the next title and follows upward scrolling', () => {
  assert.equal(selectAtScroll(674), 'caixa');
  assert.equal(selectAtScroll(676), 'altia');
  assert.equal(selectAtScroll(1176), 'aia');
  assert.equal(selectAtScroll(676), 'altia');
  assert.equal(selectAtScroll(176), 'caixa');
});

test('the final short section is marked at the page bottom', () => {
  assert.equal(selectAtScroll(1600), 'aia');
  assert.equal(selectAtScroll(1600, true), 'technologies');
  assert.equal(getActiveProfileSection([], 24, true), null);
});

function createProfileHarness(options = {}) {
  return createNavigationHarness('useActiveProfileSection', {
    sectionTops,
    page: { scrollTop: 0, scrollHeight: 2300, clientHeight: 500 },
    ...options,
  });
}

function updateMarker(harness) {
  harness.flushFrames();
  harness.render();
  return harness.result;
}

test('scrolling updates the marker without navigation, scrolling or focus side effects', () => {
  const harness = createProfileHarness({ location: { hash: '#caixa' } });
  harness.render();
  updateMarker(harness);
  harness.page.scrollTop = 676;
  harness.dispatch('scroll');
  assert.equal(updateMarker(harness), 'altia');
  harness.page.scrollTop = 176;
  harness.dispatch('scroll');
  assert.equal(updateMarker(harness), 'caixa');
  assert.equal(harness.navigations.length, 0);
  assert.equal(harness.scrollCalls.length, 0);
  assert.equal(harness.focusCalls.length, 0);
  harness.dispose();
});

test('a clicked anchor is marked immediately and then the marker follows the destination position', () => {
  const harness = createProfileHarness();
  harness.render();
  updateMarker(harness);
  harness.render({ hash: '#altia', key: 'altia' }, 'PUSH');
  assert.equal(harness.result, 'altia');
  harness.page.scrollTop = 676;
  assert.equal(updateMarker(harness), 'altia');
  harness.dispose();
});

test('the marker reflects a restored history position rather than a stale URL anchor', () => {
  const harness = createProfileHarness();
  harness.render();
  updateMarker(harness);
  harness.page.scrollTop = 1176;
  harness.render({ hash: '#caixa', key: 'restored' }, 'POP');
  assert.equal(updateMarker(harness), 'aia');
  harness.dispose();
});

test('a clicked short section stays selected until the visitor scrolls to a different position', () => {
  const harness = createProfileHarness();
  harness.render();
  updateMarker(harness);
  harness.render({ hash: '#education', key: 'education' }, 'PUSH');
  harness.page.scrollTop = 1800;
  assert.equal(updateMarker(harness), 'education');
  harness.dispatch('scroll');
  assert.equal(updateMarker(harness), 'education');
  harness.page.scrollTop = 1600;
  harness.dispatch('scroll');
  assert.equal(updateMarker(harness), 'aia');
  harness.dispatch('resize');
  assert.equal(updateMarker(harness), 'aia');
  harness.dispose();
});

test('resize recalculates the reading position beneath a horizontal header', () => {
  const harness = createProfileHarness({ horizontalHeader: true });
  harness.render();
  assert.equal(updateMarker(harness), null);
  harness.page.scrollTop = 556;
  harness.dispatch('resize');
  assert.equal(updateMarker(harness), 'altia');
  harness.dispose();
});

test('leaving profile cancels pending measurements and scroll tracking', () => {
  const harness = createProfileHarness();
  harness.render();
  updateMarker(harness);
  harness.page.scrollTop = 676;
  harness.dispatch('scroll');
  harness.render({ pathname: '/build', key: 'build' }, 'PUSH');
  assert.equal(updateMarker(harness), null);
  harness.dispatch('scroll');
  assert.equal(updateMarker(harness), null);
  harness.dispose();
});
