// Classes des héros - Heroes Arena

import { classInfo } from './config.js';

export class Hero {
    constructor(nom, avatar, classe, force, agility, magic, defense) {
        this.nom = nom;
        this.avatar = avatar || 'hero1.png';
        this.classe = classe;
        this.force = force;
        this.agility = agility;
        this.magic = magic;
        this.defense = defense;
        
        this.pvMax = Math.floor((this.force + this.defense) * 2.5);
        this.pv = this.pvMax;
        
        this.victoires = 0;
        this.defaites = 0;
        this.xp = 0;
        this.niveau = 1;
        
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.id = this.generateId();
        
        this.applyClassBonus();
    }
    
    generateId() {
        return 'hero_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    applyClassBonus() {
        const info = classInfo[this.classe];
        if (info && info.bonusStat) {
            const bonus = Math.floor(this[info.bonusStat] * (info.bonusPercent / 100));
            this[info.bonusStat] += bonus;
            
            if (info.bonusStat === 'force' || info.bonusStat === 'defense') {
                this.pvMax = Math.floor((this.force + this.defense) * 2.5);
                this.pv = this.pvMax;
            }
        }
    }
    
    getRatio() {
        const total = this.victoires + this.defaites;
        return total === 0 ? 0 : Math.round((this.victoires / total) * 100);
    }
    
    calculateLevel() {
        return Math.floor(this.xp / 100) + 1;
    }
    
    getBadge() {
        const ratio = this.getRatio();
        const total = this.victoires + this.defaites;
        
        if (total < 5) return 'rookie';
        if (ratio >= 80 && total >= 10) return 'legend';
        if (ratio >= 70 && total >= 8) return 'champion';
        if (ratio >= 60 && total >= 5) return 'veteran';
        if (ratio >= 40) return 'fighter';
        return 'apprentice';
    }
    
    getBadgeText() {
        const badges = {
            'rookie': '🥉 Recrue',
            'apprentice': '🥈 Apprenti',
            'fighter': '🥇 Combattant',
            'veteran': '🎖️ Vétéran',
            'champion': '👑 Champion',
            'legend': '🏆 Légende'
        };
        return badges[this.getBadge()] || '🥉 Recrue';
    }
    
    heal() {
        this.pv = this.pvMax;
        this.updatedAt = new Date().toISOString();
    }
    
    takeDamage(damage) {
        this.pv = Math.max(0, this.pv - damage);
        this.updatedAt = new Date().toISOString();
        return this.pv;
    }
    
    gainXp(amount) {
        this.xp += amount;
        const newLevel = this.calculateLevel();
        if (newLevel > this.niveau) {
            this.niveau = newLevel;
            this.levelUp();
        }
        this.updatedAt = new Date().toISOString();
    }
    
    levelUp() {
        const bonus = Math.floor(Math.random() * 3) + 1;
        const stats = ['force', 'agility', 'magic', 'defense'];
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        
        this[randomStat] += bonus;
        this.pvMax = Math.floor((this.force + this.defense) * 2.5);
        this.pv = this.pvMax;
        
        return { stat: randomStat, bonus };
    }
    
    getPowerLevel() {
        return this.force + this.agility + this.magic + this.defense + (this.niveau * 5);
    }
    
    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            avatar: this.avatar,
            classe: this.classe,
            force: this.force,
            agility: this.agility,
            magic: this.magic,
            defense: this.defense,
            pvMax: this.pvMax,
            pv: this.pv,
            victoires: this.victoires,
            defaites: this.defaites,
            xp: this.xp,
            niveau: this.niveau,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
    static fromJSON(data) {
        const hero = new Hero(
            data.nom,
            data.avatar,
            data.classe,
            data.force,
            data.agility,
            data.magic,
            data.defense
        );
        
        hero.id = data.id || hero.id;
        hero.pvMax = data.pvMax || hero.pvMax;
        hero.pv = data.pv !== undefined ? data.pv : hero.pv;
        hero.victoires = data.victoires !== undefined ? data.victoires : 0;
        hero.defaites = data.defaites !== undefined ? data.defaites : 0;
        hero.xp = data.xp !== undefined ? data.xp : 0;
        hero.niveau = data.niveau !== undefined ? data.niveau : 1;
        hero.createdAt = data.createdAt || hero.createdAt;
        hero.updatedAt = data.updatedAt || hero.updatedAt;
        
        return hero;
    }
    
    isValid() {
        const total = this.force + this.agility + this.magic + this.defense;
        return this.nom && 
               this.nom.length > 0 && 
               this.classe && 
               total >= 80 && total <= 120 &&
               this.force >= 10 && this.agility >= 10 && 
               this.magic >= 10 && this.defense >= 10;
    }
}