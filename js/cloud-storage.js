// js/cloud-storage.js - Client pour l'API cloud Heroes Arena
export class CloudStorage {
  constructor() {
    // Détecter si on est en développement local ou en production
    this.baseURL = this.getBaseURL();
    this.token = localStorage.getItem('heroesArena_token');
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 seconde
  }

  getBaseURL() {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Environnement local Netlify
      if (hostname === 'localhost' && window.location.port === '8888') {
        return '/.netlify/functions';
      }
      
      // Production Netlify
      if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
        return '/.netlify/functions';
      }
      
      // Domaine personnalisé
      return '/.netlify/functions';
    }
    
    return '/.netlify/functions';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    let lastError;
    
    // Retry logic pour gérer les erreurs réseau
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        console.log(`API Request (attempt ${attempt + 1}):`, {
          method: config.method || 'GET',
          url,
          hasAuth: !!this.token
        });

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('API Response:', { status: response.status, success: data.success });
        return data;
        
      } catch (error) {
        lastError = error;
        console.warn(`Tentative ${attempt + 1} échouée:`, error.message);
        
        // Ne pas retry sur les erreurs d'authentification
        if (error.message.includes('401') || error.message.includes('Non autorisé')) {
          break;
        }
        
        // Attendre avant de retry (sauf pour la dernière tentative)
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
        }
      }
    }
    
    console.error('Toutes les tentatives ont échoué:', lastError);
    throw lastError;
  }

  // ============= AUTHENTIFICATION =============

  async register(username, password, email = '') {
    try {
      const result = await this.request('/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password, email })
      });

      // Pas de token automatique lors de l'inscription
      console.log('Inscription réussie pour:', username);
      return result;
      
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (result.success && result.token) {
        this.token = result.token;
        localStorage.setItem('heroesArena_token', this.token);
        localStorage.setItem('heroesArena_user', JSON.stringify(result.user));
        
        console.log('Connexion réussie pour:', username);
      }

      return result;
      
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.token) {
        await this.request('/auth/logout', {
          method: 'POST'
        });
      }
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer côté client dans tous les cas
      this.token = null;
      localStorage.removeItem('heroesArena_token');
      localStorage.removeItem('heroesArena_user');
      console.log('Déconnexion locale effectuée');
    }
  }

  async verifyToken() {
    if (!this.token) {
      return { valid: false };
    }

    try {
      const result = await this.request('/auth/verify');
      return result;
    } catch (error) {
      console.warn('Token invalide, déconnexion automatique');
      await this.logout();
      return { valid: false };
    }
  }

  // ============= GESTION DES HÉROS =============

  async saveHeroes(heroes) {
    if (!Array.isArray(heroes)) {
      throw new Error('Les données des héros doivent être un tableau');
    }

    try {
      console.log(`Sauvegarde de ${heroes.length} héros dans le cloud...`);
      
      const result = await this.request('/heroes/bulk', {
        method: 'POST',
        body: JSON.stringify({ heroes })
      });

      console.log('Héros sauvegardés avec succès');
      return result;
      
    } catch (error) {
      console.error('Erreur sauvegarde héros:', error);
      throw error;
    }
  }

  async loadHeroes() {
    try {
      console.log('Chargement des héros depuis le cloud...');
      
      const result = await this.request('/heroes');
      
      console.log(`${result.heroes?.length || 0} héros chargés du cloud`);
      return result;
      
    } catch (error) {
      console.error('Erreur chargement héros:', error);
      throw error;
    }
  }

  async createHero(heroData) {
    try {
      const result = await this.request('/heroes', {
        method: 'POST',
        body: JSON.stringify(heroData)
      });

      console.log('Héros créé:', result.hero?.nom);
      return result;
      
    } catch (error) {
      console.error('Erreur création héros:', error);
      throw error;
    }
  }

  async updateHero(heroId, heroData) {
    try {
      const result = await this.request(`/heroes/${heroId}`, {
        method: 'PUT',
        body: JSON.stringify(heroData)
      });

      console.log('Héros mis à jour:', heroId);
      return result;
      
    } catch (error) {
      console.error('Erreur mise à jour héros:', error);
      throw error;
    }
  }

  async deleteHero(heroId) {
    try {
      const result = await this.request(`/heroes/${heroId}`, {
        method: 'DELETE'
      });

      console.log('Héros supprimé:', heroId);
      return result;
      
    } catch (error) {
      console.error('Erreur suppression héros:', error);
      throw error;
    }
  }

  async deleteAllHeroes() {
    try {
      const result = await this.request('/heroes/all', {
        method: 'DELETE'
      });

      console.log('Tous les héros supprimés');
      return result;
      
    } catch (error) {
      console.error('Erreur suppression tous les héros:', error);
      throw error;
    }
  }

  async getGlobalStats() {
    try {
      const result = await this.request('/heroes/stats');
      return result;
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      throw error;
    }
  }

  // ============= UTILITAIRES =============

  isLoggedIn() {
    return !!this.token && !!localStorage.getItem('heroesArena_user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('heroesArena_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getConnectionStatus() {
    return {
      isOnline: this.isLoggedIn(),
      user: this.getCurrentUser(),
      baseURL: this.baseURL,
      hasToken: !!this.token
    };
  }

  // ============= GESTION HORS LIGNE =============

  async syncWhenOnline() {
    // Vérifier si on est en ligne
    if (!navigator.onLine) {
      throw new Error('Aucune connexion internet');
    }

    // Vérifier si on est connecté
    if (!this.isLoggedIn()) {
      throw new Error('Non connecté');
    }

    // Tenter une requête de test
    try {
      await this.verifyToken();
      return true;
    } catch (error) {
      throw new Error('Serveur inaccessible');
    }
  }

  // ============= MIGRATION DES DONNÉES =============

  async migrateLocalToCloud(localHeroes) {
    if (!Array.isArray(localHeroes) || localHeroes.length === 0) {
      return { success: true, message: 'Aucune donnée locale à migrer' };
    }

    try {
      console.log(`Migration de ${localHeroes.length} héros locaux vers le cloud...`);
      
      // Charger les héros existants du cloud
      const cloudData = await this.loadHeroes();
      const cloudHeroes = cloudData.heroes || [];
      
      // Fusionner intelligemment
      const merged = this.mergeHeroes(localHeroes, cloudHeroes);
      
      // Sauvegarder le résultat fusionné
      const result = await this.saveHeroes(merged);
      
      console.log(`Migration terminée: ${merged.length} héros au total`);
      return {
        success: true,
        message: `Migration réussie: ${merged.length} héros synchronisés`,
        localCount: localHeroes.length,
        cloudCount: cloudHeroes.length,
        mergedCount: merged.length
      };
      
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      throw error;
    }
  }

  mergeHeroes(localHeroes, cloudHeroes) {
    const merged = new Map();
    
    // Ajouter les héros locaux
    localHeroes.forEach(hero => {
      const key = hero.nom.toLowerCase();
      merged.set(key, {
        ...hero,
        source: 'local',
        id: hero.id || this.generateHeroId(),
        updatedAt: hero.updatedAt || new Date().toISOString()
      });
    });
    
    // Ajouter/mettre à jour avec les héros cloud (priorité aux plus récents)
    cloudHeroes.forEach(hero => {
      const key = hero.nom.toLowerCase();
      const existing = merged.get(key);
      
      if (!existing || new Date(hero.updatedAt) > new Date(existing.updatedAt)) {
        merged.set(key, {
          ...hero,
          source: 'cloud'
        });
      }
    });
    
    return Array.from(merged.values());
  }

  generateHeroId() {
    return 'hero_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ============= DIAGNOSTICS =============

  async diagnose() {
    const diagnosis = {
      timestamp: new Date().toISOString(),
      environment: {
        url: window.location.href,
        baseURL: this.baseURL,
        online: navigator.onLine
      },
      auth: {
        hasToken: !!this.token,
        user: this.getCurrentUser()
      },
      connectivity: {
        canReachServer: false,
        tokenValid: false,
        error: null
      }
    };

    try {
      await this.verifyToken();
      diagnosis.connectivity.canReachServer = true;
      diagnosis.connectivity.tokenValid = true;
    } catch (error) {
      diagnosis.connectivity.error = error.message;
    }

    console.log('🩺 Diagnostic Cloud Storage:', diagnosis);
    return diagnosis;
  }
}

// Instance globale
export const cloudStorage = new CloudStorage();

// Exposer pour debug
if (typeof window !== 'undefined') {
  window.cloudStorage = cloudStorage;
}