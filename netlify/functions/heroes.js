// netlify/functions/heroes.js - API pour la gestion des héros
export default async (req, context) => {
  const { httpMethod, body, headers, url } = req;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(headers.authorization);
    if (!authResult.valid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Non autorisé' })
      };
    }

    const userId = authResult.user.id;
    const urlPath = new URL(url).pathname;

    switch (httpMethod) {
      case 'GET':
        if (urlPath.includes('/heroes')) {
          return await getHeroes(userId, corsHeaders);
        }
        break;

      case 'POST':
        if (urlPath.includes('/heroes')) {
          return await saveHeroes(userId, JSON.parse(body), corsHeaders);
        }
        break;

      case 'PUT':
        if (urlPath.includes('/heroes/')) {
          const heroId = urlPath.split('/').pop();
          return await updateHero(userId, heroId, JSON.parse(body), corsHeaders);
        }
        break;

      case 'DELETE':
        if (urlPath.includes('/heroes/')) {
          const heroId = urlPath.split('/').pop();
          return await deleteHero(userId, heroId, corsHeaders);
        }
        break;
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Endpoint non trouvé' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Base de données simulée (en production: utiliser FaunaDB, Supabase, etc.)
const userHeroes = new Map();

async function getHeroes(userId, headers) {
  const heroes = userHeroes.get(userId) || [];
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      heroes,
      count: heroes.length
    })
  };
}

async function saveHeroes(userId, heroesData, headers) {
  const { heroes } = heroesData;
  
  if (!Array.isArray(heroes)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Format de données invalide' })
    };
  }

  // Ajouter des IDs uniques et timestamp
  const processedHeroes = heroes.map(hero => ({
    ...hero,
    id: hero.id || generateHeroId(),
    userId,
    createdAt: hero.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  userHeroes.set(userId, processedHeroes);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: `${processedHeroes.length} héros sauvegardés`,
      heroes: processedHeroes
    })
  };
}

async function updateHero(userId, heroId, heroData, headers) {
  const heroes = userHeroes.get(userId) || [];
  const heroIndex = heroes.findIndex(h => h.id === heroId);
  
  if (heroIndex === -1) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Héros non trouvé' })
    };
  }

  heroes[heroIndex] = {
    ...heroes[heroIndex],
    ...heroData,
    updatedAt: new Date().toISOString()
  };

  userHeroes.set(userId, heroes);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      hero: heroes[heroIndex]
    })
  };
}

async function deleteHero(userId, heroId, headers) {
  const heroes = userHeroes.get(userId) || [];
  const filteredHeroes = heroes.filter(h => h.id !== heroId);
  
  if (filteredHeroes.length === heroes.length) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Héros non trouvé' })
    };
  }

  userHeroes.set(userId, filteredHeroes);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Héros supprimé'
    })
  };
}

async function verifyAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    return { valid: true, user: payload };
  } catch {
    return { valid: false };
  }
}

function generateHeroId() {
  return 'hero_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

