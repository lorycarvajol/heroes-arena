// ============= TESTS SIMPLES DE VÉRIFICATION =============

/**
 * Tests simples pour vérifier que l'application fonctionne
 * À exécuter dans la console : testApp()
 */

// Fonction principale de test
window.testApp = function() {
    console.log('🧪 === TESTS DE VÉRIFICATION HEROES ARENA ===\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: API globale disponible
    try {
        if (typeof window.HeroesArena === 'object') {
            console.log('✅ Test 1: API HeroesArena disponible');
            passed++;
        } else {
            throw new Error('API non disponible');
        }
    } catch (error) {
        console.log('❌ Test 1: API HeroesArena manquante');
        failed++;
    }
    
    // Test 2: État de l'application
    try {
        const state = window.HeroesArena.getAppState();
        if (state && typeof state === 'object') {
            console.log('✅ Test 2: État de l\'application accessible');
            console.log(`   📊 ${state.heroes.length} héros chargés`);
            passed++;
        } else {
            throw new Error('État non accessible');
        }
    } catch (error) {
        console.log('❌ Test 2: État de l\'application inaccessible');
        failed++;
    }
    
    // Test 3: Éléments DOM critiques
    const elementsToCheck = [
        'heroName', 'heroClass', 'force', 'agility', 'magic', 'defense',
        'createBtn', 'heroesList', 'fighter1Select', 'fighter2Select',
        'fightBtn', 'combatLog'
    ];
    
    let domElementsFound = 0;
    elementsToCheck.forEach(id => {
        if (document.getElementById(id)) {
            domElementsFound++;
        }
    });
    
    if (domElementsFound === elementsToCheck.length) {
        console.log('✅ Test 3: Tous les éléments DOM trouvés');
        passed++;
    } else {
        console.log(`❌ Test 3: ${elementsToCheck.length - domElementsFound} éléments DOM manquants`);
        failed++;
    }
    
    // Test 4: Fonctions principales
    const functionsToCheck = [
        'showSection', 'createHero', 'updateStats', 'startFight'
    ];
    
    let functionsFound = 0;
    functionsToCheck.forEach(funcName => {
        if (typeof window.HeroesArena[funcName] === 'function') {
            functionsFound++;
        }
    });
    
    if (functionsFound === functionsToCheck.length) {
        console.log('✅ Test 4: Toutes les fonctions principales disponibles');
        passed++;
    } else {
        console.log(`❌ Test 4: ${functionsToCheck.length - functionsFound} fonctions manquantes`);
        failed++;
    }
    
    // Test 5: Création d'un héros de test
    try {
        const initialCount = window.HeroesArena.getAppState().heroes.length;
        
        // Simuler la création d'un héros
        document.getElementById('heroName').value = 'TestHero';
        document.getElementById('force').value = 25;
        document.getElementById('agility').value = 25;
        document.getElementById('magic').value = 25;
        document.getElementById('defense').value = 25;
        
        window.HeroesArena.updateStats();
        
        // Vérifier que le bouton est activé
        const createBtn = document.getElementById('createBtn');
        if (!createBtn.disabled) {
            console.log('✅ Test 5: Création de héros fonctionnelle (simulation)');
            passed++;
        } else {
            throw new Error('Bouton de création désactivé');
        }
        
        // Nettoyer
        document.getElementById('heroName').value = '';
        
    } catch (error) {
        console.log('❌ Test 5: Problème avec la création de héros');
        console.log(`   Erreur: ${error.message}`);
        failed++;
    }
    
    // Test 6: Navigation entre sections
    try {
        window.HeroesArena.showSection('heroes');
        const heroesSection = document.getElementById('heroes');
        if (heroesSection.classList.contains('active')) {
            console.log('✅ Test 6: Navigation entre sections fonctionnelle');
            passed++;
        } else {
            throw new Error('Section non activée');
        }
        
        // Revenir à la section de création
        window.HeroesArena.showSection('create');
        
    } catch (error) {
        console.log('❌ Test 6: Problème avec la navigation');
        failed++;
    }
    
    // Résultats finaux
    console.log('\n📊 === RÉSULTATS DES TESTS ===');
    console.log(`✅ Tests réussis: ${passed}`);
    console.log(`❌ Tests échoués: ${failed}`);
    console.log(`📈 Taux de réussite: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
        console.log('✨ L\'application est prête à l\'utilisation !');
        console.log('\n💡 Commandes utiles :');
        console.log('   • HeroesArena.createDemoHeroes() - Créer des héros de démo');
        console.log('   • testCombat() - Tester un combat automatique');
        console.log('   • showKeyboardShortcuts() - Afficher les raccourcis');
    } else {
        console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
        console.log('🔧 Vérifiez que tous les fichiers JS sont bien chargés');
        console.log('🌐 Assurez-vous d\'utiliser un serveur HTTP');
    }
    
    return { passed, failed, total: passed + failed };
};

// Test de combat automatique
window.testCombat = function() {
    const state = window.HeroesArena.getAppState();
    
    if (state.heroes.length < 2) {
        console.log('⚠️ Il faut au moins 2 héros pour tester le combat');
        console.log('💡 Exécutez : HeroesArena.createDemoHeroes()');
        return;
    }
    
    console.log('⚔️ Test de combat automatique...');
    
    // Sélectionner les deux premiers héros
    document.getElementById('fighter1Select').value = '0';
    document.getElementById('fighter2Select').value = '1';
    
    // Mettre à jour et démarrer
    window.HeroesArena.updateFighters();
    
    setTimeout(() => {
        if (!document.getElementById('fightBtn').disabled) {
            window.HeroesArena.startFight();
            console.log('🥊 Combat lancé ! Regardez l\'arène.');
        } else {
            console.log('❌ Impossible de lancer le combat');
        }
    }, 500);
};

// Afficher les raccourcis clavier
window.showKeyboardShortcuts = function() {
    console.log('⌨️ === RACCOURCIS CLAVIER ===');
    console.log('🎯 Navigation :');
    console.log('   • Ctrl + 1 : Créer un Héros');
    console.log('   • Ctrl + 2 : Mes Héros');
    console.log('   • Ctrl + 3 : Arène');
    console.log('🎲 Actions :');
    console.log('   • Ctrl + Alt + R : Stats aléatoires');
    console.log('   • Entrée : Créer héros (dans le champ nom)');
    console.log('   • Échap : Fermer modales');
    console.log('🔧 Debug :');
    console.log('   • testApp() : Lancer les tests');
    console.log('   • testCombat() : Test de combat');
    console.log('   • HeroesArena.getAppState() : État de l\'app');
};

// Auto-exécution si le paramètre ?test est présent
if (window.location.search.includes('test')) {
    window.addEventListener('load', () => {
        setTimeout(testApp, 1000);
    });
}

// Message d'aide
console.log('🧪 Tests disponibles :');
console.log('   • testApp() - Vérification complète');
console.log('   • testCombat() - Test de combat');
console.log('   • showKeyboardShortcuts() - Raccourcis clavier');
console.log('💡 Ajoutez ?test à l\'URL pour auto-test');