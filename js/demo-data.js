// ============= DONNÉES DE DÉMONSTRATION =============

import { AppState } from './config.js';
import { createHero } from './classes.js';
import { saveHeroes } from './data.js';

/**
 * Crée des héros de démonstration pour tester l'application
 */
export function createDemoHeroes() {
    // Vérifier qu'il n'y a pas déjà des héros
    if (AppState.heroes.length > 0) {
        console.log('Des héros existent déjà, démonstration ignorée.');
        return;
    }

    const demoHeroes = [
        {
            nom: 'Aragorn',
            classe: 'Guerrier',
            avatar: 'warrior1.png',
            force: 30,
            agility: 25,
            magic: 15,
            defense: 30,
            victoires: 12,
            defaites: 3
        },
        {
            nom: 'Gandalf',
            classe: 'Mage',
            avatar: 'mage1.png',
            force: 18,
            agility: 20,
            magic: 35,
            defense: 27,
            victoires: 8,
            defaites: 2
        },
        {
            nom: 'Legolas',
            classe: 'Archer',
            avatar: 'archer1.png',
            force: 22,
            agility: 35,
            magic: 18,
            defense: 25,
            victoires: 15,
            defaites: 5
        },
        {
            nom: 'Tyrael',
            classe: 'Paladin',
            avatar: 'paladin1.png',
            force: 25,
            agility: 20,
            magic: 25,
            defense: 30,
            victoires: 6,
            defaites: 1
        },
        {
            nom: 'Conan',
            classe: 'Guerrier',
            avatar: 'warrior2.png',
            force: 35,
            agility: 20,
            magic: 10,
            defense: 35,
            victoires: 22,
            defaites: 8
        },
        {
            nom: 'Merlin',
            classe: 'Mage',
            avatar: 'mage2.png',
            force: 15,
            agility: 18,
            magic: 40,
            defense: 27,
            victoires: 4,
            defaites: 1
        }
    ];

    console.log('🎮 Création des héros de démonstration...');

    demoHeroes.forEach(data => {
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
            hero.victoires = data.victoires;
            hero.defaites = data.defaites;
            AppState.heroes.push(hero);
            console.log(`✅ ${hero.nom} le ${hero.classe} créé (${hero.victoires}V/${hero.defaites}D)`);
        }
    });

    // Sauvegarder les héros de démo
    saveHeroes();
    
    console.log(`🎉 ${AppState.heroes.length} héros de démonstration créés !`);
    
    // Afficher un badge pour un héros
    const conan = AppState.heroes.find(h => h.nom === 'Conan');
    if (conan && conan.getBadge()) {
        console.log(`🏆 ${conan.nom} a le badge ${conan.getBadgeText()} !`);
    }
}

/**
 * Remet à zéro les données et recrée la démo
 */
export function resetToDemo() {
    AppState.heroes = [];
    localStorage.removeItem('heroes');
    createDemoHeroes();
    
    // Rafraîchir l'affichage si on est sur la page des héros
    if (typeof window.HeroesArena !== 'undefined' && window.HeroesArena.showSection) {
        window.HeroesArena.showSection('heroes');
    }
}

/**
 * Ajoute quelques héros rapides pour les tests
 */
export function addQuickTestHeroes() {
    const quickHeroes = [
        { nom: 'TestWarrior', classe: 'Guerrier', stats: [25, 20, 15, 25] },
        { nom: 'TestMage', classe: 'Mage', stats: [15, 18, 30, 22] },
        { nom: 'TestArcher', classe: 'Archer', stats: [20, 28, 16, 21] },
        { nom: 'TestPaladin', classe: 'Paladin', stats: [22, 18, 20, 25] }
    ];

    quickHeroes.forEach(data => {
        // Vérifier que le nom n'existe pas déjà
        if (!AppState.heroes.some(h => h.nom === data.nom)) {
            const hero = createHero(
                data.nom,
                'default.png',
                data.classe,
                data.stats[0],
                data.stats[1],
                data.stats[2],
                data.stats[3]
            );
            
            if (hero) {
                AppState.heroes.push(hero);
            }
        }
    });

    saveHeroes();
    console.log('⚡ Héros de test rapides ajoutés !');
}

// Exposer les fonctions globalement pour debug
if (typeof window !== 'undefined') {
    window.DemoData = {
        createDemoHeroes,
        resetToDemo,
        addQuickTestHeroes
    };
}