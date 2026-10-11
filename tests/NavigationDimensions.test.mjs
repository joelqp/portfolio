import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

test('navigation sizes are measured, updated and cleared when leaving profile', () => {
  let effect;
  const observers = [];
  const exports = {};
  const source = fs.readFileSync(new URL('../app/navigation/useNavigationDimensions.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      assert.equal(name, 'react');
      return { useLayoutEffect(callback) { effect = callback; } };
    },
    ResizeObserver: class {
      observed = [];
      disconnected = false;
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(element) { this.observed.push(element); }
      disconnect() { this.disconnected = true; }
    },
  });
  const properties = new Map();
  const layoutRef = { current: { style: { setProperty: (name, value) => properties.set(name, value) } } };
  let headerHeight = 100;
  let profileHeight = 120;
  const headerRef = { current: { getBoundingClientRect: () => ({ height: headerHeight }) } };
  const profileRef = { current: { getBoundingClientRect: () => ({ height: profileHeight }) } };

  exports.useNavigationDimensions(layoutRef, headerRef, profileRef, true);
  const cleanup = effect();
  assert.equal(properties.get('--header-height'), '100px');
  assert.equal(properties.get('--profile-navigation-height'), '120px');
  assert.equal(observers[0].observed.length, 2);

  headerHeight = 140;
  profileHeight = 160;
  observers[0].callback();
  assert.equal(properties.get('--header-height'), '140px');
  assert.equal(properties.get('--profile-navigation-height'), '160px');
  cleanup();
  assert.equal(observers[0].disconnected, true);

  profileRef.current = null;
  exports.useNavigationDimensions(layoutRef, headerRef, profileRef, false);
  const nextCleanup = effect();
  assert.equal(properties.get('--profile-navigation-height'), '0px');
  assert.equal(observers[1].observed.length, 1);
  nextCleanup();
  assert.equal(observers[1].disconnected, true);
});
