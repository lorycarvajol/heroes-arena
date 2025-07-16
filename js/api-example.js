// ============= EXEMPLES D'UTILISATION DE L'API HEROES ARENA =============

/*
 * Ce fichier montre comment utiliser l'API modularisée pour créer
 * des extensions, des fonctionnalités personnalisées ou intégrer
 * Heroes Arena dans d'autres applications.
 */

import { AppState } from './config.js';
import { createHero } from './classes.js';
import { saveHeroes, loadHeroes } from './data.js';
import { eventManager } from './events.js';
import { generateRandomStats, randomBetween } from './utils.js';

// ============= EXTENSION : GÉNÉRATEUR DE HÉROS AUTOMATIQUE =============

export class HeroGenerator {
    constructor() {
        this.noms = {
            Guerrier: ['Thorin', 'Ragnar', 'Conan', 'Björn', 'Erik', 'Magnus', 'Olaf', 'Gunnar'],
            Mage: ['Gandalf', 'Merlin', 'Saruman', 'Elrond', 'Dumbledore', 'Radagast', 'Prospero', 'Morgana'],
            Archer: ['Legolas', 'Robin', 'Katniss', 'Hawkeye', 'Green Arrow', 'Artemis', 'Diana', 'Sylvanas'],
            Paladin: ['Arthas', 'Uther', 'Tyrael', 'Gareth', 'Percival', 'Galahad', 'Lancelot', 'Gawain']
        };
    }

    /**
     * Génère un héros aléatoire
     * @param {string} classe - Classe souhaitée (optionnel)
     * @returns {Object} Héros généré
     */
    genererHeroAleatoire(classe = null) {
        const classes = ['Guerrier', 'Mage', 'Archer', 'Paladin'];
        const classeChoisie = classe || classes[randomBetween(0, classes.length - 1)];
        
        // Nom aléatoire
        const nomsDisponibles = this.noms[classeChoisie];
        const nomBase = nomsDisponibles[randomBetween(0, nomsDisponibles.length - 1)];
        const nomUnique = this.genererNomUnique(nomBase);
        
        // Avatar aléatoire
        const avatar = this.choisirAvatarAleatoire(classeChoisie);
        
        // Stats aléatoires mais équilibrées
        const stats = this.genererStatsEquilibrees(classeChoisie);
        
        return createHero(nomUnique, avatar, classeChoisie, stats.force, stats.agility, stats.magic, stats.defense);
    }

    /**
     * Génère un nom unique
     * @param {string} nomBase - Nom de base
     * @returns {string} Nom unique
     */
    genererNomUnique(nomBase) {
        let nom = nomBase;
        let compteur = 1;
        
        while (AppState.heroes.some(hero => hero.nom === nom)) {
            nom = `${nomBase}${compteur}`;
            compteur++;
        }
        
        return nom;
    }

    /**
     * Choisit un avatar aléatoire pour une classe
     * @param {string} classe - Classe du héros
     * @returns {string} Nom du fichier avatar
     */
    choisirAvatarAleatoire(classe) {
        const mappingClasse = {
            'Guerrier': 'guerriers',
            'Mage': 'mages',
            'Archer': 'archers',
            'Paladin': 'paladins'
        };
        
        const categorie = mappingClasse[classe] || 'generiques';
        const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png']; // Simplifiez selon vos avatars
        
        return avatars[randomBetween(0, avatars.length - 1)];
    }

    /**
     * Génère des stats équilibrées selon la classe
     * @param {string} classe - Classe du héros
     * @returns {Object} Stats équilibrées
     */
    genererStatsEquilibrees(classe) {
        const stats = generateRandomStats(95); // Un peu plus de points pour les héros générés
        
        // Ajuster selon la classe
        switch (classe) {
            case 'Guerrier':
                stats.force = Math.min(40, stats.force + 5);
                stats.magic = Math.max(10, stats.magic - 3);
                break;
            case 'Mage':
                stats.magic = Math.min(40, stats.magic + 5);
                stats.force = Math.max(10, stats.force - 3);
                break;
            case 'Archer':
                stats.agility = Math.min(40, stats.agility + 5);
                stats.defense = Math.max(10, stats.defense - 3);
                break;
            case 'Paladin':
                stats.defense = Math.min(40, stats.defense + 5);
                stats.agility = Math.max(10, stats.agility - 3);
                break;
        }
        
        return stats;
    }

    /**
     * Génère une équipe complète
     * @param {number} nombreHeros - Nombre de héros à générer
     * @returns {Array} Équipe de héros
     */
    genererEquipe(nombreHeros = 4) {
        const equipe = [];
        const classes = ['Guerrier', 'Mage', 'Archer', 'Paladin'];
        
        for (let i = 0; i < nombreHeros; i++) {
            const classe = classes[i % classes.length];
            const hero = this.genererHeroAleatoire(classe);
            equipe.push(hero);
            AppState.heroes.push(hero);
        }
        
        return equipe;
    }
}

// ============= EXTENSION : SYSTÈME DE TOURNOI =============

export class TournamentManager {
    constructor() {
        this.participants = [];
        this.matchs = [];
        this.resultats = [];
    }

    /**
     * Lance un tournoi avec tous les héros disponibles
     * @returns {Object} Résultats du tournoi
     */
    lancerTournoi() {
        if (AppState.heroes.length < 4) {
            throw new Error('Il faut au moins 4 héros pour un tournoi');
        }

        this.participants = [...AppState.heroes];
        this.matchs = [];
        this.resultats = [];

        console.log(`🏆 Début du tournoi avec ${this.participants.length} participants !`);

        // Générer les matchs
        this.genererMatchs();
        
        // Simuler le tournoi
        return this.simulerTournoi();
    }

    /**
     * Génère les matchs du tournoi
     */
    genererMatchs() {
        const participants = [...this.participants];
        
        // Mélanger les participants
        for (let i = participants.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [participants[i], participants[j]] = [participants[j], participants[i]];
        }

        // Créer les paires
        for (let i = 0; i < participants.length - 1; i += 2) {
            if (participants[i + 1]) {
                this.matchs.push({
                    combattant1: participants[i],
                    combattant2: participants[i + 1],
                    round: 'Éliminatoires'
                });
            }
        }
    }

    /**
     * Simule le tournoi complet
     * @returns {Object} Résultats finaux
     */
    simulerTournoi() {
        let survivants = [...this.participants];
        let round = 1;

        while (survivants.length > 1) {
            const nouveauxSurvivants = [];
            const roundName = this.getNomRound(survivants.length);

            console.log(`\n🥊 ${roundName} - ${survivants.length} combattants`);

            for (let i = 0; i < survivants.length - 1; i += 2) {
                if (survivants[i + 1]) {
                    const vainqueur = this.simulerCombat(survivants[i], survivants[i + 1]);
                    nouveauxSurvivants.push(vainqueur);
                } else {
                    // Nombre impair, le dernier passe automatiquement
                    nouveauxSurvivants.push(survivants[i]);
                }
            }

            survivants = nouveauxSurvivants;
            round++;
        }

        const champion = survivants[0];
        console.log(`\n👑 Champion du tournoi : ${champion.nom} (${champion.classe}) !`);

        return {
            champion,
            participants: this.participants.length,
            matchsJoues: this.resultats.length
        };
    }

    /**
     * Simule un combat entre deux héros
     * @param {Object} hero1 - Premier combattant
     * @param {Object} hero2 - Deuxième combattant
     * @returns {Object} Vainqueur du combat
     */
    simulerCombat(hero1, hero2) {
        // Réinitialiser les PV
        hero1.pv = hero1.pvMax;
        hero2.pv = hero2.pvMax;

        console.log(`  ⚔️ ${hero1.nom} vs ${hero2.nom}`);

        let tours = 0;
        const maxTours = 50; // Éviter les combats infinis

        while (hero1.estVivant() && hero2.estVivant() && tours < maxTours) {
            // Tour de hero1
            if (hero1.estVivant()) {
                const degats = hero1.attaquer();
                hero2.pv = Math.max(0, hero2.pv - Math.max(1, degats - hero2.defense * 0.3));
            }

            // Tour de hero2
            if (hero2.estVivant()) {
                const degats = hero2.attaquer();
                hero1.pv = Math.max(0, hero1.pv - Math.max(1, degats - hero1.defense * 0.3));
            }

            tours++;
        }

        let vainqueur, perdant;
        if (!hero1.estVivant() && !hero2.estVivant()) {
            // Match nul, on utilise les PV restants
            vainqueur = hero1.pv >= hero2.pv ? hero1 : hero2;
            perdant = vainqueur === hero1 ? hero2 : hero1;
        } else {
            vainqueur = hero1.estVivant() ? hero1 : hero2;
            perdant = vainqueur === hero1 ? hero2 : hero1;
        }

        // Mettre à jour les statistiques
        vainqueur.victoires++;
        perdant.defaites++;

        console.log(`    🏆 ${vainqueur.nom} l'emporte !`);

        this.resultats.push({
            vainqueur: vainqueur.nom,
            perdant: perdant.nom,
            tours
        });

        return vainqueur;
    }

    /**
     * Obtient le nom du round selon le nombre de participants
     * @param {number} nombre - Nombre de participants
     * @returns {string} Nom du round
     */
    getNomRound(nombre) {
        if (nombre <= 2) return 'Finale';
        if (nombre <= 4) return 'Demi-finales';
        if (nombre <= 8) return 'Quarts de finale';
        if (nombre <= 16) return 'Huitièmes de finale';
        return 'Éliminatoires';
    }
}

// ============= EXTENSION : STATISTIQUES AVANCÉES =============

export class StatsManager {
    /**
     * Analyse les statistiques de tous les héros
     * @returns {Object} Rapport détaillé
     */
    analyserStatistiques() {
        const heroes = AppState.heroes;
        if (heroes.length === 0) {
            return { erreur: 'Aucun héros disponible pour l\'analyse' };
        }

        return {
            general: this.statistiquesGenerales(heroes),
            classes: this.statistiquesParClasse(heroes),
            badges: this.statistiquesBadges(heroes),
            combat: this.statistiquesCombat(heroes)
        };
    }

    /**
     * Statistiques générales
     * @param {Array} heroes - Liste des héros
     * @returns {Object} Stats générales
     */
    statistiquesGenerales(heroes) {
        const totalHeroes = heroes.length;
        const totalVictoires = heroes.reduce((sum, hero) => sum + hero.victoires, 0);
        const totalDefaites = heroes.reduce((sum, hero) => sum + hero.defaites, 0);
        
        return {
            totalHeroes,
            totalCombats: totalVictoires + totalDefaites,
            totalVictoires,
            totalDefaites,
            ratioGlobal: totalDefaites > 0 ? Math.round((totalVictoires / (totalVictoires + totalDefaites)) * 100) : 0
        };
    }

    /**
     * Statistiques par classe
     * @param {Array} heroes - Liste des héros
     * @returns {Object} Stats par classe
     */
    statistiquesParClasse(heroes) {
        const classes = {};
        
        heroes.forEach(hero => {
            if (!classes[hero.classe]) {
                classes[hero.classe] = {
                    nombre: 0,
                    victoires: 0,
                    defaites: 0,
                    statsTotal: { force: 0, agility: 0, magic: 0, defense: 0 }
                };
            }
            
            const classeStats = classes[hero.classe];
            classeStats.nombre++;
            classeStats.victoires += hero.victoires;
            classeStats.defaites += hero.defaites;
            classeStats.statsTotal.force += hero.force;
            classeStats.statsTotal.agility += hero.agility;
            classeStats.statsTotal.magic += hero.magic;
            classeStats.statsTotal.defense += hero.defense;
        });

        // Calculer les moyennes
        Object.keys(classes).forEach(classe => {
            const stats = classes[classe];
            const nombre = stats.nombre;
            
            stats.ratioVictoires = stats.defaites > 0 ? 
                Math.round((stats.victoires / (stats.victoires + stats.defaites)) * 100) : 0;
            
            stats.statsMoyennes = {
                force: Math.round(stats.statsTotal.force / nombre),
                agility: Math.round(stats.statsTotal.agility / nombre),
                magic: Math.round(stats.statsTotal.magic / nombre),
                defense: Math.round(stats.statsTotal.defense / nombre)
            };
        });

        return classes;
    }

    /**
     * Statistiques des badges
     * @param {Array} heroes - Liste des héros
     * @returns {Object} Stats des badges
     */
    statistiquesBadges(heroes) {
        const badges = { bronze: 0, silver: 0, gold: 0, none: 0 };
        
        heroes.forEach(hero => {
            const badge = hero.getBadge();
            if (badge) {
                badges[badge]++;
            } else {
                badges.none++;
            }
        });

        return badges;
    }

    /**
     * Statistiques de combat
     * @param {Array} heroes - Liste des héros
     * @returns {Object} Stats de combat
     */
    statistiquesCombat(heroes) {
        const heroesAvecCombats = heroes.filter(hero => hero.victoires + hero.defaites > 0);
        
        if (heroesAvecCombats.length === 0) {
            return { meilleurRatio: null, plusVictorieux: null, plusActif: null };
        }

        // Meilleur ratio
        const meilleurRatio = heroesAvecCombats.reduce((best, hero) => {
            return hero.getRatio() > best.getRatio() ? hero : best;
        });

        // Plus de victoires
        const plusVictorieux = heroes.reduce((best, hero) => {
            return hero.victoires > best.victoires ? hero : best;
        });

        // Plus actif (plus de combats)
        const plusActif = heroes.reduce((best, hero) => {
            const combatsHero = hero.victoires + hero.defaites;
            const combatsBest = best.victoires + best.defaites;
            return combatsHero > combatsBest ? hero : best;
        });

        return {
            meilleurRatio: { nom: meilleurRatio.nom, ratio: meilleurRatio.getRatio() },
            plusVictorieux: { nom: plusVictorieux.nom, victoires: plusVictorieux.victoires },
            plusActif: { nom: plusActif.nom, combats: plusActif.victoires + plusActif.defaites }
        };
    }
}

// ============= EXEMPLES D'UTILISATION =============

/**
 * Exemples d'utilisation de l'API Heroes Arena
 */
export class APIExamples {
    /**
     * Exemple 1 : Créer une équipe aléatoire
     */
    static async creerEquipeAleatoire() {
        console.log('📝 Exemple 1 : Création d\'une équipe aléatoire');
        
        const generator = new HeroGenerator();
        const equipe = generator.genererEquipe(4);
        
        console.log('🦸 Équipe générée :');
        equipe.forEach(hero => {
            console.log(`  - ${hero.nom} (${hero.classe}) - Force: ${hero.force}, Agilité: ${hero.agility}, Magie: ${hero.magic}, Défense: ${hero.defense}`);
        });
        
        // Sauvegarder automatiquement
        saveHeroes();
        
        return equipe;
    }

    /**
     * Exemple 2 : Lancer un tournoi automatique
     */
    static async lancerTournoiAutomatique() {
        console.log('\n🏆 Exemple 2 : Tournoi automatique');
        
        // S'assurer qu'on a assez de héros
        if (AppState.heroes.length < 4) {
            const generator = new HeroGenerator();
            generator.genererEquipe(8);
        }

        const tournament = new TournamentManager();
        const resultats = tournament.lancerTournoi();
        
        console.log('\n📊 Résultats du tournoi :');
        console.log(`Champion : ${resultats.champion.nom} (${resultats.champion.classe})`);
        console.log(`Participants : ${resultats.participants}`);
        console.log(`Matchs joués : ${resultats.matchsJoues}`);
        
        // Sauvegarder les résultats
        saveHeroes();
        
        return resultats;
    }

    /**
     * Exemple 3 : Analyser les statistiques
     */
    static analyserPerformances() {
        console.log('\n📈 Exemple 3 : Analyse des performances');
        
        const statsManager = new StatsManager();
        const rapport = statsManager.analyserStatistiques();
        
        console.log('📊 Rapport de statistiques :');
        console.log('Général :', rapport.general);
        console.log('Par classe :', rapport.classes);
        console.log('Badges :', rapport.badges);
        console.log('Combat :', rapport.combat);
        
        return rapport;
    }

    /**
     * Exemple 4 : Écouter les événements personnalisés
     */
    static configurerEvenements() {
        console.log('\n🎧 Exemple 4 : Configuration des événements');
        
        // Écouter la création de héros
        eventManager.on('heroCreated', (hero) => {
            console.log(`🎉 Nouveau héros créé via API : ${hero.nom}`);
        });

        // Écouter la fin des combats
        eventManager.on('combatFinished', (result) => {
            console.log(`⚔️ Combat terminé via API : ${result.winner} a vaincu ${result.loser}`);
        });

        console.log('✅ Événements configurés');
    }

    /**
     * Exemple complet : Démonstration de toutes les fonctionnalités
     */
    static async demonstrationComplete() {
        console.log('🚀 Démonstration complète de l\'API Heroes Arena\n');
        
        // 1. Configurer les événements
        this.configurerEvenements();
        
        // 2. Créer une équipe
        await this.creerEquipeAleatoire();
        
        // 3. Analyser les stats avant tournoi
        console.log('\n📊 Statistiques avant tournoi :');
        this.analyserPerformances();
        
        // 4. Lancer un tournoi
        await this.lancerTournoiAutomatique();
        
        // 5. Analyser les stats après tournoi
        console.log('\n📊 Statistiques après tournoi :');
        this.analyserPerformances();
        
        console.log('\n🎯 Démonstration terminée !');
    }
}

// ============= EXPOSITION DE L'API =============

// Exposer les classes pour utilisation externe
window.HeroesArenaAPI = {
    HeroGenerator,
    TournamentManager,
    StatsManager,
    APIExamples,
    
    // Raccourcis vers les fonctions principales
    genererHero: (classe) => new HeroGenerator().genererHeroAleatoire(classe),
    lancerTournoi: () => new TournamentManager().lancerTournoi(),
    analyserStats: () => new StatsManager().analyserStatistiques(),
    
    // États et utilitaires
    getAppState: () => AppState,
    eventManager
};

// Log de confirmation
console.log('🔌 API Heroes Arena chargée et prête à l\'utilisation !');
console.log('💡 Utilisez window.HeroesArenaAPI pour accéder aux fonctionnalités avancées');
console.log('📚 Exemple : window.HeroesArenaAPI.APIExamples.demonstrationComplete()');

export { HeroGenerator, TournamentManager, StatsManager, APIExamples };