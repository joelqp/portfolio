import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';
import { ScrollPageTransition, type ScrollDirection } from './ScrollPageTransition';

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
      root.style.removeProperty('--page-transition-top');
      root.style.removeProperty('--page-transition-distance');
    };

    coordinator.current = new ScrollPageTransition({
      navigate: (destination) => {
        void navigate(destination, {
          preventScrollReset: true,
          state: { scrollPageEntry: direction === 'backward' ? 'bottom' : 'top' },
        });
      },
      position: (edge) => {
        const top = edge === 'bottom' ? document.scrollingElement?.scrollHeight ?? 0 : 0;
        window.scrollTo({ top, left: 0, behavior: 'instant' });
      },
      prepare: (movement) => {
        const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
        root.style.setProperty('--page-transition-top', `${headerBottom}px`);
        root.style.setProperty('--page-transition-distance', `${Math.max(0, window.innerHeight - headerBottom)}px`);
        root.setAttribute('data-scroll-transition', movement);
      },
      release,
      start: animate ? (update) => {
        const transition = document.startViewTransition(update);
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
