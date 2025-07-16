// ============= TESTS SIMPLES =============

import { Hero, Guerrier, Mage, Archer, Paladin, createHero } from './classes.js';
import { validateStats, generateRandomStats, randomBetween } from './utils.js';
import { AppState } from './config.js';

/**
 * Classe de test simple pour vérifier le bon fonctionnement des modules
 */
export class SimpleTestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    /**
     * Ajoute un test
     * @param {string} name - Nom du test
     * @param {Function} testFunction - Fonction de test
     */
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * Exécute tous les tests
     */
    async runAllTests() {
        console.log('🧪 Début des tests...\n');
        
        for (const test of this.tests) {
            await this.runSingleTest(test);
        }
        
        this.displayResults();
    }

    /**
     * Exécute un test individuel
     * @param {Object} test - Test à exécuter
     */
    async runSingleTest(test) {
        this.results.total++;
        
        try {
            const result = await test.testFunction();
            if (result) {
                this.results.passed++;
                console.log(`✅ ${test.name}`);
            } else {
                this.results.failed++;
                console.log(`❌ ${test.name} - Échec`);
            }
        } catch (error) {
            this.results.failed++;
            console.error(`❌ ${test.name} - Erreur:`, error.message);
        }
    }

    /**
     * Affiche les résultats des tests
     */
    displayResults() {
        console.log('\n📊 Résultats des tests:');
        console.log(`✅ Réussis: ${this.results.passed}`);
        console.log(`❌ Échoués: ${this.results.failed}`);
        console.log(`📈 Total: ${this.results.total}`);
        console.log(`🎯 Taux de réussite: ${Math.round((this.results.passed / this.results.total) * 100)}%`);
    }

    /**
     * Fonction d'assertion simple
     * @param {boolean} condition - Condition à vérifier
     * @param {string} message - Message d'erreur
     */
    assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
        return true;
    }

    /**
     * Compare deux valeurs
     * @param {any} actual - Valeur actuelle
     * @param {any} expected - Valeur attendue
     * @param {string} message - Message d'erreur
     */
    assertEqual(actual, expected, message = '') {
        const defaultMessage = `Expected ${expected}, got ${actual}`;
        return this.assert(actual === expected, message || defaultMessage);
    }

    /**
     * Vérifie qu'une valeur est dans une plage
     * @param {number} value - Valeur à vérifier
     * @param {number} min - Minimum
     * @param {number} max - Maximum
     */
    assertInRange(value, min, max) {
        return this.assert(value >= min && value <= max, `Value ${value} not in range [${min}, ${max}]`);
    }
}

// Créer une instance de test
const testRunner = new SimpleTestRunner();

// ============= TESTS DES CLASSES =============

testRunner.addTest('Création de héros de base', () => {
    const hero = new Hero('TestHero', 'test.png', 15, 20, 25, 30);
    testRunner.assertEqual(hero.nom, 'TestHero');
    testRunner.assertEqual(hero.force, 15);
    testRunner.assertEqual(hero.agility, 20);
    testRunner.assertEqual(hero.magic, 25);
    testRunner.assertEqual(hero.defense, 30);
    testRunner.assert(hero.estVivant(), 'Hero should be alive');
    testRunner.assert(hero.pv > 0, 'Hero should have positive HP');
    return true;
});

testRunner.addTest('Création de Guerrier avec bonus', () => {
    const guerrier = new Guerrier('Conan', 'warrior.png', 20, 15, 10, 25);
    // Le guerrier devrait avoir +20% en force
    testRunner.assertEqual(guerrier.force, 24); // 20 * 1.2 = 24
    testRunner.assertEqual(guerrier.classe, 'Guerrier');
    testRunner.assert(!guerrier.rageActive, 'Rage should not be active initially');
    return true;
});

testRunner.addTest('Création de Mage avec bonus', () => {
    const mage = new Mage('Gandalf', 'mage.png', 10, 15, 30, 15);
    // Le mage devrait avoir +20% en magie
    testRunner.assertEqual(mage.magic, 36); // 30 * 1.2 = 36
    testRunner.assertEqual(mage.classe, 'Mage');
    testRunner.assert(!mage.bouclierActif, 'Shield should not be active initially');
    return true;
});

testRunner.addTest('Factory createHero', () => {
    const archer = createHero('Legolas', 'archer.png', 'Archer', 15, 25, 10, 20);
    testRunner.assert(archer instanceof Archer, 'Should create Archer instance');
    testRunner.assertEqual(archer.nom, 'Legolas');
    testRunner.assertEqual(archer.agility, 30); // 25 * 1.2 = 30
    return true;
});

// ============= TESTS DES UTILITAIRES =============

testRunner.addTest('Génération de nombres aléatoires', () => {
    for (let i = 0; i < 100; i++) {
        const num = randomBetween(10, 20);
        testRunner.assertInRange(num, 10, 20);
    }
    return true;
});

testRunner.addTest('Génération de stats aléatoires', () => {
    const stats = generateRandomStats(90);
    const total = stats.force + stats.agility + stats.magic + stats.defense;
    testRunner.assertEqual(total, 90);
    
    // Vérifier que chaque stat est dans la plage valide
    testRunner.assertInRange(stats.force, 10, 40);
    testRunner.assertInRange(stats.agility, 10, 40);
    testRunner.assertInRange(stats.magic, 10, 40);
    testRunner.assertInRange(stats.defense, 10, 40);
    return true;
});

testRunner.addTest('Validation des stats', () => {
    // Stats valides
    const validStats = { force: 20, agility: 25, magic: 30, defense: 25 };
    const validResult = validateStats(validStats);
    testRunner.assert(validResult.isValid, 'Valid stats should pass validation');
    testRunner.assertEqual(validResult.total, 100);
    
    // Stats invalides (trop de points)
    const invalidStats = { force: 40, agility: 40, magic: 40, defense: 40 };
    const invalidResult = validateStats(invalidStats);
    testRunner.assert(!invalidResult.isValid, 'Invalid stats should fail validation');
    testRunner.assertEqual(invalidResult.total, 160);
    
    return true;
});

// ============= TESTS DE COMBAT =============

testRunner.addTest('Combat de base', () => {
    const hero1 = new Guerrier('Fighter1', 'test1.png', 25, 15, 10, 20);
    const hero2 = new Archer('Fighter2', 'test2.png', 20, 25, 15, 10);
    
    // Sauvegarder les PV initiaux
    const initialHp1 = hero1.pv;
    const initialHp2 = hero2.pv;
    
    // Simuler une attaque
    const degats = hero1.attaquer();
    testRunner.assert(degats > 0, 'Attack should deal damage');
    
    // Vérifier que les héros sont vivants au début
    testRunner.assert(hero1.estVivant(), 'Hero1 should be alive');
    testRunner.assert(hero2.estVivant(), 'Hero2 should be alive');
    
    return true;
});

testRunner.addTest('Système de badges', () => {
    const hero = new Hero('BadgeTest', 'test.png', 20, 20, 20, 20);
    
    // Pas de badge au début
    testRunner.assertEqual(hero.getBadge(), null);
    testRunner.assertEqual(hero.getBadgeText(), null);
    
    // Badge bronze à 5 victoires
    hero.victoires = 5;
    testRunner.assertEqual(hero.getBadge(), 'bronze');
    testRunner.assertEqual(hero.getBadgeText(), 'Expérimenté');
    
    // Badge argent à 10 victoires
    hero.victoires = 10;
    testRunner.assertEqual(hero.getBadge(), 'silver');
    testRunner.assertEqual(hero.getBadgeText(), 'Vétéran');
    
    // Badge or à 20 victoires
    hero.victoires = 20;
    testRunner.assertEqual(hero.getBadge(), 'gold');
    testRunner.assertEqual(hero.getBadgeText(), 'Légendaire');
    
    return true;
});

testRunner.addTest('Calcul des ratios', () => {
    const hero = new Hero('RatioTest', 'test.png', 20, 20, 20, 20);
    
    // Pas de combats
    testRunner.assertEqual(hero.getRatio(), 0);
    
    // 3 victoires, 2 défaites = 60%
    hero.victoires = 3;
    hero.defaites = 2;
    testRunner.assertEqual(hero.getRatio(), 60);
    
    // 10 victoires, 0 défaite = 100%
    hero.victoires = 10;
    hero.defaites = 0;
    testRunner.assertEqual(hero.getRatio(), 100);
    
    return true;
});

// ============= TESTS DES POUVOIRS SPÉCIAUX =============

testRunner.addTest('Rage du Guerrier', () => {
    const guerrier = new Guerrier('Berserker', 'test.png', 30, 15, 10, 20);
    
    // Pas de rage au début
    testRunner.assert(!guerrier.rageActive, 'Rage should not be active initially');
    
    // Simuler des dégâts pour déclencher la rage (sous 40% PV)
    guerrier.pv = Math.floor(guerrier.pvMax * 0.3); // 30% des PV
    
    const powerCheck = guerrier.checkPassivePower();
    testRunner.assertEqual(powerCheck, 'rage', 'Should trigger rage power');
    testRunner.assert(guerrier.rageActive, 'Rage should be active after trigger');
    testRunner.assertEqual(guerrier.rageTurns, 3, 'Rage should last 3 turns');
    
    return true;
});

testRunner.addTest('Bouclier du Mage', () => {
    const mage = new Mage('Wizard', 'test.png', 10, 15, 30, 20);
    
    // Pas de bouclier au début
    testRunner.assert(!mage.bouclierActif, 'Shield should not be active initially');
    
    // Activer le bouclier
    const bouclierPoints = mage.activerBouclier();
    testRunner.assert(mage.bouclierActif, 'Shield should be active after activation');
    testRunner.assert(bouclierPoints > 0, 'Shield should have points');
    
    // Tester l'absorption de dégâts
    const degatsInitiaux = 50;
    const degatsAbsorbes = mage.absorberDegats(degatsInitiaux);
    testRunner.assert(degatsAbsorbes < degatsInitiaux, 'Shield should absorb some damage');
    
    return true;
});

testRunner.addTest('Tir Multiple de l\'Archer', () => {
    const archer = new Archer('Marksman', 'test.png', 20, 30, 10, 15);
    
    // Tir multiple disponible au début
    testRunner.assert(archer.tirMultipleReady, 'Multiple shot should be ready initially');
    
    // Utiliser le tir multiple
    const tirs = archer.tirMultiple();
    testRunner.assert(Array.isArray(tirs), 'Should return array of shots');
    testRunner.assertInRange(tirs.length, 2, 3, 'Should fire 2-3 arrows');
    testRunner.assert(!archer.tirMultipleReady, 'Multiple shot should not be ready after use');
    
    // Recharger
    archer.rechargerTirMultiple();
    testRunner.assert(archer.tirMultipleReady, 'Multiple shot should be ready after reload');
    
    return true;
});

testRunner.addTest('Aura du Paladin', () => {
    const paladin = new Paladin('Guardian', 'test.png', 20, 15, 25, 30);
    
    // Pas d'aura au début
    testRunner.assert(!paladin.auraActive, 'Aura should not be active initially');
    
    // Activer l'aura
    paladin.activerAura();
    testRunner.assert(paladin.auraActive, 'Aura should be active after activation');
    testRunner.assertEqual(paladin.auraTurns, 4, 'Aura should last 4 turns');
    
    // Tester la guérison
    paladin.pv = paladin.pvMax - 50; // Réduire les PV
    const pvAvant = paladin.pv;
    const soin = paladin.processAura();
    testRunner.assert(soin > 0, 'Aura should provide healing');
    testRunner.assert(paladin.pv > pvAvant, 'HP should increase after aura healing');
    
    return true;
});

// ============= TESTS D'INTÉGRATION =============

testRunner.addTest('Sérialisation des héros', () => {
    const guerrier = new Guerrier('SerializeTest', 'test.png', 25, 15, 10, 20);
    guerrier.victoires = 5;
    guerrier.defaites = 2;
    
    const json = guerrier.toJSON();
    testRunner.assertEqual(json.nom, 'SerializeTest');
    testRunner.assertEqual(json.classe, 'Guerrier');
    testRunner.assertEqual(json.victoires, 5);
    testRunner.assertEqual(json.defaites, 2);
    
    return true;
});

testRunner.addTest('Recréation de héros depuis JSON', () => {
    const data = {
        nom: 'RecreateTest',
        classe: 'Mage',
        avatar: 'test.png',
        force: 15,
        agility: 20,
        magic: 35,
        defense: 25,
        victoires: 8,
        defaites: 3
    };
    
    const mage = createHero(data.nom, data.avatar, data.classe, data.force, data.agility, data.magic, data.defense);
    testRunner.assert(mage instanceof Mage, 'Should recreate Mage instance');
    testRunner.assertEqual(mage.nom, data.nom);
    testRunner.assertEqual(mage.classe, data.classe);
    
    // Restaurer les stats
    mage.victoires = data.victoires;
    mage.defaites = data.defaites;
    testRunner.assertEqual(mage.victoires, 8);
    testRunner.assertEqual(mage.defaites, 3);
    
    return true;
});

// ============= FONCTION D'EXPORT POUR LANCER LES TESTS =============

/**
 * Lance tous les tests et retourne les résultats
 * @returns {Promise<Object>} Résultats des tests
 */
export async function runTests() {
    await testRunner.runAllTests();
    return testRunner.results;
}

/**
 * Lance les tests depuis la console
 */
export function runTestsFromConsole() {
    console.log('🎮 Lancement des tests Heroes Arena...\n');
    runTests().then((results) => {
        if (results.failed === 0) {
            console.log('\n🎉 Tous les tests sont passés ! L\'application est prête.');
        } else {
            console.log(`\n⚠️ ${results.failed} test(s) ont échoué. Vérifiez les erreurs ci-dessus.`);
        }
    });
}

// Si ce fichier est chargé directement, lancer les tests
if (typeof window !== 'undefined' && window.location.search.includes('test')) {
    runTestsFromConsole();
}