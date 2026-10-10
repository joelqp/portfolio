import { ContentSection } from '../components/ContentSection/ContentSection';
import { DemoPlaceholder } from '../components/DemoPlaceholder/DemoPlaceholder';
import { PageContent } from '../components/PageContent/PageContent';
import { profileExperiences, profileSections } from '../content/placeholderContent';

export default function ProfilePage() {
  return (
    <PageContent introduction="Las experiencias aparecen de la más reciente a la más antigua. Sus descripciones son provisionales; las reservas de las demos se identifican por separado.">
      {profileExperiences.map(({ id, title, paragraphs, demo }) => (
        <ContentSection key={id} id={id} title={title}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <DemoPlaceholder title={demo.title} description={demo.description} />
        </ContentSection>
      ))}
      {profileSections.map(({ id, title, paragraphs }) => (
        <ContentSection key={id} id={id} title={title}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </ContentSection>
      ))}
    </PageContent>
  );
}
