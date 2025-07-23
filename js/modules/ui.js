// Interface utilisateur - Heroes Arena

import { AppState, avatarCatalog, classInfo, gameConfig, messages } from '../core/config.js';
import { generateRandomStats, validateStats, formatName, validateName, calculateHealthPercentage, getHealthColor } from '../core/utils.js';

export class UIManager {
    constructor() {
        this.currentSection = 'create';
        this.selectedAvatar = 'warrior1.png';
        this.isInitialized = false;
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            console.log('🎨 Initialisation de l\'interface...');
            
            this.initializeStats();
            this.initializeAvatars();
            this.initializeClassInfo();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Interface initialisée');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de l\'UI:', error);
            this.showError('Erreur lors de l\'initialisation de l\'interface');
        }
    }
    
    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        const correspondingTab = document.querySelector(`[onclick*="${sectionName}"]`);
        if (correspondingTab) {
            correspondingTab.classList.add('active');
        }
        
        this.currentSection = sectionName;
        
        // Actions spéciales selon la section
        if (sectionName === 'heroes') {
            this.displayHeroes();
        } else if (sectionName === 'arena') {
            this.updateFighterSelectors();
        }
    }
    
    initializeAvatars() {
        this.showAvatarCategory('guerriers');
    }
    
    showAvatarCategory(category) {
        if (!avatarCatalog[category]) return;
        
        const avatarGrid = document.getElementById('avatarGrid');
        if (!avatarGrid) return;
        
        document.querySelectorAll('.catalog-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick*="${category}"]`)?.classList.add('active');
        
        avatarGrid.innerHTML = avatarCatalog[category].map(avatar => `
            <div class="avatar-option ${avatar === this.selectedAvatar ? 'selected' : ''}" 
                 onclick="window.HeroesArena.ui.selectAvatar('${avatar}')">
                <img src="images/${avatar}" alt="${avatar}" loading="lazy">
            </div>
        `).join('');
    }
    
    selectAvatar(filename) {
        this.selectedAvatar = filename;
        AppState.selectedAvatar = filename;
        
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[onclick*="${filename}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    initializeStats() {
        this.updateStats();
        this.randomStats();
    }
    
    updateStats() {
        const stats = {
            force: parseInt(document.getElementById('force')?.value || 20),
            agility: parseInt(document.getElementById('agility')?.value || 20),
            magic: parseInt(document.getElementById('magic')?.value || 20),
            defense: parseInt(document.getElementById('defense')?.value || 20)
        };
        
        Object.keys(stats).forEach(stat => {
            const valueElement = document.getElementById(`${stat}Value`);
            if (valueElement) {
                valueElement.textContent = stats[stat];
            }
            
            const fillElement = document.querySelector(`.stat-fill.${stat}`);
            if (fillElement) {
                const percentage = ((stats[stat] - gameConfig.minStatValue) / 
                                 (gameConfig.maxStatValue - gameConfig.minStatValue)) * 100;
                fillElement.style.width = `${percentage}%`;
            }
        });
        
        const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
        const totalElement = document.getElementById('totalPoints');
        
        if (totalElement) {
            totalElement.textContent = `Total: ${total}/${gameConfig.statPoints} points`;
            totalElement.className = total === gameConfig.statPoints ? 'total-points valid' : 'total-points invalid';
        }
        
        const createBtn = document.getElementById('createBtn');
        if (createBtn) {
            createBtn.disabled = total !== gameConfig.statPoints;
        }
        
        return stats;
    }
    
    randomStats() {
        const stats = generateRandomStats();
        
        Object.keys(stats).forEach(stat => {
            const slider = document.getElementById(stat);
            if (slider) {
                slider.value = stats[stat];
            }
        });
        
        this.updateStats();
    }
    
    initializeClassInfo() {
        this.updateClassInfo();
    }
    
    updateClassInfo() {
        const selectedClass = document.getElementById('heroClass')?.value || 'Guerrier';
        const info = classInfo[selectedClass];
        const classInfoElement = document.getElementById('classInfo');
        
        if (!info || !classInfoElement) return;
        
        classInfoElement.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.desc}</p>
            <div class="power-preview">
                <h5>Pouvoir : ${info.power}</h5>
                <p>${info.powerDesc}</p>
            </div>
        `;
    }
    
    displayHeroes() {
        const heroesList = document.getElementById('heroesList');
        if (!heroesList) return;
        
        if (AppState.heroes.length === 0) {
            heroesList.innerHTML = `
                <div class="empty-state">
                    <h3>Aucun héros créé</h3>
                    <p>Allez dans "Créer un Héros" pour commencer votre aventure !</p>
                    <button class="btn" onclick="HeroesArena.showSection('create')">Créer mon premier héros</button>
                </div>
            `;
            return;
        }
        
        let heroesToShow = AppState.heroes;
        if (AppState.currentFilter && AppState.currentFilter !== 'all') {
            heroesToShow = AppState.heroes.filter(hero => hero.classe === AppState.currentFilter);
        }
        
        heroesList.innerHTML = heroesToShow.map((hero, index) => 
            this.generateHeroCard(hero, AppState.heroes.indexOf(hero))
        ).join('');
    }
    
    generateHeroCard(hero, index) {
        const healthPercent = (hero.pv / hero.pvMax) * 100;
        const healthColor = healthPercent > 75 ? '#10b981' : 
                           healthPercent > 50 ? '#f59e0b' : 
                           healthPercent > 25 ? '#f97316' : '#ef4444';
        
        return `
            <div class="hero-card clickable" data-hero-id="${hero.id}" data-hero-index="${index}" onclick="window.showHeroDetailsNow(${index})" title="Cliquer pour voir les détails - ${hero.nom}">
                <div class="hero-avatar-container">
                    <div class="hero-avatar">
                        <img src="images/${hero.avatar}" alt="${hero.nom}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="avatar-fallback" style="display: none;">👤</div>
                    </div>
                    <div class="hero-level-badge">Niv. ${hero.niveau}</div>
                </div>
                
                <div class="hero-info">
                    <h3 class="hero-name">${hero.nom}</h3>
                    <div class="hero-class ${hero.classe.toLowerCase()}">${hero.classe}</div>
                    <div class="hero-badge">${hero.getBadgeText()}</div>
                </div>
                
                <div class="hero-stats">
                    <div class="stat-mini">
                        <span class="stat-icon">⚔️</span>
                        <span>${hero.force}</span>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">🏃</span>
                        <span>${hero.agility}</span>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">🔮</span>
                        <span>${hero.magic}</span>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">🛡️</span>
                        <span>${hero.defense}</span>
                    </div>
                </div>
                
                <div class="hero-health">
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${healthPercent}%; background-color: ${healthColor}"></div>
                        <div class="health-text">${hero.pv}/${hero.pvMax}</div>
                    </div>
                </div>
                
                <div class="hero-record">
                    <span class="victories">${hero.victoires}V</span> - 
                    <span class="defeats">${hero.defaites}D</span>
                    <span class="ratio">(${hero.getRatio()}%)</span>
                </div>
            </div>
        `;
    }
    
    updateFighterSelectors() {
        const selectors = [
            document.getElementById('fighter1Select'),
            document.getElementById('fighter2Select')
        ];
        
        const options = '<option value="">Sélectionnez un héros</option>' +
            AppState.heroes.map((hero, index) => 
                `<option value="${index}">${hero.nom} (${hero.classe})</option>`
            ).join('');
        
        selectors.forEach(select => {
            if (select) {
                const currentValue = select.value;
                select.innerHTML = options;
                if (currentValue && AppState.heroes[currentValue]) {
                    select.value = currentValue;
                }
            }
        });
        
        this.updateFighters();
    }
    
    updateFighters() {
        const f1Index = document.getElementById('fighter1Select')?.value;
        const f2Index = document.getElementById('fighter2Select')?.value;
        
        AppState.fighter1 = f1Index ? AppState.heroes[f1Index] : null;
        AppState.fighter2 = f2Index ? AppState.heroes[f2Index] : null;
        
        this.updateFighterDisplay();
        
        const canFight = AppState.fighter1 && 
                        AppState.fighter2 && 
                        AppState.fighter1.id !== AppState.fighter2.id;
        
        const fightBtn = document.getElementById('fightBtn');
        if (fightBtn) {
            fightBtn.disabled = !canFight;
        }
    }
    
    updateFighterDisplay() {
        this.updateSingleFighterDisplay('fighter1Display', AppState.fighter1);
        this.updateSingleFighterDisplay('fighter2Display', AppState.fighter2);
    }
    
    updateSingleFighterDisplay(displayId, fighter) {
        const display = document.getElementById(displayId);
        if (!display) return;
        
        if (!fighter) {
            display.innerHTML = `
                <div class="fighter-avatar-large">
                    <span style="color: #64748b; font-size: 2rem;">?</span>
                </div>
                <div class="fighter-name">En attente...</div>
                <div class="hero-class" style="background: rgba(255, 255, 255, 0.1);">Non sélectionné</div>
                <div class="health-bar">
                    <div class="health-fill" style="width: 0%"></div>
                    <div class="health-text">0/0</div>
                </div>
            `;
            return;
        }
        
        const healthPercent = calculateHealthPercentage(fighter.pv, fighter.pvMax);
        const healthColor = getHealthColor(healthPercent);
        
        display.innerHTML = `
            <div class="fighter-avatar-large">
                <img src="images/${fighter.avatar}" alt="${fighter.nom}">
            </div>
            <div class="fighter-name">${fighter.nom}</div>
            <div class="hero-class ${fighter.classe.toLowerCase()}">${fighter.classe}</div>
            <div class="fighter-stats">
                <div class="stat-mini">⚔️ ${fighter.force}</div>
                <div class="stat-mini">🏃 ${fighter.agility}</div>
                <div class="stat-mini">🔮 ${fighter.magic}</div>
                <div class="stat-mini">🛡️ ${fighter.defense}</div>
            </div>
            <div class="health-bar">
                <div class="health-fill" style="width: ${healthPercent}%; background-color: ${healthColor}"></div>
                <div class="health-text">${fighter.pv}/${fighter.pvMax}</div>
            </div>
        `;
    }
    
    filterHeroes(filter) {
        AppState.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[onclick*="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.displayHeroes();
    }
    
    addLogEntry(message, type = 'info') {
        const combatLog = document.getElementById('combatLog');
        if (!combatLog) return;
        
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = message;
        
        combatLog.appendChild(entry);
        combatLog.scrollTop = combatLog.scrollHeight;
        
        const entries = combatLog.children;
        if (entries.length > 100) {
            combatLog.removeChild(entries[0]);
        }
    }
    
    clearCombatLog() {
        const combatLog = document.getElementById('combatLog');
        if (combatLog) {
            combatLog.innerHTML = '';
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('create');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('heroes');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('arena');
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.remove();
                });
            }
        });
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            zIndex: '10000',
            maxWidth: '400px',
            wordWrap: 'break-word'
        });
        
        switch (type) {
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#3b82f6';
                break;
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
        
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    // Méthodes pour les effets visuels de combat
    applyAttackingEffect(fighterId) {
        const fighterElement = document.getElementById(fighterId);
        if (fighterElement) {
            fighterElement.classList.add('attacking');
            setTimeout(() => {
                fighterElement.classList.remove('attacking');
            }, 600);
        }
    }
    
    applyDefendingEffect(fighterId) {
        const fighterElement = document.getElementById(fighterId);
        if (fighterElement) {
            fighterElement.classList.add('defending');
            setTimeout(() => {
                fighterElement.classList.remove('defending');
            }, 400);
        }
    }
    
    applyVictoryEffect(fighterId) {
        const fighterElement = document.getElementById(fighterId);
        if (fighterElement) {
            fighterElement.classList.add('victory');
        }
    }
    
    applyDefeatEffect(fighterId) {
        const fighterElement = document.getElementById(fighterId);
        if (fighterElement) {
            fighterElement.classList.add('defeat');
        }
    }
    
    resetCombatEffects() {
        const fighterElements = [
            document.getElementById('fighter1Display'),
            document.getElementById('fighter2Display')
        ];
        
        fighterElements.forEach(element => {
            if (element) {
                element.classList.remove('attacking', 'defending', 'victory', 'defeat');
            }
        });
    }
    
    // Modal de fin de combat
    showCombatEndModal(result) {
        const { winner, loser, draw, originalWinner, originalLoser } = result;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay combat-end-modal';
        
        if (draw) {
            modal.innerHTML = `
                <div class="modal-content combat-result-content draw-result">
                    <div class="victory-effects draw-effects">
                        <div class="sparkle-overlay"></div>
                        <div class="celebration-particles"></div>
                    </div>
                    <div class="combat-result-header draw enhanced">
                        <div class="result-crown">⚖️</div>
                        <h2 class="victory-title animated">MATCH NUL ÉPIQUE !</h2>
                        <div class="victory-subtitle">Un combat légendaire digne des plus grands héros</div>
                        <div class="battle-decorations">
                            <div class="decoration-line"></div>
                            <span class="battle-emblem">⚔️</span>
                            <div class="decoration-line"></div>
                        </div>
                    </div>
                    <div class="combat-result-body draw-body">
                        <div class="draw-heroes-display">
                            <div class="hero-draw-card">
                                <div class="hero-avatar-result-enhanced">
                                    <img src="images/${originalWinner.avatar}" alt="${originalWinner.nom}">
                                    <div class="hero-glow draw-glow"></div>
                                </div>
                                <h3 class="hero-draw-name">${originalWinner.nom}</h3>
                                <div class="hero-draw-class">${originalWinner.classe}</div>
                            </div>
                            <div class="draw-vs-symbol">
                                <div class="vs-text">VS</div>
                                <div class="equality-symbol">=</div>
                            </div>
                            <div class="hero-draw-card">
                                <div class="hero-avatar-result-enhanced">
                                    <img src="images/${originalLoser.avatar}" alt="${originalLoser.nom}">
                                    <div class="hero-glow draw-glow"></div>
                                </div>
                                <h3 class="hero-draw-name">${originalLoser.nom}</h3>
                                <div class="hero-draw-class">${originalLoser.classe}</div>
                            </div>
                        </div>
                        <div class="draw-message">
                            <div class="honor-text">
                                <p class="main-honor">🏛️ Honneur aux Deux Combattants 🏛️</p>
                                <p class="sub-honor">Ce combat restera gravé dans l'histoire de l'arène</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer enhanced">
                        <button class="btn victory-continue-btn" onclick="this.closest('.modal-overlay').remove()">
                            <span class="btn-text">Retour à l'Arène</span>
                            <span class="btn-icon">⚔️</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="modal-content combat-result-content victory-result">
                    <div class="victory-effects">
                        <div class="golden-sparkles"></div>
                        <div class="victory-rays"></div>
                        <div class="celebration-confetti"></div>
                    </div>
                    <div class="combat-result-header victory enhanced">
                        <div class="victory-crown-container">
                            <div class="crown-glow"></div>
                            <div class="result-crown winner-crown">👑</div>
                        </div>
                        <h2 class="victory-title animated">VICTOIRE GLORIEUSE !</h2>
                        <div class="victory-subtitle">${originalWinner.nom} triomphe dans l'arène !</div>
                        <div class="battle-decorations gold">
                            <div class="decoration-line gold"></div>
                            <span class="battle-emblem winner">🏆</span>
                            <div class="decoration-line gold"></div>
                        </div>
                    </div>
                    <div class="combat-result-body victory-body">
                        <div class="battle-showcase">
                            <div class="winner-section enhanced">
                                <div class="champion-banner">🏆 CHAMPION 🏆</div>
                                <div class="result-hero-card winner enhanced">
                                    <div class="hero-avatar-result-enhanced winner">
                                        <img src="images/${originalWinner.avatar}" alt="${originalWinner.nom}">
                                        <div class="hero-glow winner-glow"></div>
                                        <div class="victory-aura"></div>
                                    </div>
                                    <h3 class="hero-winner-name">${originalWinner.nom}</h3>
                                    <div class="hero-class winner-class">${originalWinner.classe}</div>
                                    <div class="badge-display winner-badge">${originalWinner.getBadgeText()}</div>
                                    <div class="victory-stats">
                                        <div class="stat-item">
                                            <span class="stat-icon">🏆</span>
                                            <span class="stat-text">${originalWinner.victoires} Victoires</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-icon">⚔️</span>
                                            <span class="stat-text">${originalWinner.getRatio()}% Ratio</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="vs-divider enhanced">
                                <div class="vs-background">
                                    <div class="vs-text">VS</div>
                                    <div class="battle-clash">⚔️</div>
                                </div>
                            </div>
                            <div class="loser-section enhanced">
                                <div class="honor-banner">🛡️ HONNEUR AU VAILLANT 🛡️</div>
                                <div class="result-hero-card loser enhanced">
                                    <div class="hero-avatar-result-enhanced loser">
                                        <img src="images/${originalLoser.avatar}" alt="${originalLoser.nom}">
                                        <div class="hero-glow loser-glow"></div>
                                    </div>
                                    <h3 class="hero-loser-name">${originalLoser.nom}</h3>
                                    <div class="hero-class loser-class">${originalLoser.classe}</div>
                                    <div class="badge-display loser-badge">${originalLoser.getBadgeText()}</div>
                                    <div class="defeat-stats">
                                        <div class="stat-item">
                                            <span class="stat-icon">💪</span>
                                            <span class="stat-text">Combat Vaillant</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-icon">🔄</span>
                                            <span class="stat-text">Revanche Possible</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="victory-message">
                            <div class="victory-proclamation">
                                <p class="main-victory">🎉 Gloire au Vainqueur ! 🎉</p>
                                <p class="sub-victory">Un combat mémorable pour l'histoire de l'arène</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer enhanced victory-footer">
                        <button class="btn victory-continue-btn champion" onclick="this.closest('.modal-overlay').remove()">
                            <span class="btn-text">Célébrer la Victoire</span>
                            <span class="btn-icon">🏆</span>
                        </button>
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(modal);
        
        // Animation d'entrée
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 100);
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                // Forcer la mise à jour de l'affichage après fermeture
                this.displayHeroes();
            }
        });
        
        // Ajouter un gestionnaire de fermeture pour forcer la mise à jour
        modal.addEventListener('remove', () => {
            this.displayHeroes();
        });
        
        return modal;
    }
    
    
    // Méthode pour forcer la mise à jour complète de l'interface
    forceUpdate() {
        this.displayHeroes();
        this.updateFighterSelectors();
        this.updateFighterDisplay();
    }
}

export const uiManager = new UIManager();