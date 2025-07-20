// netlify/functions/auth.js - Authentification pour Heroes Arena
import crypto from 'crypto';

// Base de données simulée (remplacer par une vraie DB en production)
const users = new Map();
const sessions = new Map();
const loginAttempts = new Map();

// Configuration
const CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'heroes-arena-secret-2024',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 heures
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
};

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event, context) => {
  console.log('Auth function called:', event.httpMethod, event.path);

  // Gestion CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body, headers } = event;
    const data = body ? JSON.parse(body) : {};
    
    // Router selon l'endpoint
    if (path.endsWith('/auth') || path.includes('/auth/register')) {
      if (httpMethod === 'POST') {
        return await handleRegister(data);
      }
    } else if (path.includes('/auth/login')) {
      if (httpMethod === 'POST') {
        return await handleLogin(data);
      }
    } else if (path.includes('/auth/verify')) {
      if (httpMethod === 'GET') {
        return await handleVerify(headers.authorization);
      }
    } else if (path.includes('/auth/logout')) {
      if (httpMethod === 'POST') {
        return await handleLogout(headers.authorization);
      }
    }
    
    return createResponse(404, { error: 'Endpoint non trouvé' });
    
  } catch (error) {
    console.error('Erreur dans auth function:', error);
    return createResponse(500, { error: 'Erreur serveur interne' });
  }
};

// Fonction d'inscription
async function handleRegister(data) {
  const { username, password, email } = data;
  
  // Validation
  if (!username || !password) {
    return createResponse(400, { error: 'Nom d\'utilisateur et mot de passe requis' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return createResponse(400, { error: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères' });
  }
  
  if (password.length < 6) {
    return createResponse(400, { error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  
  // Vérifier si l'utilisateur existe déjà
  if (users.has(username.toLowerCase())) {
    return createResponse(409, { error: 'Ce nom d\'utilisateur est déjà pris' });
  }
  
  // Créer l'utilisateur
  const userId = generateId();
  const hashedPassword = await hashPassword(password);
  
  const user = {
    id: userId,
    username,
    email: email || '',
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    heroes: [],
    lastLogin: null,
    isActive: true
  };
  
  users.set(username.toLowerCase(), user);
  
  console.log(`Nouvel utilisateur créé: ${username}`);
  
  return createResponse(201, {
    success: true,
    message: 'Compte créé avec succès',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }
  });
}

// Fonction de connexion
async function handleLogin(data) {
  const { username, password } = data;
  
  if (!username || !password) {
    return createResponse(400, { error: 'Nom d\'utilisateur et mot de passe requis' });
  }
  
  const userKey = username.toLowerCase();
  
  // Vérifier les tentatives de connexion
  const attempts = loginAttempts.get(userKey) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  
  if (attempts.count >= CONFIG.MAX_LOGIN_ATTEMPTS && 
      (now - attempts.lastAttempt) < CONFIG.LOCKOUT_TIME) {
    return createResponse(429, { 
      error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' 
    });
  }
  
  // Réinitialiser les tentatives si le délai est écoulé
  if ((now - attempts.lastAttempt) >= CONFIG.LOCKOUT_TIME) {
    attempts.count = 0;
  }
  
  const user = users.get(userKey);
  
  if (!user || !user.isActive) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(userKey, attempts);
    return createResponse(401, { error: 'Identifiants invalides' });
  }
  
  // Vérifier le mot de passe
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(userKey, attempts);
    return createResponse(401, { error: 'Identifiants invalides' });
  }
  
  // Connexion réussie - réinitialiser les tentatives
  loginAttempts.delete(userKey);
  
  // Créer le token
  const token = generateToken(user);
  const sessionId = generateId();
  
  // Stocker la session
  sessions.set(sessionId, {
    userId: user.id,
    username: user.username,
    createdAt: now,
    expiresAt: now + CONFIG.TOKEN_EXPIRY,
    token
  });
  
  // Mettre à jour la dernière connexion
  user.lastLogin = new Date().toISOString();
  
  console.log(`Connexion réussie: ${username}`);
  
  return createResponse(200, {
    success: true,
    message: 'Connexion réussie',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      lastLogin: user.lastLogin
    },
    token,
    expiresAt: new Date(now + CONFIG.TOKEN_EXPIRY).toISOString()
  });
}

// Fonction de vérification de token
async function handleVerify(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createResponse(401, { error: 'Token manquant' });
  }
  
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  
  if (!payload) {
    return createResponse(401, { error: 'Token invalide ou expiré' });
  }
  
  // Vérifier que l'utilisateur existe toujours
  const user = users.get(payload.username.toLowerCase());
  if (!user || !user.isActive) {
    return createResponse(401, { error: 'Utilisateur non trouvé' });
  }
  
  return createResponse(200, {
    valid: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
}

// Fonction de déconnexion
async function handleLogout(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createResponse(400, { error: 'Token manquant' });
  }
  
  const token = authHeader.substring(7);
  
  // Trouver et supprimer la session
  for (const [sessionId, session] of sessions.entries()) {
    if (session.token === token) {
      sessions.delete(sessionId);
      break;
    }
  }
  
  return createResponse(200, {
    success: true,
    message: 'Déconnexion réussie'
  });
}

// Utilitaires
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

async function hashPassword(password) {
  // Utilisation d'un hash simple pour la démo
  // En production, utiliser bcrypt ou scrypt
  return crypto.createHash('sha256').update(password + CONFIG.JWT_SECRET).digest('hex');
}

async function verifyPassword(password, hash) {
  const computed = await hashPassword(password);
  return computed === hash;
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + CONFIG.TOKEN_EXPIRY,
    iat: Date.now()
  };
  
  // JWT simplifié pour la démo
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = btoa(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', CONFIG.JWT_SECRET)
    .update(`${header}.${payloadB64}`)
    .digest('base64url');
    
  return `${header}.${payloadB64}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, payload, signature] = token.split('.');
    
    // Vérifier la signature
    const expectedSignature = crypto
      .createHmac('sha256', CONFIG.JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const decoded = JSON.parse(atob(payload));
    
    // Vérifier l'expiration
    if (decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Erreur de vérification token:', error);
    return null;
  }
}

// Nettoyage périodique des sessions expirées (appelé automatiquement)
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId);
    }
  }
}

// Nettoyer toutes les 15 minutes
setInterval(cleanupExpiredSessions, 15 * 60 * 1000);