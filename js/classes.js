// ============= CLASSES DES HÉROS =============

export class Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        this.nom = nom;
        this.avatar = avatar;
        this.force = force;
        this.agility = agility;
        this.magic = magic;
        this.defense = defense;
        this.pvMax = this.calculerPV();
        this.pv = this.pvMax;
        this.victoires = 0;
        this.defaites = 0;
        this.powerActive = false;
        this.powerDuration = 0;
    }

    calculerPV() {
        return Math.floor((this.force + this.defense) * 2.5 + 50);
    }

    attaquer() {
        const base = this.force + Math.floor(Math.random() * 10);
        return Math.floor(base * (0.8 + Math.random() * 0.4));
    }

    soigner(montant) {
        this.pv = Math.min(this.pvMax, this.pv + montant);
    }

    estVivant() {
        return this.pv > 0;
    }

    getRatio() {
        const total = this.victoires + this.defaites;
        return total === 0 ? 0 : Math.round((this.victoires / total) * 100);
    }

    getBadge() {
        if (this.victoires >= 20) return 'gold';
        if (this.victoires >= 10) return 'silver';
        if (this.victoires >= 5) return 'bronze';
        return null;
    }

    getBadgeClass() {
        const badge = this.getBadge();
        return badge ? `${badge}-badge` : '';
    }

    getBadgeText() {
        const badge = this.getBadge();
        if (badge === 'gold') return 'Légendaire';
        if (badge === 'silver') return 'Vétéran';
        if (badge === 'bronze') return 'Expérimenté';
        return null;
    }

    // Pouvoir passif générique
    checkPassivePower() {
        return false; // Par défaut, pas de pouvoir passif
    }

    toJSON() {
        return {
            nom: this.nom,
            avatar: this.avatar,
            classe: this.classe,
            force: this.force,
            agility: this.agility,
            magic: this.magic,
            defense: this.defense,
            victoires: this.victoires,
            defaites: this.defaites
        };
    }
}

export class Guerrier extends Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        super(nom, avatar, force, agility, magic, defense);
        this.classe = "Guerrier";
        this.force = Math.floor(this.force * 1.2);
        this.pvMax = this.calculerPV();
        this.pv = this.pvMax;
        this.rageActive = false;
        this.rageTurns = 0;
    }

    attaqueSpeciale() {
        return Math.floor(this.force * 1.8 + Math.random() * 15);
    }

    // Pouvoir : Rage Berserker
    checkPassivePower() {
        if (!this.rageActive && (this.pv / this.pvMax) <= 0.4) {
            this.rageActive = true;
            this.rageTurns = 3;
            return "rage";
        }
        return false;
    }

    attaquer() {
        let degats = super.attaquer();
        if (this.rageActive) {
            degats = Math.floor(degats * 1.5); // +50% dégâts
            this.rageTurns--;
            if (this.rageTurns <= 0) {
                this.rageActive = false;
            }
        }
        return degats;
    }

    getDefenseEffective() {
        return this.rageActive ? Math.floor(this.defense * 0.7) : this.defense; // -30% défense en rage
    }
}

export class Mage extends Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        super(nom, avatar, force, agility, magic, defense);
        this.classe = "Mage";
        this.magic = Math.floor(this.magic * 1.2);
        this.pvMax = this.calculerPV();
        this.pv = this.pvMax;
        this.bouclierActif = false;
        this.bouclierPoints = 0;
    }

    attaqueSpeciale() {
        return Math.floor(this.magic * 2 + Math.random() * 20);
    }

    // Pouvoir : Bouclier Magique
    activerBouclier() {
        this.bouclierActif = true;
        this.bouclierPoints = Math.floor(this.magic * 0.8);
        return this.bouclierPoints;
    }

    absorberDegats(degats) {
        if (this.bouclierActif && this.bouclierPoints > 0) {
            const absorbe = Math.min(degats, this.bouclierPoints);
            this.bouclierPoints -= absorbe;
            if (this.bouclierPoints <= 0) {
                this.bouclierActif = false;
            }
            return degats - absorbe;
        }
        return degats;
    }

    checkPassivePower() {
        if (!this.bouclierActif && Math.random() < 0.3) {
            return "bouclier";
        }
        return false;
    }
}

export class Archer extends Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        super(nom, avatar, force, agility, magic, defense);
        this.classe = "Archer";
        this.agility = Math.floor(this.agility * 1.2);
        this.pvMax = this.calculerPV();
        this.pv = this.pvMax;
        this.tirMultipleReady = true;
    }

    attaqueSpeciale() {
        return Math.floor((this.force + this.agility) * 1.3 + Math.random() * 12);
    }

    // Pouvoir : Tir Multiple
    tirMultiple() {
        if (this.tirMultipleReady) {
            this.tirMultipleReady = false;
            const tirs = [];
            const nombreTirs = 2 + Math.floor(Math.random() * 2); // 2-3 tirs
            for (let i = 0; i < nombreTirs; i++) {
                tirs.push(Math.floor((this.force + this.agility) * 0.6 + Math.random() * 8));
            }
            return tirs;
        }
        return null;
    }

    checkPassivePower() {
        if (this.tirMultipleReady && Math.random() < 0.25) {
            return "tir_multiple";
        }
        return false;
    }

    // Recharge le tir multiple après 2 tours
    rechargerTirMultiple() {
        this.tirMultipleReady = true;
    }
}

export class Paladin extends Hero {
    constructor(nom, avatar, force, agility, magic, defense) {
        super(nom, avatar, force, agility, magic, defense);
        this.classe = "Paladin";
        this.defense = Math.floor(this.defense * 1.2);
        this.pvMax = this.calculerPV();
        this.pv = this.pvMax;
        this.auraActive = false;
        this.auraTurns = 0;
    }

    attaqueSpeciale() {
        this.soigner(15);
        return Math.floor(this.force * 1.2 + Math.random() * 10);
    }

    // Pouvoir : Aura de Guérison
    activerAura() {
        this.auraActive = true;
        this.auraTurns = 4;
    }

    processAura() {
        if (this.auraActive) {
            const soin = Math.floor(this.magic * 0.3 + 5);
            this.soigner(soin);
            this.auraTurns--;
            if (this.auraTurns <= 0) {
                this.auraActive = false;
            }
            return soin;
        }
        return 0;
    }

    checkPassivePower() {
        if (!this.auraActive && (this.pv / this.pvMax) <= 0.6 && Math.random() < 0.4) {
            return "aura";
        }
        return false;
    }
}

// Factory pour créer les héros
export function createHero(nom, avatar, classe, force, agility, magic, defense) {
    switch (classe) {
        case 'Guerrier':
            return new Guerrier(nom, avatar, force, agility, magic, defense);
        case 'Mage':
            return new Mage(nom, avatar, force, agility, magic, defense);
        case 'Archer':
            return new Archer(nom, avatar, force, agility, magic, defense);
        case 'Paladin':
            return new Paladin(nom, avatar, force, agility, magic, defense);
        default:
            return null;
    }
}