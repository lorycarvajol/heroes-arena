// ============= SCRIPT PRINCIPAL - HEROES ARENA =============

// Imports des modules
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
    saveHeroesToFileHandler,
    loadHeroesFromFileHandler,
    loadHeroesFromLocalStorageHandler,
    exportStatsHandler,
    updateFighters,
    updateFighterSelectors,
    resetArena,
    addLogEntry,
    clearCombatLog
} from './ui.js';

import { autoLoadHeroes } from './data.js';
import { startCombat } from './combat.js';

// Fonction d'initialisation
function initializeHeroesArena() {
    console.log('🎮 Initialisation de Heroes Arena...');
    
    try {
        // Chargement automatique des héros depuis localStorage
        autoLoadHeroes();
        console.log('✅ Héros chargés automatiquement');
        
        // Initialisation de l'interface
        showSection('create');
        console.log('✅ Section création affichée');
        
        initAvatars();
        console.log('✅ Avatars initialisés');
        
        updateStats();
        console.log('✅ Statistiques initialisées');
        
        updateClassInfo();
        console.log('✅ Informations de classe initialisées');
        
        // Initialiser les sélecteurs de l'arène
        updateFighterSelectors();
        console.log('✅ Sélecteurs de l\'arène initialisés');
        
        console.log('🚀 Heroes Arena initialisé avec succès !');
        console.log('📁 Gestion des fichiers JSON activée');
        console.log('🎯 Interface simplifiée des héros activée');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        
        // Fallback en cas d'erreur
        try {
            showSection('create');
            updateStats();
            console.log('⚠️ Initialisation de secours réussie');
        } catch (fallbackError) {
            console.error('💥 Échec de l\'initialisation de secours:', fallbackError);
        }
    }
}

// Créer l'objet global HeroesArena
const HeroesArena = {
    // Navigation et sections
    showSection,
    
    // Gestion des avatars
    showAvatarCategory,
    initAvatars,
    selectAvatar,
    
    // Création de héros
    updateStats,
    randomStats,
    updateClassInfo,
    createHeroFromForm,
    
    // Affichage des héros
    displayHeroes,
    filterHeroes,
    
    // Gestion des héros
    deleteHeroHandler,
    clearAllHeroesHandler,
    
    // Gestion des fichiers JSON
    saveHeroesToFileHandler,
    loadHeroesFromFileHandler,
    loadHeroesFromLocalStorageHandler,
    exportStatsHandler,
    
    // Arène
    updateFighters,
    updateFighterSelectors,
    resetArena,
    startCombat,
    
    // Logs de combat
    addLogEntry,
    clearCombatLog,
    
    // Fonction d'initialisation
    init: initializeHeroesArena
};

// Rendre HeroesArena accessible globalement
window.HeroesArena = HeroesArena;

// Auto-initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeroesArena);
} else {
    // Le DOM est déjà chargé
    initializeHeroesArena();
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('💥 Erreur globale:', event.error);
});

// Message de bienvenue dans la console
console.log(`
🎮 HEROES ARENA - Ultimate Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Fonctionnalités disponibles:
   📁 Sauvegarde vers fichiers JSON
   📂 Chargement depuis fichiers JSON
   💾 Backup automatique localStorage
   📊 Export de statistiques
   🎯 Interface simplifiée des héros
   📱 Modal de détails interactive
   ⚔️  Système de combat avancé
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Export pour compatibilité ES6
export default HeroesArena;