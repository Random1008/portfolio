/* =====================================================================
   DONNÉES DU PORTFOLIO
   ---------------------------------------------------------------------
   C'est le seul fichier à modifier pour personnaliser le contenu.
   - Une chaîne vide ("") ou une liste vide ([]) affiche « À compléter »
     ou masque l'élément (liens, boutons).
   - Aucune donnée personnelle n'est inventée : remplissez les champs.
   - Les chemins (images, CV) sont relatifs au dossier portfolio/.
   ===================================================================== */
window.PORTFOLIO = {

  /* ---------- Identité ---------- */
  profile: {
    name: "Flavio GARDONI",                 // ex. "Prénom Nom"
    initials: "FG",             // ex. "PN" — sinon le logo affiche </>
    title: "Passionné d'informatique et d'intelligence artificielle",
    titleHighlight: "intelligence artificielle",
    subtitle: "Développement, systèmes informatique, technologies intelligentes.",
    intro: "Je conçois des projets personnels autour du développement logiciel, des systèmes Linux, des réseaux et de l'IA — du homelab aux agents intelligents.",
    photo: "asset/img/moi.png", // banniere Mon profil 
    cv: "asset/document/CV_6adb3f7661d04.pdf"                    // ex. "assets/cv.pdf" — active le bouton « Télécharger mon CV »
  },

  /* ---------- Terminal de la page d'accueil ---------- */
  terminal: [
    { cmd: "whoami", out: ["Flavio GARDONI"] },
    { cmd: "ls ~/domaines", out: ["dev/  ia/  linux/  homelab/  electronique/"] },
    { cmd: "cat objectif.txt", out: ["Continuer à progresser et concevoir des projets innovants."] }
  ],

  /* ---------- À propos ---------- */
  about: {
    paragraphs: [
      "Passionné par l'informatique et l'ia.",
      "J'aime apprendre de nouvelles technologies, expérimenter des solutions et développer des projets afin d'améliorer mes compétences techniques.",
      "Mon objectif est de continuer à progresser dans les domaine que je connais et en apprendre de nouveaux."
    ],
    interests: ["Développement logiciel", "Intelligence artificielle / LLM", "Linux", "Réseaux", "Cybersécurité", "Électronique"],
    goals: ["Continuer à progresser dans les domaine informatique que je connais", "Concevoir des projets", "apprendre toujours plus de competences techniques"],
    specialties: ["homelab", "Automatisation", "agents IA", "Électronique embarquée (Raspberry Pi, ESP32)"],
    illustration: ""          // ex. "assets/images/univers.jpg"
  },

  /* ---------- Compétences ----------
     level : null = non renseigné, sinon un entier de 1 à skillLevelMax. */
  skillLevelMax: 5,
  skills: [
    { category: "Développement", items: [
      { name: "Python", icon: "file-code", description: "Scripts, automatisation et projets IA.", level: null },
      { name: "HTML", icon: "code-xml", description: "Structure sémantique et accessible des pages web.", level: null },
      { name: "CSS", icon: "palette", description: "Mise en page, responsive design et animations.", level: null },
      { name: "Bash", icon: "terminal", description: "Scripts shell et automatisation système.", level: null },
      { name: "Git", icon: "git-branch", description: "Gestion de versions et collaboration.", level: null }
    ]},
    { category: "Linux", items: [
      { name: "Linux", icon: "terminal", description: "Administration et utilisation au quotidien.", level: null },
      { name: "Arch Linux", icon: "layers", description: "Installation et configuration d'un système sur mesure.", level: null },
      { name: "Docker", icon: "box", description: "Conteneurisation et déploiement de services.", level: null }
    ]},
    { category: "Intelligence artificielle", items: [
      { name: "LLM", icon: "message", description: "Utilisation et intégration de modèles de langage.", level: null },
      { name: "Machine learning", icon: "cpu", description: "Bases de l'apprentissage automatique.", level: null },
      { name: "Automatisation", icon: "workflow", description: "Enchaînement de tâches et workflows intelligents.", level: null },
      { name: "Agents IA", icon: "bot", description: "Assistants capables d'agir avec des outils.", level: null }
    ]},
    { category: "Réseau", items: [
      { name: "SSH", icon: "key", description: "Accès distant sécurisé aux machines.", level: null },
      { name: "VPN", icon: "lock", description: "Connexions chiffrées vers le réseau local.", level: null }
    ]},
    { category: "Cybersécurité", items: [
      { name: "Pentest", icon: "shield", description: "Tests d'intrusion dans un cadre légal.", level: null },
      { name: "Reverse engineering", icon: "search", description: "Analyse du fonctionnement de programmes.", level: null }
    ]},
    { category: "Électronique", items: [
      { name: "Raspberry Pi", icon: "circuit", description: "Serveurs, applications et automatisation.", level: null },
      { name: "ESP32", icon: "circuit", description: "Serveurs, applications et automatisation.", level: null }
    ]}
  ],

  /* ---------- Intelligence artificielle ---------- */
  ai: {
    domains: [
      { title: "Modèles de langage", icon: "message", description: "Compréhension et utilisation des LLM pour générer, résumer et raisonner." },
      { title: "IA locale", icon: "server", description: "Exécution de modèles sur mes propres machines, sans dépendre du cloud." },
      { title: "Agents autonomes", icon: "bot", description: "Assistants capables de planifier et d'utiliser des outils." },
      { title: "Automatisation", icon: "workflow", description: "Workflows qui enchaînent des tâches répétitives." },
      { title: "API IA", icon: "plug", description: "Intégration de services d'IA dans des applications." },
      { title: "Python", icon: "file-code", description: "Le langage de base de mes expérimentations." },
      { title: "Machine learning", icon: "cpu", description: "Entraînement et évaluation de modèles." },
      { title: "Applications intelligentes", icon: "sparkles", description: "Des outils concrets qui intègrent l'IA." }
    ],
    lab: {
      intro: "creation et decouverte de fonctionnement",    // présentation de vos expérimentations avec l'IA
      models: ["opus 5.5", "sonnet 5", "deepseek v4 flash", "Qwen3.8 OBLITERATED"],             // ex. ["Nom du modèle — usage"]
      projects: ["infoduo - duolingo mais pour la tech", "knowledge os - obsidian mais optimiser pour l'ia", "random agent - agent ia baser sur deepseek harness", "arc browser - un navigateur web 100% personalisable baser sur chromium",],
      tools: ["Claude desktop", "terminal agent hermes", "code oss", "brave browser", "photocraft", "canva",],
      experiments: ["test du models chatgpt-oss-120B sur une Radeon RX 9060 XT 16Go", "test d'un model 1B sur un raspberry pi 4 2Go",],
      ideas: ["cree un model ia from scratch et le mettre dans une cle style cyberpunk",],
      demos: []               // ex. [{ label: "Démo", url: "https://..." }]
    }
  },

  /* ---------- Projets ---------- */
  projectCategories: [
    { id: "all", label: "Tous" },
    { id: "ia", label: "Intelligence artificielle" },
    { id: "dev", label: "Développement" },
    { id: "linux", label: "Linux" },
    { id: "cyber", label: "Cybersécurité" },
    { id: "reseau", label: "Réseau" },
    { id: "electronique", label: "Électronique" }
  ],
  /* Modèle d'un projet — copiez un bloc pour en ajouter un.
     image / images : chemins vers assets/projects/...
     github / demo : laissez "" pour masquer le lien. */
  projects: [
    {
      id: "homelab", title: "Homelab personnel", icon: "home",
      categories: ["linux", "reseau"],
      description: "Infrastructure informatique personnelle : Raspberry Pi, Docker, services réseau et monitoring.",
      tech: ["Raspberry Pi", "Docker", "Linux", "Réseau"],
      image: "asset/img/homelab.png", images: [], github: "", demo: "",
      context: "Infrastructure chez moi pour apprendre plusieurs logiciel et systeme",
      objectives: ["Héberger mes propres services", "Pratiquer l'administration Linux", "Superviser les machines"],
      features: ["Infrastructure informatique", "Raspberry Pi", "Conteneurs Docker", "Services réseau", "Monitoring", "Administration Linux"],
      challenges: [], solutions: [], improvements: []
    },
    {
      id: "assistant-ia", title: "Assistant IA personnel", icon: "bot",
      categories: ["ia", "dev"],
      description: "Assistant basé sur des agents intelligents et des modèles de langage pour automatiser des tâches.",
      tech: ["Python", "LLM", "Agents IA"],
      image: "", images: [], github: "", demo: "",
      context: "Projet d'expérimentation autour des agents intelligents et des modèles de langage.",
      objectives: ["Automatiser des tâches du quotidien", "Expérimenter les agents IA"],
      features: ["Agents intelligents", "Automatisation", "Modèles de langage"],
      challenges: [], solutions: [], improvements: []
    },
    {
      id: "homelab-control-center", title: "Homelab Control Center", icon: "dashboard",
      categories: ["dev", "linux"],
      description: "Interface de gestion du homelab : dashboard, monitoring et gestion des services.",
      tech: ["HTML", "CSS", "JavaScript"],
      image: "", images: [], github: "", demo: "",
      context: "Centraliser la gestion du homelab dans une seule interface.",
      objectives: ["Visualiser l'état des machines", "Gérer les services depuis un tableau de bord"],
      features: ["Interface de gestion", "Dashboard", "Monitoring", "Gestion des services"],
      challenges: [], solutions: [], improvements: []
    },
    {
      id: "raspberry-pi", title: "Projets Raspberry Pi", icon: "circuit",
      categories: ["electronique", "linux"],
      description: "Serveurs, applications et automatisation sur Raspberry Pi.",
      tech: ["Raspberry Pi", "Linux", "Python"],
      image: "", images: [], github: "", demo: "",
      context: "Utilisation du Raspberry Pi comme plateforme d'expérimentation.",
      objectives: ["Héberger des serveurs légers", "Automatiser des tâches"],
      features: ["Serveurs", "Applications", "Automatisation"],
      challenges: [], solutions: [], improvements: []
    },
    {
      id: "esp32", title: "Projets ESP32", icon: "radio",
      categories: ["electronique"],
      description: "Électronique, capteurs et IoT : automatisation et applications connectées.",
      tech: ["ESP32", "Capteurs", "IoT"],
      image: "", images: [], github: "", demo: "",
      context: "Projets d'électronique embarquée autour du microcontrôleur ESP32.",
      objectives: ["Lire et exploiter des capteurs", "Créer des objets connectés"],
      features: ["Électronique", "Capteurs", "IoT", "Automatisation", "Applications"],
      challenges: [], solutions: [], improvements: []
    }
  ],

  /* ---------- Homelab ----------
     monitoringApi : URL d'une API JSON renvoyant [{ "id": "rpi", "status": "up" | "down" }].
     Laissée vide, aucune donnée de supervision n'est affichée. */
  homelab: {
    monitoringApi: "",
    tiers: [["internet"], ["routeur"], ["switch"], ["rpi", "serveur", "nas"]],
    network: {
      internet: { label: "Internet", icon: "globe" },
      routeur: { label: "Routeur / pare-feu", icon: "router" },
      switch: { label: "Switch", icon: "network" }
    },
    machines: [
      { id: "rpi", name: "Raspberry Pi", icon: "circuit", type: "Nano-ordinateur",
        description: "", role: "Services légers & automatisation", os: "", services: [] },
      { id: "serveur", name: "Serveur", icon: "server", type: "Serveur",
        description: "", role: "Hébergement de conteneurs Docker", os: "", services: [] },
      { id: "nas", name: "NAS", icon: "drive", type: "Stockage réseau",
        description: "", role: "Stockage & sauvegardes", os: "", services: [] }
    ],
    adminProjects: [
      { title: "Administration Linux", icon: "terminal", description: "" },
      { title: "Monitoring", icon: "activity", description: "" },
      { title: "Services réseau", icon: "network", description: "" },
      { title: "Conteneurisation Docker", icon: "box", description: "" }
    ]
  },

  /* ---------- Parcours ----------
     Aucun diplôme ni expérience n'est inventé : complétez les entrées. */
  timeline: [
    { date: "", category: "Formation", icon: "graduation", title: "Formation", description: "" },
    { date: "", category: "Expérience", icon: "briefcase", title: "Expérience", description: "" },
    { date: "", category: "Projet personnel", icon: "home", title: "Homelab personnel", description: "Mise en place d'une infrastructure : Raspberry Pi, Docker, services réseau et monitoring." },
    { date: "", category: "Projet personnel", icon: "bot", title: "Assistant IA personnel", description: "Expérimentation autour des agents intelligents, de l'automatisation et des modèles de langage." },
    { date: "", category: "Apprentissage", icon: "book", title: "Linux & Arch Linux", description: "Administration système, scripts Bash et configuration d'un environnement sur mesure." },
    { date: "", category: "Objectif", icon: "target", title: "Objectif professionnel", description: "Continuer à progresser dans le domaine informatique et concevoir des projets innovants." }
  ],

  /* ---------- Contact ----------
     formEndpoint : URL d'un service d'envoi (ex. Formspree, Getform, ou votre API).
     Le formulaire y envoie les données en POST. Vide = aucun envoi, alternative proposée. */
  contact: {
    email: "",
    formEndpoint: "",
    links: [
      { label: "GitHub", icon: "github", url: "" },
      { label: "LinkedIn", icon: "linkedin", url: "" }
      // { label: "Autre réseau", icon: "link", url: "https://..." }
    ]
  }
};
