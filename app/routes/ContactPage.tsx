import { ContentSection } from '../components/ContentSection/ContentSection';
import { PageContent } from '../components/PageContent/PageContent';
import { contactSections } from '../content/placeholderContent';

export default function ContactPage() {
  return (
    <PageContent introduction="Texto provisional para preparar la página de contacto. Los canales reales se añadirán cuando estén disponibles.">
      {contactSections.map(({ id, title, paragraphs }) => (
        <ContentSection key={id} id={id} title={title}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </ContentSection>
      ))}
    </PageContent>
  );
}
