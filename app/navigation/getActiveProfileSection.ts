type SectionPosition = {
  id: string;
  top: number;
};

export function getActiveProfileSection(
  sections: readonly SectionPosition[],
  readingTop: number,
  atPageBottom: boolean
): string | null {
  if (atPageBottom) {
    return sections.at(-1)?.id ?? null;
  }

  let activeId: string | null = null;
  for (const section of sections) {
    if (section.top > readingTop + 1) {
      break;
    }
    activeId = section.id;
  }
  return activeId;
}
