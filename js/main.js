// ============= POINT D'ENTRÉE PRINCIPAL =============

import { AppState } from './config.js';
import { autoLoadHeroes, saveHeroes } from './data.js';
import { createDemoHeroes } from './demo-data.js';
import { 
    showSection, 
    showAvatarCategory, 
    initAvatars, 
    selectAvatar,
    updateStats, 
    randomStats, 
    updateClassInfo,
    createHeroFromForm,
    displayHeroes,
    filterHeroes,
    deleteHeroHandler,
    clearAllHeroesHandler,
    loadHeroesHandler,
    updateFighters,
    updateFighterSelectors,
    resetArena,
    addLogEntry
} from './ui.js';
import { startFight } from './combat.js';

// ============= API GLOBALE =============
// Exposer les fonctions nécessaires pour les événements HTML
window.HeroesArena = {
    // Navigation
    showSection,
    
    // Gestion des avatars
    showAvatarCategory,
    selectAvatar,
    
    // Gestion des stats
    updateStats,
    randomStats,
    updateClassInfo,
    
    // Gestion des héros
    createHero: createHeroFromForm,
    filterHeroes,
    deleteHeroHandler,
    clearAllHeroesHandler,
    saveHeroes,
    loadHeroesHandler,
    
    // Arène
    updateFighters,
    startFight,
    resetArena,
    
    // État de l'application
    getAppState: () => AppState,
    
    // Fonctions de démo
    createDemoHeroes: () => {
        AppState.heroes = []; // Vider d'abord la liste
        createDemoHeroes();
        displayHeroes();
        updateFighterSelectors();
        showSection('heroes');
    }
};

// ============= INITIALISATION =============
function initializeApp() {
    console.log('🚀 Initialisation de Heroes Arena...');
    
    // Initialiser les avatars
    initAvatars();
    
    // Mettre à jour les stats par défaut
    updateStats();
    
    // Mettre à jour les informations de classe
    updateClassInfo();
    
    // Charger les héros sauvegardés
    autoLoadHeroes();
    
    // Si aucun héros n'est chargé, proposer la création de héros de démo
    if (AppState.heroes.length === 0) {
        console.log('💡 Aucun héros trouvé. Création d\'héros de démonstration...');
        createDemoHeroes();
    }
    
    // Générer des stats aléatoires par défaut
    randomStats();
    
    // Mettre à jour les sélecteurs de l'arène
    updateFighterSelectors();
    
    // Ajouter un message de bienvenue dans l'arène
    addLogEntry('Bienvenue dans l\'arène ! Sélectionnez deux héros pour commencer le combat...', 'info');
    
    console.log('✅ Heroes Arena initialisé avec succès !');
    console.log(`📊 ${AppState.heroes.length} héros chargés`);
    
    // Afficher des conseils dans la console
    showConsoleHelp();
}

// ============= AIDE CONSOLE =============
function showConsoleHelp() {
    console.log('\n🎮 === HEROES ARENA - AIDE CONSOLE ===');
    console.log('💡 Commandes disponibles :');
    console.log('  • HeroesArena.createDemoHeroes() - Créer des héros de démo');
    console.log('  • HeroesArena.getAppState() - Voir l\'état de l\'application');
    console.log('  • DemoData.resetToDemo() - Reset avec données de démo');
    console.log('🎯 Raccourcis clavier :');
    console.log('  • Ctrl+1/2/3 - Navigation rapide');
    console.log('  • Échap - Fermer les modales');
    console.log('═══════════════════════════════════\n');
}

// ============= GESTION DES ERREURS =============
window.addEventListener('error', (event) => {
    console.error('❌ Erreur dans Heroes Arena:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse rejetée dans Heroes Arena:', event.reason);
});

// ============= DÉMARRAGE DE L'APPLICATION =============
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM chargé, initialisation de l\'application...');
    initializeApp();
});

// Pour compatibilité avec l'ancien code
window.onload = function() {
    // Si DOMContentLoaded n'a pas été déclenché
    if (document.readyState === 'loading') {
        initializeApp();
    }
};

// ============= EXPORTS POUR TESTS =============
export { initializeApp };