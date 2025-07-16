// ============= SYSTÈME DE COMBAT =============

import { AppState } from './config.js';
import { Guerrier, Mage, Archer, Paladin } from './classes.js';
import { saveHeroes } from './data.js';
import { updateFighterDisplay, updateFighters, updateFighterSelectors, addLogEntry, clearCombatLog } from './ui.js';

export function startFight() {
    if (!AppState.fighter1 || !AppState.fighter2 || AppState.combatEnCours || AppState.fighter1 === AppState.fighter2) return;
    
    AppState.combatEnCours = true;
    document.getElementById('fightBtn').disabled = true;
    
    // Réinitialiser les héros
    AppState.fighter1.pv = AppState.fighter1.pvMax;
    AppState.fighter2.pv = AppState.fighter2.pvMax;
    
    // Réinitialiser les pouvoirs
    resetHeroPowers(AppState.fighter1);
    resetHeroPowers(AppState.fighter2);
    
    clearCombatLog();
    addLogEntry(`Combat épique entre ${AppState.fighter1.nom} et ${AppState.fighter2.nom} !`, 'info');
    addLogEntry(`${AppState.fighter1.nom} (${AppState.fighter1.classe}) vs ${AppState.fighter2.nom} (${AppState.fighter2.classe})`, 'info');
    
    setTimeout(() => combatTurn(AppState.fighter1, AppState.fighter2), 1000);
}

function resetHeroPowers(hero) {
    if (hero instanceof Guerrier) {
        hero.rageActive = false;
        hero.rageTurns = 0;
    }
    if (hero instanceof Mage) {
        hero.bouclierActif = false;
        hero.bouclierPoints = 0;
    }
    if (hero instanceof Archer) {
        hero.tirMultipleReady = true;
    }
    if (hero instanceof Paladin) {
        hero.auraActive = false;
        hero.auraTurns = 0;
    }
}

function combatTurn(attaquant, defenseur) {
    if (!attaquant.estVivant() || !defenseur.estVivant()) {
        finirCombat();
        return;
    }
    
    // Vérifier les pouvoirs passifs
    const attaquantPower = attaquant.checkPassivePower();
    const defenseurPower = defenseur.checkPassivePower();
    
    // Traiter les pouvoirs du défenseur en premier
    if (defenseurPower) {
        processPower(defenseur, defenseurPower);
    }
    
    // Traiter les pouvoirs de l'attaquant
    if (attaquantPower) {
        processPower(attaquant, attaquantPower);
    }
    
    // Processus d'aura pour les Paladins
    if (attaquant instanceof Paladin) {
        const soin = attaquant.processAura();
        if (soin > 0) {
            addLogEntry(`L'aura de ${attaquant.nom} le soigne de ${soin} PV !`, 'power');
        }
    }
    if (defenseur instanceof Paladin) {
        const soin = defenseur.processAura();
        if (soin > 0) {
            addLogEntry(`L'aura de ${defenseur.nom} le soigne de ${soin} PV !`, 'power');
        }
    }
    
    // Attaque
    const useSpecial = Math.random() < 0.3;
    let degats;
    let actionText;
    
    // Vérifier le tir multiple de l'Archer
    if (attaquant instanceof Archer && attaquant.checkPassivePower() === 'tir_multiple') {
        const tirs = attaquant.tirMultiple();
        if (tirs) {
            addLogEntry(`${attaquant.nom} déclenche un Tir Multiple !`, 'power');
            let degatsTotal = 0;
            tirs.forEach((degat, index) => {
                const degatsFinaux = calculerDegats(attaquant, defenseur, degat);
                if (degatsFinaux > 0) {
                    defenseur.pv = Math.max(0, defenseur.pv - degatsFinaux);
                    degatsTotal += degatsFinaux;
                }
            });
            addLogEntry(`${tirs.length} flèches touchent pour ${degatsTotal} dégâts total !`, 'special');
        } else {
            // Attaque normale
            degats = attaquant.attaquer();
            actionText = `${attaquant.nom} attaque !`;
            addLogEntry(actionText, 'attack');
            const degatsFinaux = calculerDegats(attaquant, defenseur, degats);
            if (degatsFinaux > 0) {
                defenseur.pv = Math.max(0, defenseur.pv - degatsFinaux);
                addLogEntry(`${defenseur.nom} subit ${degatsFinaux} dégâts !`, 'attack');
            } else {
                addLogEntry(`${defenseur.nom} esquive l'attaque !`, 'info');
            }
        }
    } else {
        // Attaque normale ou spéciale
        if (useSpecial) {
            degats = attaquant.attaqueSpeciale();
            actionText = `${attaquant.nom} utilise son attaque spéciale !`;
            addLogEntry(actionText, 'special');
        } else {
            degats = attaquant.attaquer();
            actionText = `${attaquant.nom} attaque !`;
            addLogEntry(actionText, 'attack');
        }
        
        const degatsFinaux = calculerDegats(attaquant, defenseur, degats);
        
        if (degatsFinaux === 0) {
            addLogEntry(`${defenseur.nom} esquive l'attaque !`, 'info');
        } else {
            defenseur.pv = Math.max(0, defenseur.pv - degatsFinaux);
            addLogEntry(`${defenseur.nom} subit ${degatsFinaux} dégâts ! (PV: ${defenseur.pv}/${defenseur.pvMax})`, 'attack');
        }
    }
    
    updateFighterDisplay();
    
    // Tour suivant ou fin de combat
    if (defenseur.estVivant() && attaquant.estVivant()) {
        setTimeout(() => combatTurn(defenseur, attaquant), 1500);
    } else {
        setTimeout(finirCombat, 1000);
    }
}

function processPower(hero, powerType) {
    switch (powerType) {
        case 'rage':
            addLogEntry(`${hero.nom} entre dans une RAGE BERSERKER ! (+50% dégâts, -30% défense)`, 'power');
            break;
        case 'bouclier':
            const bouclierPoints = hero.activerBouclier();
            addLogEntry(`${hero.nom} active un Bouclier Magique (${bouclierPoints} points) !`, 'power');
            break;
        case 'aura':
            hero.activerAura();
            addLogEntry(`${hero.nom} active son Aura de Guérison !`, 'power');
            break;
    }
}

function calculerDegats(attaquant, defenseur, degatsBase) {
    // Défense effective (modifiée par la rage)
    let defenseEffective = defenseur.defense;
    if (defenseur instanceof Guerrier) {
        defenseEffective = defenseur.getDefenseEffective();
    }
    
    // Réduction des dégâts basée sur la défense
    const reduction = defenseEffective * 0.3;
    let degatsReduits = Math.max(1, degatsBase - reduction);
    
    // Absorption du bouclier magique
    if (defenseur instanceof Mage) {
        degatsReduits = defenseur.absorberDegats(degatsReduits);
        if (degatsReduits < degatsBase) {
            addLogEntry(`Le bouclier de ${defenseur.nom} absorbe une partie des dégâts !`, 'power');
        }
    }
    
    // Chance d'esquive basée sur l'agilité (max 25%)
    const chanceEsquive = Math.min(25, defenseur.agility * 0.5);
    if (Math.random() * 100 < chanceEsquive) {
        return 0;
    }
    
    return Math.floor(degatsReduits);
}

function finirCombat() {
    AppState.combatEnCours = false;
    document.getElementById('fightBtn').disabled = false;
    
    let vainqueur = null;
    let perdant = null;
    
    if (AppState.fighter1.estVivant()) {
        vainqueur = AppState.fighter1;
        perdant = AppState.fighter2;
        addLogEntry(`🎉 ${AppState.fighter1.nom} remporte le combat !`, 'special');
        addLogEntry(`👑 Victoire pour ${AppState.fighter1.nom} le ${AppState.fighter1.classe} !`, 'info');
    } else if (AppState.fighter2.estVivant()) {
        vainqueur = AppState.fighter2;
        perdant = AppState.fighter1;
        addLogEntry(`🎉 ${AppState.fighter2.nom} remporte le combat !`, 'special');
        addLogEntry(`👑 Victoire pour ${AppState.fighter2.nom} le ${AppState.fighter2.classe} !`, 'info');
    } else {
        addLogEntry(`💀 Combat sans vainqueur ! Les deux héros tombent !`, 'info');
    }
    
    // Mettre à jour les statistiques
    if (vainqueur && perdant) {
        vainqueur.victoires++;
        perdant.defaites++;
        
        // Vérifier les nouveaux badges
        const nouveauBadge = vainqueur.getBadge();
        if ((nouveauBadge === 'bronze' && vainqueur.victoires === 5) ||
            (nouveauBadge === 'silver' && vainqueur.victoires === 10) ||
            (nouveauBadge === 'gold' && vainqueur.victoires === 20)) {
            const badgeNames = { bronze: 'Expérimenté', silver: 'Vétéran', gold: 'Légendaire' };
            addLogEntry(`🏆 ${vainqueur.nom} obtient le badge ${badgeNames[nouveauBadge]} !`, 'special');
        }
        
        saveHeroes();
    }
    
    addLogEntry(`⏹️ Fin du combat`, 'info');
    updateFighters();
    updateFighterSelectors();
}