import { useEffect, useState, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getActiveProfileSection } from './getActiveProfileSection';
import { profileSectionItems } from './profileSections';

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

    function updateActiveSection() {
      frame = null;
      const horizontalHeader = window.matchMedia('(max-width: 60rem)').matches;
      const headerHeight = horizontalHeader ? headerRef.current?.getBoundingClientRect().height ?? 0 : 0;
      const gap = sections.length > 0
        ? parseFloat(window.getComputedStyle(sections[0].element).scrollMarginTop) || 0
        : 0;
      const positions = sections.map(({ id, element }) => ({
        id,
        top: (element.querySelector('h2') ?? element).getBoundingClientRect().top,
      }));
      const page = document.scrollingElement;
      // Short final sections cannot always reach the reading edge.
      const atPageBottom = page !== null && page.scrollTop > 0 &&
        page.scrollHeight - page.scrollTop - page.clientHeight <= 1;
      if (preserveAnchorSelection) {
        if (anchorPosition === null) {
          anchorPosition = window.scrollY;
        } else if (window.scrollY !== anchorPosition) {
          preserveAnchorSelection = false;
        }
      }
      const id = preserveAnchorSelection
        ? anchorId ?? null
        : getActiveProfileSection(positions, headerHeight + gap, atPageBottom);

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
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', scheduleUpdate);
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
