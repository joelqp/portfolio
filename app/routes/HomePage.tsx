import { Link } from 'react-router';
import { ContentSection } from '../components/ContentSection/ContentSection';
import { PageContent } from '../components/PageContent/PageContent';
import { homeSections } from '../content/placeholderContent';

export default function HomePage() {
  return (
    <PageContent introduction="Una primera lectura del portfolio, con textos de relleno que se sustituirán por la presentación profesional definitiva.">
      {homeSections.map(({ id, title, paragraphs }) => (
        <ContentSection key={id} id={id} title={title}>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </ContentSection>
      ))}
      <ContentSection id="explore" title="Explorar el portfolio">
        <p><Link to="/profile">Perfil profesional y espacios de las demos</Link></p>
        <p><Link to="/build">Cómo se está construyendo este portfolio</Link></p>
        <p><Link to="/contact">Contacto y canales pendientes</Link></p>
      </ContentSection>
    </PageContent>
  );
}
