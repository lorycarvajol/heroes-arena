// Module d'authentification pour Heroes Arena
// Gestion complète de l'authentification avec validation et gestion d'erreurs

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        
        // Expressions régulières pour validation
        this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        this.usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        
        this.init();
    }
    
    init() {
        // Vérifier si un utilisateur est déjà connecté
        const savedUser = localStorage.getItem('heroesArena_currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showMainApp();
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                this.logout();
            }
        } else {
            this.showAuthScreen();
        }
    }
    
    // Gestion du stockage des utilisateurs
    loadUsers() {
        try {
            const users = localStorage.getItem('heroesArena_users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            return [];
        }
    }
    
    saveUsers() {
        try {
            localStorage.setItem('heroesArena_users', JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
            return false;
        }
    }
    
    // Validation des données
    validateEmail(email) {
        if (!email || email.trim() === '') {
            return { valid: false, message: 'L\'email est requis' };
        }
        
        if (!this.emailRegex.test(email)) {
            return { valid: false, message: 'Format d\'email invalide' };
        }
        
        return { valid: true };
    }
    
    validatePassword(password) {
        if (!password || password.length === 0) {
            return { valid: false, message: 'Le mot de passe est requis' };
        }
        
        if (password.length < 8) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
        }
        
        if (!this.passwordRegex.test(password)) {
            return { 
                valid: false, 
                message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' 
            };
        }
        
        return { valid: true };
    }
    
    validateUsername(username) {
        if (!username || username.trim() === '') {
            return { valid: false, message: 'Le nom d\'utilisateur est requis' };
        }
        
        if (username.length < 3) {
            return { valid: false, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
        }
        
        if (username.length > 20) {
            return { valid: false, message: 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères' };
        }
        
        if (!this.usernameRegex.test(username)) {
            return { 
                valid: false, 
                message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores' 
            };
        }
        
        return { valid: true };
    }
    
    // Vérification de l'existence d'un utilisateur
    userExists(email, username = null) {
        return this.users.some(user => 
            user.email.toLowerCase() === email.toLowerCase() || 
            (username && user.username.toLowerCase() === username.toLowerCase())
        );
    }
    
    // Hashage simple du mot de passe (à remplacer par une solution plus sécurisée en production)
    hashPassword(password) {
        // Simulation d'un hashage - en production, utiliser bcrypt ou équivalent
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Conversion en 32bit
        }
        return hash.toString();
    }
    
    // Inscription
    async register(userData) {
        try {
            const { username, email, password, confirmPassword } = userData;
            
            // Validation des champs
            const usernameValidation = this.validateUsername(username);
            if (!usernameValidation.valid) {
                return { success: false, field: 'username', message: usernameValidation.message };
            }
            
            const emailValidation = this.validateEmail(email);
            if (!emailValidation.valid) {
                return { success: false, field: 'email', message: emailValidation.message };
            }
            
            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.valid) {
                return { success: false, field: 'password', message: passwordValidation.message };
            }
            
            if (password !== confirmPassword) {
                return { success: false, field: 'confirmPassword', message: 'Les mots de passe ne correspondent pas' };
            }
            
            // Vérifier que l'utilisateur n'existe pas déjà
            if (this.userExists(email, username)) {
                const existingUser = this.users.find(u => 
                    u.email.toLowerCase() === email.toLowerCase() || 
                    u.username.toLowerCase() === username.toLowerCase()
                );
                
                if (existingUser.email.toLowerCase() === email.toLowerCase()) {
                    return { success: false, field: 'email', message: 'Cet email est déjà utilisé' };
                } else {
                    return { success: false, field: 'username', message: 'Ce nom d\'utilisateur est déjà pris' };
                }
            }
            
            // Créer le nouvel utilisateur
            const newUser = {
                id: Date.now().toString(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                heroes: []
            };
            
            this.users.push(newUser);
            
            if (!this.saveUsers()) {
                return { success: false, message: 'Erreur lors de la sauvegarde' };
            }
            
            // Connexion automatique après inscription
            this.currentUser = { ...newUser };
            delete this.currentUser.password; // Ne pas stocker le mot de passe dans la session
            
            localStorage.setItem('heroesArena_currentUser', JSON.stringify(this.currentUser));
            
            return { success: true, user: this.currentUser };
            
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return { success: false, message: 'Erreur technique lors de l\'inscription' };
        }
    }
    
    // Connexion
    async login(email, password) {
        try {
            const emailValidation = this.validateEmail(email);
            if (!emailValidation.valid) {
                return { success: false, field: 'email', message: emailValidation.message };
            }
            
            if (!password || password.length === 0) {
                return { success: false, field: 'password', message: 'Le mot de passe est requis' };
            }
            
            const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (!user) {
                return { success: false, field: 'email', message: 'Email ou mot de passe incorrect' };
            }
            
            const hashedPassword = this.hashPassword(password);
            if (user.password !== hashedPassword) {
                return { success: false, field: 'password', message: 'Email ou mot de passe incorrect' };
            }
            
            // Connexion réussie
            this.currentUser = { ...user };
            delete this.currentUser.password; // Ne pas stocker le mot de passe dans la session
            
            localStorage.setItem('heroesArena_currentUser', JSON.stringify(this.currentUser));
            
            return { success: true, user: this.currentUser };
            
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, message: 'Erreur technique lors de la connexion' };
        }
    }
    
    // Déconnexion
    logout() {
        this.currentUser = null;
        localStorage.removeItem('heroesArena_currentUser');
        this.showAuthScreen();
        
        // Nettoyer les données de session si nécessaire
        if (window.HeroesArena && window.HeroesArena.resetArena) {
            window.HeroesArena.resetArena();
        }
    }
    
    // Interface utilisateur
    showAuthScreen() {
        const authScreen = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (authScreen) authScreen.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
    
    showMainApp() {
        const authScreen = document.getElementById('authScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (authScreen) authScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Mettre à jour l'affichage utilisateur
        const usernameElement = document.getElementById('currentUsername');
        if (usernameElement && this.currentUser) {
            usernameElement.textContent = this.currentUser.username;
        }
    }
    
    showLogin() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.classList.add('active');
            loginForm.style.display = 'block';
        }
        if (registerForm) {
            registerForm.classList.remove('active');
            registerForm.style.display = 'none';
        }
        
        this.clearAllErrors();
    }
    
    showRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.classList.remove('active');
            loginForm.style.display = 'none';
        }
        if (registerForm) {
            registerForm.classList.add('active');
            registerForm.style.display = 'block';
        }
        
        this.clearAllErrors();
    }
    
    // Gestion des erreurs d'affichage
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
    
    clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
    
    clearAllErrors() {
        const errorFields = [
            'loginEmail', 'loginPassword',
            'registerUsername', 'registerEmail', 'registerPassword', 'confirmPassword'
        ];
        
        errorFields.forEach(field => this.clearFieldError(field));
        
        const authMessages = document.getElementById('authMessages');
        if (authMessages) {
            authMessages.innerHTML = '';
        }
    }
    
    showGeneralMessage(message, type = 'error') {
        const authMessages = document.getElementById('authMessages');
        if (authMessages) {
            authMessages.innerHTML = `<div class="message ${type}">${message}</div>`;
            
            // Effacer le message après 5 secondes
            setTimeout(() => {
                authMessages.innerHTML = '';
            }, 5000);
        }
    }
    
    // Gestionnaires d'événements
    async handleLogin(event) {
        event.preventDefault();
        this.clearAllErrors();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const result = await this.login(email, password);
        
        if (result.success) {
            this.showGeneralMessage('Connexion réussie!', 'success');
            setTimeout(() => {
                this.showMainApp();
                // Réinitialiser l'application si nécessaire
                if (window.HeroesArena && window.HeroesArena.loadData) {
                    window.HeroesArena.loadData();
                }
            }, 1000);
        } else {
            if (result.field) {
                this.showFieldError('login' + result.field.charAt(0).toUpperCase() + result.field.slice(1), result.message);
            } else {
                this.showGeneralMessage(result.message);
            }
        }
        
        return false;
    }
    
    async handleRegister(event) {
        event.preventDefault();
        this.clearAllErrors();
        
        const userData = {
            username: document.getElementById('registerUsername').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        
        const result = await this.register(userData);
        
        if (result.success) {
            this.showGeneralMessage('Compte créé avec succès!', 'success');
            setTimeout(() => {
                this.showMainApp();
                // Réinitialiser l'application si nécessaire
                if (window.HeroesArena && window.HeroesArena.loadData) {
                    window.HeroesArena.loadData();
                }
            }, 1000);
        } else {
            if (result.field) {
                this.showFieldError('register' + result.field.charAt(0).toUpperCase() + result.field.slice(1), result.message);
            } else {
                this.showGeneralMessage(result.message);
            }
        }
        
        return false;
    }
    
    // Méthodes utilitaires
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Gestion des héros liés à l'utilisateur
    getUserHeroes() {
        if (!this.currentUser) return [];
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        return user ? user.heroes || [] : [];
    }
    
    saveUserHeroes(heroes) {
        if (!this.currentUser) return false;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].heroes = heroes;
            return this.saveUsers();
        }
        
        return false;
    }
}

// Créer l'instance globale du système d'authentification
const authSystem = new AuthSystem();

// Exposer les méthodes globalement pour utilisation dans les formulaires HTML
window.HeroesAuth = {
    showLogin: () => authSystem.showLogin(),
    showRegister: () => authSystem.showRegister(),
    handleLogin: (event) => authSystem.handleLogin(event),
    handleRegister: (event) => authSystem.handleRegister(event),
    logout: () => authSystem.logout(),
    isAuthenticated: () => authSystem.isAuthenticated(),
    getCurrentUser: () => authSystem.getCurrentUser(),
    getUserHeroes: () => authSystem.getUserHeroes(),
    saveUserHeroes: (heroes) => authSystem.saveUserHeroes(heroes)
};

export { authSystem };