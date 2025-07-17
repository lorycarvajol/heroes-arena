// ============= SYSTÈME DE COMBAT =============

import { AppState } from './config.js';
import { saveHeroesToLocalStorage } from './data.js'; // Import corrigé
import { addLogEntry, updateFighterDisplay } from './ui.js';

// Variables du combat
let combatInterval;
let roundCounter = 0;
const ROUND_DELAY = 1500; // Délai entre les rounds en ms

// Démarrer un combat
export function startCombat() {
    if (!AppState.fighter1 || !AppState.fighter2) {
        alert('Veuillez sélectionner deux combattants !');
        return;
    }
    
    if (AppState.fighter1 === AppState.fighter2) {
        alert('Un héros ne peut pas combattre contre lui-même !');
        return;
    }
    
    if (AppState.combatEnCours) {
        alert('Un combat est déjà en cours !');
        return;
    }
    
    // Réinitialiser les PV des combattants
    AppState.fighter1.pv = AppState.fighter1.pvMax;
    AppState.fighter2.pv = AppState.fighter2.pvMax;
    
    // Réinitialiser les effets temporaires
    resetTemporaryEffects(AppState.fighter1);
    resetTemporaryEffects(AppState.fighter2);
    
    AppState.combatEnCours = true;
    roundCounter = 0;
    
    // Désactiver le bouton de combat
    document.getElementById('fightBtn').disabled = true;
    
    // Messages d'introduction
    addLogEntry(`🏟️ NOUVEAU COMBAT ! ${AppState.fighter1.nom} VS ${AppState.fighter2.nom}`, 'info');
    addLogEntry(`⚔️ Que le meilleur gagne !`, 'info');
    
    // Afficher les stats de début de combat
    addLogEntry(`${AppState.fighter1.nom}: ${AppState.fighter1.pv}/${AppState.fighter1.pvMax} PV`, 'info');
    addLogEntry(`${AppState.fighter2.nom}: ${AppState.fighter2.pv}/${AppState.fighter2.pvMax} PV`, 'info');
    
    // Démarrer le combat avec un délai
    setTimeout(() => {
        combatRound();
    }, 1000);
}

// Exécuter un round de combat
function combatRound() {
    if (!AppState.combatEnCours) return;
    
    roundCounter++;
    addLogEntry(`--- Round ${roundCounter} ---`, 'info');
    
    // Déterminer qui attaque en premier (basé sur l'agilité)
    const fighter1Speed = AppState.fighter1.agility + Math.random() * 10;
    const fighter2Speed = AppState.fighter2.agility + Math.random() * 10;
    
    let firstAttacker, secondAttacker;
    
    if (fighter1Speed >= fighter2Speed) {
        firstAttacker = AppState.fighter1;
        secondAttacker = AppState.fighter2;
    } else {
        firstAttacker = AppState.fighter2;
        secondAttacker = AppState.fighter1;
    }
    
    // Premier attaquant
    setTimeout(() => {
        if (AppState.combatEnCours && secondAttacker.pv > 0) {
            executeAttack(firstAttacker, secondAttacker);
            updateFighterDisplay();
            
            // Vérifier si le combat continue
            if (checkCombatEnd()) return;
            
            // Deuxième attaquant
            setTimeout(() => {
                if (AppState.combatEnCours && firstAttacker.pv > 0) {
                    executeAttack(secondAttacker, firstAttacker);
                    updateFighterDisplay();
                    
                    // Vérifier si le combat continue
                    if (checkCombatEnd()) return;
                    
                    // Continuer au round suivant
                    setTimeout(() => {
                        combatRound();
                    }, ROUND_DELAY);
                }
            }, ROUND_DELAY / 2);
        }
    }, ROUND_DELAY / 2);
}

// Exécuter une attaque
function executeAttack(attacker, defender) {
    // Vérifier si le pouvoir spécial se déclenche
    const powerActivated = checkSpecialPower(attacker, defender);
    
    if (powerActivated) {
        return; // Le pouvoir spécial a déjà géré l'attaque
    }
    
    // Attaque normale
    const attackType = Math.random() < 0.7 ? 'normal' : 'special';
    
    if (attackType === 'normal') {
        normalAttack(attacker, defender);
    } else {
        specialAttack(attacker, defender);
    }
}

// Attaque normale
function normalAttack(attacker, defender) {
    const baseDamage = Math.floor(attacker.force * (0.8 + Math.random() * 0.4));
    const defense = Math.floor(defender.defense * (0.5 + Math.random() * 0.3));
    const finalDamage = Math.max(1, baseDamage - defense);
    
    defender.pv = Math.max(0, defender.pv - finalDamage);
    
    addLogEntry(`${attacker.nom} attaque ${defender.nom} et inflige ${finalDamage} dégâts !`, 'attack');
}

// Attaque spéciale
function specialAttack(attacker, defender) {
    const specialMultiplier = 1.5 + (attacker.magic / 100);
    const baseDamage = Math.floor(attacker.force * specialMultiplier);
    const defense = Math.floor(defender.defense * 0.7); // Moins de défense contre les attaques spéciales
    const finalDamage = Math.max(1, baseDamage - defense);
    
    defender.pv = Math.max(0, defender.pv - finalDamage);
    
    addLogEntry(`⚡ ${attacker.nom} utilise une attaque spéciale et inflige ${finalDamage} dégâts !`, 'special');
}

// Vérifier et activer les pouvoirs spéciaux
function checkSpecialPower(attacker, defender) {
    const powerChance = 0.25; // 25% de chance de base
    const adjustedChance = powerChance + (attacker.magic / 200); // Bonus basé sur la magie
    
    if (Math.random() < adjustedChance || (attacker.pv / attacker.pvMax) < 0.4) {
        activateSpecialPower(attacker, defender);
        return true;
    }
    
    return false;
}

// Activer un pouvoir spécial selon la classe
function activateSpecialPower(attacker, defender) {
    switch (attacker.classe) {
        case 'Guerrier':
            activateRageBerserker(attacker, defender);
            break;
        case 'Mage':
            activateShieldMaster(attacker, defender);
            break;
        case 'Archer':
            activateDeadlyShot(attacker, defender);
            break;
        case 'Paladin':
            activateLightGuardian(attacker, defender);
            break;
        default:
            normalAttack(attacker, defender);
    }
}

// Pouvoir du Guerrier : Rage Berserker
function activateRageBerserker(attacker, defender) {
    const rageDamage = Math.floor(attacker.force * 2);
    const finalDamage = Math.max(1, rageDamage - Math.floor(defender.defense * 0.5));
    
    defender.pv = Math.max(0, defender.pv - finalDamage);
    
    addLogEntry(`🔥 ${attacker.nom} entre en RAGE BERSERKER ! ${finalDamage} dégâts devastateurs !`, 'power');
}

// Pouvoir du Mage : Seigneur des Boucliers
function activateShieldMaster(attacker, defender) {
    const magicDamage = Math.floor(attacker.magic * 1.5);
    const finalDamage = Math.max(1, magicDamage - Math.floor(defender.defense * 0.3));
    
    defender.pv = Math.max(0, defender.pv - finalDamage);
    
    // Le mage se soigne aussi
    const healing = Math.floor(attacker.magic * 0.5);
    attacker.pv = Math.min(attacker.pvMax, attacker.pv + healing);
    
    addLogEntry(`🛡️ ${attacker.nom} invoque un BOUCLIER MAGIQUE ! ${finalDamage} dégâts et +${healing} PV !`, 'power');
}

// Pouvoir de l'Archer : Tir Mortel
function activateDeadlyShot(attacker, defender) {
    const precision = attacker.agility + attacker.force;
    const criticalChance = Math.min(0.8, precision / 100);
    
    let damage = Math.floor(attacker.force * 1.8);
    
    if (Math.random() < criticalChance) {
        damage *= 2;
        addLogEntry(`🎯 ${attacker.nom} réalise un TIR CRITIQUE MORTEL ! ${damage} dégâts !`, 'power');
    } else {
        addLogEntry(`🏹 ${attacker.nom} utilise son TIR MORTEL ! ${damage} dégâts !`, 'power');
    }
    
    defender.pv = Math.max(0, defender.pv - damage);
}

// Pouvoir du Paladin : Gardien Lumineux
function activateLightGuardian(attacker, defender) {
    const holyDamage = Math.floor((attacker.magic + attacker.defense) * 0.9);
    const finalDamage = Math.max(1, holyDamage - Math.floor(defender.defense * 0.4));
    
    defender.pv = Math.max(0, defender.pv - finalDamage);
    
    // Soins massifs
    const healing = Math.floor(attacker.magic * 0.8);
    attacker.pv = Math.min(attacker.pvMax, attacker.pv + healing);
    
    addLogEntry(`✨ ${attacker.nom} canalise la LUMIÈRE DIVINE ! ${finalDamage} dégâts et +${healing} PV !`, 'power');
}

// Vérifier si le combat est terminé
function checkCombatEnd() {
    if (AppState.fighter1.pv <= 0 || AppState.fighter2.pv <= 0) {
        endCombat();
        return true;
    }
    
    // Combat trop long (plus de 20 rounds)
    if (roundCounter > 20) {
        addLogEntry('⏰ Combat trop long ! Match nul par épuisement.', 'info');
        endCombat(true);
        return true;
    }
    
    return false;
}

// Terminer le combat
function endCombat(draw = false) {
    AppState.combatEnCours = false;
    
    if (draw) {
        addLogEntry('🤝 Match nul ! Les deux combattants sont épuisés.', 'info');
    } else {
        const winner = AppState.fighter1.pv > 0 ? AppState.fighter1 : AppState.fighter2;
        const loser = AppState.fighter1.pv <= 0 ? AppState.fighter1 : AppState.fighter2;
        
        // Mettre à jour les statistiques
        winner.victoires++;
        loser.defaites++;
        
        // Messages de fin
        addLogEntry(`🏆 ${winner.nom} remporte le combat !`, 'info');
        addLogEntry(`💀 ${loser.nom} est vaincu...`, 'attack');
        
        // Afficher les nouveaux records
        addLogEntry(`📊 ${winner.nom}: ${winner.victoires}V/${winner.defaites}D (${winner.getRatio()}%)`, 'info');
        addLogEntry(`📊 ${loser.nom}: ${loser.victoires}V/${loser.defaites}D (${loser.getRatio()}%)`, 'info');
        
        // Vérifier les nouveaux badges
        checkBadgeUpgrade(winner);
        checkBadgeUpgrade(loser);
    }
    
    // Réactiver le bouton de combat
    document.getElementById('fightBtn').disabled = false;
    
    // Sauvegarder automatiquement
    saveHeroesToLocalStorage();
    
    addLogEntry('💾 Résultats sauvegardés automatiquement.', 'info');
}

// Vérifier les mises à jour de badges
function checkBadgeUpgrade(hero) {
    const oldBadge = hero.getBadge();
    const newBadge = hero.getBadge(); // Recalculer le badge
    
    if (oldBadge !== newBadge) {
        addLogEntry(`🎖️ ${hero.nom} obtient un nouveau badge : ${hero.getBadgeText()} !`, 'power');
    }
}

// Réinitialiser les effets temporaires
function resetTemporaryEffects(hero) {
    // Ici on peut ajouter la logique pour réinitialiser des effets temporaires
    // comme des bonus/malus de combat
}

// Arrêter le combat (pour le bouton reset)
export function stopCombat() {
    AppState.combatEnCours = false;
    
    if (combatInterval) {
        clearInterval(combatInterval);
        combatInterval = null;
    }
    
    document.getElementById('fightBtn').disabled = false;
    addLogEntry('⏹️ Combat interrompu.', 'info');
}