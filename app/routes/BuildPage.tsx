import { ContentSection } from '../components/ContentSection/ContentSection';
import { PageContent } from '../components/PageContent/PageContent';
import { buildSections } from '../content/placeholderContent';

export default function BuildPage() {
  return (
    <PageContent introduction="Espacio para explicar las tecnologías, decisiones y herramientas del portfolio. La explicación completa se redactará a partir de lo realmente construido.">
      {buildSections.map(({ id, title, paragraphs }) => (
        <ContentSection key={id} id={id} title={title}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </ContentSection>
      ))}
    </PageContent>
  );
}
