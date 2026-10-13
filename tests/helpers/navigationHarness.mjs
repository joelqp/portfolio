import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { PageScrollIntent } from '../../app/navigation/PageScrollIntent.ts';
import { navigationItems } from '../../app/navigation.ts';
import * as jsxRuntime from 'react/jsx-runtime';
import { getActiveProfileSection } from '../../app/navigation/getActiveProfileSection.ts';
import * as placeholderContent from '../../app/content/placeholderContent.ts';
import { ScrollPageTransition } from '../../app/navigation/ScrollPageTransition.ts';

const sectionModule = {};
const sectionSource = fs.readFileSync(new URL('../../app/navigation/profileSections.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(sectionSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, {
  exports: sectionModule,
  require(name) {
    if (name !== '../content/placeholderContent') throw new Error(`Unexpected dependency: ${name}`);
    return placeholderContent;
  },
});
const { profileSectionItems } = sectionModule;

export function createNavigationHarness(moduleName, options = {}) {
  let location = { pathname: '/profile', hash: '', key: 'initial', ...options.location };
  let navigationType = options.navigationType ?? 'POP';
  const listeners = new Map();
  const frames = new Map();
  const refs = [];
  const states = [];
  const callbackSlots = [];
  const effectSlots = [];
  let refIndex = 0;
  let stateIndex = 0;
  let callbackIndex = 0;
  let result;
  let effectIndex = 0;
  let nextFrame = 0;
  const pendingEffects = [];
  const navigations = [];
  const scrollCalls = [];
  const focusCalls = [];
  const scrollLocationKey = { current: options.scrollLocationKey ?? null };
  const storage = new Map(Object.entries(options.storage ?? {}));

  class Element {
    listeners = new Map();
    parentElement = null;
    scrollHeight = 100;
    clientHeight = 100;
    isContentEditable = false;
    overflowY = 'visible';
    control = false;

    closest() { return this.control ? this : null; }
    contains(target) {
      for (let element = target; element; element = element.parentElement) {
        if (element === this) return true;
      }
      return false;
    }
    focus(settings) { focusCalls.push({ element: this, settings }); }
    addEventListener(name, callback) {
      const entries = this.listeners.get(name) ?? [];
      entries.push(callback);
      this.listeners.set(name, entries);
    }
    removeEventListener(name, callback) {
      this.listeners.set(name, (this.listeners.get(name) ?? []).filter((entry) => entry !== callback));
    }
  }

  const body = new Element();
  const main = new Element();
  const heading = new Element();
  const page = Object.assign(new Element(), {
    scrollTop: 500, scrollHeight: 1000, clientHeight: 500, overflowY: 'auto', ...options.page,
    scrollTo(settings) {
      scrollCalls.push(settings);
      page.scrollTop = Math.min(Math.max(0, settings.top), page.scrollHeight - page.clientHeight);
    },
    getBoundingClientRect() {
      const top = options.frameTop ?? options.headerTop ?? 0;
      const bottom = options.frameBottom ?? 500 - top;
      const left = options.frameLeft ?? options.headerLeft ?? 0;
      const right = options.frameRight ?? options.headerRight ?? options.viewportWidth ?? 1440;
      return { top, bottom, left, right, width: right - left, height: bottom - top };
    },
  });
  main.parentElement = page;
  page.parentElement = body;
  const documentPage = { scrollTop: 0, scrollHeight: 500, clientHeight: 500, ...options.documentPage };
  const section = new Element();
  section.closest = (selector) => selector === 'main' ? main : null;
  section.querySelector = () => heading;
  section.getBoundingClientRect = () => ({ top: 700 - page.scrollTop });
  heading.getBoundingClientRect = section.getBoundingClientRect;
  const profileElements = new Map();
  for (const [id, top] of Object.entries(options.sectionTops ?? {})) {
    const element = new Element();
    element.closest = (selector) => selector === 'main' ? main : null;
    element.getBoundingClientRect = () => ({ top: top - page.scrollTop });
    element.querySelector = () => element;
    profileElements.set(id, element);
  }
  const headerRef = {
    current: { getBoundingClientRect: () => ({
      height: options.headerHeight ?? (options.horizontalHeader ? 120 : 0),
      top: options.headerTop ?? 0,
      bottom: (options.headerTop ?? 0) + (options.headerHeight ?? (options.horizontalHeader ? 120 : 0)),
      left: options.headerLeft ?? 0,
      right: options.headerRight ?? options.viewportWidth ?? 1440,
    }) },
  };
  const document = {
    body,
    scrollingElement: documentPage,
    getElementById: (id) => options.sectionTops
      ? profileElements.get(id) ?? null
      : id === 'caixa' ? section : null,
    querySelector: (selector) => selector === 'main' ? main : selector === 'header' ? headerRef.current
      : selector === '[data-page-scroll]' ? page : null,
    startViewTransition: options.startViewTransition,
    documentElement: Object.assign(new Element(), {
      attributes: new Map(),
      style: {
        properties: new Map(),
        setProperty(name, value) { this.properties.set(name, value); },
        removeProperty(name) { this.properties.delete(name); },
      },
      setAttribute(name, value) { this.attributes.set(name, value); },
      removeAttribute(name) { this.attributes.delete(name); },
      hasAttribute(name) { return this.attributes.has(name); },
    }),
  };
  const window = {
    sessionStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) {
        if (options.storageThrows) throw new Error('Storage unavailable');
        storage.set(key, value);
      },
    },
    innerWidth: options.viewportWidth ?? 1440,
    innerHeight: 500,
    get scrollY() { return documentPage.scrollTop; },
    getComputedStyle: (element) => ({ overflowY: element.overflowY, scrollMarginTop: '24px' }),
    matchMedia: (query) => ({ matches: query.includes('prefers-reduced-motion')
      ? options.reducedMotion ?? false
      : options.horizontalHeader ?? false }),
    addEventListener: (name, callback, settings) => {
      const entries = listeners.get(name) ?? [];
      const entry = { callback, capture: settings?.capture ?? false };
      if (entry.capture) entries.unshift(entry);
      else entries.push(entry);
      listeners.set(name, entries);
    },
    removeEventListener: (name, callback) => {
      listeners.set(name, (listeners.get(name) ?? []).filter((entry) => entry.callback !== callback));
    },
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
    scrollTo(settings) {
      scrollCalls.push(settings);
      page.scrollTop = Math.min(Math.max(0, settings.top), page.scrollHeight - page.clientHeight);
    },
  };

  function registerEffect(callback, dependencies) {
    const slotIndex = effectIndex++;
    const previous = effectSlots[slotIndex];
    if (previous && dependencies.every((value, index) => Object.is(value, previous.dependencies[index]))) {
      return;
    }
    pendingEffects.push(() => {
      previous?.cleanup?.();
      effectSlots[slotIndex] = { dependencies, cleanup: callback() };
    });
  }

  const navigate = (pathname, settings) => navigations.push({ pathname, settings });
  const dependencies = {
    react: {
      useCallback(callback, dependencies) {
        const index = callbackIndex++;
        const previous = callbackSlots[index];
        if (previous && dependencies.every((value, position) => Object.is(value, previous.dependencies[position]))) {
          return previous.callback;
        }
        callbackSlots[index] = { callback, dependencies };
        return callback;
      },
      useRef(value) {
        const index = refIndex++;
        return refs[index] ?? (refs[index] = { current: value });
      },
      useState(initialValue) {
        const index = stateIndex++;
        if (!(index in states)) states[index] = initialValue;
        return [states[index], (update) => {
          states[index] = typeof update === 'function' ? update(states[index]) : update;
        }];
      },
      useEffect: registerEffect,
      useLayoutEffect: registerEffect,
    },
    'react-router': {
      useLocation: () => location,
      useNavigate: () => navigate,
      useNavigationType: () => navigationType,
    },
    '../navigation': { navigationItems },
    './PageScrollIntent': { PageScrollIntent },
    './ScrollPageTransition': { ScrollPageTransition },
    './getActiveProfileSection': { getActiveProfileSection },
    './profileSections': { profileSectionItems },
    './getProfileEntryAnimation': {
      getProfileEntryAnimation: () => options.entryAnimation ?? null,
    },
    'react/jsx-runtime': jsxRuntime,
    '../Header/Header': { Header: () => null },
    '../ProfileSubnavigation/ProfileSubnavigation': { ProfileSubnavigation: () => null },
    '../../navigation/usePageScrollNavigation': {
      usePageScrollNavigation: () => ({ current: options.scrollLocationKey ?? null }),
    },
    '../../navigation/useNavigationDimensions': { useNavigationDimensions: () => {} },
    '../../navigation/useProfileSectionNavigation': { useProfileSectionNavigation: () => {} },
    '../../navigation/usePageScrollRestoration': { usePageScrollRestoration: () => {} },
    './SiteLayout.module.css': { default: {} },
    '../../styles/pageTransition.module.css': { default: {} },
  };
  const scrollModule = {};
  const scrollSource = fs.readFileSync(new URL('../../app/navigation/pageScroll.ts', import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(scrollSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports: scrollModule, document });
  dependencies['./pageScroll'] = scrollModule;
  const modulePath = moduleName === 'SiteLayout'
    ? '../../app/components/SiteLayout/SiteLayout.tsx'
    : `../../app/navigation/${moduleName}.ts`;
  const source = fs.readFileSync(new URL(modulePath, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === './useScrollPageTransition') {
        const nested = {};
        const source = fs.readFileSync(new URL('../../app/navigation/useScrollPageTransition.ts', import.meta.url), 'utf8');
        vm.runInNewContext(ts.transpileModule(source, {
          compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText, { exports: nested, require: (dependency) => dependencies[dependency], window, document });
        return nested;
      }
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    window,
    document,
    HTMLElement: Element,
  });

  return {
    body, main, heading, section, page, navigations, scrollCalls, focusCalls, document, scrollLocationKey, storage,
    get result() { return result; },
    createTarget(properties) { return Object.assign(new Element(), properties); },
    render(nextLocation = location, nextNavigationType = navigationType) {
      location = { ...location, ...nextLocation };
      navigationType = nextNavigationType;
      refIndex = 0;
      stateIndex = 0;
      callbackIndex = 0;
      effectIndex = 0;
      if (moduleName === 'SiteLayout') {
        const layout = exports.SiteLayout({ children: null });
        layout.props.children.props.children[1].props.ref.current = main;
      } else if (moduleName === 'usePageScrollRestoration') {
        result = exports[moduleName](scrollLocationKey);
      } else {
        result = exports[moduleName](headerRef);
      }
      pendingEffects.splice(0).forEach((callback) => callback());
    },
    flushFrames() {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback());
    },
    dispatch(name, settings = {}) {
      const event = {
        target: main, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
        ...settings,
      };
      if (name === 'scroll') {
        for (const callback of page.listeners.get(name) ?? []) callback(event);
      } else {
        for (const { callback } of listeners.get(name) ?? []) callback(event);
      }
      return event;
    },
    dispose() { effectSlots.forEach((slot) => slot.cleanup?.()); },
  };
}
