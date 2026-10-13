import { useEffect, useState, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getActiveProfileSection } from './getActiveProfileSection';
import { profileSectionItems } from './profileSections';
import { getProfileEntryAnimation } from './getProfileEntryAnimation';
import { getPageScrollElement } from './pageScroll';

type ActiveSection = {
  locationKey: string;
  id: string | null;
};

export function useActiveProfileSection(headerRef: RefObject<HTMLElement | null>) {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);

  useEffect(() => {
    if (pathname !== '/profile') {
      return;
    }

    const sections = profileSectionItems.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element?.closest('main') ? [{ id, element }] : [];
    });
    let frame: number | null = null;
    const anchorId = profileSectionItems.find(({ id }) => hash === `#${id}`)?.id;
    let preserveAnchorSelection = anchorId !== undefined && navigationType !== 'POP';
    let anchorPosition: number | null = null;
    const entryAnimation = getProfileEntryAnimation();
    let entering = entryAnimation !== null;
    let disposed = false;

    function updateActiveSection() {
      frame = null;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const gap = sections.length > 0
        ? parseFloat(window.getComputedStyle(sections[0].element).scrollMarginTop) || 0
        : 0;
      const positions = sections.map(({ id, element }) => ({
        id,
        top: (element.querySelector('h2') ?? element).getBoundingClientRect().top,
      }));
      const page = getPageScrollElement();
      // Short final sections cannot always reach the reading edge.
      const atPageBottom = page !== null && page.scrollTop > 0 &&
        page.scrollHeight - page.scrollTop - page.clientHeight <= 1;
      if (preserveAnchorSelection && !entering) {
        if (anchorPosition === null) {
          anchorPosition = page?.scrollTop ?? 0;
        } else if (page?.scrollTop !== anchorPosition) {
          preserveAnchorSelection = false;
        }
      }
      const id = preserveAnchorSelection
        ? anchorId ?? null
        : getActiveProfileSection(positions, headerBottom + gap, atPageBottom);

      setActiveSection((previous) => previous?.locationKey === key && previous.id === id
        ? previous
        : { locationKey: key, id });
    }

    function scheduleUpdate() {
      if (frame === null) {
        frame = window.requestAnimationFrame(updateActiveSection);
      }
    }

    scheduleUpdate();
    if (entryAnimation) {
      const finishEntry = () => {
        if (disposed) return;
        entering = false;
        anchorPosition = null;
        scheduleUpdate();
      };
      entryAnimation.finished.then(finishEntry, finishEntry);
    }
    const page = getPageScrollElement();
    page?.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      disposed = true;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      page?.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [pathname, hash, key, navigationType, headerRef]);

  if (pathname !== '/profile') {
    return null;
  }
  if (activeSection?.locationKey === key) {
    return activeSection.id;
  }
  return profileSectionItems.find(({ id }) => hash === `#${id}`)?.id ?? null;
}
