import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { PageScrollIntent } from '../../app/navigation/PageScrollIntent.ts';
import { navigationItems } from '../../app/navigation.ts';
import * as jsxRuntime from 'react/jsx-runtime';
import { getActiveProfileSection } from '../../app/navigation/getActiveProfileSection.ts';
import * as placeholderContent from '../../app/content/placeholderContent.ts';

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
  const effectSlots = [];
  let refIndex = 0;
  let stateIndex = 0;
  let result;
  let effectIndex = 0;
  let nextFrame = 0;
  const pendingEffects = [];
  const navigations = [];
  const scrollCalls = [];
  const focusCalls = [];

  class Element {
    parentElement = null;
    scrollHeight = 100;
    clientHeight = 100;
    isContentEditable = false;
    overflowY = 'visible';
    control = false;

    closest() { return this.control ? this : null; }
    focus(settings) { focusCalls.push({ element: this, settings }); }
  }

  const body = new Element();
  const main = new Element();
  const heading = new Element();
  const page = { scrollTop: 500, scrollHeight: 1000, clientHeight: 500, ...options.page };
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
  const headerRef = { current: { getBoundingClientRect: () => ({ height: 120 }) } };
  const document = {
    body,
    documentElement: new Element(),
    scrollingElement: page,
    getElementById: (id) => options.sectionTops
      ? profileElements.get(id) ?? null
      : id === 'caixa' ? section : null,
    querySelector: (selector) => selector === 'main' ? main : null,
  };
  const window = {
    innerHeight: 500,
    get scrollY() { return page.scrollTop; },
    getComputedStyle: (element) => ({ overflowY: element.overflowY, scrollMarginTop: '24px' }),
    matchMedia: () => ({ matches: options.horizontalHeader ?? false }),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
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
    './getActiveProfileSection': { getActiveProfileSection },
    './profileSections': { profileSectionItems },
    'react/jsx-runtime': jsxRuntime,
    '../Header/Header': { Header: () => null },
    '../../navigation/usePageScrollNavigation': { usePageScrollNavigation: () => {} },
    './SiteLayout.module.css': { default: {} },
  };
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
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    window,
    document,
    HTMLElement: Element,
  });

  return {
    body, main, heading, section, page, navigations, scrollCalls, focusCalls,
    get result() { return result; },
    createTarget(properties) { return Object.assign(new Element(), properties); },
    render(nextLocation = location, nextNavigationType = navigationType) {
      location = { ...location, ...nextLocation };
      navigationType = nextNavigationType;
      refIndex = 0;
      stateIndex = 0;
      effectIndex = 0;
      if (moduleName === 'SiteLayout') {
        const layout = exports.SiteLayout({ children: null });
        layout.props.children[1].props.ref.current = main;
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
        target: body, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
        ...settings,
      };
      listeners.get(name)?.(event);
      return event;
    },
    dispose() { effectSlots.forEach((slot) => slot.cleanup?.()); },
  };
}
