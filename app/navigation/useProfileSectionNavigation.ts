import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getProfileEntryAnimation } from './getProfileEntryAnimation';

export function useProfileSectionNavigation(headerRef: RefObject<HTMLElement | null>) {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const initialLocationKey = useRef(key);
  const hasNavigated = useRef(false);

  useLayoutEffect(() => {
    if (key !== initialLocationKey.current) {
      hasNavigated.current = true;
    }

    // History restores the saved position instead of repeating the anchor jump.
    if (navigationType === 'POP' && hasNavigated.current) {
      return;
    }

    if (pathname !== '/profile' || !hash) {
      return;
    }

    const section = document.getElementById(hash.slice(1));
    let cancelled = false;
    function moveToSection() {
      if (cancelled) return;
      if (!section || !section.closest('main')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
        return;
      }

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const gap = parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      const top = window.scrollY + section.getBoundingClientRect().top - headerHeight - gap;

      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
      section.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    }

    const frame = window.requestAnimationFrame(() => {
      const entryAnimation = getProfileEntryAnimation();
      if (entryAnimation) {
        entryAnimation.finished.then(moveToSection, moveToSection);
      } else {
        moveToSection();
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, hash, key, navigationType, headerRef]);
}
