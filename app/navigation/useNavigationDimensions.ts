import { useLayoutEffect, type RefObject } from 'react';

export function useNavigationDimensions(
  layoutRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLElement | null>,
  profileNavigationRef: RefObject<HTMLElement | null>,
  isProfilePage: boolean
) {
  useLayoutEffect(() => {
    const layout = layoutRef.current;
    const header = headerRef.current;
    const profileNavigation = profileNavigationRef.current;
    if (!layout || !header) return;

    const updateDimensions = () => {
      layout.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
      layout.style.setProperty(
        '--profile-navigation-height',
        `${profileNavigation?.getBoundingClientRect().height ?? 0}px`
      );
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(header);
    if (profileNavigation) observer.observe(profileNavigation);
    return () => observer.disconnect();
  }, [layoutRef, headerRef, profileNavigationRef, isProfilePage]);
}
