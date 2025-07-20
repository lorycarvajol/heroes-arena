// Initialisation globale pour Heroes Arena
// Ce fichier charge l'application et expose les méthodes globalement

// Fonction d'initialisation asynchrone
export async function initHeroesArena() {
    try {
        console.log('🚀 Démarrage de Heroes Arena...');
        
        // Importer les modules
        const { AppState } = await import('./core/config.js');
        const { uiManager } = await import('./modules/ui.js');
        const { dataManager } = await import('./modules/data.js');
        const { combatSystem } = await import('./modules/combat.js');
        
        // Créer l'application
        const app = {
            ui: uiManager,
            data: dataManager,
            combat: combatSystem,
            
            // Méthodes d'interface
            showSection(sectionName) {
                return this.ui.showSection(sectionName);
            },
            
            showAvatarCategory(category) {
                return this.ui.showAvatarCategory(category);
            },
            
            updateClassInfo() {
                return this.ui.updateClassInfo();
            },
            
            updateStats() {
                return this.ui.updateStats();
            },
            
            randomStats() {
                return this.ui.randomStats();
            },
            
            filterHeroes(filter) {
                return this.ui.filterHeroes(filter);
            },
            
            updateFighters() {
                return this.ui.updateFighters();
            },
            
            // Méthodes de gestion des héros
            async createHeroFromForm() {
                try {
                    const nom = document.getElementById('heroName')?.value?.trim();
                    const classe = document.getElementById('heroClass')?.value;
                    const stats = this.ui.updateStats();
                    
                    if (!nom) {
                        this.ui.showError('Veuillez entrer un nom pour le héros');
                        return false;
                    }
                    
                    const result = await this.data.addHero({
                        nom,
                        avatar: this.ui.selectedAvatar,
                        classe,
                        ...stats
                    });
                    
                    if (result.success) {
                        this.ui.showSuccess('Héros créé avec succès !');
                        
                        // Debug : vérifier que le héros est bien dans AppState
                        console.log('Héros créé:', result.hero);
                        console.log('Total héros:', AppState.heroes.length);
                        
                        // Forcer une sauvegarde immédiate
                        await this.data.saveHeroes();
                        
                        // Réinitialiser le formulaire
                        document.getElementById('heroName').value = '';
                        this.ui.randomStats();
                        
                        // Afficher les héros et aller à la section héros
                        this.ui.displayHeroes();
                        this.ui.updateFighterSelectors();
                        this.ui.showSection('heroes');
                        
                        return true;
                    } else {
                        this.ui.showError(result.error);
                        return false;
                    }
                    
                } catch (error) {
                    console.error('Erreur lors de la création du héros:', error);
                    this.ui.showError('Erreur lors de la création du héros');
                    return false;
                }
            },
            
            async deleteHero(index) {
                const hero = AppState.heroes[index];
                if (!hero) return;
                
                if (confirm(`Êtes-vous sûr de vouloir supprimer ce héros ?\n\n${hero.nom} (${hero.classe})`)) {
                    const result = await this.data.deleteHero(index);
                    
                    if (result.success) {
                        this.ui.showSuccess('Héros supprimé');
                        this.ui.displayHeroes();
                        this.ui.updateFighterSelectors();
                    } else {
                        this.ui.showError(result.error);
                    }
                }
            },
            
            async healHero(index) {
                const hero = AppState.heroes[index];
                if (!hero) return;
                
                hero.heal();
                await this.data.saveHeroes();
                this.ui.displayHeroes();
                this.ui.showSuccess(`${hero.nom} a été complètement soigné !`);
            },
            
            showHeroDetails(index) {
                const hero = AppState.heroes[index];
                if (!hero) return;
                
                // Créer une modal détaillée avec les informations du héros
                const modal = document.createElement('div');
                modal.className = 'modal-overlay hero-details-modal';
                
                const healthPercent = (hero.pv / hero.pvMax) * 100;
                const healthColor = healthPercent > 75 ? '#10b981' : 
                                   healthPercent > 50 ? '#f59e0b' : 
                                   healthPercent > 25 ? '#f97316' : '#ef4444';
                
                modal.innerHTML = `
                    <div class="modal-content hero-details-content">
                        <div class="modal-header">
                            <div class="hero-details-header">
                                <div class="hero-avatar-large">
                                    <img src="images/${hero.avatar}" alt="${hero.nom}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="avatar-fallback" style="display: none;">👤</div>
                                </div>
                                <div class="hero-details-title">
                                    <h2>${hero.nom}</h2>
                                    <div class="hero-class-badge">${hero.classe}</div>
                                    <div class="hero-level-display">Niveau ${hero.niveau}</div>
                                    <div class="hero-badge-display">${hero.getBadgeText()}</div>
                                </div>
                            </div>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="hero-details-grid">
                                <div class="stats-section">
                                    <h3>Caractéristiques</h3>
                                    <div class="stat-detail">
                                        <span class="stat-icon">⚔️</span>
                                        <span class="stat-name">Force</span>
                                        <span class="stat-value">${hero.force}</span>
                                    </div>
                                    <div class="stat-detail">
                                        <span class="stat-icon">🏃</span>
                                        <span class="stat-name">Agilité</span>
                                        <span class="stat-value">${hero.agility}</span>
                                    </div>
                                    <div class="stat-detail">
                                        <span class="stat-icon">🔮</span>
                                        <span class="stat-name">Magie</span>
                                        <span class="stat-value">${hero.magic}</span>
                                    </div>
                                    <div class="stat-detail">
                                        <span class="stat-icon">🛡️</span>
                                        <span class="stat-name">Défense</span>
                                        <span class="stat-value">${hero.defense}</span>
                                    </div>
                                </div>
                                
                                <div class="progress-section">
                                    <h3>Progression</h3>
                                    <div class="progress-item">
                                        <span>Expérience</span>
                                        <span>${hero.xp} XP</span>
                                    </div>
                                    <div class="health-section">
                                        <span>Points de vie</span>
                                        <div class="health-bar-detail">
                                            <div class="health-fill" style="width: ${healthPercent}%; background-color: ${healthColor}"></div>
                                            <div class="health-text">${hero.pv}/${hero.pvMax}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="combat-section">
                                    <h3>Palmarès</h3>
                                    <div class="combat-stats">
                                        <div class="combat-stat victories">
                                            <span class="label">Victoires</span>
                                            <span class="value">${hero.victoires}</span>
                                        </div>
                                        <div class="combat-stat defeats">
                                            <span class="label">Défaites</span>
                                            <span class="value">${hero.defaites}</span>
                                        </div>
                                        <div class="combat-stat ratio">
                                            <span class="label">Ratio</span>
                                            <span class="value">${hero.getRatio()}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
                            <button class="btn btn-danger" onclick="if(confirm('Supprimer ce héros ?')) { HeroesArena.deleteHero(${index}); this.closest('.modal-overlay').remove(); }">Supprimer</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Fermer en cliquant à l'extérieur
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            },
            
            // Méthodes de combat
            async startCombat() {
                if (!AppState.fighter1 || !AppState.fighter2) {
                    this.ui.showError('Veuillez sélectionner deux combattants');
                    return;
                }
                
                if (AppState.fighter1.id === AppState.fighter2.id) {
                    this.ui.showError('Un héros ne peut pas combattre contre lui-même');
                    return;
                }
                
                try {
                    // Désactiver le bouton de combat
                    const fightBtn = document.getElementById('fightBtn');
                    if (fightBtn) fightBtn.disabled = true;
                    
                    // Nettoyer le log de combat
                    this.ui.clearCombatLog();
                    
                    // Démarrer le combat
                    const result = await this.combat.startCombat(AppState.fighter1, AppState.fighter2);
                    
                    if (result.success) {
                        // Sauvegarder automatiquement
                        await this.data.saveHeroes();
                        
                        // Mettre à jour l'affichage
                        this.ui.displayHeroes();
                        this.ui.updateFighterDisplay();
                    } else {
                        this.ui.showError(result.error);
                    }
                    
                } catch (error) {
                    console.error('Erreur lors du démarrage du combat:', error);
                    this.ui.showError('Erreur lors du démarrage du combat');
                } finally {
                    // Réactiver le bouton
                    setTimeout(() => {
                        const fightBtn = document.getElementById('fightBtn');
                        if (fightBtn) fightBtn.disabled = false;
                    }, 1000);
                }
            },
            
            resetArena() {
                // Réinitialiser les sélections
                const selectors = [
                    document.getElementById('fighter1Select'),
                    document.getElementById('fighter2Select')
                ];
                
                selectors.forEach(select => {
                    if (select) select.value = '';
                });
                
                // Réinitialiser l'état
                AppState.fighter1 = null;
                AppState.fighter2 = null;
                
                // Arrêter le combat en cours
                this.combat.stopCombat();
                
                // Réinitialiser les effets visuels
                this.ui.resetCombatEffects();
                
                // Mettre à jour l'affichage
                this.ui.updateFighters();
                this.ui.clearCombatLog();
                
                // Ajouter un message de bienvenue
                this.ui.addLogEntry('Bienvenue dans l\'arène ! Sélectionnez deux héros pour commencer le combat...', 'info');
            },
            
            stopCombat() {
                this.combat.stopCombat();
                
                const fightBtn = document.getElementById('fightBtn');
                if (fightBtn) fightBtn.disabled = false;
            },
            
            // Méthodes d'import/export
            async exportData() {
                const result = await this.data.exportToFile();
                
                if (result.success) {
                    this.ui.showSuccess(`Export réussi: ${result.filename}`);
                } else {
                    this.ui.showError(result.error);
                }
            },
            
            async loadData() {
                const result = await this.data.loadHeroes();
                
                if (result.success) {
                    this.ui.showSuccess(`${result.count} héros chargés`);
                    this.ui.displayHeroes();
                    this.ui.updateFighterSelectors();
                } else {
                    this.ui.showError(result.error);
                }
            },
            
            async clearAllData() {
                if (confirm('Êtes-vous sûr de vouloir supprimer tous les héros ?')) {
                    const result = await this.data.clearAllHeroes();
                    
                    if (result.success) {
                        this.ui.showSuccess(`${result.count} héros supprimés`);
                        this.ui.displayHeroes();
                        this.ui.updateFighterSelectors();
                        this.resetArena();
                    } else {
                        this.ui.showError(result.error);
                    }
                }
            },
            
            createDemoHeroes() {
                // Créer quelques héros de démonstration
                const demoHeroes = [
                    { nom: 'Aragorn', classe: 'Guerrier', force: 35, agility: 25, magic: 15, defense: 25, avatar: 'warrior1.png' },
                    { nom: 'Gandalf', classe: 'Mage', force: 20, agility: 20, magic: 35, defense: 25, avatar: 'wizard1.png' },
                    { nom: 'Legolas', classe: 'Archer', force: 25, agility: 35, magic: 20, defense: 20, avatar: 'archer1.png' },
                    { nom: 'Gimli', classe: 'Paladin', force: 30, agility: 15, magic: 20, defense: 35, avatar: 'paladin1.png' }
                ];
                
                let created = 0;
                
                demoHeroes.forEach(async (heroData) => {
                    const result = await this.data.addHero(heroData);
                    if (result.success) {
                        created++;
                        if (created === demoHeroes.length) {
                            this.ui.showSuccess(`${created} héros de démo créés !`);
                            this.ui.displayHeroes();
                            this.ui.updateFighterSelectors();
                        }
                    }
                });
            },
            
            // Méthode de debug
            debug() {
                console.log('=== DEBUG HEROES ARENA ===');
                console.log('AppState.heroes:', AppState.heroes);
                console.log('localStorage heroes:', localStorage.getItem('heroesArena_heroes'));
                console.log('HeroesArena object:', window.HeroesArena);
                console.log('UI Manager:', this.ui);
                console.log('Data Manager:', this.data);
                console.log('========================');
            }
        };
        
        // Initialiser l'application
        console.log('🔄 Chargement des héros...');
        const loadResult = await app.data.loadHeroes();
        console.log('📊 Héros chargés:', loadResult);
        
        await app.ui.initialize();
        
        // Configurer le combat
        app.combat.onLogUpdate = (entry) => {
            app.ui.addLogEntry(entry.message, entry.type);
        };
        
        // Configurer la fin de combat
        app.combat.onCombatEnd = (result) => {
            app.ui.showCombatEndModal(result);
            // Forcer la mise à jour de l'affichage des héros
            setTimeout(() => {
                app.ui.forceUpdate();
            }, 500);
        };
        
        // Démarrer la sauvegarde automatique
        app.data.startAutoSave();
        
        // Afficher l'interface initiale
        app.ui.displayHeroes();
        app.ui.updateFighterSelectors();
        app.ui.addLogEntry('Bienvenue dans l\'arène ! Sélectionnez deux héros pour commencer le combat...', 'info');
        
        // Exposer l'objet app globalement immédiatement
        window.HeroesArena = app;
        window.app = app; // Pour debug
        
        // Créer des fonctions globales simples pour les actions des héros
        window.showHeroDetailsNow = function(index) {
            console.log('🔍 showHeroDetailsNow appelé avec index:', index);
            try {
                if (app && app.showHeroDetails) {
                    app.showHeroDetails(index);
                } else {
                    console.log('📱 Utilisation de la méthode de fallback');
                    showHeroDetailsFallback(index);
                }
            } catch (error) {
                console.error('❌ Erreur dans showHeroDetailsNow:', error);
                showHeroDetailsFallback(index);
            }
        };
        
        window.deleteHeroNow = function(index) {
            console.log('🗑️ deleteHeroNow appelé avec index:', index);
            if (confirm('Êtes-vous sûr de vouloir supprimer ce héros ?')) {
                try {
                    if (app && app.deleteHero) {
                        app.deleteHero(index);
                    } else {
                        console.error('❌ Méthode deleteHero non disponible');
                    }
                } catch (error) {
                    console.error('❌ Erreur dans deleteHeroNow:', error);
                }
            }
        };
        
        // Fonction de fallback pour afficher les détails
        async function showHeroDetailsFallback(index) {
            // Utiliser AppState déjà importé
            const hero = AppState.heroes[index];
            if (!hero) {
                alert('Héros introuvable ! Index: ' + index + ', Total héros: ' + (AppState.heroes?.length || 0));
                console.log('🔍 Debug AppState.heroes:', AppState.heroes);
                return;
            }
            
            // Créer une modal simple directement
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #1e293b, #334155);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    color: white;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                ">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 10px 0; color: #e2e8f0;">${hero.nom}</h2>
                        <div style="background: #3b82f6; color: white; padding: 6px 16px; border-radius: 20px; display: inline-block; margin: 5px;">${hero.classe}</div>
                        <div style="background: #fbbf24; color: #1f2937; padding: 6px 16px; border-radius: 20px; display: inline-block; margin: 5px;">Niveau ${hero.niveau}</div>
                        <div style="color: #fbbf24; margin-top: 5px;">${hero.getBadgeText()}</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
                        <div>
                            <h3 style="margin: 0 0 15px 0; color: #e2e8f0; font-size: 1.1rem;">Caractéristiques</h3>
                            <div style="margin: 8px 0;">⚔️ Force: <strong>${hero.force}</strong></div>
                            <div style="margin: 8px 0;">🏃 Agilité: <strong>${hero.agility}</strong></div>
                            <div style="margin: 8px 0;">🔮 Magie: <strong>${hero.magic}</strong></div>
                            <div style="margin: 8px 0;">🛡️ Défense: <strong>${hero.defense}</strong></div>
                        </div>
                        
                        <div>
                            <h3 style="margin: 0 0 15px 0; color: #e2e8f0; font-size: 1.1rem;">Progression</h3>
                            <div style="margin: 8px 0;">🎖️ Expérience: <strong>${hero.xp} XP</strong></div>
                            <div style="margin: 8px 0;">❤️ Vie: <strong>${hero.pv}/${hero.pvMax}</strong></div>
                            <div style="margin: 8px 0;">🏆 Victoires: <strong style="color: #10b981;">${hero.victoires}</strong></div>
                            <div style="margin: 8px 0;">💀 Défaites: <strong style="color: #ef4444;">${hero.defaites}</strong></div>
                            <div style="margin: 8px 0;">📊 Ratio: <strong style="color: #3b82f6;">${hero.getRatio()}%</strong></div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                            background: #6b7280;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            margin-right: 10px;
                        ">Fermer</button>
                        <button onclick="if(confirm('Supprimer ce héros ?')) { window.deleteHeroNow(${index}); this.closest('div[style*=\"position: fixed\"]').remove(); }" style="
                            background: #ef4444;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Supprimer</button>
                    </div>
                </div>
            `;
            
            // Fermer en cliquant à l'extérieur
            modal.onclick = function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            };
            
            document.body.appendChild(modal);
        }
        
        console.log('✅ Heroes Arena initialisé avec succès');
        console.log('📱 Objet global HeroesArena exposé');
        
        return app;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        throw error;
    }
}

// La fonction est exportée via export en haut du fichier