// ========== MODULE AUTH UI : modules/auth-ui.js ==========

import { cloudStorage } from '../cloud-storage.js';

export class AuthUI {
    constructor() {
        this.currentTab = 'login';
        this.isOnlineMode = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Formulaires
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Raccourci clavier pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAuth();
            }
        });
    }

    async checkAuthStatus() {
        if (cloudStorage.isLoggedIn()) {
            const verification = await cloudStorage.verifyToken();
            if (verification.valid) {
                this.showUserPanel();
                this.isOnlineMode = true;
                return;
            }
        }
        this.showAuth();
    }

    switchTab(tab) {
        this.currentTab = tab;

        // Mettre à jour les onglets
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[onclick="AuthUI.switchTab('${tab}')"]`).classList.add('active');

        // Mettre à jour les formulaires
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${tab}Form`).classList.add('active');

        // Effacer les messages d'erreur
        this.clearMessages();

        // Sauvegarder l'onglet actuel
        if (window.saveFormValues) window.saveFormValues();
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showError('login', 'Veuillez remplir tous les champs');
            if (window.saveFormValues) window.saveFormValues();
            return;
        }

        this.setLoading('login', true);

        try {
            const result = await cloudStorage.login(username, password);

            if (result.success) {
                this.showUserPanel();
                this.hideAuth();
                this.isOnlineMode = true;

                // Charger les héros depuis le cloud
                await this.syncHeroesFromCloud();

                this.showNotification('Connexion réussie !', 'success');
                
                // Nettoyer les données sauvegardées après succès
                if (window.clearSavedFormData) window.clearSavedFormData();
            }
        } catch (error) {
            this.showError('login', error.message || 'Erreur de connexion');
            // Sauvegarder les valeurs en cas d'erreur
            if (window.saveFormValues) window.saveFormValues();
        } finally {
            this.setLoading('login', false);
        }
    }

    async handleRegister() {
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (!username || !password) {
            this.showError('register', 'Nom d\'utilisateur et mot de passe requis');
            if (window.saveFormValues) window.saveFormValues();
            return;
        }

        if (password !== passwordConfirm) {
            this.showError('register', 'Les mots de passe ne correspondent pas');
            if (window.saveFormValues) window.saveFormValues();
            return;
        }

        if (password.length < 6) {
            this.showError('register', 'Le mot de passe doit contenir au moins 6 caractères');
            if (window.saveFormValues) window.saveFormValues();
            return;
        }

        this.setLoading('register', true);

        try {
            const result = await cloudStorage.register(username, password, email);

            if (result.success) {
                this.showSuccess('register', 'Inscription réussie ! Vous pouvez maintenant vous connecter.');

                // Basculer vers la connexion après 2 secondes
                setTimeout(() => {
                    this.switchTab('login');
                    document.getElementById('loginUsername').value = username;
                    // Nettoyer les données d'inscription mais garder le nom d'utilisateur pour la connexion
                    if (window.clearSavedFormData) window.clearSavedFormData();
                }, 2000);
            }
        } catch (error) {
            this.showError('register', error.message || 'Erreur lors de l\'inscription');
            // Sauvegarder les valeurs en cas d'erreur
            if (window.saveFormValues) window.saveFormValues();
        } finally {
            this.setLoading('register', false);
        }
    }

    async logout() {
        try {
            await cloudStorage.logout();
            this.hideUserPanel();
            this.isOnlineMode = false;
            this.showAuth();
            this.showNotification('Déconnexion réussie', 'info');

            // Optionnel : effacer les données locales
            if (confirm('Voulez-vous également supprimer les données locales ?')) {
                if (window.HeroesArena && window.HeroesArena.clearAllHeroesHandler) {
                    window.HeroesArena.clearAllHeroesHandler();
                }
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }

    playOffline() {
        this.hideAuth();
        this.isOnlineMode = false;
        this.showNotification('Mode hors ligne activé', 'info');
    }

    showAuth() {
        document.getElementById('authOverlay').style.display = 'flex';
    }

    hideAuth() {
        document.getElementById('authOverlay').style.display = 'none';
    }

    showUserPanel() {
        const user = cloudStorage.getCurrentUser();
        if (!user) return;

        document.getElementById('userAvatar').textContent = user.username.charAt(0).toUpperCase();
        document.getElementById('userName').textContent = user.username;
        document.getElementById('userEmail').textContent = user.email || 'Pas d\'email';
        document.getElementById('userPanel').style.display = 'flex';
    }

    hideUserPanel() {
        document.getElementById('userPanel').style.display = 'none';
    }

    showError(form, message) {
        const errorEl = document.getElementById(`${form}Error`);
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    showSuccess(form, message) {
        const successEl = document.getElementById(`${form}Success`);
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
        }
    }

    clearMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    setLoading(form, loading) {
        const btn = document.getElementById(`${form}Btn`);
        btn.disabled = loading;
        btn.textContent = loading ?
            (form === 'login' ? 'Connexion...' : 'Inscription...') :
            (form === 'login' ? 'Se connecter' : 'S\'inscrire');
    }

    setSyncStatus(status, text) {
        const indicator = document.getElementById('syncIndicator');
        const syncText = document.getElementById('syncText');

        indicator.className = `sync-indicator ${status}`;
        syncText.textContent = text;
    }

    async syncHeroesFromCloud() {
        if (!this.isOnlineMode) return;

        try {
            this.setSyncStatus('syncing', 'Synchronisation...');

            const result = await cloudStorage.loadHeroes();
            if (result.success && result.heroes) {
                // Intégrer avec le système existant
                if (window.HeroesArena && window.HeroesArena.getAppState) {
                    const appState = window.HeroesArena.getAppState();

                    // Remplacer les héros locaux par ceux du cloud
                    appState.heroes.length = 0;
                    result.heroes.forEach(heroData => {
                        const hero = this.recreateHeroFromData(heroData);
                        if (hero) appState.heroes.push(hero);
                    });

                    // Mettre à jour l'affichage
                    if (window.HeroesArena.displayHeroes) {
                        window.HeroesArena.displayHeroes();
                    }
                    if (window.HeroesArena.updateFighterSelectors) {
                        window.HeroesArena.updateFighterSelectors();
                    }
                }

                this.setSyncStatus('', 'Synchronisé');
                this.showNotification(`${result.heroes.length} héros chargés depuis le cloud`, 'success');
            }
        } catch (error) {
            this.setSyncStatus('error', 'Erreur sync');
            console.error('Erreur de synchronisation:', error);
        }
    }

    async syncHeroesToCloud() {
        if (!this.isOnlineMode) return;

        try {
            this.setSyncStatus('syncing', 'Sauvegarde...');

            if (window.HeroesArena && window.HeroesArena.getAppState) {
                const appState = window.HeroesArena.getAppState();
                const heroesData = appState.heroes.map(hero => hero.toJSON());

                const result = await cloudStorage.saveHeroes(heroesData);
                if (result.success) {
                    this.setSyncStatus('', 'Synchronisé');
                    this.showNotification('Héros sauvegardés dans le cloud', 'success');
                }
            }
        } catch (error) {
            this.setSyncStatus('error', 'Erreur sync');
            console.error('Erreur de sauvegarde:', error);
        }
    }

    recreateHeroFromData(data) {
        // Utiliser la factory existante si disponible
        if (window.HeroesArena && window.HeroesArena.createHero) {
            // Cette fonction devra être adaptée pour accepter les données complètes
            return window.HeroesArena.createHeroFromData(data);
        }
        return null;
    }

    showNotification(message, type = 'info') {
        // Utiliser le système de notification existant si disponible
        if (window.eventManager && window.eventManager.showNotification) {
            window.eventManager.showNotification(message, type);
        } else {
            // Fallback simple
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Méthodes publiques pour l'intégration
    isOnline() {
        return this.isOnlineMode;
    }

    async autoSave() {
        if (this.isOnlineMode) {
            await this.syncHeroesToCloud();
        }
    }
}