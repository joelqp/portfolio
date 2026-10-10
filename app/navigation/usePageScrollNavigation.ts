import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { navigationItems } from '../navigation';
import { PageScrollIntent } from './PageScrollIntent';

const wheelGesturePause = 200;

function isAtPageTop() {
  const page = document.scrollingElement;
  return page !== null && page.scrollTop <= 1;
}

function isAtPageBottom() {
  const page = document.scrollingElement;
  return page !== null && page.scrollHeight - page.scrollTop - page.clientHeight <= 1;
}

function shouldIgnoreTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  if (target.isContentEditable || target.closest('input, textarea, select, button')) {
    return true;
  }

  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    if (element === document.body || element === document.documentElement) {
      break;
    }

    const overflow = window.getComputedStyle(element).overflowY;
    if (/(auto|scroll)/.test(overflow) && element.scrollHeight > element.clientHeight) {
      return true;
    }
  }

  return false;
}

export function usePageScrollNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lastWheelTime = useRef(-Infinity);
  const pendingPage = useRef<{ pathname: string; edge: 'top' | 'bottom' } | null>(null);

  useLayoutEffect(() => {
    if (pendingPage.current?.pathname === pathname) {
      const top = pendingPage.current.edge === 'bottom' ? document.scrollingElement?.scrollHeight ?? 0 : 0;
      window.scrollTo({ top, left: 0, behavior: 'instant' });
      pendingPage.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    const pageIndex = navigationItems.findIndex(({ to }) => to === pathname);
    if (pageIndex < 0) {
      return;
    }
    const nextPage = navigationItems[pageIndex + 1];
    const previousPage = navigationItems[pageIndex - 1];

    const downwardIntent = new PageScrollIntent('down');
    const upwardIntent = new PageScrollIntent('up');
    let navigating = false;
    let touchY: number | null = null;

    function startGesture(eligible = true) {
      downwardIntent.startGesture(eligible && isAtPageBottom());
      upwardIntent.startGesture(eligible && isAtPageTop());
    }

    function navigateFromScroll(delta: number): boolean {
      if (navigating) {
        return false;
      }

      const moveForward = downwardIntent.addDistance(delta, isAtPageBottom());
      const moveBackward = upwardIntent.addDistance(delta, isAtPageTop());
      const destination = moveForward ? nextPage : moveBackward ? previousPage : undefined;
      if (!destination) {
        return false;
      }

      navigating = true;
      pendingPage.current = { pathname: destination.to, edge: moveForward ? 'top' : 'bottom' };
      void navigate(destination.to, { preventScrollReset: true });
      return true;
    }

    function onWheel(event: WheelEvent) {
      const previousTime = lastWheelTime.current;
      lastWheelTime.current = event.timeStamp;
      if (event.ctrlKey || event.defaultPrevented || shouldIgnoreTarget(event.target)) {
        startGesture(false);
        return;
      }

      if (event.timeStamp - previousTime > wheelGesturePause) {
        startGesture();
      }

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      navigateFromScroll(event.deltaY * unit);
    }

    function onTouchStart(event: TouchEvent) {
      const eligible = event.touches.length === 1 && !shouldIgnoreTarget(event.target);
      touchY = eligible ? event.touches[0].clientY : null;
      startGesture(eligible);
    }

    function onTouchMove(event: TouchEvent) {
      if (touchY === null || event.touches.length !== 1 || event.defaultPrevented) {
        touchY = null;
        startGesture(false);
        return;
      }

      const currentY = event.touches[0].clientY;
      navigateFromScroll(touchY - currentY);
      touchY = currentY;
    }

    function onTouchEnd() {
      touchY = null;
      startGesture(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
          (event.shiftKey && event.key !== ' ') || shouldIgnoreTarget(event.target)) {
        return;
      }

      const upwardKey = event.key === 'PageUp' || event.key === 'ArrowUp' ||
        (event.key === ' ' && event.shiftKey);
      const downwardKey = event.key === 'PageDown' || event.key === 'ArrowDown' ||
        (event.key === ' ' && !event.shiftKey);

      if (upwardKey || downwardKey) {
        startGesture();
        if (navigateFromScroll(upwardKey ? -80 : 80)) {
          event.preventDefault();
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [pathname, navigate]);
}
