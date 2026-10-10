type PlaceholderSectionContent = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

type PlaceholderExperienceContent = PlaceholderSectionContent & {
  demo: {
    title: string;
    description: string;
  };
};

export const homeSections: readonly PlaceholderSectionContent[] = [
  {
    id: 'introduction',
    title: 'Presentación',
    paragraphs: [
      'Este espacio contendrá una presentación profesional breve: qué hago, qué tipo de problemas abordo y qué puede encontrar el visitante en este portfolio.',
      'Este texto de relleno permite revisar la lectura y la distribución de la página. La presentación definitiva está pendiente y sustituirá estos párrafos.',
    ],
  },
  {
    id: 'resume',
    title: 'Currículum',
    paragraphs: [
      'Aquí se ofrecerá acceso al currículum profesional en PDF. El archivo real está pendiente; este marcador todavía no permite descargarlo.',
    ],
  },
];

export const profileExperiences: readonly PlaceholderExperienceContent[] = [
  {
    id: 'caixa',
    title: 'CaixaBank Tech',
    paragraphs: [
      'Aquí se describirán el contexto de esta experiencia, las responsabilidades y las contribuciones profesionales reales. Los textos, fechas y tecnologías vinculadas a ese trabajo están pendientes de incorporar.',
      'La demostración se presentará por separado como una recreación personal. Este texto es provisional y no atribuye resultados ni responsabilidades profesionales.',
    ],
    demo: {
      title: 'Consulta bancaria y escenarios',
      description: 'La futura demo permitirá recorrer tarjetas, detalle y movimientos en una interfaz ficticia, explorando información ausente y escenarios de fallo y recuperación.',
    },
  },
  {
    id: 'altia',
    title: 'ALTIA',
    paragraphs: [
      'Este bloque está reservado para explicar la experiencia profesional, sus objetivos y las aportaciones realizadas. La descripción definitiva y sus datos verificables están pendientes.',
      'El espacio inferior corresponde a una simulación independiente del trabajo profesional. Permite revisar cómo convivirán la explicación y la demostración dentro de una misma sección.',
    ],
    demo: {
      title: 'Migración de archivos',
      description: 'La futura demo representará la transferencia de recursos ficticios, su validación y transformación, y la resolución de incidencias mediante correcciones y reintentos.',
    },
  },
  {
    id: 'aia',
    title: 'AIA',
    paragraphs: [
      'Aquí se incorporará una explicación del contexto profesional y de las contribuciones reales en esta experiencia. Por ahora se utiliza texto de relleno para comprobar el espacio disponible.',
      'La descripción final distinguirá las aportaciones laborales de los métodos construidos específicamente para la demostración personal.',
    ],
    demo: {
      title: 'Transporte y aprovechamiento de materiales',
      description: 'La futura demo permitirá modificar ubicaciones y comparar recorridos en una red ficticia para transformar y entregar materiales, con reproducción, pausa y reinicio.',
    },
  },
];

export const profileSections: readonly PlaceholderSectionContent[] = [
  {
    id: 'education',
    title: 'Formación',
    paragraphs: [
      'Mi formación combina estudios universitarios, un curso básico y aprendizaje práctico en proyectos de software.',
      'Estudié en la Universitat Autònoma de Barcelona entre 2019 y 2024.',
      'En AIA realicé prácticas como data scientist entre julio y septiembre de 2023.',
      'Durante estas prácticas trabajé en una API que devolvía la ruta óptima para camiones.',
      'En ALTIA realicé prácticas de ingeniería de software entre julio y septiembre de 2024.',
      'Participé en la migración de una plataforma de la Universitat Oberta de Catalunya a Canvas.',
      'Colaboré en la descarga y exportación de archivos, en tareas dentro de Canvas y en pruebas de la migración.',
      'Durante esta etapa completé un curso básico de ERP en UiPath.',
      'Desde octubre de 2024 continúo mi aprendizaje práctico como ingeniero de software en CaixaBank Tech.',
      'En las primeras semanas desarrollé un simulador de transacciones bancarias con Bizum utilizando React, Spring Boot y PostgreSQL.',
      'En el proyecto de fraccionamiento automático trabajé en una SPA con React, integrada en una aplicación móvil mediante Ionic.',
      'Este trabajo incluyó el uso de componentes internos de la empresa para construir el flujo de fraccionamiento de pagos.',
      'También trabajé con datos recibidos del backend, incluyendo su filtrado, cifrado y transformación en el frontend.',
      'En el dashboard de tarjetas y operativas participé desde el inicio hasta el final del proyecto, con contacto cercano con los requisitos de negocio y coordinación con otras consultoras.',
      'Esta experiencia me ha permitido conocer mejor el funcionamiento interno de las tarjetas bancarias y el tratamiento de los datos que se presentan al usuario.',
    ],
  },
  {
    id: 'technologies',
    title: 'Tecnologías',
    paragraphs: [
      'He utilizado React en proyectos de software bancario y en un simulador de transacciones con Bizum.',
      'En CaixaBank Tech trabajo con React para desarrollar aplicaciones de página única (SPA).',
      'Estas aplicaciones se integran en una aplicación móvil mediante Ionic; mi trabajo se centra en las SPA.',
      'Utilizo componentes internos de la empresa para construir las interfaces de las operativas bancarias.',
      'En el proyecto de fraccionamiento automático participé en el flujo que permite fraccionar un pago desde la aplicación móvil.',
      'También trabajé con React en el dashboard de tarjetas y operativas.',
      'En estos proyectos consumo datos del backend y los adapto a las necesidades de la interfaz.',
      'Parte de este trabajo incluye el filtrado y la transformación de los datos recibidos.',
      'También he trabajado con el cifrado de datos en estos flujos del frontend.',
      'Durante mis primeras semanas en CaixaBank Tech desarrollé un simulador de transacciones bancarias con Bizum.',
      'En ese simulador utilicé Spring Boot para el backend.',
      'Utilicé PostgreSQL como base de datos del mismo proyecto.',
      'En las prácticas de AIA trabajé en una API que devolvía la ruta óptima para camiones.',
      'En ALTIA trabajé con Canvas durante una migración de plataforma de la UOC, colaborando en la descarga y exportación de archivos y en pruebas.',
      'Durante las prácticas en ALTIA completé un curso básico de ERP en UiPath.',
    ],
  },
];

export const buildSections: readonly PlaceholderSectionContent[] = [
  {
    id: 'stack',
    title: 'Base técnica',
    paragraphs: ['La aplicación utiliza React, TypeScript, React Router y Vite. Este bloque se ampliará con una explicación de su función y de las decisiones realmente adoptadas.'],
  },
  {
    id: 'construction',
    title: 'Proceso y decisiones',
    paragraphs: [
      'Aquí se explicará cómo se ha construido el portfolio, desde su estructura compartida hasta las demostraciones. El texto final describirá el proceso y las herramientas realmente utilizados.',
      'Este párrafo provisional permite observar una sección con más contenido. Las explicaciones de funcionalidades futuras se incorporarán cuando esas funcionalidades existan.',
    ],
  },
  {
    id: 'resources',
    title: 'Repositorio y documentación',
    paragraphs: ['Espacio reservado para los enlaces públicos al código y a la documentación seleccionada. Los destinos definitivos están pendientes.'],
  },
];

export const contactSections: readonly PlaceholderSectionContent[] = [
  {
    id: 'professional-channels',
    title: 'Canales profesionales',
    paragraphs: [
      'Esta página reunirá los canales profesionales de contacto mediante enlaces identificados. Los destinos reales están pendientes y se incorporarán sin un formulario propio.',
      'Este texto de relleno sirve para revisar el espacio y la legibilidad antes de añadir el contenido definitivo.',
    ],
  },
  {
    id: 'email',
    title: 'Correo electrónico',
    paragraphs: ['Dirección de correo pendiente. Cuando se incorpore una dirección real, se podrá abrir el cliente de correo desde su enlace.'],
  },
  {
    id: 'professional-profiles',
    title: 'Perfiles profesionales',
    paragraphs: ['Enlaces a los perfiles profesionales pendientes. No se muestran enlaces operativos hasta disponer de sus direcciones reales.'],
  },
];
