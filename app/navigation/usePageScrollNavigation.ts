import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { navigationItems } from '../navigation';
import { PageScrollIntent } from './PageScrollIntent';
import { useScrollPageTransition } from './useScrollPageTransition';
import { getPageScrollElement, scrollPageTo } from './pageScroll';

const wheelGesturePause = 200;

function isAtPageTop() {
  const page = getPageScrollElement();
  return page !== null && page.scrollTop <= 1;
}

function isAtPageBottom() {
  const page = getPageScrollElement();
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
    if (element === getPageScrollElement()) break;
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

function scrollFrameFromOutside(event: KeyboardEvent) {
  const page = getPageScrollElement();
  if (!page || (event.target instanceof HTMLElement && page.contains(event.target))) return;

  const pageStep = page.clientHeight * 0.9;
  const steps: Record<string, number> = {
    ArrowDown: 40,
    ArrowUp: -40,
    PageDown: pageStep,
    PageUp: -pageStep,
    ' ': event.shiftKey ? -pageStep : pageStep,
    Home: -page.scrollTop,
    End: page.scrollHeight,
  };
  const step = steps[event.key];
  if (step === undefined) return;
  const top = Math.max(0, Math.min(page.scrollTop + step, page.scrollHeight - page.clientHeight));
  if (top !== page.scrollTop) {
    event.preventDefault();
    scrollPageTo(top);
  }
}

export function usePageScrollNavigation() {
  const { pathname } = useLocation();
  const { navigateFromScroll: navigateFromGesture, scrollLocationKey } = useScrollPageTransition();
  const lastWheelTime = useRef(-Infinity);
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

      navigating = navigateFromGesture(destination.to, moveForward ? 'forward' : 'backward');
      return navigating;
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
          return;
        }
      }
      scrollFrameFromOutside(event);
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
  }, [pathname, navigateFromGesture]);

  return scrollLocationKey;
}
