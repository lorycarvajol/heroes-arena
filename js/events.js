// ============= GESTIONNAIRE D'ÉVÉNEMENTS AVANCÉS =============

import { AppState } from './config.js';
import { debounce } from './utils.js';

/**
 * Classe pour gérer les événements avancés de l'application
 */
export class EventManager {
    constructor() {
        this.listeners = new Map();
        this.init();
    }

    /**
     * Initialise les gestionnaires d'événements
     */
    init() {
        this.setupKeyboardEvents();
        this.setupWindowEvents();
        this.setupFormEvents();
        this.setupCustomEvents();
    }

    /**
     * Configure les événements clavier
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });

        // Raccourcis clavier
        this.addKeyboardShortcut('Escape', () => {
            this.closeModals();
        });

        this.addKeyboardShortcut('Enter', (event) => {
            if (event.target.matches('#heroName')) {
                event.preventDefault();
                const createBtn = document.getElementById('createBtn');
                if (createBtn && !createBtn.disabled) {
                    createBtn.click();
                }
            }
        });

        // Navigation par onglets avec les touches numériques
        for (let i = 1; i <= 3; i++) {
            this.addKeyboardShortcut(`${i}`, (event) => {
                if (event.ctrlKey) {
                    event.preventDefault();
                    const sections = ['create', 'heroes', 'arena'];
                    if (sections[i - 1] && window.HeroesArena && window.HeroesArena.showSection) {
                        window.HeroesArena.showSection(sections[i - 1]);
                    }
                }
            });
        }

        // Raccourci pour générer des stats aléatoires
        this.addKeyboardShortcut('r', (event) => {
            if (event.ctrlKey && event.altKey) {
                event.preventDefault();
                if (window.HeroesArena && window.HeroesArena.randomStats) {
                    window.HeroesArena.randomStats();
                    this.showNotification('Stats aléatoires générées !', 'info');
                }
            }
        });
    }

    /**
     * Configure les événements de fenêtre
     */
    setupWindowEvents() {
        // Redimensionnement de fenêtre
        const debouncedResize = debounce(() => {
            this.handleResize();
        }, 250);

        window.addEventListener('resize', debouncedResize);

        // Avant fermeture de page
        window.addEventListener('beforeunload', (event) => {
            if (AppState.combatEnCours) {
                event.preventDefault();
                event.returnValue = 'Un combat est en cours. Êtes-vous sûr de vouloir quitter ?';
                return event.returnValue;
            }
        });

        // Visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && AppState.combatEnCours) {
                console.log('⏸️ Combat mis en pause (onglet masqué)');
            } else if (!document.hidden && AppState.combatEnCours) {
                console.log('▶️ Combat repris (onglet visible)');
            }
        });
    }

    /**
     * Configure les événements de formulaire
     */
    setupFormEvents() {
        // Validation en temps réel du nom de héros
        const heroNameInput = document.getElementById('heroName');
        if (heroNameInput) {
            heroNameInput.addEventListener('input', debounce((event) => {
                this.validateHeroName(event.target);
            }, 300));

            heroNameInput.addEventListener('blur', (event) => {
                this.validateHeroName(event.target);
            });
        }

        // Auto-save lors de changements
        const statSliders = document.querySelectorAll('.stat-slider');
        statSliders.forEach(slider => {
            slider.addEventListener('change', debounce(() => {
                this.emit('statsChanged', {
                    force: parseInt(document.getElementById('force').value),
                    agility: parseInt(document.getElementById('agility').value),
                    magic: parseInt(document.getElementById('magic').value),
                    defense: parseInt(document.getElementById('defense').value)
                });
            }, 500));
        });
    }

    /**
     * Configure les événements personnalisés
     */
    setupCustomEvents() {
        // Événement de création de héros
        this.on('heroCreated', (hero) => {
            console.log(`🦸 Nouveau héros créé: ${hero.nom} (${hero.classe})`);
            this.showNotification(`${hero.nom} a rejoint votre équipe !`, 'success');
        });

        // Événement de combat terminé
        this.on('combatFinished', (result) => {
            console.log(`⚔️ Combat terminé: ${result.winner} vs ${result.loser}`);
            if (result.badge) {
                this.showNotification(`🏆 ${result.winner} obtient le badge ${result.badge} !`, 'achievement');
            }
        });

        // Événement de suppression de héros
        this.on('heroDeleted', (heroName) => {
            console.log(`🗑️ Héros supprimé: ${heroName}`);
            this.showNotification(`${heroName} a été supprimé`, 'info');
        });
    }

    /**
     * Ajoute un raccourci clavier
     * @param {string} key - Touche
     * @param {Function} callback - Fonction à exécuter
     */
    addKeyboardShortcut(key, callback) {
        if (!this.listeners.has('keyboard')) {
            this.listeners.set('keyboard', new Map());
        }
        this.listeners.get('keyboard').set(key.toLowerCase(), callback);
    }

    /**
     * Gère les événements clavier
     * @param {KeyboardEvent} event - Événement clavier
     */
    handleKeyboard(event) {
        const keyboardListeners = this.listeners.get('keyboard');
        if (!keyboardListeners) return;

        const key = event.key.toLowerCase();
        const callback = keyboardListeners.get(key);
        
        if (callback) {
            callback(event);
        }
    }

    /**
     * Gère le redimensionnement de fenêtre
     */
    handleResize() {
        // Ajuster l'affichage pour mobile
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);

        // Réajuster les grilles si nécessaire
        this.emit('windowResized', { width: window.innerWidth, height: window.innerHeight, isMobile });
    }

    /**
     * Valide le nom de héros
     * @param {HTMLInputElement} input - Champ de saisie
     */
    validateHeroName(input) {
        const name = input.value.trim();
        const isValid = name.length >= 2 && name.length <= 20;
        const isDuplicate = AppState.heroes.some(hero => hero.nom.toLowerCase() === name.toLowerCase());

        input.classList.toggle('invalid', !isValid || isDuplicate);
        
        // Afficher un message d'erreur si nécessaire
        let errorMessage = '';
        if (!isValid && name.length > 0) {
            errorMessage = 'Le nom doit contenir entre 2 et 20 caractères';
        } else if (isDuplicate) {
            errorMessage = 'Ce nom est déjà utilisé par un autre héros';
        }

        this.showInputError(input, errorMessage);
    }

    /**
     * Affiche une erreur sur un champ de saisie
     * @param {HTMLElement} input - Champ de saisie
     * @param {string} message - Message d'erreur
     */
    showInputError(input, message) {
        // Supprimer les anciens messages d'erreur
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }

        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'input-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 4px;
                animation: fadeInUp 0.3s ease;
            `;
            input.parentNode.appendChild(errorDiv);
        }
    }

    /**
     * Ferme les modales/popups ouverts
     */
    closeModals() {
        // Logique pour fermer les modales si implémentées plus tard
        document.querySelectorAll('.modal.open').forEach(modal => {
            modal.classList.remove('open');
        });
    }

    /**
     * Affiche une notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (success, error, info, achievement)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Obtient la couleur d'une notification selon son type
     * @param {string} type - Type de notification
     * @returns {string} Code couleur CSS
     */
    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            achievement: 'linear-gradient(135deg, #ffd700, #ff6b9d)'
        };
        return colors[type] || colors.info;
    }

    /**
     * Ajoute un écouteur d'événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {Function} callback - Fonction à exécuter
     */
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    /**
     * Supprime un écouteur d'événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {Function} callback - Fonction à supprimer
     */
    off(eventName, callback) {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    /**
     * Émet un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {any} data - Données à passer
     */
    emit(eventName, data = null) {
        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erreur dans l'événement ${eventName}:`, error);
                }
            });
        }
    }

    /**
     * Nettoie tous les écouteurs d'événements
     */
    destroy() {
        this.listeners.clear();
        // Supprimer les événements DOM si nécessaire
    }
}

// Créer une instance globale si elle n'existe pas
let eventManager = null;
if (typeof window !== 'undefined') {
    eventManager = new EventManager();
    
    // Ajouter les animations CSS pour les notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }

        .input-error {
            animation: fadeInUp 0.3s ease;
        }

        .form-input.invalid {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
        }

        .mobile-view .form-grid {
            grid-template-columns: 1fr !important;
        }

        .mobile-view .fighter-selection,
        .mobile-view .fighters-display {
            grid-template-columns: 1fr !important;
        }
    `;
    document.head.appendChild(style);
}

export { eventManager };