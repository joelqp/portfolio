import { profileExperiences, profileSections } from '../content/placeholderContent';

export const profileSectionItems = [...profileExperiences, ...profileSections].map(
  ({ id, title }) => ({ id, title })
);
