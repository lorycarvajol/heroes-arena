// ============= CONFIGURATION ET VARIABLES GLOBALES =============

// Variables globales de l'application
export const AppState = {
    heroes: [],
    currentFilter: 'all',
    selectedAvatar: 'warrior1.png',
    currentAvatarCategory: 'guerriers',
    fighter1: null,
    fighter2: null,
    combatEnCours: false
};

// Catalogue d'avatars par catégorie
export const avatarCatalog = {
    guerriers: [
        'warrior1.png', 'warrior2.png', 'warrior3.png', 'warrior4.png',
        'knight1.png', 'knight2.png', 'barbarian1.png', 'berserker1.png'
    ],
    mages: [
        'mage1.png', 'mage2.png', 'wizard1.png', 'wizard2.png',
        'sorcerer1.png', 'necromancer1.png', 'witch1.png', 'warlock1.png'
    ],
    archers: [
        'archer1.png', 'archer2.png', 'ranger1.png', 'ranger2.png',
        'hunter1.png', 'scout1.png', 'bowman1.png', 'marksman1.png'
    ],
    paladins: [
        'paladin1.png', 'paladin2.png', 'cleric1.png', 'cleric2.png',
        'priest1.png', 'templar1.png', 'crusader1.png', 'guardian1.png'
    ],
    generiques: [
        'hero1.png', 'hero2.png', 'hero3.png', 'hero4.png',
        'adventurer1.png', 'fighter1.png', 'rogue1.png', 'monk1.png'
    ]
};

// Informations des classes
export const classInfo = {
    'Guerrier': {
        title: 'Guerrier - Maître de la Rage',
        desc: 'Bonus de +20% en Force. Spécialiste du combat rapproché avec une attaque spéciale "Charge Brutale" qui inflige des dégâts massifs.',
        power: 'Rage Berserker',
        powerDesc: 'Augmente les dégâts de 50% pendant 3 tours, mais réduit la défense de 30%. Se déclenche automatiquement quand les PV tombent sous 40%.'
    },
    'Mage': {
        title: 'Mage - Seigneur des Boucliers',
        desc: 'Bonus de +20% en Magie. Maître des arts mystiques avec une attaque spéciale "Boule de Feu" dévastatrice.',
        power: 'Bouclier Magique',
        powerDesc: 'Crée un bouclier qui absorbe les dégâts basé sur la stat Magie. 30% de chance de se déclencher à chaque tour.'
    },
    'Archer': {
        title: 'Archer - Tireur Mortel',
        desc: 'Bonus de +20% en Agilité. Expert en combat à distance avec une attaque spéciale "Tir de Précision" mortel.',
        power: 'Tir Multiple',
        powerDesc: 'Tire 2-3 flèches d\'affilée infligeant des dégâts modérés chacune. 25% de chance de se déclencher, puis recharge après 2 tours.'
    },
    'Paladin': {
        title: 'Paladin - Gardien Lumineux',
        desc: 'Bonus de +20% en Défense. Guerrier saint avec une attaque spéciale "Châtiment Divin" qui soigne et inflige des dégâts.',
        power: 'Aura de Guérison',
        powerDesc: 'Active une aura qui régénère des PV pendant 4 tours. 40% de chance de se déclencher quand les PV tombent sous 60%.'
    }
};

// Informations des pouvoirs
export const powerInfo = {
    'Guerrier': {
        name: 'Rage Berserker',
        description: '+50% dégâts, -30% défense pendant 3 tours sous 40% PV'
    },
    'Mage': {
        name: 'Bouclier Magique',
        description: 'Absorbe les dégâts basé sur la Magie (30% chance/tour)'
    },
    'Archer': {
        name: 'Tir Multiple',
        description: '2-3 tirs consécutifs avec recharge (25% chance)'
    },
    'Paladin': {
        name: 'Aura de Guérison',
        description: 'Régénération pendant 4 tours sous 60% PV (40% chance)'
    }
};