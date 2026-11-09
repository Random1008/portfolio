# Portfolio — Informatique & Intelligence artificielle

Portfolio personnel en **HTML5, CSS3 et JavaScript natif**. Aucun framework, aucune compilation, aucun serveur Node.js.

## Structure
```
portfolio/
├── index.html            Accueil : hero, à propos, compétences, IA, projets, homelab, parcours, contact
├── pages/
│   ├── projets.html      Galerie complète + filtres (?projet=<id> ouvre directement une fiche)
│   ├── homelab.html      Schéma, équipements, services, projets d'administration
│   └── contact.html      Canaux + formulaire
├── css/
│   ├── industry.css      Design system (tokens, boutons, cartes, champs)
│   ├── style.css         Thème sombre/clair, mise en page, composants du site
│   ├── animations.css    Apparitions, transitions de filtres, modale
│   └── responsive.css    Tablette / smartphone
├── js/
│   ├── data.js           ← TOUT LE CONTENU MODIFIABLE
│   ├── icons.js          Icônes Lucide (SVG)
│   ├── main.js           Utilitaires, en-tête, pied de page, thème, menu mobile, sections
│   ├── projects.js       Cartes projets + modale de détail
│   ├── filters.js        Filtres par catégorie
│   ├── homelab.js        Schéma, équipements, supervision
│   ├── contact.js        Canaux + formulaire
│   └── animations.js     Scroll reveal, terminal, particules
└── assets/               images/, icons/, projects/ (à remplir)
```