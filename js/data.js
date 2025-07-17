// ============= GESTION DES DONNÉES AVEC FICHIERS JSON =============
import { AppState } from './config.js';
import { createHero } from './classes.js';

// Vérifier si l'API File System Access est supportée
const supportsFileSystemAccess = 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;

// ============= SAUVEGARDE VERS FICHIER JSON =============

// Sauvegarder les héros dans un fichier JSON
export async function saveHeroesToFile() {
    if (AppState.heroes.length === 0) {
        alert('Aucun héros à sauvegarder !');
        return false;
    }

    const heroesData = {
        version: "1.0",
        dateCreation: new Date().toISOString(),
        heroes: AppState.heroes.map(hero => hero.toJSON())
    };

    const jsonString = JSON.stringify(heroesData, null, 2);

    try {
        if (supportsFileSystemAccess) {
            // Utiliser l'API moderne File System Access
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `heroes_${new Date().toISOString().split('T')[0]}.json`,
                types: [{
                    description: 'Fichiers JSON',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            const writable = await fileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();

            alert('Héros sauvegardés avec succès !');
            return true;
        } else {
            // Fallback : téléchargement via blob
            downloadHeroesAsJSON(jsonString);
            return true;
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            alert('Erreur lors de la sauvegarde : ' + error.message);
        }
        return false;
    }
}

// Fallback : téléchargement via blob
function downloadHeroesAsJSON(jsonString) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heroes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Fichier téléchargé ! Vos héros sont sauvegardés.');
}

// ============= CHARGEMENT DEPUIS FICHIER JSON =============

// Charger les héros depuis un fichier JSON
export async function loadHeroesFromFile() {
    try {
        let fileContent;

        if (supportsFileSystemAccess) {
            // Utiliser l'API moderne File System Access
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Fichiers JSON',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            const file = await fileHandle.getFile();
            fileContent = await file.text();
        } else {
            // Fallback : input file
            fileContent = await selectAndReadFile();
        }

        return await processHeroesFile(fileContent);

    } catch (error) {
        if (error.name !== 'AbortError') {
            alert('Erreur lors du chargement : ' + error.message);
        }
        return false;
    }
}

// Fallback pour la sélection de fichier
function selectAndReadFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                reject(new Error('Aucun fichier sélectionné'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
            reader.readAsText(file);
        };

        input.click();
    });
}

// Traiter le contenu du fichier de héros
async function processHeroesFile(fileContent) {
    try {
        const data = JSON.parse(fileContent);
        
        // Vérifier la structure du fichier
        if (!data.heroes || !Array.isArray(data.heroes)) {
            throw new Error('Format de fichier invalide : propriété "heroes" manquante');
        }

        // Demander confirmation si des héros existent déjà
        if (AppState.heroes.length > 0) {
            const replace = confirm(
                `Vous avez déjà ${AppState.heroes.length} héros. Voulez-vous les remplacer ?\n` +
                `(Annuler pour ajouter les nouveaux héros aux existants)`
            );
            
            if (replace) {
                AppState.heroes = [];
                AppState.fighter1 = null;
                AppState.fighter2 = null;
            }
        }

        // Charger les héros
        let successCount = 0;
        data.heroes.forEach(heroData => {
            const hero = createHero(
                heroData.nom,
                heroData.avatar,
                heroData.classe,
                heroData.force,
                heroData.agility,
                heroData.magic,
                heroData.defense
            );

            if (hero) {
                // Restaurer les statistiques
                hero.victoires = heroData.victoires || 0;
                hero.defaites = heroData.defaites || 0;
                AppState.heroes.push(hero);
                successCount++;
            }
        });

        if (successCount > 0) {
            alert(`${successCount} héros chargés avec succès !`);
            // Sauvegarder automatiquement dans localStorage comme backup
            saveHeroesToLocalStorage();
            return true;
        } else {
            alert('Aucun héros valide trouvé dans le fichier !');
            return false;
        }

    } catch (error) {
        alert('Erreur lors de l\'analyse du fichier : ' + error.message);
        return false;
    }
}

// ============= GESTION HYBRIDE (JSON + localStorage) =============

// Sauvegarder dans localStorage (backup automatique)
export function saveHeroesToLocalStorage() {
    const heroesData = AppState.heroes.map(hero => hero.toJSON());
    localStorage.setItem('heroes', JSON.stringify(heroesData));
}

// Charger depuis localStorage (chargement automatique)
export function loadHeroesFromLocalStorage() {
    try {
        const saved = localStorage.getItem('heroes');
        if (!saved) return false;

        const heroesData = JSON.parse(saved);
        AppState.heroes = [];

        heroesData.forEach(data => {
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
                hero.victoires = data.victoires || 0;
                hero.defaites = data.defaites || 0;
                AppState.heroes.push(hero);
            }
        });

        return true;
    } catch (error) {
        console.log('Erreur lors du chargement automatique:', error);
        return false;
    }
}

// Chargement automatique au démarrage (localStorage)
export function autoLoadHeroes() {
    loadHeroesFromLocalStorage();
}

// ============= FONCTIONS DE COMPATIBILITÉ =============

// Pour la compatibilité avec l'ancien système
export function saveHeroes() {
    return saveHeroesToLocalStorage();
}

export function loadHeroes() {
    const saved = localStorage.getItem('heroes');
    if (!saved) {
        alert('Aucune sauvegarde trouvée !');
        return false;
    }
    
    try {
        const heroesData = JSON.parse(saved);
        AppState.heroes = [];
        
        heroesData.forEach(data => {
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
                hero.victoires = data.victoires || 0;
                hero.defaites = data.defaites || 0;
                AppState.heroes.push(hero);
            }
        });
        
        alert(`${AppState.heroes.length} héros chargés avec succès !`);
        return true;
    } catch (error) {
        alert('Erreur lors du chargement : ' + error.message);
        return false;
    }
}

// ============= GESTION DES HÉROS =============

// Supprimer tous les héros
export function clearAllHeroes() {
    if (AppState.heroes.length === 0) return false;

    if (confirm('Êtes-vous sûr de vouloir supprimer tous les héros ?')) {
        AppState.heroes = [];
        AppState.fighter1 = null;
        AppState.fighter2 = null;
        saveHeroesToLocalStorage();
        return true;
    }
    return false;
}

// Supprimer un héros
export function deleteHero(index) {
    if (index < 0 || index >= AppState.heroes.length) return false;

    if (confirm(`Êtes-vous sûr de vouloir supprimer ${AppState.heroes[index].nom} ?`)) {
        AppState.heroes.splice(index, 1);
        saveHeroesToLocalStorage();
        return true;
    }
    return false;
}

// ============= UTILITAIRES =============

// Vérifier la compatibilité des API
export function checkFileAPISupport() {
    return {
        fileSystemAccess: supportsFileSystemAccess,
        fileReader: 'FileReader' in window,
        blob: 'Blob' in window
    };
}

// Exporter les statistiques
export async function exportHeroesStats() {
    if (AppState.heroes.length === 0) {
        alert('Aucun héros à exporter !');
        return;
    }

    const stats = {
        totalHeroes: AppState.heroes.length,
        totalVictoires: AppState.heroes.reduce((sum, hero) => sum + hero.victoires, 0),
        totalDefaites: AppState.heroes.reduce((sum, hero) => sum + hero.defaites, 0),
        classeDistribution: {},
        heroes: AppState.heroes.map(hero => ({
            nom: hero.nom,
            classe: hero.classe,
            victoires: hero.victoires,
            defaites: hero.defaites,
            ratio: hero.defaites > 0 ? (hero.victoires / hero.defaites).toFixed(2) : hero.victoires
        }))
    };

    // Calculer la distribution des classes
    AppState.heroes.forEach(hero => {
        stats.classeDistribution[hero.classe] = (stats.classeDistribution[hero.classe] || 0) + 1;
    });

    const jsonString = JSON.stringify(stats, null, 2);
    
    if (supportsFileSystemAccess) {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `heroes_stats_${new Date().toISOString().split('T')[0]}.json`,
                types: [{
                    description: 'Fichiers JSON',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            const writable = await fileHandle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            alert('Statistiques exportées avec succès !');
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('Erreur lors de l\'export : ' + error.message);
            }
        }
    } else {
        downloadHeroesAsJSON(jsonString);
    }
}