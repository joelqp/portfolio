import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';
import { ScrollPageTransition, type ScrollDirection } from './ScrollPageTransition';
import { getPageScrollElement, scrollPageTo } from './pageScroll';

const turnProperties = ['axis-x', 'axis-y', 'min-perspective'] as const;

type GeometryPhase = 'old' | 'new' | 'transition';
type PageGeometry = {
  headerHeight: number;
  width: number;
  height: number;
};

function measurePageGeometry(): PageGeometry {
  const header = document.querySelector('header')?.getBoundingClientRect();
  const frame = getPageScrollElement()?.getBoundingClientRect();
  const headerHeight = Math.max(0, (header?.bottom ?? frame?.top ?? 0) - (frame?.top ?? 0));
  return {
    headerHeight,
    width: Math.max(1, frame?.width ?? window.innerWidth),
    height: Math.max(1, (frame?.height ?? window.innerHeight) - headerHeight),
  };
}

function setPageGeometry(root: HTMLElement, phase: GeometryPhase, geometry: PageGeometry) {
  root.style.setProperty(`--page-${phase}-header-height`, `${geometry.headerHeight}px`);
}

function setTurnGeometry(root: HTMLElement, geometry: PageGeometry) {
  const diagonal = Math.hypot(geometry.width, geometry.height);
  // An axis perpendicular to the diagonal lifts the lower-right corner toward the staple.
  root.style.setProperty('--page-turn-axis-x', `${geometry.height / diagonal}`);
  root.style.setProperty('--page-turn-axis-y', `${-geometry.width / diagonal}`);
  root.style.setProperty('--page-turn-min-perspective', `${2 * diagonal}px`);
}

/** Browser adapter; the animation itself lives in pageTransition.module.css. */
export function useScrollPageTransition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const coordinator = useRef<ScrollPageTransition | null>(null);
  const previousKey = useRef(location.key);
  const scrollLocationKey = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (previousKey.current !== location.key) {
      scrollLocationKey.current = null;
      if (navigationType === 'POP') coordinator.current?.cancel();
      else if (coordinator.current?.commit(location.pathname)) {
        scrollLocationKey.current = location.key;
      }
    }
    previousKey.current = location.key;
  }, [location.key, location.pathname, navigationType]);

  useLayoutEffect(() => () => coordinator.current?.cancel(), []);

  useEffect(() => {
    function preventSnapshotScroll(event: Event) {
      if (coordinator.current?.busy && document.documentElement.hasAttribute('data-scroll-transition')) {
        event.preventDefault();
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) &&
          !event.altKey && !event.ctrlKey && !event.metaKey) {
        preventSnapshotScroll(event);
      }
    }
    window.addEventListener('wheel', preventSnapshotScroll, { passive: false, capture: true });
    window.addEventListener('touchmove', preventSnapshotScroll, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => {
      window.removeEventListener('wheel', preventSnapshotScroll, true);
      window.removeEventListener('touchmove', preventSnapshotScroll, true);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  const navigateFromScroll = useCallback((pathname: string, direction: ScrollDirection) => {
    if (coordinator.current?.busy) return false;
    const root = document.documentElement;
    const animate = typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const release = () => {
      root.removeAttribute('data-scroll-transition');
      for (const phase of ['old', 'new', 'transition'] as const) {
        root.style.removeProperty(`--page-${phase}-header-height`);
      }
      for (const property of turnProperties) root.style.removeProperty(`--page-turn-${property}`);
    };

    coordinator.current = new ScrollPageTransition({
      navigate: (destination) => {
        void navigate(destination, {
          preventScrollReset: true,
          state: { scrollPageEntry: direction === 'backward' ? 'bottom' : 'top' },
        });
      },
      position: (edge) => {
        const top = edge === 'bottom' ? getPageScrollElement()?.scrollHeight ?? 0 : 0;
        scrollPageTo(top);
      },
      prepare: (movement) => {
        const geometry = measurePageGeometry();
        setPageGeometry(root, 'old', geometry);
        setPageGeometry(root, 'new', geometry);
        setPageGeometry(root, 'transition', geometry);
        setTurnGeometry(root, geometry);
        root.setAttribute('data-scroll-transition', movement);
      },
      release,
      start: animate ? (update) => {
        const activeCoordinator = coordinator.current;
        const transition = document.startViewTransition(async () => {
          await update();
          if (coordinator.current !== activeCoordinator || !activeCoordinator?.busy) return;
          // Read the destination after its route commit and layout effects, before capture.
          const geometry = measurePageGeometry();
          setPageGeometry(root, 'new', geometry);
          setPageGeometry(root, 'transition', geometry);
          if (direction === 'backward') setTurnGeometry(root, geometry);
        });
        // Capture failure or interruption must not produce unhandled rejections.
        void transition.ready.catch(() => {});
        void transition.updateCallbackDone.catch(() => {});
        return transition;
      } : undefined,
    });
    return coordinator.current.navigate(pathname, direction);
  }, [navigate]);

  return { navigateFromScroll, scrollLocationKey };
}
