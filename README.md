# 🏟️ Heroes Arena - Ultimate Edition

> **Un jeu de combat de héros web moderne avec système d'authentification cloud et architecture SCSS modulaire**

[![Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![Netlify Status](https://img.shields.io/badge/netlify-deployed-success.svg)](https://heroes-arena.netlify.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SCSS](https://img.shields.io/badge/SCSS-Modular-ff69b4.svg)](https://sass-lang.com/)

Heroes Arena est un jeu de combat de héros web interactif où vous créez des personnages personnalisés avec 6 classes uniques, les faites combattre dans une arène épique, et progressez à travers un système de badges et de niveaux. Le tout avec une sauvegarde cloud sécurisée et une architecture front-end moderne.

## ✨ Fonctionnalités Principales

### 
🎮 **Gameplay Complet**
- **6 Classes de héros** avec pouvoirs uniques et bonus spécialisés
- **Système de combat** au tour par tour avec animations et effets visuels
- **100 points de statistiques** à répartir librement (Force, Agilité, Magie, Défense)
- **40+ avatars** organisés par classe dans un catalogue interactif
- **Système de progression** avec badges Bronze, Argent et Or
- **Calcul intelligent des PV** basé sur Force + Défense × 2.5

### 🔐 **Authentification & Cloud**
- **Système d'authentification** complet avec connexion/inscription
- **Visibilité des mots de passe** avec bouton toggle 👁️/🙈
- **Persistance des formulaires** - les données restent même après rechargement
- **Sauvegarde cloud** automatique via Netlify Functions
- **Synchronisation** en temps réel entre appareils
- **Mode hors ligne** avec sauvegarde locale

### 🎨 **Interface Moderne**
- **Design glassmorphism** avec thème sombre immersif
- **Architecture SCSS modulaire** avec variables et mixins
- **Interface responsive** optimisée mobile et desktop
- **Animations CSS** fluides et micro-interactions
- **Raccourcis clavier** pour navigation rapide

### ⚙️ **Architecture Technique**
- **ES6+ Modules** avec imports/exports natifs
- **POO JavaScript** avec classes héritées
- **API REST** avec Netlify Functions
- **LocalStorage & SessionStorage** pour la persistance
- **Compilation SCSS** avec watch mode et sourcemaps

## 🚀 Démo en Ligne

🌐 **[Jouer maintenant sur Netlify](https://heroes-arena.netlify.app)**

*Créez vos héros, combattez dans l'arène, et sauvegardez votre progression dans le cloud !*

## 🏗️ Architecture du Projet

```
heroes-arena/
├── 🌐 Frontend
│   ├── index.html              # Application principale
│   ├── auth.html              # Page d'authentification
│   ├── css/                   # CSS compilé
│   │   ├── style.css         # Styles principaux compilés
│   │   └── style.css.map     # Source maps pour débogage
│   ├── js/                    # Architecture modulaire ES6+
│   │   ├── main.js           # Point d'entrée principal
│   │   ├── app-loader.js     # Chargeur d'application
│   │   ├── init.js           # Initialisation et événements
│   │   ├── core/             # Modules fondamentaux
│   │   │   ├── classes.js    # Classes POO (Hero, Guerrier, Mage, etc.)
│   │   │   ├── config.js     # Configuration globale et catalogues
│   │   │   └── utils.js      # Fonctions utilitaires
│   │   └── modules/          # Modules métier
│   │       ├── auth.js       # Authentification backend
│   │       ├── auth-ui.js    # Interface d'authentification
│   │       ├── data.js       # Gestion données et persistance
│   │       ├── ui.js         # Interface utilisateur et modales
│   │       ├── combat.js     # Logique de combat
│   │       └── combat-effects.js # Effets visuels combat
│   └── images/               # Assets visuels
│       └── [40+ avatars]     # Collection d'avatars par classe
│
├── 🎨 Styles (Architecture SCSS)
│   ├── scss/                 # Sources SCSS modulaires
│   │   ├── main.scss        # Point d'entrée et imports
│   │   ├── abstracts/       # Variables et outils
│   │   │   ├── _variables.scss   # Couleurs, tailles, z-index
│   │   │   └── _mixins.scss     # Mixins (glass-effect, flex-center, etc.)
│   │   ├── base/            # Fondations
│   │   │   ├── _reset.scss      # Reset CSS moderne
│   │   │   └── _animations.scss # Animations globales
│   │   ├── components/      # Composants UI réutilisables
│   │   │   ├── _auth.scss       # Modal d'authentification
│   │   │   ├── _buttons.scss    # Système de boutons
│   │   │   ├── _modal.scss      # Modales (héros, combat, résultats)
│   │   │   ├── _hero-card.scss  # Cartes de héros
│   │   │   ├── _arena.scss      # Interface de combat
│   │   │   ├── _forms.scss      # Formulaires de création
│   │   │   └── _combat-log.scss # Journal de combat
│   │   ├── layout/          # Structure et mise en page
│   │   │   ├── _header.scss     # En-tête avec navigation
│   │   │   ├── _main.scss       # Zone de contenu principal
│   │   │   └── _navigation.scss # Navigation et menus
│   │   └── utilities/       # Utilitaires
│   │       ├── _helpers.scss    # Classes d'aide (flex, text, etc.)
│   │       └── _responsive.scss # Breakpoints responsive
│   └── css/                 # CSS compilé automatiquement
│
├── ☁️ Backend (Serverless)
│   └── netlify/
│       └── functions/       # API Netlify Functions
│           ├── auth.js      # Endpoints authentification
│           └── heroes.js    # Endpoints gestion héros
│
└── ⚙️ Configuration
    ├── package.json         # Scripts NPM et dépendances
    ├── netlify.toml        # Configuration déploiement
    └── README.md           # Documentation complète
```

## 🎯 Classes de Héros (POO JavaScript)

### ⚔️ **Guerrier** - Maître de la Rage
- **Bonus** : +20% Force (spécialisation corps à corps)
- **Pouvoir** : *Rage Berserker* - +50% dégâts, -30% défense (3 tours)
- **Style** : Tank offensif, haute résistance
- **Avatars** : warrior1-4, knight1-2, barbarian1, berserker1

### 🔮 **Mage** - Seigneur des Arcanes
- **Bonus** : +20% Magie (maître des sortilèges)
- **Pouvoir** : *Bouclier Magique* - Absorbe les dégâts (4 tours)
- **Style** : DPS magique, contrôle du champ de bataille
- **Avatars** : mage1-2, wizard1-2, sorcerer1, necromancer1, witch1, warlock1

### 🏹 **Archer** - Expert en Tirs de Précision
- **Bonus** : +20% Agilité (maître de la précision)
- **Pouvoir** : *Tir Multiple* - 2-3 flèches consécutives
- **Style** : DPS à distance, critique élevé
- **Avatars** : archer1-2, ranger1-2, hunter1, scout1, bowman1, marksman1

### 🛡️ **Paladin** - Gardien Guérisseur
- **Bonus** : +20% Défense (protecteur ultime)
- **Pouvoir** : *Aura de Guérison* - Régénération PV (4 tours)
- **Style** : Tank défensif, support
- **Avatars** : paladin1-2, cleric1-2, priest1, templar1, crusader1, guardian1

### 🗡️ **Assassin** - Maître de l'Ombre
- **Bonus** : +20% Agilité (spécialisation furtivité)
- **Pouvoir** : *Attaque Sournoise* - Double dégâts critiques
- **Style** : Burst damage, esquive élevée
- **Avatars** : rogue1, warrior3, scout1, hunter1, ranger2, fighter1, adventurer1, marksman1

### 🌿 **Druide** - Gardien de la Nature
- **Bonus** : +10% Magie, +10% Défense (équilibre naturel)
- **Pouvoir** : *Forme Animale* - Transformation temporaire
- **Style** : Hybride magie/défense, polyvalent
- **Avatars** : monk1, cleric1, priest1, hero2, mage2, wizard2, guardian1, hero4

## 🎮 Guide de Jeu Complet

### 🏗️ **Création de Héros**
1. **Choisissez une classe** selon votre style (6 options disponibles)
2. **Répartissez 100 points** entre les 4 statistiques :
   - **Force** : Dégâts physiques et PV
   - **Agilité** : Vitesse d'attaque et esquive
   - **Magie** : Dégâts magiques et pouvoirs
   - **Défense** : Résistance aux dégâts et PV
3. **Sélectionnez un avatar** dans le catalogue (40+ options)
4. **Nommez votre héros** et validez la création

### ⚔️ **Système de Combat**
- **Tour par tour** : Les héros attaquent en alternance
- **Calcul des dégâts** : `max(1, Attaque - floor(Défense × 0.5))`
- **Points de Vie** : `(Force + Défense) × 2.5`
- **Pouvoirs spéciaux** : Se déclenchent automatiquement selon les conditions
- **Animations visuelles** : Effets de combat immersifs

### 🏆 **Système de Progression**
- **🥉 Bronze** : 5 victoires → Bordure bronze, titre "Combattant"
- **🥈 Argent** : 10 victoires → Bordure argent animée, titre "Vétéran"
- **🥇 Or** : 20 victoires → Bordure or prestigieuse, titre "Champion"

### ⌨️ **Raccourcis Clavier**
- `Ctrl + 1` : Ouvrir création de héros
- `Ctrl + 2` : Afficher mes héros
- `Ctrl + 3` : Aller à l'arène
- `Échap` : Fermer les modales
- `Entrée` : Valider les formulaires

## 🛠️ Installation & Développement

### 📋 **Prérequis**
- **Node.js** 18+
- **npm** ou **yarn**
- **Sass CLI** (compilation des styles)
- **Netlify CLI** (développement local avec functions)

### 🚀 **Installation Rapide**

```bash
# 1. Cloner le repository
git clone https://github.com/your-username/heroes-arena.git
cd heroes-arena

# 2. Installer les dépendances
npm install

# 3. Première compilation des styles
npm run sass:build

# 4. Démarrer le serveur de développement
npm run dev

# 5. En parallèle (nouveau terminal) : Watch SCSS
npm run sass:dev
```

L'application sera accessible sur **`http://localhost:8888`**

### 🧪 **Commandes de Développement**

```bash
# Serveur de développement avec Netlify Functions
npm run dev

# 🎨 Compilation SCSS
npm run sass:build        # Build CSS compressé pour production
npm run sass:watch        # Watch mode basique
npm run sass:dev          # Watch avec source maps (développement)

# 📦 Build et Tests
npm run build             # Build du projet
npm test                 # Tests unitaires

# 🚀 Déploiement
npm run deploy           # Déploiement Netlify production
```

### 🎨 **Workflow de Développement SCSS**

```bash
# Terminal 1 : Serveur Netlify
npm run dev

# Terminal 2 : Compilation SCSS en temps réel
npm run sass:dev

# Les modifications SCSS sont compilées automatiquement
# Le navigateur se recharge automatiquement via Netlify Dev
```

### 🔧 **Configuration Netlify**

Le projet utilise **Netlify Functions** pour l'API backend :

```toml
# netlify.toml
[build]
  publish = "."
  functions = "netlify/functions"

[dev]
  functions = "netlify/functions"
  port = 8888
  framework = "#static"
```

## 🔐 Configuration Authentification

### Variables d'Environnement

Pour le développement local, créez `.env` :

```env
# Base de données (exemple avec Supabase)
DATABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your-super-secret-jwt-key

# Email (optionnel, pour reset password)
EMAIL_API_KEY=your_email_service_key
```

### Backend Options

Le système d'authentification supporte :
- **Netlify Identity** (recommandé pour simplicité)
- **Supabase** (base de données complète)
- **Firebase Auth** (écosystème Google)
- **Custom API** (backend personnalisé)

## 🎨 Personnalisation Avancée

### 🖼️ **Ajouter des Avatars**

1. **Ajoutez vos images** dans le dossier `images/`
2. **Modifiez le catalogue** dans `js/core/config.js` :

```javascript
export const avatarCatalog = {
    guerriers: [
        'warrior1.png', 'warrior2.png',
        'mon-nouveau-guerrier.png' // ← Votre avatar
    ],
    // ... autres classes
};
```

### 🆕 **Créer une Nouvelle Classe**

1. **Étendez la classe Hero** dans `js/core/classes.js` :

```javascript
export class Ninja extends Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        super(nom, avatar, 'Ninja', force, agility, magic, defense);
    }
    
    activatePower() {
        // Pouvoir spécial : Invisibilité
        this.invisible = true;
        this.esquiveBonus = 50;
        this.powerActive = true;
        this.powerDuration = 3;
        
        return {
            type: 'invisibilité',
            message: `${this.nom} disparaît dans l'ombre !`,
            effect: 'Esquive +50% pendant 3 tours'
        };
    }
}
```

2. **Ajoutez la configuration** dans `js/core/config.js` :

```javascript
export const classInfo = {
    'Ninja': {
        title: 'Ninja - Maître de l\'Ombre',
        desc: 'Bonus de +20% en Agilité. Expert en furtivité.',
        power: 'Invisibilité',
        powerDesc: 'Devient invisible et augmente l\'esquive de 50% pendant 3 tours.',
        bonusStat: 'agility',
        bonusPercent: 20
    }
};
```

3. **Ajoutez les avatars** correspondants dans le catalogue

### 🎨 **Personnaliser le Design SCSS**

#### **Variables principales**
```scss
// scss/abstracts/_variables.scss

// 🎨 Couleurs principales
$primary-purple: #7c3aed;
$primary-gold: #f59e0b;
$primary-bronze: #cd7f32;

// 🌙 Backgrounds sombres
$bg-primary: #0f172a;
$bg-secondary: #1e293b;
$bg-card: rgba(255, 255, 255, 0.05);

// 🎪 Vos couleurs personnalisées
$custom-primary: #ff6b6b;
$custom-accent: #4ecdc4;
$custom-dark: #2d3748;
```

#### **Mixins utilitaires**
```scss
// scss/abstracts/_mixins.scss

// Effet glassmorphism
@mixin glass-effect($opacity: 0.1) {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, $opacity);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// Centrage flex
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Utilisation dans vos composants
.mon-composant {
  @include glass-effect(0.15);
  @include flex-center;
  // ... autres styles
}
```

#### **Créer un nouveau thème**
```scss
// scss/themes/_custom.scss

// Variables de votre thème
$theme-primary: #e91e63;
$theme-secondary: #9c27b0;
$theme-bg: #121212;

// Override des variables globales
:root {
  --primary-color: #{$theme-primary};
  --secondary-color: #{$theme-secondary};
  --bg-primary: #{$theme-bg};
}
```

## 🧪 Tests et Qualité

### Tests Unitaires
```bash
# Tests des classes et logique métier
npm test

# Tests spécifiques
npm test -- --grep "Hero class"
npm test -- --grep "Combat system"
```

### Tests d'Intégration
```bash
# Tests de l'interface utilisateur
npm run test:integration

# Tests des API Netlify Functions
npm run test:api
```

### Linting et Formatage
```bash
# ESLint (si configuré)
npm run lint

# Prettier (si configuré)  
npm run format

# Vérification SCSS
npm run sass:check
```

## 🚀 Déploiement en Production

### Netlify (Recommandé)

1. **Connectez GitHub** à Netlify
2. **Configuration automatique** via `netlify.toml`
3. **Variables d'environnement** dans l'interface Netlify
4. **Déploiement automatique** sur chaque push

```bash
# Déploiement manuel
npm run sass:build  # Compilation CSS finale
npm run deploy     # Deploy vers Netlify
```

### Autres Plateformes

**Vercel** : Compatible avec adaptation mineure
**GitHub Pages** : Nécessite compilation préalable (pas de Functions)
**Firebase Hosting** : Support complet avec Firebase Functions

## 📊 Monitoring et Analytics

### Métriques de Performance
Le projet inclut le tracking de :
- **Temps de chargement** des pages
- **Interactions utilisateur** (clics, combats)
- **Erreurs JavaScript** et crashes
- **Usage des fonctionnalités** (classes populaires, etc.)

### Analytics (Optionnel)
```html
<!-- Google Analytics dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Dépannage Fréquent

### ❌ **Erreurs de Développement**

**Styles SCSS non compilés**
```bash
# Vérifiez la compilation
npm run sass:build

# Redémarrez le watch
npm run sass:dev
```

**Sass command not found**
```bash
# Installation globale
npm install -g sass

# Ou via npx
npx sass scss/main.scss:css/style.css --watch
```

**Modules ES6 non chargés**
```bash
# Vérifiez le serveur local
npm run dev

# Évitez d'ouvrir index.html directement
```

**Erreurs CORS sur les images**
```bash
# Utilisez le serveur Netlify Dev
npm run dev

# Ou serveur HTTP simple
npx http-server -c-1
```

### ❌ **Erreurs d'Authentification**

**Functions Netlify non accessible**
```bash
# Vérifiez la configuration
cat netlify.toml

# Redémarrez avec functions
npm run dev
```

**Variables d'environnement manquantes**
```bash
# Vérifiez le fichier .env
cat .env

# Ou dans l'interface Netlify pour production
```

### 🐛 **Débogage JavaScript**

```javascript
// Activez les logs détaillés
// js/core/config.js
export const DEBUG = true;

// Console pour diagnostics
console.log('Heroes loaded:', window.HeroesArena?.getAppState?.()?.heroes);
```

## 🤝 Contribution

### Workflow de Contribution

1. **Fork** le projet sur GitHub
2. **Clone** votre fork localement
3. **Créez une branche** : `git checkout -b feature/ma-fonctionnalite`
4. **Développez** en suivant les conventions
5. **Testez** vos modifications
6. **Commit** : `git commit -m "feat: ajoute nouvelle classe Ninja"`
7. **Push** : `git push origin feature/ma-fonctionnalite`
8. **Pull Request** avec description détaillée

### Standards de Code

**JavaScript ES6+**
```javascript
/**
 * Calcule les dégâts d'une attaque avec les bonus de classe
 * @param {number} attackStat - Statistique d'attaque
 * @param {number} defenseStat - Statistique de défense  
 * @param {Object} options - Options d'attaque (critique, bonus)
 * @returns {number} Dégâts finaux infligés
 */
export function calculateDamage(attackStat, defenseStat, options = {}) {
    const baseDamage = Math.max(1, attackStat - Math.floor(defenseStat * 0.5));
    return options.isCritical ? baseDamage * 2 : baseDamage;
}
```

**SCSS BEM Methodology**
```scss
// Bloc
.hero-card {
  // ...
  
  // Élément
  &__avatar {
    width: 80px;
    height: 80px;
  }
  
  // Modificateur
  &--premium {
    border-color: $primary-gold;
  }
}
```

## 📈 Roadmap Technique

### 🎯 **Version 2.0** (Q3 2024)
- [ ] **TypeScript** migration complète
- [ ] **Web Components** pour réutilisabilité
- [ ] **PWA** avec Service Worker
- [ ] **Tests E2E** avec Playwright

### 🎯 **Version 2.5** (Q4 2024)
- [ ] **WebSockets** pour multijoueur temps réel
- [ ] **IndexedDB** pour cache avancé
- [ ] **Web Workers** pour calculs lourds
- [ ] **CSS Container Queries** responsive

### 🎯 **Version 3.0** (2025)
- [ ] **React/Vue** migration (optionnelle)
- [ ] **GraphQL API** pour performance
- [ ] **Micro-frontends** architecture
- [ ] **WebAssembly** pour logique critique

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE).

```
MIT License

Copyright (c) 2024 Heroes Arena Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🙏 Remerciements

- **[Netlify](https://netlify.com)** - Hébergement et Functions serverless
- **[Sass](https://sass-lang.com)** - Préprocesseur CSS modulaire
- **[Unsplash](https://unsplash.com)** - Images et inspiration design
- **[MDN Web Docs](https://developer.mozilla.org)** - Documentation technique
- **Communauté JavaScript** - Ressources et inspiration

## 📞 Support & Communauté

- **🐛 Issues** : [GitHub Issues](https://github.com/your-username/heroes-arena/issues)
- **💬 Discussions** : [GitHub Discussions](https://github.com/your-username/heroes-arena/discussions)
- **📧 Contact** : heroes-arena@example.com
- **🐦 Suivez-nous** : [@HeroesArenaGame](https://twitter.com/HeroesArenaGame)

## 📋 Stack Technique Complète

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+, SCSS |
| **Backend** | Netlify Functions (Node.js) |
| **Base de données** | LocalStorage, SessionStorage, Cloud API |
| **Build Tools** | Sass CLI, Netlify CLI |
| **Déploiement** | Netlify, Git Auto-Deploy |
| **Monitoring** | Netlify Analytics, Custom Metrics |

---

<div align="center">

**⭐ Heroes Arena - Créé avec ❤️ et beaucoup de JavaScript moderne !**

[🎮 Jouer Maintenant](https://heroes-arena.netlify.app) • [📖 Documentation](docs/) • [🤝 Contribuer](CONTRIBUTING.md)

*Un projet open-source pour apprendre et s'amuser avec les technologies web modernes*

</div>