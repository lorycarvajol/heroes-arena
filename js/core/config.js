// Configuration globale de l'application Heroes Arena

export const AppState = {
    heroes: [],
    currentFilter: 'all',
    selectedAvatar: 'warrior1.png',
    currentAvatarCategory: 'guerriers',
    fighter1: null,
    fighter2: null,
    combatEnCours: false,
    lastSyncTime: null,
    isOnline: false
};

export const avatarCatalog = {
    guerriers: [
        'warrior1.png', 'warrior2.png', 'warrior3.png', 'warrior4.png',
        'warrior5.png', 'warrior6.png', 'warrior7.png', 'warrior8.png',
        'warrior9.png', 'warrior10.png', 'warrior11.png', 'warrior12.png',
        
    ],
    mages: [
        'mage1.png', 'mage2.png', 'mage3.png', 'mage4.png',
        'mage5.png', 'mage6.png', 'mage7.png', 'mage8.png',
        'mage9.png', 'mage10.png', 'mage11.png', 'mage12.png',
    ],
    archers: [
        'archer1.png', 'archer2.png', 'archer3.png', 'archer4.png',
        'archer5.png', 'archer6.png', 'archer7.png', 'archer8.png',
        'archer9.png', 'archer10.png', 'archer11.png', 'archer12.png',
    ],
    paladins: [
        'paladin1.png', 'paladin2.png', 'paladin3.png', 'paladin4.png',
        'paladin5.png', 'paladin6.png', 'paladin7.png', 'paladin8.png',
        'paladin9.png', 'paladin10.png', 'paladin11.png', 'paladin12.png', 
    ],
    assassins: [
        'rogue1.png', 'rogue2.png', 'rogue3.png', 'rogue4.png',
        'rogue5.png', 'rogue6.png', 'rogue7.png', 'rogue8.png',
        'rogue9.png', 'rogue10.png', 'rogue11.png', 'rogue12.png', 
    ],
    druides: [
        'druide1.png', 'druide2.png', 'druide3.png', 'druide4.png',
        'druide5.png', 'druide6.png', 'druide7.png', 'druide8.png',
        'druide9.png', 'druide10.png', 'druide11.png', 'druide12.png', 
    ],
    generiques: [
        'warrior1.png', 'warrior2.png', 'mage3.png', 'mage4.png',
        'archer5.png', 'archer6.png', 'paladin7.png', 'paladin8.png',
        'rogue9.png', 'rogue10.png', 'druide11.png', 'druide12.png',
    ]
};

export const classInfo = {
    'Guerrier': {
        title: 'Guerrier - Maître de la Rage',
        desc: 'Bonus de +20% en Force. Spécialiste du combat rapproché.',
        power: 'Rage Berserker',
        powerDesc: 'Augmente les dégâts de 50% pendant 3 tours.',
        bonusStat: 'force',
        bonusPercent: 20
    },
    'Mage': {
        title: 'Mage - Seigneur des Boucliers',
        desc: 'Bonus de +20% en Magie. Maître des arts mystiques.',
        power: 'Bouclier Magique',
        powerDesc: 'Crée un bouclier qui absorbe les dégâts.',
        bonusStat: 'magic',
        bonusPercent: 20
    },
    'Archer': {
        title: 'Archer - Tireur Mortel',
        desc: 'Bonus de +20% en Agilité. Expert en combat à distance.',
        power: 'Tir Multiple',
        powerDesc: 'Tire 2-3 flèches d\'affilée.',
        bonusStat: 'agility',
        bonusPercent: 20
    },
    'Paladin': {
        title: 'Paladin - Gardien Lumineux',
        desc: 'Bonus de +20% en Défense. Guerrier saint.',
        power: 'Aura de Guérison',
        powerDesc: 'Régénère des PV pendant 4 tours.',
        bonusStat: 'defense',
        bonusPercent: 20
    },
    'Assassin': {
        title: 'Assassin - Maître de l\'Ombre',
        desc: 'Bonus de +20% en Agilité. Expert en frappes critiques et esquive.',
        power: 'Frappe Mortelle',
        powerDesc: '25% de chance de critique (x2 dégâts) + 15% esquive pendant 3 tours.',
        bonusStat: 'agility',
        bonusPercent: 20
    },
    'Druide': {
        title: 'Druide - Gardien de la Nature',
        desc: 'Bonus de +10% sur toutes les stats. Maître de l\'équilibre et régénération.',
        power: 'Symbiose Naturelle',
        powerDesc: 'Régénère 10% PV max/tour pendant 5 tours + 25% défense.',
        bonusStat: 'all',
        bonusPercent: 10
    }
};

export const gameConfig = {
    maxHeroes: 50,
    maxNameLength: 20,
    statPoints: 100,
    minStatValue: 10,
    maxStatValue: 40,
    combatDelay: 3000,        // Délai entre les rounds
    attackAnimationDelay: 800, // Délai pour l'animation d'attaque
    damageAnimationDelay: 600, // Délai pour afficher les dégâts
    effectsDelay: 1200,       // Délai pour les effets visuels
    maxCombatRounds: 20,
    autoSaveInterval: 30000,
    clearArenaDelay: 5000     // Délai avant vidage automatique de l'arène (5 secondes)
};

export const messages = {
    errors: {
        nameRequired: 'Veuillez entrer un nom pour le héros',
        nameExists: 'Un héros avec ce nom existe déjà',
        statsInvalid: 'Les statistiques doivent totaliser exactement 100 points',
        maxHeroes: 'Vous avez atteint le nombre maximum de héros',
        noFighters: 'Veuillez sélectionner deux combattants',
        sameFighter: 'Un héros ne peut pas combattre contre lui-même',
        combatInProgress: 'Un combat est déjà en cours'
    },
    success: {
        heroCreated: 'Héros créé avec succès !',
        heroDeleted: 'Héros supprimé',
        dataExported: 'Données exportées',
        dataSaved: 'Données sauvegardées'
    }
};