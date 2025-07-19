// js/cloud-storage.js - Client pour l'API cloud
export class CloudStorage {
  constructor() {
    this.baseURL = '/.netlify/functions';
    this.token = localStorage.getItem('heroesArena_token');
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

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur réseau');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async register(username, password, email = '') {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email })
    });

    if (result.success) {
      this.token = result.token;
      localStorage.setItem('heroesArena_token', this.token);
      localStorage.setItem('heroesArena_user', JSON.stringify(result.user));
    }

    return result;
  }

  async login(username, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (result.success) {
      this.token = result.token;
      localStorage.setItem('heroesArena_token', this.token);
      localStorage.setItem('heroesArena_user', JSON.stringify(result.user));
    }

    return result;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('heroesArena_token');
    localStorage.removeItem('heroesArena_user');
  }

  async verifyToken() {
    if (!this.token) return { valid: false };

    try {
      const result = await this.request('/auth/verify');
      return result;
    } catch {
      await this.logout();
      return { valid: false };
    }
  }

  // Gestion des héros
  async saveHeroes(heroes) {
    return await this.request('/heroes', {
      method: 'POST',
      body: JSON.stringify({ heroes })
    });
  }

  async loadHeroes() {
    return await this.request('/heroes');
  }

  async updateHero(heroId, heroData) {
    return await this.request(`/heroes/${heroId}`, {
      method: 'PUT',
      body: JSON.stringify(heroData)
    });
  }

  async deleteHero(heroId) {
    return await this.request(`/heroes/${heroId}`, {
      method: 'DELETE'
    });
  }

  // Utilitaires
  isLoggedIn() {
    return !!this.token && !!localStorage.getItem('heroesArena_user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('heroesArena_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Instance globale
export const cloudStorage = new CloudStorage();