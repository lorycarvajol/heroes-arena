// js/main.js - Point d'entrée principal modifié pour Netlify
import { AppState } from './config.js';
import { autoLoadHeroes, saveHeroes, createHeroFromData, forceSyncToCloud } from './data.js';
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
import { startCombat } from './combat.js';

// ============= API GLOBALE ÉTENDUE =============
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
    createHeroFromForm,
    createHeroFromData, // Nouveau: pour la reconstruction depuis le cloud
    filterHeroes,
    deleteHeroHandler,
    clearAllHeroesHandler,
    saveHeroes,
    loadHeroesHandler,
    
    // Nouvelle fonction pour la synchronisation cloud
    syncToCloud: async function() {
        if (window.AuthUI && window.AuthUI.isOnline()) {
            await window.AuthUI.autoSave();
            alert('Synchronisation avec le cloud terminée !');
        } else {
            alert('Vous devez être connecté pour synchroniser avec le cloud');
        }
    },
    
    // Arène
    updateFighters,
    startCombat,
    resetArena,
    
    // État de l'application
    getAppState: () => AppState,
    
    // Fonctions de démo
    createDemoHeroes: () => {
        AppState.heroes = [];
        createDemoHeroes();
        displayHeroes();
        updateFighterSelectors();
        showSection('heroes');
        
        // Auto-sync si connecté
        if (window.AuthUI && window.AuthUI.isOnline()) {
            setTimeout(() => window.AuthUI.autoSave(), 1000);
        }
    },
    
    // Nouvelle fonction pour afficher l'état de connexion
    getConnectionStatus: function() {
        if (window.AuthUI) {
            return {
                isOnline: window.AuthUI.isOnline(),
                user: window.AuthUI.getCurrentUser ? window.AuthUI.getCurrentUser() : null
            };
        }
        return { isOnline: false, user: null };
    },
    
    // Fonction pour forcer la synchronisation
    forceSyncToCloud
};

// ============= INITIALISATION MODIFIÉE =============
async function initializeApp() {
    console.log('🚀 Initialisation de Heroes Arena (version Cloud)...');
    
    // Initialiser les avatars
    initAvatars();
    
    // Mettre à jour les stats par défaut
    updateStats();
    
    // Mettre à jour les informations de classe
    updateClassInfo();
    
    // Ajouter un message de bienvenue dans l'arène
    addLogEntry('Bienvenue dans l\'arène ! Sélectionnez deux héros pour commencer le combat...', 'info');
    
    // Attendre que l'authentification soit initialisée
    await waitForAuth();
    
    // Charger les héros (cloud ou local selon l'état de connexion)
    await autoLoadHeroes();
    
    // Si aucun héros n'est chargé, proposer la création de héros de démo
    if (AppState.heroes.length === 0) {
        console.log('💡 Aucun héros trouvé.');
        
        // Si connecté, proposer de créer des héros de démo dans le cloud
        if (window.AuthUI && window.AuthUI.isOnline()) {
            if (confirm('Aucun héros trouvé. Voulez-vous créer des héros de démonstration ?')) {
                createDemoHeroes();
                await saveHeroes(); // Sauvegarder dans le cloud
            }
        } else {
            // Mode hors ligne - créer automatiquement des héros de démo
            console.log('Mode hors ligne - création d\'héros de démonstration...');
            createDemoHeroes();
        }
    }
    
    // Générer des stats aléatoires par défaut
    randomStats();
    
    // Mettre à jour les sélecteurs de l'arène
    updateFighterSelectors();
    
    // Afficher les héros
    displayHeroes();
    
    // Configurer l'interface utilisateur selon l'état de connexion
    setupUIForConnectionState();
    
    console.log('✅ Heroes Arena initialisé avec succès !');
    console.log(`📊 ${AppState.heroes.length} héros chargés`);
    console.log(`🌐 Mode: ${window.AuthUI && window.AuthUI.isOnline() ? 'En ligne' : 'Hors ligne'}`);
    
    // Afficher des conseils dans la console
    showConsoleHelp();
}

// ============= FONCTIONS UTILITAIRES =============
async function waitForAuth() {
    return new Promise((resolve) => {
        if (window.AuthUI) {
            // Si AuthUI existe déjà, attendre qu'il soit initialisé
            const checkInit = () => {
                if (window.AuthUI.isOnline !== undefined) {
                    resolve();
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            checkInit();
        } else {
            // Attendre que AuthUI soit chargé
            const checkExists = () => {
                if (window.AuthUI) {
                    waitForAuth().then(resolve);
                } else {
                    setTimeout(checkExists, 100);
                }
            };
            checkExists();
        }
    });
}

function setupUIForConnectionState() {
    // Ajouter des éléments UI pour indiquer l'état de connexion
    const header = document.querySelector('.header');
    if (header && window.AuthUI) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'connectionStatus';
        statusDiv.style.cssText = `
            margin-top: 10px;
            font-size: 0.9rem;
            opacity: 0.8;
        `;
        
        if (window.AuthUI.isOnline()) {
            const user = window.AuthUI.getCurrentUser();
            statusDiv.innerHTML = `🌐 Connecté en tant que <strong>${user ? user.username : 'Utilisateur'}</strong>`;
            statusDiv.style.color = '#10b981';
        } else {
            statusDiv.innerHTML = '📱 Mode hors ligne - données sauvegardées localement';
            statusDiv.style.color = '#fbbf24';
        }
        
        header.appendChild(statusDiv);
    }
    
    // Ajouter des boutons de synchronisation si connecté
    if (window.AuthUI && window.AuthUI.isOnline()) {
        addCloudSyncButtons();
    }
}

function addCloudSyncButtons() {
    const heroesSection = document.getElementById('heroes');
    if (!heroesSection) return;
    
    const buttonContainer = heroesSection.querySelector('div[style*="display: flex"]');
    if (buttonContainer) {
        // Bouton de synchronisation forcée
        const syncBtn = document.createElement('button');
        syncBtn.className = 'btn btn-secondary';
        syncBtn.innerHTML = '🔄 Sync Cloud';
        syncBtn.onclick = () => window.HeroesArena.syncToCloud();
        syncBtn.title = 'Forcer la synchronisation avec le cloud';
        
        buttonContainer.appendChild(syncBtn);
    }
}

// ============= AIDE CONSOLE MISE À JOUR =============
function showConsoleHelp() {
    console.log('\n🎮 === HEROES ARENA - AIDE CONSOLE (Version Cloud) ===');
    console.log('💡 Commandes disponibles :');
    console.log('  • HeroesArena.createDemoHeroes() - Créer des héros de démo');
    console.log('  • HeroesArena.getAppState() - Voir l\'état de l\'application');
    console.log('  • HeroesArena.getConnectionStatus() - État de la connexion');
    console.log('  • HeroesArena.syncToCloud() - Synchroniser avec le cloud');
    console.log('  • HeroesArena.forceSyncToCloud() - Forcer la synchronisation');
    console.log('  • DemoData.resetToDemo() - Reset avec données de démo');
    console.log('🌐 Authentification :');
    console.log('  • AuthUI.logout() - Se déconnecter');
    console.log('  • AuthUI.isOnline() - Vérifier l\'état de connexion');
    console.log('🎯 Raccourcis clavier :');
    console.log('  • Ctrl+1/2/3 - Navigation rapide');
    console.log('  • Échap - Fermer les modales');
    console.log('═══════════════════════════════════\n');
}

// ============= GESTION DES ERREURS ÉTENDUE =============
window.addEventListener('error', (event) => {
    console.error('❌ Erreur dans Heroes Arena:', event.error);
    
    // Signaler les erreurs cloud spécifiques
    if (event.error && event.error.message && event.error.message.includes('fetch')) {
        console.warn('🌐 Possible problème de connexion réseau');
        if (window.AuthUI && window.AuthUI.setSyncStatus) {
            window.AuthUI.setSyncStatus('error', 'Erreur réseau');
        }
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse rejetée dans Heroes Arena:', event.reason);
    
    // Gérer les erreurs de synchronisation
    if (event.reason && event.reason.message && event.reason.message.includes('sync')) {
        console.warn('🔄 Erreur de synchronisation - basculement vers le mode local');
    }
});

// ============= GESTION HORS LIGNE =============
window.addEventListener('online', () => {
    console.log('🌐 Connexion internet rétablie');
    if (window.AuthUI && window.AuthUI.isOnline()) {
        // Tenter une synchronisation automatique
        setTimeout(() => {
            window.AuthUI.autoSave();
        }, 2000);
    }
});

window.addEventListener('offline', () => {
    console.log('📱 Mode hors ligne détecté');
    if (window.AuthUI && window.AuthUI.setSyncStatus) {
        window.AuthUI.setSyncStatus('error', 'Hors ligne');
    }
});

// ============= HOOKS POUR L'INTÉGRATION CLOUD =============

// Hook après création d'un héros
const originalCreateHero = createHeroFromForm;
function enhancedCreateHero() {
    const result = originalCreateHero.apply(this, arguments);
    
    // Auto-sync après création si connecté
    if (result && window.AuthUI && window.AuthUI.isOnline()) {
        setTimeout(() => {
            window.AuthUI.autoSave();
        }, 1000);
    }
    
    return result;
}

// Remplacer la fonction originale
window.HeroesArena.createHeroFromForm = enhancedCreateHero;

// Hook après suppression d'un héros
const originalDeleteHero = deleteHeroHandler;
function enhancedDeleteHero(index) {
    const result = originalDeleteHero.call(this, index);
    
    // Auto-sync après suppression si connecté
    if (result && window.AuthUI && window.AuthUI.isOnline()) {
        setTimeout(() => {
            window.AuthUI.autoSave();
        }, 1000);
    }
    
    return result;
}

window.HeroesArena.deleteHeroHandler = enhancedDeleteHero;

// ============= DÉMARRAGE DE L'APPLICATION =============
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM chargé, initialisation de l\'application...');
    
    // Injecter l'interface d'authentification si elle n'existe pas
    if (!document.getElementById('authOverlay')) {
        await loadAuthInterface();
    }
    
    await initializeApp();
});

// Fonction pour charger l'interface d'authentification
async function loadAuthInterface() {
    try {
        // Si le fichier auth.html existe, le charger
        const response = await fetch('./auth.html');
        if (response.ok) {
            const authHTML = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(authHTML, 'text/html');
            
            // Extraire le contenu nécessaire
            const authOverlay = doc.getElementById('authOverlay');
            const userPanel = doc.getElementById('userPanel');
            
            if (authOverlay) {
                document.body.appendChild(authOverlay);
            }
            if (userPanel) {
                // Insérer le panneau utilisateur dans le header
                const header = document.querySelector('.header');
                if (header) {
                    header.appendChild(userPanel);
                }
            }
            
            console.log('✅ Interface d\'authentification chargée');
        }
    } catch (error) {
        console.warn('⚠️ Impossible de charger l\'interface d\'authentification:', error);
        console.log('💡 L\'application fonctionnera en mode hors ligne uniquement');
    }
}

// Pour compatibilité avec l'ancien code
window.onload = function() {
    if (document.readyState === 'loading') {
        initializeApp();
    }
};

// ============= FONCTIONS UTILITAIRES POUR LE CLOUD =============

// Fonction pour exporter les données vers un fichier JSON
window.HeroesArena.exportToFile = function() {
    const data = {
        heroes: AppState.heroes.map(h => h.toJSON()),
        exportDate: new Date().toISOString(),
        version: '2.0.0-cloud'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `heroes-arena-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📁 Données exportées vers un fichier');
};

// Fonction pour importer des données depuis un fichier JSON
window.HeroesArena.importFromFile = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.heroes && Array.isArray(data.heroes)) {
                const confirmMessage = `Importer ${data.heroes.length} héros ?\nCela remplacera vos héros actuels.`;
                
                if (confirm(confirmMessage)) {
                    AppState.heroes = [];
                    data.heroes.forEach(heroData => {
                        const hero = createHeroFromData(heroData);
                        if (hero) AppState.heroes.push(hero);
                    });
                    
                    await saveHeroes();
                    displayHeroes();
                    updateFighterSelectors();
                    
                    alert(`${AppState.heroes.length} héros importés avec succès !`);
                }
            } else {
                alert('Format de fichier invalide');
            }
        } catch (error) {
            alert('Erreur lors de l\'importation : ' + error.message);
        }
    };
    
    input.click();
};

// ============= STATISTIQUES CLOUD =============
window.HeroesArena.getCloudStats = async function() {
    if (!window.AuthUI || !window.AuthUI.isOnline()) {
        alert('Vous devez être connecté pour voir les statistiques cloud');
        return;
    }
    
    try {
        const result = await window.cloudStorage.loadHeroes();
        if (result.success) {
            const stats = {
                totalHeroes: result.heroes.length,
                byClass: {},
                totalBattles: 0,
                creationDates: []
            };
            
            result.heroes.forEach(hero => {
                stats.byClass[hero.classe] = (stats.byClass[hero.classe] || 0) + 1;
                stats.totalBattles += (hero.victoires || 0) + (hero.defaites || 0);
                if (hero.createdAt) {
                    stats.creationDates.push(hero.createdAt);
                }
            });
            
            console.log('📊 Statistiques Cloud:', stats);
            return stats;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
    }
};

// ============= EXPORTS POUR TESTS =============
export { initializeApp, loadAuthInterface };
