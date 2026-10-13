/** The shared frame is the only page scroll owner. Nested controls keep their own scroll. */
export function getPageScrollElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-page-scroll]');
}

export function scrollPageTo(top: number) {
  getPageScrollElement()?.scrollTo({ top, left: 0, behavior: 'instant' });
}
