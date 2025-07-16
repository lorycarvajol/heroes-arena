// ============= GESTION DES DONNÉES =============

import { AppState } from './config.js';
import { createHero } from './classes.js';

// Sauvegarde des héros
export function saveHeroes() {
    const heroesData = AppState.heroes.map(hero => hero.toJSON());
    localStorage.setItem('heroes', JSON.stringify(heroesData));
}

// Chargement des héros
export function loadHeroes() {
    try {
        const saved = localStorage.getItem('heroes');
        if (!saved) {
            alert('Aucune sauvegarde trouvée !');
            return false;
        }
        
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
                // Restaurer les statistiques
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

// Chargement automatique au démarrage
export function autoLoadHeroes() {
    const saved = localStorage.getItem('heroes');
    if (saved) {
        try {
            const heroesData = JSON.parse(saved);
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
                    // Restaurer les statistiques
                    hero.victoires = data.victoires || 0;
                    hero.defaites = data.defaites || 0;
                    AppState.heroes.push(hero);
                }
            });
        } catch (error) {
            console.log('Erreur lors du chargement automatique:', error);
        }
    }
}

// Supprimer tous les héros
export function clearAllHeroes() {
    if (AppState.heroes.length === 0) return false;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les héros ?')) {
        AppState.heroes = [];
        AppState.fighter1 = null;
        AppState.fighter2 = null;
        saveHeroes();
        return true;
    }
    return false;
}

// Supprimer un héros
export function deleteHero(index) {
    if (index < 0 || index >= AppState.heroes.length) return false;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${AppState.heroes[index].nom} ?`)) {
        AppState.heroes.splice(index, 1);
        saveHeroes();
        return true;
    }
    return false;
}