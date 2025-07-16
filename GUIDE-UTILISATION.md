# 🚀 Guide d'Installation Rapide - Heroes Arena

## ⚡ Installation Express (5 minutes)

### 1. **Créer la Structure**
```
heroes-arena/
├── index.html
├── package.json
├── js/
│   ├── main.js
│   ├── config.js
│   ├── classes.js
│   ├── data.js
│   ├── ui.js
│   ├── combat.js
│   ├── demo-data.js
│   ├── utils.js (optionnel)
│   └── events.js (optionnel)
└── images/ (optionnel)
```

### 2. **Copier les Fichiers**

1. **index.html** - Copier le contenu complet fourni
2. **js/main.js** - Script principal 
3. **js/config.js** - Configuration
4. **js/classes.js** - Classes des héros
5. **js/data.js** - Gestion des données
6. **js/ui.js** - Interface utilisateur
7. **js/combat.js** - Système de combat
8. **js/demo-data.js** - Données de démonstration

### 3. **Lancer l'Application**

**Option A : Python (recommandé)**
```bash
cd heroes-arena
python -m http.server 8000
# Ouvrir http://localhost:8000
```

**Option B : Node.js**
```bash
cd heroes-arena
npx http-server -p 8000
# Ouvrir http://localhost:8000
```

**Option C : PHP**
```bash
cd heroes-arena
php -S localhost:8000
# Ouvrir http://localhost:8000
```

## ✅ Vérification

1. **Page se charge** ✓
2. **Héros de démo apparaissent** ✓
3. **Création de héros fonctionne** ✓
4. **Combat fonctionne** ✓

## 🎮 Premiers Pas

### Étape 1 : Découvrir les Héros de Démo
- Allez dans l'onglet **"Mes Héros"**
- Vous devriez voir Aragorn, Gandalf, Legolas, etc.
- Observez leurs stats et badges

### Étape 2 : Créer votre Premier Héros
- Allez dans **"Créer un Héros"**
- Entrez un nom (ex: "MonHéros")
- Choisissez une classe
- Répartissez 100 points de stats
- Cliquez **"Créer le Héros"**

### Étape 3 : Premier Combat
- Allez dans **"Arène"**
- Sélectionnez 2 héros différents
- Cliquez **"Commencer le Combat"**
- Regardez le combat se dérouler !

## 🎯 Raccourcis Clavier

- **Ctrl + 1** : Créer un Héros
- **Ctrl + 2** : Mes Héros  
- **Ctrl + 3** : Arène
- **Ctrl + Alt + R** : Stats aléatoires
- **Échap** : Fermer modales

## 🔧 Dépannage Rapide

### Problème : "Module not found"
**Solution :** Utilisez un serveur HTTP, pas file://

### Problème : Avatars ne s'affichent pas
**Solution :** Normal ! Les placeholders colorés apparaissent automatiquement

### Problème : Pas de héros au démarrage
**Solution :** Cliquez sur "Créer Héros Démo" dans l'onglet "Mes Héros"

### Problème : Combat ne démarre pas
**Solution :** Vérifiez que 2 héros différents sont sélectionnés

## 📱 Compatibilité

- ✅ **Chrome/Edge** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Mobile** (responsive)

## 🆘 Besoin d'Aide ?

### Console de Debug
Appuyez sur **F12** et regardez la console pour :
- Messages d'initialisation
- Commandes disponibles
- Erreurs éventuelles

### Commandes de Debug
```javascript
// Dans la console du navigateur
HeroesArena.getAppState()        // État de l'app
HeroesArena.createDemoHeroes()   // Créer héros démo
DemoData.resetToDemo()           // Reset complet
```

## 🎊 C'est Prêt !

Votre Heroes Arena est maintenant fonctionnel ! 

**Prochaines étapes :**
- Créez vos propres héros
- Organisez des tournois
- Explorez les différentes classes
- Débloquez tous les badges

---

## 📋 Checklist Finale

- [ ] Structure de dossiers créée
- [ ] Tous les fichiers JS copiés
- [ ] Serveur HTTP lancé
- [ ] Application accessible
- [ ] Héros de démo visibles
- [ ] Création de héros testée
- [ ] Combat testé
- [ ] Raccourcis clavier testés

**🎮 Amusez-vous bien avec Heroes Arena !**