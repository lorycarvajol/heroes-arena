// ============= INTERFACE UTILISATEUR =============

import { AppState, avatarCatalog, classInfo, powerInfo } from './config.js';
import { createHero } from './classes.js';
import { 
    saveHeroesToFile, 
    loadHeroesFromFile, 
    saveHeroesToLocalStorage,
    loadHeroesFromLocalStorage, 
    clearAllHeroes, 
    deleteHero,
    exportHeroesStats 
} from './data.js';

// Navigation entre sections
export function showSection(sectionName) {
    // Vérifier que la section existe
    const targetSection = document.getElementById(sectionName);
    if (!targetSection) {
        console.error(`❌ Section "${sectionName}" introuvable !`);
        console.log('📋 Sections disponibles:', Array.from(document.querySelectorAll('.section')).map(s => s.id));
        return;
    }

    // Désactiver toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les onglets
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activer la section cible
    targetSection.classList.add('active');
    
    // Activer l'onglet correspondant
    const targetTab = document.querySelector(`[onclick*="showSection('${sectionName}')"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    } else {
        console.warn(`⚠️ Onglet pour "${sectionName}" introuvable`);
    }
    
    // Actions spécifiques selon la section
    if (sectionName === 'heroes') {
        displayHeroes();
    } else if (sectionName === 'arena') {
        updateFighterSelectors();
    }
}

// Gestion des avatars
export function showAvatarCategory(category) {
    AppState.currentAvatarCategory = category;
    
    document.querySelectorAll('.catalog-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    initAvatars();
}

export function initAvatars() {
    const avatarGrid = document.getElementById('avatarGrid');
    avatarGrid.innerHTML = '';
    
    const avatars = avatarCatalog[AppState.currentAvatarCategory] || [];
    
    avatars.forEach(filename => {
        const avatarOption = document.createElement('div');
        avatarOption.className = `avatar-option ${filename === AppState.selectedAvatar ? 'selected' : ''}`;
        avatarOption.onclick = () => selectAvatar(filename);
        
        // Créer un placeholder coloré en cas d'image manquante
        avatarOption.innerHTML = `
            <img src="images/${filename}" alt="${filename}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                 onload="this.nextElementSibling.style.display='none';">
            <div class="avatar-placeholder" style="display: none;">
                ${filename.substring(0, 3).toUpperCase()}
            </div>
        `;
        avatarGrid.appendChild(avatarOption);
    });
}

export function selectAvatar(filename) {
    AppState.selectedAvatar = filename;
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.avatar-option').classList.add('selected');
}

// Gestion des stats
export function updateStats() {
    const force = parseInt(document.getElementById('force').value);
    const agility = parseInt(document.getElementById('agility').value);
    const magic = parseInt(document.getElementById('magic').value);
    const defense = parseInt(document.getElementById('defense').value);
    
    const total = force + agility + magic + defense;
    
    document.getElementById('forceValue').textContent = force;
    document.getElementById('agilityValue').textContent = agility;
    document.getElementById('magicValue').textContent = magic;
    document.getElementById('defenseValue').textContent = defense;
    
    const totalElement = document.getElementById('totalPoints');
    totalElement.textContent = `Total: ${total}/100 points`;
    
    document.querySelector('.stat-fill.force').style.width = (force / 40 * 100) + '%';
    document.querySelector('.stat-fill.agility').style.width = (agility / 40 * 100) + '%';
    document.querySelector('.stat-fill.magic').style.width = (magic / 40 * 100) + '%';
    document.querySelector('.stat-fill.defense').style.width = (defense / 40 * 100) + '%';
    
    const isValid = total <= 100;
    document.getElementById('createBtn').disabled = !isValid;
    totalElement.className = `total-points ${isValid ? 'valid' : 'invalid'}`;
}

export function randomStats() {
    const remaining = 85 + Math.floor(Math.random() * 16);
    let stats = [0, 0, 0, 0];
    let remaining_points = remaining;
    
    for (let i = 0; i < 3; i++) {
        const min = 10;
        const max = Math.min(40, remaining_points - (3 - i) * 10);
        stats[i] = min + Math.floor(Math.random() * (max - min + 1));
        remaining_points -= stats[i];
    }
    stats[3] = Math.max(10, Math.min(40, remaining_points));
    
    document.getElementById('force').value = stats[0];
    document.getElementById('agility').value = stats[1];
    document.getElementById('magic').value = stats[2];
    document.getElementById('defense').value = stats[3];
    
    updateStats();
}

export function updateClassInfo() {
    const classe = document.getElementById('heroClass').value;
    const infoDiv = document.getElementById('classInfo');
    
    const info = classInfo[classe];
    infoDiv.innerHTML = `
        <h4>${info.title}</h4>
        <p>${info.desc}</p>
        <div class="power-preview">
            <h5>Pouvoir : ${info.power}</h5>
            <p>${info.powerDesc}</p>
        </div>
    `;
}

// Création de héros
export function createHeroFromForm() {
    const nom = document.getElementById('heroName').value.trim();
    const classe = document.getElementById('heroClass').value;
    const force = parseInt(document.getElementById('force').value);
    const agility = parseInt(document.getElementById('agility').value);
    const magic = parseInt(document.getElementById('magic').value);
    const defense = parseInt(document.getElementById('defense').value);
    
    if (!nom) {
        alert('Veuillez entrer un nom pour votre héros !');
        return false;
    }
    
    if (nom.length < 2 || nom.length > 20) {
        alert('Le nom doit contenir entre 2 et 20 caractères !');
        return false;
    }
    
    // Vérifier si le nom contient au moins une lettre
    if (!/[a-zA-ZÀ-ÿ]/.test(nom)) {
        alert('Le nom doit contenir au moins une lettre !');
        return false;
    }
    
    // Vérifier les doublons
    if (AppState.heroes.some(hero => hero.nom.toLowerCase() === nom.toLowerCase())) {
        alert('Ce nom est déjà utilisé par un autre héros !');
        return false;
    }
    
    if (force + agility + magic + defense > 100) {
        alert('Le total des caractéristiques ne peut pas dépasser 100 points !');
        return false;
    }
    
    const hero = createHero(nom, AppState.selectedAvatar, classe, force, agility, magic, defense);
    
    if (!hero) {
        alert('Erreur lors de la création du héros !');
        return false;
    }
    
    AppState.heroes.push(hero);
    
    document.getElementById('heroName').value = '';
    randomStats();
    
    // Émission d'événement personnalisé si le gestionnaire d'événements est disponible
    if (typeof eventManager !== 'undefined') {
        eventManager.emit('heroCreated', hero);
    }
    
    alert(`${hero.nom} le ${hero.classe} a été créé avec succès !`);
    saveHeroesToLocalStorage(); // Sauvegarde automatique locale
    updateFighterSelectors();
    return true;
}

// Affichage des héros (version simplifiée)
export function displayHeroes() {
    const container = document.getElementById('heroesList');
    
    const filteredHeroes = AppState.currentFilter === 'all' 
        ? AppState.heroes 
        : AppState.heroes.filter(hero => hero.classe === AppState.currentFilter);
    
    if (filteredHeroes.length === 0) {
        const message = AppState.currentFilter === 'all' 
            ? 'Aucun héros créé' 
            : `Aucun ${AppState.currentFilter} créé`;
        const subMessage = AppState.currentFilter === 'all'
            ? 'Créez votre premier héros dans l\'onglet "Créer un Héros" !'
            : 'Créez un héros de cette classe pour le voir apparaître ici.';
            
        container.innerHTML = `
            <div class="empty-state">
                <h3>${message}</h3>
                <p>${subMessage}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredHeroes.map((hero, originalIndex) => {
        const index = AppState.heroes.indexOf(hero);
        const badgeClass = hero.getBadgeClass();
        const badgeText = hero.getBadgeText();
        
        return `
            <div class="hero-card-simple ${badgeClass}" onclick="showHeroDetails(${index})">
                <div class="delete-btn" onclick="window.HeroesArena.deleteHeroHandler(${index}); event.stopPropagation();">×</div>
                ${badgeText ? `<div class="badge-indicator badge-${hero.getBadge()}">${badgeText}</div>` : ''}
                <div class="hero-avatar-simple">
                    <img src="images/${hero.avatar}" alt="${hero.nom}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                         onload="this.nextElementSibling.style.display='none';">
                    <div class="avatar-placeholder" style="display: none;">
                        ${hero.nom.substring(0, 2).toUpperCase()}
                    </div>
                </div>
                <div class="hero-info-simple">
                    <h3 class="hero-name-simple">${hero.nom}</h3>
                    <div class="hero-class-simple">${hero.classe}</div>
                    <div class="hero-rank-simple">Rang: ${badgeText || 'Novice'}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Afficher les détails d'un héros dans une modal
export function showHeroDetails(index) {
    const hero = AppState.heroes[index];
    if (!hero) return;
    
    const power = powerInfo[hero.classe] || { name: 'Aucun', description: 'Pas de pouvoir spécial' };
    
    const modalHTML = `
        <div class="hero-modal-overlay" onclick="closeHeroDetails()">
            <div class="hero-modal" onclick="event.stopPropagation()">
                <div class="hero-modal-header">
                    <h2>${hero.nom}</h2>
                    <button class="close-modal" onclick="closeHeroDetails()">×</button>
                </div>
                <div class="hero-modal-content">
                    <div class="hero-modal-left">
                        <div class="hero-avatar-large">
                            <img src="images/${hero.avatar}" alt="${hero.nom}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                 onload="this.nextElementSibling.style.display='none';">
                            <div class="avatar-placeholder" style="display: none; font-size: 48px;">
                                ${hero.nom.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <div class="hero-class-badge">${hero.classe}</div>
                        ${hero.getBadgeText() ? `<div class="hero-rank-badge">${hero.getBadgeText()}</div>` : ''}
                    </div>
                    <div class="hero-modal-right">
                        <div class="hero-record-detailed">
                            <h3>Statistiques de Combat</h3>
                            <div class="record-grid">
                                <div class="record-item-detailed">
                                    <div class="record-label">Victoires</div>
                                    <div class="record-value record-wins">${hero.victoires}</div>
                                </div>
                                <div class="record-item-detailed">
                                    <div class="record-label">Défaites</div>
                                    <div class="record-value record-losses">${hero.defaites}</div>
                                </div>
                                <div class="record-item-detailed">
                                    <div class="record-label">Ratio de Victoire</div>
                                    <div class="record-value record-ratio">${hero.getRatio()}%</div>
                                </div>
                                <div class="record-item-detailed">
                                    <div class="record-label">Combats Totaux</div>
                                    <div class="record-value">${hero.victoires + hero.defaites}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="hero-power-detailed">
                            <h3>Pouvoir Spécial</h3>
                            <div class="power-card">
                                <div class="power-name">${power.name}</div>
                                <div class="power-description">${power.description}</div>
                            </div>
                        </div>
                        
                        <div class="hero-stats-detailed">
                            <h3>Caractéristiques</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-label">Force</div>
                                    <div class="stat-bar">
                                        <div class="stat-fill force" style="width: ${(hero.force / 40) * 100}%"></div>
                                        <span class="stat-value">${hero.force}</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Agilité</div>
                                    <div class="stat-bar">
                                        <div class="stat-fill agility" style="width: ${(hero.agility / 40) * 100}%"></div>
                                        <span class="stat-value">${hero.agility}</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Magie</div>
                                    <div class="stat-bar">
                                        <div class="stat-fill magic" style="width: ${(hero.magic / 40) * 100}%"></div>
                                        <span class="stat-value">${hero.magic}</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Défense</div>
                                    <div class="stat-bar">
                                        <div class="stat-fill defense" style="width: ${(hero.defense / 40) * 100}%"></div>
                                        <span class="stat-value">${hero.defense}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="total-stats">
                                Total: ${hero.force + hero.agility + hero.magic + hero.defense}/100 points
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Fermer la modal des détails
export function closeHeroDetails() {
    const modal = document.querySelector('.hero-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

export function filterHeroes(filter) {
    AppState.currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayHeroes();
}

// Handlers pour les events
export function deleteHeroHandler(index) {
    if (deleteHero(index)) {
        displayHeroes();
        updateFighterSelectors();
        saveHeroesToLocalStorage(); // Sauvegarde automatique locale
    }
}

export function clearAllHeroesHandler() {
    if (clearAllHeroes()) {
        displayHeroes();
        resetArena();
        updateFighterSelectors();
        saveHeroesToLocalStorage(); // Sauvegarde automatique locale
    }
}

// Nouveaux handlers pour la gestion des fichiers JSON
export async function saveHeroesToFileHandler() {
    await saveHeroesToFile();
}

export async function loadHeroesFromFileHandler() {
    const success = await loadHeroesFromFile();
    if (success) {
        displayHeroes();
        updateFighterSelectors();
    }
}

export async function exportStatsHandler() {
    await exportHeroesStats();
}

// Handler pour charger depuis localStorage (pour le bouton de chargement local)
export function loadHeroesFromLocalStorageHandler() {
    const saved = localStorage.getItem('heroes');
    if (!saved) {
        alert('Aucune sauvegarde locale trouvée !');
        return;
    }
    
    try {
        const heroesData = JSON.parse(saved);
        AppState.heroes = [];
        
        heroesData.forEach(data => {
            const hero = createHero(
                data.nom,
                data.avatar,
                data.classe,
                data.force,
                data.agility,
                data.magic,
                data.defense
            );
            
            if (hero) {
                hero.victoires = data.victoires || 0;
                hero.defaites = data.defaites || 0;
                AppState.heroes.push(hero);
            }
        });
        
        alert(`${AppState.heroes.length} héros chargés depuis la sauvegarde locale !`);
        displayHeroes();
        updateFighterSelectors();
    } catch (error) {
        alert('Erreur lors du chargement local : ' + error.message);
    }
}

// Arène - mise à jour des sélecteurs
export function updateFighterSelectors() {
    const fighter1Select = document.getElementById('fighter1Select');
    const fighter2Select = document.getElementById('fighter2Select');
    
    const options = '<option value="">Sélectionnez un héros</option>' + 
        AppState.heroes.map((hero, index) => {
            const badge = hero.getBadgeText() ? ` [${hero.getBadgeText()}]` : '';
            return `<option value="${index}">${hero.nom} (${hero.classe}) ${hero.victoires}V/${hero.defaites}D${badge}</option>`;
        }).join('');
    
    fighter1Select.innerHTML = options;
    fighter2Select.innerHTML = options;
}

export function updateFighters() {
    const fighter1Index = document.getElementById('fighter1Select').value;
    const fighter2Index = document.getElementById('fighter2Select').value;
    
    AppState.fighter1 = fighter1Index !== '' ? AppState.heroes[fighter1Index] : null;
    AppState.fighter2 = fighter2Index !== '' ? AppState.heroes[fighter2Index] : null;
    
    updateFighterDisplay();
    
    const fightBtn = document.getElementById('fightBtn');
    fightBtn.disabled = !AppState.fighter1 || !AppState.fighter2 || AppState.combatEnCours || AppState.fighter1 === AppState.fighter2;
}

export function updateFighterDisplay() {
    const fighter1Display = document.getElementById('fighter1Display');
    const fighter2Display = document.getElementById('fighter2Display');
    
    if (AppState.fighter1) {
        fighter1Display.innerHTML = `
            <div class="fighter-avatar-large">
                <img src="images/${AppState.fighter1.avatar}" alt="${AppState.fighter1.nom}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                <div class="avatar-placeholder" style="display: none; font-size: 24px;">
                    ${AppState.fighter1.nom.substring(0, 2).toUpperCase()}
                </div>
            </div>
            <div class="fighter-name">${AppState.fighter1.nom} ${AppState.fighter1.getBadgeText() ? `[${AppState.fighter1.getBadgeText()}]` : ''}</div>
            <div class="hero-class">${AppState.fighter1.classe}</div>
            <div class="health-bar">
                <div class="health-fill" style="width: ${(AppState.fighter1.pv / AppState.fighter1.pvMax) * 100}%"></div>
                <div class="health-text">${AppState.fighter1.pv}/${AppState.fighter1.pvMax}</div>
            </div>
        `;
    } else {
        fighter1Display.innerHTML = `
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
    }
    
    if (AppState.fighter2) {
        fighter2Display.innerHTML = `
            <div class="fighter-avatar-large">
                <img src="images/${AppState.fighter2.avatar}" alt="${AppState.fighter2.nom}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                <div class="avatar-placeholder" style="display: none; font-size: 24px;">
                    ${AppState.fighter2.nom.substring(0, 2).toUpperCase()}
                </div>
            </div>
            <div class="fighter-name">${AppState.fighter2.nom} ${AppState.fighter2.getBadgeText() ? `[${AppState.fighter2.getBadgeText()}]` : ''}</div>
            <div class="hero-class">${AppState.fighter2.classe}</div>
            <div class="health-bar">
                <div class="health-fill" style="width: ${(AppState.fighter2.pv / AppState.fighter2.pvMax) * 100}%"></div>
                <div class="health-text">${AppState.fighter2.pv}/${AppState.fighter2.pvMax}</div>
            </div>
        `;
    } else {
        fighter2Display.innerHTML = `
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
    }
}

export function resetArena() {
    if (AppState.fighter1) AppState.fighter1.pv = AppState.fighter1.pvMax;
    if (AppState.fighter2) AppState.fighter2.pv = AppState.fighter2.pvMax;
    
    AppState.combatEnCours = false;
    updateFighterDisplay();
    updateFighters();
    
    clearCombatLog();
    addLogEntry('Arène réinitialisée. Prêt pour un nouveau combat !', 'info');
}

// Gestion du log de combat
export function addLogEntry(message, type = 'info') {
    const log = document.getElementById('combatLog');
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

export function clearCombatLog() {
    document.getElementById('combatLog').innerHTML = '';
}

// Rendre les fonctions accessibles globalement
window.showHeroDetails = showHeroDetails;
window.closeHeroDetails = closeHeroDetails;