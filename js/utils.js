// ============= FONCTIONS UTILITAIRES =============

/**
 * Génère un nombre aléatoire entre min et max (inclus)
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} Nombre aléatoire
 */
export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Génère des statistiques aléatoires pour un héros
 * @param {number} totalPoints - Total de points à distribuer (défaut: 85-100)
 * @returns {Object} Objet avec force, agility, magic, defense
 */
export function generateRandomStats(totalPoints = null) {
    if (!totalPoints) {
        totalPoints = randomBetween(85, 100);
    }
    
    let stats = { force: 0, agility: 0, magic: 0, defense: 0 };
    let remaining = totalPoints;
    const statNames = Object.keys(stats);
    
    // Distribuer les points en s'assurant que chaque stat a au moins 10
    for (let i = 0; i < statNames.length - 1; i++) {
        const statName = statNames[i];
        const min = 10;
        const maxRemaining = remaining - ((statNames.length - 1 - i) * 10);
        const max = Math.min(40, maxRemaining);
        
        stats[statName] = randomBetween(min, max);
        remaining -= stats[statName];
    }
    
    // Dernière stat prend le reste
    const lastStat = statNames[statNames.length - 1];
    stats[lastStat] = Math.max(10, Math.min(40, remaining));
    
    return stats;
}

/**
 * Valide les statistiques d'un héros
 * @param {Object} stats - Objet avec force, agility, magic, defense
 * @returns {Object} Résultat de validation avec isValid et total
 */
export function validateStats(stats) {
    const { force, agility, magic, defense } = stats;
    const total = force + agility + magic + defense;
    
    const isValid = total <= 100 && 
                   force >= 10 && force <= 40 &&
                   agility >= 10 && agility <= 40 &&
                   magic >= 10 && magic <= 40 &&
                   defense >= 10 && defense <= 40;
    
    return { isValid, total };
}

/**
 * Formate un nom pour l'affichage (première lettre en majuscule)
 * @param {string} nom - Nom à formater
 * @returns {string} Nom formaté
 */
export function formatName(nom) {
    if (!nom || typeof nom !== 'string') return '';
    return nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase();
}

/**
 * Calcule le pourcentage de vie restante
 * @param {number} pvActuel - Points de vie actuels
 * @param {number} pvMax - Points de vie maximum
 * @returns {number} Pourcentage (0-100)
 */
export function calculateHealthPercentage(pvActuel, pvMax) {
    if (pvMax <= 0) return 0;
    return Math.max(0, Math.min(100, (pvActuel / pvMax) * 100));
}

/**
 * Génère une couleur en fonction du pourcentage de vie
 * @param {number} percentage - Pourcentage de vie (0-100)
 * @returns {string} Code couleur CSS
 */
export function getHealthColor(percentage) {
    if (percentage > 60) return '#10b981'; // Vert
    if (percentage > 30) return '#fbbf24'; // Jaune
    return '#ef4444'; // Rouge
}

/**
 * Debounce une fonction (limite la fréquence d'exécution)
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en millisecondes
 * @returns {Function} Fonction debouncée
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Anime un élément avec une classe CSS
 * @param {HTMLElement} element - Élément à animer
 * @param {string} animationClass - Classe CSS d'animation
 * @param {number} duration - Durée en millisecondes (optionnel)
 */
export function animateElement(element, animationClass, duration = null) {
    if (!element) return;
    
    element.classList.add(animationClass);
    
    if (duration) {
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
}

/**
 * Crée un délai (promesse)
 * @param {number} ms - Délai en millisecondes
 * @returns {Promise} Promesse qui se résout après le délai
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copie un objet en profondeur (simple)
 * @param {Object} obj - Objet à copier
 * @returns {Object} Copie de l'objet
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Vérifie si un élément est visible dans le viewport
 * @param {HTMLElement} element - Élément à vérifier
 * @returns {boolean} True si visible
 */
export function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Scroll smooth vers un élément
 * @param {HTMLElement|string} element - Élément ou sélecteur CSS
 * @param {Object} options - Options de scroll
 */
export function scrollToElement(element, options = {}) {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;
    
    const defaultOptions = {
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    };
    
    target.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Génère un ID unique
 * @param {string} prefix - Préfixe optionnel
 * @returns {string} ID unique
 */
export function generateUniqueId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formate une date pour l'affichage
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
export function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Convertit une valeur en pourcentage pour les barres de progression
 * @param {number} value - Valeur actuelle
 * @param {number} max - Valeur maximale
 * @returns {string} Pourcentage avec unité (ex: "75%")
 */
export function toPercentage(value, max) {
    if (max <= 0) return '0%';
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));
    return `${Math.round(percentage)}%`;
}

/**
 * Utilitaires pour le localStorage avec gestion d'erreurs
 */
export const Storage = {
    /**
     * Sauvegarde une valeur dans le localStorage
     * @param {string} key - Clé de stockage
     * @param {any} value - Valeur à sauvegarder
     * @returns {boolean} Succès de l'opération
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    },
    
    /**
     * Récupère une valeur du localStorage
     * @param {string} key - Clé de stockage
     * @param {any} defaultValue - Valeur par défaut si non trouvée
     * @returns {any} Valeur récupérée ou valeur par défaut
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return defaultValue;
        }
    },
    
    /**
     * Supprime une valeur du localStorage
     * @param {string} key - Clé à supprimer
     * @returns {boolean} Succès de l'opération
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            return false;
        }
    },
    
    /**
     * Vide tout le localStorage
     * @returns {boolean} Succès de l'opération
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erreur lors du vidage:', error);
            return false;
        }
    }
};