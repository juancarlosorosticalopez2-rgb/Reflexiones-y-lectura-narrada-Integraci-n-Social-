export interface Paragraph {
  id: number;
  text: string;
  marginalNote?: string;
  isPullQuote?: boolean;
}

export interface ReflectionChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readingTime: string;
  durationSecondsEstimate: number;
  epigraph: {
    quote: string;
    author: string;
  };
  paragraphs: Paragraph[];
  keyQuote: string;
  discussionPrompts: string[];
}

export const REFLECTION_CHAPTERS: ReflectionChapter[] = [
  {
    id: 'integracion',
    number: '01',
    title: 'La trama de las diferencias',
    subtitle: 'Hacia una integración que no anula la singularidad',
    readingTime: '3 min de lectura',
    durationSecondsEstimate: 160,
    epigraph: {
      quote: 'Integrar no es igualar, sino aprender a convivir en la polifonía de lo diverso.',
      author: 'Cuadernos de Filosofía Contemporánea'
    },
    paragraphs: [
      {
        id: 0,
        text: 'La integración suele confundirse con la asimilación, ese impulso inadvertido de diluir la extrañeza del otro en nuestras propias costumbres. Sin embargo, la auténtica integración no exige la renuncia a la propia identidad, sino la apertura de un espacio compartido donde las diferencias se reconozcan como constitutivas del bien común.',
        marginalNote: 'La asimilación disuelve; la integración compone.',
      },
      {
        id: 1,
        text: 'Cuando una comunidad decide integrarse verdaderamente, renuncia a la ilusión del monocultivo social. No busca una uniformidad estéril donde todos piensen con el mismo compás, sino un ecosistema resiliente donde saberes ancestrales, innovaciones técnicas y memorias diversas se fecunden mutuamente sin jerarquías asfixiantes.',
        marginalNote: 'Resiliencia ecológica del pensamiento.'
      },
      {
        id: 2,
        text: 'Integrar es, en última instancia, un acto de hospitalidad epistémica: admitir que la verdad nunca es propiedad exclusiva de una sola tradición, y que el mundo se vuelve más inteligible cuando lo contemplamos a través de ojos que han mirado desde orillas distintas a las nuestras.',
        isPullQuote: true
      },
      {
        id: 3,
        text: 'El desafío contemporáneo radica en construir puentes sin desdibujar las riberas. Una sociedad integrada no es aquella que apaga los contrastes, sino la que sabe hacer de la tensión entre lo propio y lo ajeno una conversación fecunda, permanente y serena.'
      }
    ],
    keyQuote: 'La hospitalidad epistémica reconoce que el mundo se vuelve más inteligible cuando lo contemplamos desde orillas que no son las nuestras.',
    discussionPrompts: [
      '¿En qué momentos de nuestra vida cotidiana confundimos la integración con la exigencia de que el otro se parezca a nosotros?',
      '¿Cómo pueden las instituciones educativas y laborales proteger la singularidad sin fragmentar la cohesión colectiva?'
    ]
  },
  {
    id: 'pensamiento-critico',
    number: '02',
    title: 'La sospecha lúcida',
    subtitle: 'El coraje de dudar en la era de las certezas veloces',
    readingTime: '3 min de lectura',
    durationSecondsEstimate: 175,
    epigraph: {
      quote: 'Pensar críticamente no es destruir, sino examinar los cimientos sobre los que descansan nuestras convicciones.',
      author: 'Ensayos sobre la Razón Inquieta'
    },
    paragraphs: [
      {
        id: 0,
        text: 'Vivimos rodeados de certezas instantáneas. La velocidad de las redes premia la reacción inmediata por encima de la deliberación paciente. Frente a este vértigo, el pensamiento crítico no surge como un ejercicio de pedantería o cinismo, sino como un acto de legítima defensa intelectual y sosiego moral.',
        marginalNote: 'El sosiego frente al frenesí algorítmico.'
      },
      {
        id: 1,
        text: 'Tener criterio propio comienza por someter a examen no sólo las afirmaciones ajenas, sino con particular rigor nuestras simpatías ideológicas más arraigadas. La pregunta incómoda "¿por qué creo lo que creo?" es el antídoto más eficaz contra el dogmatismo y las cámaras de resonancia que nos adormecen.',
        marginalNote: 'La autocrítica como punto de partida.'
      },
      {
        id: 2,
        text: 'El pensamiento crítico no busca vencer en una disputa retórica, sino aproximarse con honestidad a la complejidad de lo real. Quien piensa con rigor acepta la fragilidad de sus hipótesis y contempla el error no como una derrota, sino como la corrección indispensable de una brújula en viaje.',
        isPullQuote: true
      },
      {
        id: 3,
        text: 'Cultivar esta lucidez requiere lentitud, lecturas plurales y el hábito de suspender el juicio hasta haber escuchado las razones del desacuerdo. Solo una ciudadanía entrenada en la duda metódica es capaz de resistir la seducción de las respuestas simples a problemas profundamente intrincados.'
      }
    ],
    keyQuote: 'Quien piensa con rigor contempla el error no como una derrota, sino como la corrección indispensable de una brújula en viaje.',
    discussionPrompts: [
      '¿Qué prejuicio o certeza personal ha cambiado en ti durante el último año tras una reflexión detenida?',
      '¿De qué manera podemos enseñarnos a pausar el impulso de juzgar ante noticias diseñadas para provocar indignación inmediata?'
    ]
  },
  {
    id: 'colaboracion',
    number: '03',
    title: 'Sinfonía de inteligencias',
    subtitle: 'La superación del mito del creador solitario',
    readingTime: '3 min de lectura',
    durationSecondsEstimate: 165,
    epigraph: {
      quote: 'Ningún problema de envergadura humana ha sido resuelto jamás por una mente en soledad.',
      author: 'Teoría de la Acción Compartida'
    },
    paragraphs: [
      {
        id: 0,
        text: 'La modernidad ensalzó con desmesura la figura del héroe aislado: el científico solitario en su desván, el líder providencial o el artista ermitaño. Pero si examinamos con detenimiento los grandes saltos de la humanidad, descubrimos que cada conquista ha sido el fruto de una vasta polifonía de esfuerzos entrelazados.',
        marginalNote: 'El desmontaje del individualismo épico.'
      },
      {
        id: 1,
        text: 'Colaborar no es meramente repartirse tareas mecánicas como quien divide una carga. La colaboración genuina ocurre cuando el encuentro entre dos o más mentes engendra una comprensión cualitativamente nueva, inaccesible para cualquiera de los participantes por separado.',
        marginalNote: 'La emergencia de lo inédito.'
      },
      {
        id: 2,
        text: 'Para que este milagro colectivo acontezca, es imprescindible deponer la soberbia del protagonismo. Cooperar exige vulnerabilidad: exponer ideas incompletas para que otros las pulan, admitir las propias lagunas y alegrarse con el acierto ajeno como si fuese propio.',
        isPullQuote: true
      },
      {
        id: 3,
        text: 'En un mundo amenazado por el aislamiento atomizado, el trabajo en común es una escuela cívica. Enseña a escuchar con atención generosa, a negociar con respeto los disensos y a recordar que nuestra fuerza nunca reside en la autosuficiencia, sino en la urdimbre de nuestras dependencias mutuas.'
      }
    ],
    keyQuote: 'Colaborar exige la valentía de exponer ideas incompletas para que otros las fecunden y pulan con generosidad.',
    discussionPrompts: [
      '¿Qué condiciones emocionales y de confianza hacen posible que un equipo se atreva a proponer ideas arriesgadas?',
      '¿Cómo equilibrar el reconocimiento del esfuerzo individual con la celebración de los logros colectivos?'
    ]
  },
  {
    id: 'sociedad',
    number: '04',
    title: 'El tejido de la empatía',
    subtitle: 'Bienes comunes, convivencia y pacto intergeneracional',
    readingTime: '4 min de lectura',
    durationSecondsEstimate: 190,
    epigraph: {
      quote: 'La sociedad no es un contrato de conveniencia, sino un compromiso sagrado entre quienes fueron, quienes son y quienes vendrán.',
      author: 'Meditaciones sobre la Polis'
    },
    paragraphs: [
      {
        id: 0,
        text: 'Una sociedad no es un simple agregado de voluntades individuales unidas por el cálculo mercantil. Es, ante todo, una densa red de cuidados invisibles: el maestro que enseña con devoción, el médico que vela en la noche, el trabajador que sostiene los servicios elementales y la memoria de quienes nos precedieron abriendo caminos que hoy transitamos sin reparar en su costo.',
        marginalNote: 'La infraestructura invisible del cuidado.'
      },
      {
        id: 1,
        text: 'La fragilidad de la convivencia se hace evidente cuando el individualismo voraz erosiona la noción de lo común: los parques, las plazas, la salud pública, la palabra empeñada y el silencio de las bibliotecas. Cuando lo colectivo se degrada a botín de partes, la soledad se convierte en la enfermedad endémica de la época.',
        marginalNote: 'La custodia de lo que pertenece a todos.'
      },
      {
        id: 2,
        text: 'Recuperar el sentido de la sociedad implica reactivar la empatía cívica: la capacidad de sentir como propia la herida ajena y de legislar no para el beneficio coyuntural del presente, sino con la mirada puesta en las generaciones que aún no tienen voz ni voto.',
        isPullQuote: true
      },
      {
        id: 3,
        text: 'La civilización no se mide por la altura de sus rascacielos ni por la velocidad de sus procesadores, sino por la ternura y la dignidad con la que ampara a sus miembros más vulnerables. Cuidar de la sociedad es, en definitiva, comprender que el destino de cada uno de nosotros está indisolublemente anudado al destino de todos.'
      }
    ],
    keyQuote: 'La civilización se mide por la dignidad con la que ampara a sus miembros más vulnerables y por su compromiso con quienes aún no tienen voz.',
    discussionPrompts: [
      '¿Qué pequeños gestos cotidianos refuerzan el tejido comunitario en el vecindario o lugar de trabajo?',
      '¿Qué decisiones tomadas hoy expresan verdadera responsabilidad con las generaciones del siglo XXII?'
    ]
  }
];
