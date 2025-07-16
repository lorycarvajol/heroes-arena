# Heroes Arena - Version Modularisée

## 🎮 Description

Heroes Arena est un jeu web interactif où vous pouvez créer des héros personnalisés avec des classes uniques et les faire combattre dans une arène. Chaque héros possède des statistiques, des pouvoirs spéciaux et peut gravir les échelons pour obtenir des badges de prestige.

## 📁 Structure du Projet

```
heroes-arena/
│
├── index.html                 # Page principale
├── README.md                 # Documentation
│
├── js/                       # Scripts JavaScript modulaires
│   ├── main.js              # Point d'entrée principal
│   ├── config.js            # Configuration et variables globales
│   ├── classes.js           # Classes des héros (POO)
│   ├── data.js              # Gestion des données et sauvegarde
│   ├── ui.js                # Interface utilisateur
│   ├── combat.js            # Système de combat
│   ├── events.js            # Gestionnaire d'événements
│   └── utils.js             # Fonctions utilitaires
│
├── images/                   # Avatars des héros (optionnel)
│   ├── warrior1.png
│   ├── mage1.png
│   └── ...
│
└── css/                      # Styles CSS (optionnel)
    └── styles.css           # Styles supplémentaires
```

## 🚀 Installation et Utilisation

### Prérequis
- Navigateur web moderne supportant ES6 modules
- Serveur HTTP local (pour éviter les problèmes CORS)

### Installation Simple
1. Téléchargez tous les fichiers dans un dossier
2. Créez la structure de dossiers ci-dessus
3. Placez les fichiers JavaScript dans le dossier `js/`
4. Ouvrez `index.html` via un serveur HTTP local

### Serveur Local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000`

## 📚 Architecture des Modules

### 🔧 config.js
- **Rôle** : Configuration globale et constantes
- **Contient** :
  - Variables d'état de l'application (`AppState`)
  - Catalogue d'avatars par classe
  - Informations des classes et pouvoirs
  - Configuration des badges

### 🏛️ classes.js
- **Rôle** : Définition des classes de héros (POO)
- **Classes** :
  - `Hero` : Classe de base
  - `Guerrier` : Spécialiste de la rage
  - `Mage` : Maître des boucliers magiques
  - `Archer` : Expert en tirs multiples
  - `Paladin` : Gardien avec aura de soin
- **Factory** : `createHero()` pour instancier les héros

### 💾 data.js
- **Rôle** : Gestion des données et persistance
- **Fonctions** :
  - `saveHeroes()` : Sauvegarde dans localStorage
  - `loadHeroes()` : Chargement depuis localStorage
  - `autoLoadHeroes()` : Chargement automatique au démarrage
  - `deleteHero()` : Suppression d'un héros
  - `clearAllHeroes()` : Suppression de tous les héros

### 🎨 ui.js
- **Rôle** : Interface utilisateur et affichage
- **Fonctions principales** :
  - Navigation entre sections
  - Gestion des avatars et du catalogue
  - Création et affichage des héros
  - Interface de l'arène
  - Mise à jour des barres de vie
  - Filtrage et recherche

### ⚔️ combat.js
- **Rôle** : Système de combat et logique de jeu
- **Fonctions** :
  - `startFight()` : Lancement d'un combat
  - `combatTurn()` : Gestion des tours de combat
  - `calculerDegats()` : Calcul des dégâts avec défense
  - `processPower()` : Activation des pouvoirs spéciaux
  - Gestion des badges et statistiques

### 🎯 events.js
- **Rôle** : Gestion avancée des événements
- **Fonctionnalités** :
  - Raccourcis clavier (Ctrl+1/2/3 pour naviguer)
  - Validation en temps réel
  - Notifications système
  - Auto-sauvegarde
  - Gestion responsive

### 🛠️ utils.js
- **Rôle** : Fonctions utilitaires réutilisables
- **Outils** :
  - Générateurs de nombres aléatoires
  - Validation des statistiques
  - Utilitaires pour localStorage
  - Animations et UI helpers
  - Formatage de données

### 🏠 main.js
- **Rôle** : Point d'entrée et orchestration
- **Responsabilités** :
  - Initialisation de l'application
  - Exposition de l'API globale (`window.HeroesArena`)
  - Gestion des erreurs
  - Coordination entre modules

## 🎯 Fonctionnalités

### Création de Héros
- **4 classes** : Guerrier, Mage, Archer, Paladin
- **Système de stats** : 100 points à répartir (Force, Agilité, Magie, Défense)
- **Catalogue d'avatars** : Plus de 40 avatars organisés par classe
- **Pouvoirs uniques** : Chaque classe a un pouvoir passif spécial

### Système de Combat
- **Combat au tour par tour** avec animations
- **Calculs complexes** : Dégâts, défense, esquive
- **Pouvoirs spéciaux** :
  - Guerrier : Rage Berserker (+50% dégâts, -30% défense)
  - Mage : Bouclier Magique (absorption de dégâts)
  - Archer : Tir Multiple (2-3 flèches consécutives)
  - Paladin : Aura de Guérison (régénération sur 4 tours)

### Progression et Badges
- **Système de badges** :
  - 🥉 **Bronze** : 5 victoires (Expérimenté)
  - 🥈 **Argent** : 10 victoires (Vétéran)
  - 🥇 **Or** : 20 victoires (Légendaire)
- **Statistiques** : Victoires, défaites, ratio de réussite
- **Effets visuels** : Bordures animées pour les badges

### Interface Utilisateur
- **Design moderne** : Thème sombre avec effets glassmorphism
- **Responsive** : Adapté mobile et desktop
- **Animations** : Transitions fluides et effets visuels
- **Raccourcis clavier** : Navigation rapide

## 🎮 Guide d'Utilisation

### Raccourcis Clavier
- `Ctrl + 1` : Aller à "Créer un Héros"
- `Ctrl + 2` : Aller à "Mes Héros"
- `Ctrl + 3` : Aller à "Arène"
- `Échap` : Fermer les modales
- `Entrée` : Créer un héros (depuis le champ nom)

### Conseils de Jeu
1. **Équilibrage** : Répartissez bien vos 100 points de stats
2. **Spécialisation** : Chaque classe a un bonus de +20% sur sa stat principale
3. **Stratégie** : Considérez les pouvoirs passifs lors des combats
4. **Progression** : Accumulez les victoires pour débloquer les badges

## 🔧 Personnalisation

### Ajouter de Nouveaux Avatars
1. Ajoutez vos images dans le dossier `images/`
2. Modifiez `avatarCatalog` dans `config.js`
3. Respectez le format : `nom_classe_numero.png`

### Créer une Nouvelle Classe
1. Étendez la classe `Hero` dans `classes.js`
2. Ajoutez les informations dans `config.js`
3. Implémentez les pouvoirs spéciaux
4. Mettez à jour l'interface utilisateur

### Modifier les Statistiques
- Ajustez les valeurs dans les classes de héros
- Modifiez les calculs dans `combat.js`
- Personnalisez les bonus de classe

## 🐛 Débogage

### Console de Développement
L'application affiche des logs détaillés :
```javascript
🚀 Initialisation de Heroes Arena...
📊 3 héros chargés
🦸 Nouveau héros créé: Aragorn (Guerrier)
⚔️ Combat terminé: Gandalf vs Legolas
```

### Gestion d'Erreurs
- Sauvegarde automatique après chaque action
- Validation en temps réel des formulaires
- Messages d'erreur contextuels
- Récupération automatique des données

## 📈 Améliorations Possibles

### Fonctionnalités Avancées
- [ ] Système de niveaux et d'expérience
- [ ] Équipements et objets
- [ ] Tournois et championnats
- [ ] Mode multijoueur en ligne
- [ ] Sauvegarde cloud
- [ ] Graphiques de progression

### Optimisations Techniques
- [ ] Service Worker pour le mode hors-ligne
- [ ] Compression des données de sauvegarde
- [ ] Lazy loading des avatars
- [ ] Tests unitaires
- [ ] Bundle avec Webpack/Vite

## 📄 Licence

Ce projet est fourni à des fins éducatives. Libre d'utilisation et de modification.

## 🤝 Contribution

Pour contribuer :
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

**Heroes Arena** - Créé avec ❤️ et beaucoup de JavaScript modulaire !