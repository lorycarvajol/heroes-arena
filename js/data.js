// js/data.js - Gestion des données modifiée pour le cloud
import { AppState } from './config.js';
import { createHero } from './classes.js';
import { cloudStorage } from './cloud-storage.js';

// Sauvegarde hybride (local + cloud)
export async function saveHeroes() {
    const heroesData = AppState.heroes.map(hero => hero.toJSON());
    
    // Sauvegarde locale (toujours)
    try {
        localStorage.setItem('heroes', JSON.stringify(heroesData));
    } catch (error) {
        console.warn('Impossible de sauvegarder localement:', error);
    }
    
    // Sauvegarde cloud (si connecté)
    if (window.AuthUI && window.AuthUI.isOnline()) {
        try {
            await cloudStorage.saveHeroes(heroesData);
            console.log('✅ Héros sauvegardés dans le cloud');
        } catch (error) {
            console.warn('⚠️ Erreur de sauvegarde cloud:', error);
            // Continuer avec la sauvegarde locale uniquement
        }
    }
}

// Chargement hybride (priorité au cloud si disponible)
export async function loadHeroes() {
    try {
        let heroesData = [];
        let source = 'local';
        
        // Essayer de charger depuis le cloud d'abord
        if (window.AuthUI && window.AuthUI.isOnline()) {
            try {
                const cloudResult = await cloudStorage.loadHeroes();
                if (cloudResult.success && cloudResult.heroes) {
                    heroesData = cloudResult.heroes;
                    source = 'cloud';
                }
            } catch (error) {
                console.warn('Impossible de charger depuis le cloud:', error);
            }
        }
        
        // Fallback vers le localStorage si pas de données cloud
        if (heroesData.length === 0) {
            const saved = localStorage.getItem('heroes');
            if (saved) {
                heroesData = JSON.parse(saved);
                source = 'local';
            }
        }
        
        if (heroesData.length === 0) {
            alert('Aucune sauvegarde trouvée !');
            return false;
        }
        
        // Reconstruction des héros
        AppState.heroes = [];
        heroesData.forEach(data => {
            const hero = createHeroFromData(data);
            if (hero) {
                AppState.heroes.push(hero);
            }
        });
        
        alert(`${AppState.heroes.length} héros chargés depuis ${source === 'cloud' ? 'le cloud' : 'la sauvegarde locale'} !`);
        
        // Si chargé depuis local et connecté au cloud, proposer la synchronisation
        if (source === 'local' && window.AuthUI && window.AuthUI.isOnline()) {
            if (confirm('Voulez-vous synchroniser ces héros avec le cloud ?')) {
                await saveHeroes();
            }
        }
        
        return true;
        
    } catch (error) {
        alert('Erreur lors du chargement : ' + error.message);
        return false;
    }
}

// Chargement automatique au démarrage (modifié)
export async function autoLoadHeroes() {
    // Attendre que l'authentification soit vérifiée
    if (window.AuthUI) {
        await new Promise(resolve => {
            const checkAuth = () => {
                if (window.AuthUI.isOnline() !== undefined) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }
    
    // Charger les héros
    const saved = localStorage.getItem('heroes');
    if (saved) {
        try {
            const heroesData = JSON.parse(saved);
            heroesData.forEach(data => {
                const hero = createHeroFromData(data);
                if (hero) {
                    AppState.heroes.push(hero);
                }
            });
            
            // Si connecté au cloud, synchroniser en arrière-plan
            if (window.AuthUI && window.AuthUI.isOnline()) {
                setTimeout(async () => {
                    try {
                        const cloudResult = await cloudStorage.loadHeroes();
                        if (cloudResult.success && cloudResult.heroes && cloudResult.heroes.length > 0) {
                            // Proposer de synchroniser si les données cloud sont différentes
                            const cloudCount = cloudResult.heroes.length;
                            const localCount = AppState.heroes.length;
                            
                            if (cloudCount !== localCount) {
                                if (confirm(`Données différentes détectées:\n- Local: ${localCount} héros\n- Cloud: ${cloudCount} héros\n\nCharger depuis le cloud ?`)) {
                                    await loadHeroes();
                                    if (window.HeroesArena && window.HeroesArena.displayHeroes) {
                                        window.HeroesArena.displayHeroes();
                                        window.HeroesArena.updateFighterSelectors();
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.log('Synchronisation cloud échouée:', error);
                    }
                }, 2000);
            }
        } catch (error) {
            console.log('Erreur lors du chargement automatique:', error);
        }
    }
}

// Fonction pour recréer un héros depuis les données JSON
export function createHeroFromData(data) {
    const hero = createHero(
        data.nom,
        data.avatar,
        data.classe,
        data.force,
        data.agility,
        data.magic,
        data.defense
    );
    
    if (hero) {
        // Restaurer les statistiques et métadonnées
        hero.victoires = data.victoires || 0;
        hero.defaites = data.defaites || 0;
        hero.id = data.id || generateHeroId();
        hero.createdAt = data.createdAt || new Date().toISOString();
        hero.updatedAt = data.updatedAt || new Date().toISOString();
    }
    
    return hero;
}

// Supprimer tous les héros (modifié)
export async function clearAllHeroes() {
    if (AppState.heroes.length === 0) return false;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les héros ?')) {
        AppState.heroes = [];
        AppState.fighter1 = null;
        AppState.fighter2 = null;
        
        // Supprimer localement
        localStorage.removeItem('heroes');
        
        // Supprimer du cloud si connecté
        if (window.AuthUI && window.AuthUI.isOnline()) {
            try {
                await cloudStorage.saveHeroes([]);
                console.log('Héros supprimés du cloud');
            } catch (error) {
                console.warn('Erreur lors de la suppression cloud:', error);
            }
        }
        
        return true;
    }
    return false;
}

// Supprimer un héros (modifié)
export async function deleteHero(index) {
    if (index < 0 || index >= AppState.heroes.length) return false;
    
    const hero = AppState.heroes[index];
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${hero.nom} ?`)) {
        // Supprimer du cloud d'abord si connecté
        if (window.AuthUI && window.AuthUI.isOnline() && hero.id) {
            try {
                await cloudStorage.deleteHero(hero.id);
            } catch (error) {
                console.warn('Erreur lors de la suppression cloud:', error);
            }
        }
        
        // Supprimer localement
        AppState.heroes.splice(index, 1);
        await saveHeroes();
        return true;
    }
    return false;
}

// Synchronisation forcée
export async function forceSyncToCloud() {
    if (!window.AuthUI || !window.AuthUI.isOnline()) {
        alert('Vous devez être connecté pour synchroniser avec le cloud');
        return false;
    }
    
    try {
        await saveHeroes();
        alert('Synchronisation réussie !');
        return true;
    } catch (error) {
        alert('Erreur de synchronisation: ' + error.message);
        return false;
    }
}

// Résolution de conflits de synchronisation
export async function resolveSync(strategy = 'merge') {
    if (!window.AuthUI || !window.AuthUI.isOnline()) return;
    
    try {
        const cloudResult = await cloudStorage.loadHeroes();
        const cloudHeroes = cloudResult.heroes || [];
        const localHeroes = AppState.heroes.map(h => h.toJSON());
        
        let finalHeroes = [];
        
        switch (strategy) {
            case 'cloud_wins':
                finalHeroes = cloudHeroes;
                break;
                
            case 'local_wins':
                finalHeroes = localHeroes;
                break;
                
            case 'merge':
            default:
                // Fusionner en évitant les doublons par nom
                const merged = new Map();
                
                // Ajouter les héros locaux
                localHeroes.forEach(hero => {
                    merged.set(hero.nom, {
                        ...hero,
                        source: 'local',
                        updatedAt: hero.updatedAt || new Date().toISOString()
                    });
                });
                
                // Ajouter/mettre à jour avec les héros cloud
                cloudHeroes.forEach(hero => {
                    const existing = merged.get(hero.nom);
                    if (!existing || new Date(hero.updatedAt) > new Date(existing.updatedAt)) {
                        merged.set(hero.nom, {
                            ...hero,
                            source: 'cloud'
                        });
                    }
                });
                
                finalHeroes = Array.from(merged.values());
                break;
        }
        
        // Reconstruire la liste des héros
        AppState.heroes = [];
        finalHeroes.forEach(data => {
            const hero = createHeroFromData(data);
            if (hero) AppState.heroes.push(hero);
        });
        
        // Sauvegarder le résultat
        await saveHeroes();
        
        return true;
    } catch (error) {
        console.error('Erreur lors de la résolution de synchronisation:', error);
        return false;
    }
}

// Utilitaire pour générer un ID unique
function generateHeroId() {
    return 'hero_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Auto-sauvegarde périodique
let autoSaveInterval = null;

export function startAutoSave(intervalMs = 30000) {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    autoSaveInterval = setInterval(async () => {
        if (AppState.heroes.length > 0) {
            await saveHeroes();
            console.log('🔄 Auto-sauvegarde effectuée');
        }
    }, intervalMs);
}

export function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Export des statistiques des héros
export function exportHeroesStats() {
    if (AppState.heroes.length === 0) {
        alert('Aucun héros à exporter !');
        return;
    }

    const stats = {
        totalHeroes: AppState.heroes.length,
        heroDetails: AppState.heroes.map(hero => ({
            nom: hero.nom,
            classe: hero.classe,
            niveau: hero.niveau || 1,
            force: hero.force,
            agility: hero.agility,
            magic: hero.magic,
            defense: hero.defense,
            victoires: hero.victoires || 0,
            defaites: hero.defaites || 0,
            ratio: hero.victoires && hero.defaites ? (hero.victoires / (hero.victoires + hero.defaites) * 100).toFixed(1) + '%' : 'N/A',
            createdAt: hero.createdAt
        })),
        classeDistribution: {},
        totalBattles: 0,
        exportDate: new Date().toISOString()
    };

    // Calculer la distribution par classe
    AppState.heroes.forEach(hero => {
        stats.classeDistribution[hero.classe] = (stats.classeDistribution[hero.classe] || 0) + 1;
        stats.totalBattles += (hero.victoires || 0) + (hero.defaites || 0);
    });

    // Créer le fichier CSV
    const csvHeader = 'Nom,Classe,Force,Agilité,Magie,Défense,Victoires,Défaites,Ratio,Date de création\n';
    const csvRows = stats.heroDetails.map(hero => 
        `"${hero.nom}","${hero.classe}",${hero.force},${hero.agility},${hero.magic},${hero.defense},${hero.victoires},${hero.defaites},"${hero.ratio}","${hero.createdAt}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `heroes-stats-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Statistiques de ${stats.totalHeroes} héros exportées !`);
}

// Fonctions héritées pour compatibilité
export function saveHeroesToFile() {
    const heroesData = AppState.heroes.map(hero => hero.toJSON());
    const dataStr = JSON.stringify({ heroes: heroesData, exportDate: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `heroes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Héros sauvegardés dans un fichier !');
}

export function loadHeroesFromFile() {
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
                if (confirm(`Charger ${data.heroes.length} héros depuis le fichier ?\nCela remplacera vos héros actuels.`)) {
                    AppState.heroes = [];
                    data.heroes.forEach(heroData => {
                        const hero = createHeroFromData(heroData);
                        if (hero) AppState.heroes.push(hero);
                    });
                    
                    await saveHeroes();
                    alert(`${AppState.heroes.length} héros chargés !`);
                    return true;
                }
            } else {
                alert('Format de fichier invalide');
            }
        } catch (error) {
            alert('Erreur lors du chargement : ' + error.message);
        }
        return false;
    };
    
    input.click();
}

export function saveHeroesToLocalStorage() {
    try {
        const heroesData = AppState.heroes.map(hero => hero.toJSON());
        localStorage.setItem('heroes', JSON.stringify(heroesData));
        alert('Héros sauvegardés localement !');
    } catch (error) {
        alert('Erreur de sauvegarde : ' + error.message);
    }
}

export function loadHeroesFromLocalStorage() {
    return loadHeroes();
}

// Démarrer l'auto-sauvegarde par défaut
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        startAutoSave();
    });
    
    // Sauvegarder avant fermeture
    window.addEventListener('beforeunload', async (e) => {
        if (AppState.heroes.length > 0) {
            await saveHeroes();
        }
    });
}