import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getProfileEntryAnimation } from './getProfileEntryAnimation';
import { getPageScrollElement, scrollPageTo } from './pageScroll';

const storageKey = 'portfolio-page-scroll-positions';

function readPositions(): Record<string, number> {
  try {
    const stored: unknown = JSON.parse(window.sessionStorage.getItem(storageKey) ?? '{}');
    if (stored === null || typeof stored !== 'object' || Array.isArray(stored)) return {};
    return Object.fromEntries(Object.entries(stored).filter(([, value]) =>
      typeof value === 'number' && Number.isFinite(value) && value >= 0
    ));
  } catch {
    return {};
  }
}

/** Restores the frame by history entry; gesture destinations stay with their coordinator. */
export function usePageScrollRestoration(scrollLocationKey: RefObject<string | null>) {
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef<Record<string, number> | null>(null);

  useLayoutEffect(() => {
    const page = getPageScrollElement();
    if (!page) return;
    positions.current ??= readPositions();
    const savedTop = positions.current[key];
    let cancelled = false;
    let position = page.scrollTop;
    let pendingHistoryRestore = false;
    let restoredPosition = page.scrollTop;

    const persist = () => {
      positions.current![key] = position;
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify(positions.current));
      } catch {
        // In-memory history restoration remains available when storage is restricted.
      }
    };
    const recordScroll = () => {
      if (page.scrollTop !== restoredPosition) pendingHistoryRestore = false;
      position = page.scrollTop;
    };
    const restore = () => {
      if (cancelled) return;
      scrollPageTo(savedTop ?? 0);
      position = page.scrollTop;
      restoredPosition = page.scrollTop;
    };

    if (scrollLocationKey.current !== key) {
      if (navigationType === 'POP' && savedTop !== undefined) {
        restore();
        const entryAnimation = getProfileEntryAnimation();
        if (entryAnimation) {
          pendingHistoryRestore = true;
          // The mobile index can change the final scroll range while opening.
          const finishRestore = () => {
            if (pendingHistoryRestore) restore();
            pendingHistoryRestore = false;
          };
          entryAnimation.finished.then(finishRestore, finishRestore);
        }
      } else if (!hash) {
        scrollPageTo(0);
        position = page.scrollTop;
      }
    }

    page.addEventListener('scroll', recordScroll, { passive: true });
    window.addEventListener('pagehide', persist);
    return () => {
      cancelled = true;
      persist();
      page.removeEventListener('scroll', recordScroll);
      window.removeEventListener('pagehide', persist);
    };
  }, [key, hash, navigationType, scrollLocationKey]);
}
