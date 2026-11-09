# Portfolio — Informatique & Intelligence artificielle

Portfolio personnel en **HTML5, CSS3 et JavaScript natif**. Aucun framework, aucune compilation, aucun serveur Node.js.

## Lancer le site
Ouvrez `index.html` dans un navigateur moderne. C'est tout.

> Optionnel : pour tester l'envoi du formulaire ou une API de monitoring, servez le dossier en HTTP (ex. `python3 -m http.server`), certains services refusant les requêtes depuis `file://`.

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

## Personnaliser
Tout se fait dans **`js/data.js`** :

| Clé | Rôle |
| --- | --- |
| `profile` | Nom, initiales, titres, photo, chemin du CV (`cv: "assets/cv.pdf"` active le bouton de téléchargement) |
| `about` | Texte de présentation, centres d'intérêt, objectifs, spécialisations, illustration |
| `skills` / `skillLevelMax` | Compétences par catégorie. `level: null` = « à définir », sinon un entier de 1 à 5 |
| `ai` | Domaines IA et emplacements du laboratoire (modèles, projets, outils, expérimentations, démos) |
| `projects` | Fiches projets — copiez un bloc pour en ajouter un |
| `homelab` | Schéma (`tiers`), machines, projets d'administration, `monitoringApi` |
| `timeline` | Parcours (formation, expériences, projets, objectifs) |
| `contact` | Email, liens, `formEndpoint` |

Les champs vides affichent « À compléter » ou masquent l'élément (liens GitHub/démo, réseaux) : aucun faux lien n'est généré.

### Ajouter un projet
Ajoutez un objet dans `projects` avec un `id` unique, une ou plusieurs `categories` parmi `ia, dev, linux, cyber, reseau, electronique`, puis les champs de détail (`context`, `objectives`, `features`, `challenges`, `solutions`, `improvements`, `images`, `github`, `demo`). Images à placer dans `assets/projects/`.

## Fonctionnalités nécessitant un service externe
- **Formulaire de contact** : un site statique ne peut pas envoyer d'email seul. Renseignez `contact.formEndpoint` avec l'URL d'un service (Formspree, Getform…) ou de votre propre API acceptant un POST `FormData`. Sans service, le message **n'est pas envoyé** et le visiteur se voit proposer d'ouvrir sa messagerie (si `contact.email` est renseigné) ou de copier son message.
- **Supervision du homelab** : renseignez `homelab.monitoringApi` avec une URL renvoyant `[{ "id": "rpi", "status": "up" }]` (CORS autorisé). Sans API, aucun état n'est affiché.

## Accessibilité & performance
HTML sémantique, navigation au clavier, `:focus-visible`, modale native `<dialog>`, attributs ARIA, respect de `prefers-reduced-motion`, animation des particules suspendue hors écran, images en `loading="lazy"`.
