
export const competenceAreas = [
  {
    id: 1,
    name: "Digital Marketing",
    description: "Strategie e tecniche per il marketing digitale moderno",
    icon: "target",
    color: "blue",
    topics: [
      {
        id: 1,
        name: "Social Media Marketing",
        description: "Gestione professionale dei social media",
        courses: [
          {
            id: 1,
            title: "Instagram Marketing per Business",
            description: "Impara a utilizzare Instagram per far crescere il tuo business con strategie comprovate",
            duration: "2h 30min",
            participants: 1250,
            progress: 65,
            type: "video",
            image: "photo-1611224923853-80b023f02d71",
            level: "Intermedio"
          },
          {
            id: 2,
            title: "LinkedIn per Professionisti",
            description: "Costruisci la tua presenza professionale su LinkedIn",
            duration: "1h 45min",
            participants: 890,
            progress: 30,
            type: "arcade",
            image: "photo-1516321318423-f06f85e504b3",
            level: "Principiante"
          }
        ]
      },
      {
        id: 2,
        name: "Content Marketing",
        description: "Creazione di contenuti efficaci",
        courses: [
          {
            id: 3,
            title: "Storytelling per Brand",
            description: "L'arte del racconto applicata al marketing aziendale",
            duration: "3h 15min",
            participants: 750,
            type: "text",
            image: "photo-1552664730-d307ca884978",
            level: "Avanzato"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Leadership & Management",
    description: "Sviluppo delle competenze manageriali e di leadership",
    icon: "users",
    color: "green",
    topics: [
      {
        id: 3,
        name: "Team Management",
        description: "Gestione efficace dei team",
        courses: [
          {
            id: 4,
            title: "Remote Team Leadership",
            description: "Guidare team distribuiti nell'era del lavoro remoto",
            duration: "2h 20min",
            participants: 650,
            progress: 80,
            type: "video",
            image: "photo-1600880292203-757bb62b4baf",
            level: "Intermedio"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Tecnologia & Innovazione",
    description: "Competenze tecniche e innovazione digitale",
    icon: "laptop",
    color: "purple",
    topics: [
      {
        id: 4,
        name: "Intelligenza Artificiale",
        description: "Introduzione all'AI per business",
        courses: [
          {
            id: 5,
            title: "AI per il Business",
            description: "Come l'intelligenza artificiale può trasformare la tua azienda",
            duration: "4h 10min",
            participants: 420,
            type: "arcade",
            image: "photo-1677442136019-21780ecad995",
            level: "Avanzato"
          }
        ]
      }
    ]
  }
];

export const userStats = {
  coursesCompleted: 12,
  hoursLearned: 45,
  certificatesEarned: 8,
  currentStreak: 7
};

export const recentActivity = [
  {
    id: 1,
    type: "course_completed",
    title: "Instagram Marketing per Business",
    timestamp: "2 ore fa",
    points: 50
  },
  {
    id: 2,
    type: "certificate_earned",
    title: "Certificato Digital Marketing Base",
    timestamp: "1 giorno fa",
    points: 100
  },
  {
    id: 3,
    type: "course_started",
    title: "LinkedIn per Professionisti",
    timestamp: "3 giorni fa",
    points: 10
  }
];
