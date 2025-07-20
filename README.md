# 🏟️ Heroes Arena - Ultimate Edition

> **Un jeu de combat de héros web interactif avec système d'authentification et sauvegarde cloud**

[![Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/heroes-arena)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Heroes Arena est un jeu web moderne où vous créez des héros personnalisés avec des classes uniques et les faites combattre dans une arène épique. Avec un système de progression, des badges de prestige, et une sauvegarde cloud sécurisée.

## ✨ Fonctionnalités Principales

### 🎮 **Gameplay**
- **4 Classes de héros** avec des pouvoirs uniques
- **Système de combat** au tour par tour avec animations
- **100 points de statistiques** à répartir librement
- **Catalogue de 40+ avatars** organisés par classe
- **Système de badges** et progression (Bronze, Argent, Or)

### 🔐 **Authentification & Cloud**
- **Système d'authentification** complet (connexion/inscription)
- **Sauvegarde cloud** automatique via Netlify Functions
- **Synchronisation** en temps réel entre appareils
- **Récupération de mot de passe** par email

### 🎨 **Interface**
- **Design moderne** avec thème sombre et effets glassmorphism
- **Interface responsive** (mobile et desktop)
- **Animations fluides** et effets visuels
- **Raccourcis clavier** pour navigation rapide

## 🚀 Démo en Ligne

🌐 **[Jouer maintenant sur Netlify](https://heroes-arena.netlify.app)**

## 📱 Captures d'Écran

| Authentification | Création de Héros | Combat |
|------------------|-------------------|---------|
| ![Auth](docs/screenshots/auth.png) | ![Create](docs/screenshots/create.png) | ![Combat](docs/screenshots/combat.png) |

## 🏗️ Architecture du Projet

```
heroes-arena/
├── 🌐 Frontend
│   ├── index.html              # Page principale avec auth
│   ├── style.css               # Styles compilés SCSS
│   ├── js/                     # Scripts modulaires ES6+
│   │   ├── main.js            # Point d'entrée principal
│   │   ├── app-loader.js      # Chargeur d'application
│   │   ├── init.js            # Initialisation
│   │   ├── core/              # Modules core
│   │   │   ├── config.js      # Configuration globale
│   │   │   ├── classes.js     # Classes de héros (POO)
│   │   │   └── utils.js       # Utilitaires
│   │   ├── modules/           # Modules métier
│   │   │   ├── auth.js        # Authentification
│   │   │   ├── data.js        # Gestion données
│   │   │   ├── ui.js          # Interface utilisateur
│   │   │   ├── combat.js      # Système de combat
│   │   │   └── combat-effects.js # Effets visuels
│   │   └── interfaces/        # Types TypeScript (futur)
│   └── images/                # Assets (avatars)
│
├── ☁️ Backend (Netlify Functions)
│   └── netlify/
│       └── functions/
│           ├── auth.js        # API authentification
│           └── heroes.js      # API gestion héros
│
├── 🎨 Styles (SCSS)
│   └── scss/
│       ├── abstracts/         # Variables, mixins
│       ├── base/              # Reset, typographie
│       ├── components/        # Composants UI
│       ├── layout/            # Layout général
│       ├── pages/             # Styles spécifiques
│       └── themes/            # Thèmes couleurs
│
└── ⚙️ Configuration
    ├── package.json           # Dépendances Node.js
    ├── netlify.toml          # Config déploiement
    └── README.md             # Documentation
```

## 🎯 Classes de Héros

### ⚔️ **Guerrier** - Maître de la Rage
- **Bonus** : +20% Force
- **Pouvoir** : Rage Berserker (+50% dégâts, -30% défense, 3 tours)
- **Style** : Combat rapproché, haute résistance

### 🔮 **Mage** - Seigneur des Boucliers
- **Bonus** : +20% Magie  
- **Pouvoir** : Bouclier Magique (absorbe les dégâts, 4 tours)
- **Style** : Contrôle, défense magique

### 🏹 **Archer** - Expert en Tirs Multiples
- **Bonus** : +20% Agilité
- **Pouvoir** : Tir Multiple (2-3 flèches consécutives)
- **Style** : Attaques à distance, precision

### 🛡️ **Paladin** - Gardien Guérisseur
- **Bonus** : +20% Défense
- **Pouvoir** : Aura de Guérison (régénération sur 4 tours)
- **Style** : Tank, support, résistance

## 🎮 Guide de Jeu

### 🎯 **Création de Héros**
1. **Choisissez une classe** selon votre style de jeu
2. **Répartissez 100 points** entre Force, Agilité, Magie, Défense
3. **Sélectionnez un avatar** dans le catalogue
4. **Nommez votre héros** et validez

### ⚔️ **Combat**
- Les combats sont **au tour par tour**
- Chaque héros attaque en alternance
- Les **pouvoirs spéciaux** se déclenchent automatiquement
- Les **dégâts** dépendent des stats et de la défense
- **PV** = (Force + Défense) × 2.5

### 🏆 **Progression**
- **🥉 Bronze** : 5 victoires → Bordure bronze
- **🥈 Argent** : 10 victoires → Bordure argent animée  
- **🥇 Or** : 20 victoires → Bordure or prestigieuse

### ⌨️ **Raccourcis Clavier**
- `Ctrl + 1` : Créer un Héros
- `Ctrl + 2` : Mes Héros  
- `Ctrl + 3` : Arène
- `Échap` : Fermer les modales
- `Entrée` : Valider création

## 🛠️ Installation & Développement

### 📋 **Prérequis**
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Netlify CLI** (pour le développement local)

### 🚀 **Installation Rapide**

```bash
# Cloner le repository
git clone https://github.com/lorycarvajol/heroes-arena.git
cd heroes-arena

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:8888`

### 🧪 **Commandes Disponibles**

```bash
# Développement local avec Netlify
npm run dev

# Build du projet
npm run build

# Tests (si configurés)
npm test

# Déploiement production
npm run deploy
```

### 🔧 **Configuration Netlify**

Le projet utilise **Netlify Functions** pour l'API backend. Configuration dans `netlify.toml` :

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[dev]
  functions = "netlify/functions"
  port = 8888
```

## 🔐 Configuration Authentification

### Variables d'Environnement

Créez un fichier `.env` (non versioned) :

```env
# Base de données (par exemple Supabase)
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# Email (pour reset password)
EMAIL_SERVICE_API_KEY=your_email_api_key
```

### Base de Données

Le projet supporte plusieurs options :
- **Netlify Identity** (recommandé)
- **Supabase** 
- **Firebase Auth**
- **Base de données custom**

## 🎨 Personnalisation

### 🖼️ **Ajouter des Avatars**

1. Ajoutez vos images dans `images/`
2. Modifiez `avatarCatalog` dans `js/core/config.js` :

```javascript
export const avatarCatalog = {
    guerriers: [
        'warrior1.png', 'warrior2.png', 
        'mon-nouveau-guerrier.png' // ← Nouveau
    ],
    // ...
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
    }
}
```

2. **Ajoutez les infos** dans `js/core/config.js` :

```javascript
export const classInfo = {
    'Ninja': {
        title: 'Ninja - Maître de l\'Ombre',
        desc: 'Bonus de +20% en Agilité. Expert en esquive.',
        power: 'Invisibilité',
        powerDesc: 'Augmente l\'esquive de 50% pendant 3 tours.',
        bonusStat: 'agility',
        bonusPercent: 20
    }
};
```

### 🎨 **Personnaliser les Styles**

Le projet utilise **SCSS** pour une organisation modulaire :

```scss
// scss/themes/_dark.scss
$primary-color: #6366f1;
$background-dark: #0f172a;
$card-bg: rgba(255, 255, 255, 0.1);

// Votre thème personnalisé
$custom-primary: #ff6b6b;
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration  
npm run test:integration

# Tests E2E avec Playwright
npm run test:e2e
```

## 📊 Monitoring & Analytics

### Performance Monitoring

Le projet inclut des métriques de performance :
- Temps de chargement
- Interactions utilisateur
- Erreurs JavaScript
- Usage mémoire

### Analytics

Configuration Google Analytics dans `index.html` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🚀 Déploiement

### Netlify (Recommandé)

1. **Connectez votre repository** GitHub à Netlify
2. **Configuration automatique** via `netlify.toml`
3. **Déploiement automatique** sur push

### Autres Plateformes

- **Vercel** : Compatible avec configuration minimal
- **GitHub Pages** : Nécessite adaptation (pas de functions)
- **Firebase Hosting** : Support complet avec Functions

## 🔧 Dépannage

### Problèmes Courants

**❌ Erreur CORS sur les images**
```bash
# Solution : Serveur local requis
npx http-server
# ou
python -m http.server 8000
```

**❌ Modules ES6 non chargés**
```html
<!-- Vérifiez le type module -->
<script type="module" src="js/main.js"></script>
```

**❌ Authentification échoue**
```javascript
// Vérifiez les variables d'environnement
console.log('API URL:', process.env.NETLIFY_URL);
```

### Logs de Débogage

Active les logs détaillés dans la console :

```javascript
// js/core/config.js
export const DEBUG = true; // ← Activez pour développement
```

## 🤝 Contribution

### Workflow de Contribution

1. **Fork** le projet
2. **Créez une branche** : `git checkout -b feature/ma-feature`
3. **Développez** avec les bonnes pratiques
4. **Tests** : Assurez-vous que tout passe
5. **Commit** : Messages explicites
6. **Push** : `git push origin feature/ma-feature`
7. **Pull Request** : Description détaillée

### Standards de Code

- **ES6+** avec modules
- **JSDoc** pour la documentation
- **Prettier** pour le formatage
- **ESLint** pour la qualité

```javascript
/**
 * Calcule les dégâts d'une attaque
 * @param {number} force - Force de l'attaquant
 * @param {number} defense - Défense du défenseur
 * @returns {number} Dégâts infligés
 */
function calculerDegats(force, defense) {
    return Math.max(1, force - Math.floor(defense * 0.5));
}
```

## 📈 Roadmap

### 🎯 **Version 2.0** (Q3 2024)
- [ ] **Système d'XP et niveaux** 
- [ ] **Équipements et objets**
- [ ] **Sorts et compétences**
- [ ] **Mode histoire/campagne**

### 🎯 **Version 2.5** (Q4 2024)
- [ ] **Multijoueur en temps réel**
- [ ] **Tournois et classements**
- [ ] **Guildes et alliances**
- [ ] **Chat en jeu**

### 🎯 **Version 3.0** (2025)
- [ ] **Application mobile** (React Native)
- [ ] **Marketplace NFT** (optionnel)
- [ ] **IA avancée** pour NPCs
- [ ] **Réalité augmentée**

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024 Heroes Arena Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

## 🙏 Remerciements

- **[Netlify](https://netlify.com)** pour l'hébergement et les functions
- **[SCSS](https://sass-lang.com)** pour les styles modulaires  
- **[Unsplash](https://unsplash.com)** pour les images placeholder
- **Communauté JavaScript** pour l'inspiration

## 📞 Support & Contact

- **🐛 Issues** : [GitHub Issues](https://github.com/votre-username/heroes-arena/issues)
- **💬 Discussions** : [GitHub Discussions](https://github.com/votre-username/heroes-arena/discussions)
- **📧 Email** : support@heroes-arena.com
- **🐦 Twitter** : [@HeroesArenaGame](https://twitter.com/HeroesArenaGame)

---

<div align="center">

**⭐ Heroes Arena - Créé avec ❤️ et beaucoup de JavaScript moderne !**

[🎮 Jouer Maintenant](https://heroes-arena.netlify.app) • [📖 Documentation](docs/) • [🤝 Contribuer](CONTRIBUTING.md)

</div>