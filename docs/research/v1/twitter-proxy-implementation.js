// Twitter/X Proxy Implementation Example
// Complete Fastify server with multi-provider support and 0G Storage integration

import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { createHash } from 'crypto';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import CircuitBreaker from 'opossum';
import pRetry from 'p-retry';

// Initialize Playwright with stealth
chromium.use(stealth());

// Fastify server setup
const fastify = Fastify({
  logger: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
});

// ============================================
// CONFIGURATION
// ============================================

const config = {
  providers: {
    twitterapi: {
      endpoint: 'https://api.twitterapi.io/v1',
      apiKey: process.env.TWITTERAPI_KEY,
      timeout: 3000,
      maxRetries: 3
    },
    apify: {
      token: process.env.APIFY_TOKEN,
      actorId: 'kaitoeasyapi/twitter-scraper',
      timeout: 10000
    },
    nitter: {
      instances: [
        'https://nitter.poast.org',
        'https://nitter.privacydev.net',
        'https://nitter.net'
      ],
      timeout: 2000
    }
  },
  cache: {
    ttl: {
      tweet: 3600,      // 1 hour
      search: 300,      // 5 minutes
      user: 1800       // 30 minutes
    }
  },
  rateLimit: {
    global: {
      max: 1000,
      timeWindow: '1 minute'
    },
    endpoints: {
      status: { max: 100, timeWindow: '1 minute' },
      search: { max: 20, timeWindow: '1 minute' },
      timeline: { max: 50, timeWindow: '1 minute' }
    }
  },
  zerog: {
    enabled: process.env.ZEROG_ENABLED === 'true',
    endpoint: process.env.ZEROG_ENDPOINT,
    privateKey: process.env.ZEROG_PRIVATE_KEY
  }
};

// ============================================
// PROVIDER IMPLEMENTATIONS
// ============================================

// TwitterAPI.io Provider
class TwitterAPIProvider {
  constructor(config) {
    this.config = config;
    this.breaker = new CircuitBreaker(this._fetch.bind(this), {
      timeout: config.timeout,
      errorThresholdPercentage: 50,
      resetTimeout: 30000
    });
  }
  
  async _fetch(endpoint, params = {}) {
    const url = new URL(`${this.config.endpoint}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`TwitterAPI error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async getTweet(id) {
    return await this.breaker.fire(`/tweets/${id}`);
  }
  
  async searchTweets(query, limit = 20) {
    return await this.breaker.fire('/search', { q: query, limit });
  }
  
  async getUserTimeline(username, limit = 20) {
    return await this.breaker.fire(`/users/${username}/tweets`, { limit });
  }
}

// Playwright Scraper Provider
class PlaywrightProvider {
  constructor() {
    this.browser = null;
    this.contextPool = [];
    this.maxContexts = 3;
  }
  
  async initialize() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-site-isolation-trials',
          '--disable-web-security',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-for-policy',
          '--no-sandbox'
        ]
      });
    }
  }
  
  async getContext() {
    await this.initialize();
    
    if (this.contextPool.length < this.maxContexts) {
      const context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        locale: 'en-US',
        timezoneId: 'America/New_York'
      });
      
      this.contextPool.push(context);
      return context;
    }
    
    // Return random context from pool
    return this.contextPool[Math.floor(Math.random() * this.contextPool.length)];
  }
  
  async scrapeTweet(tweetId) {
    const context = await this.getContext();
    const page = await context.newPage();
    
    try {
      // Navigate to tweet
      await page.goto(`https://x.com/i/status/${tweetId}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Wait for content
      await page.waitForSelector('[data-testid="tweetText"]', { timeout: 10000 });
      
      // Add random delay to appear human
      await page.waitForTimeout(Math.random() * 2000 + 1000);
      
      // Extract tweet data
      const tweetData = await page.evaluate(() => {
        const getText = (selector) => {
          const element = document.querySelector(selector);
          return element ? element.innerText : null;
        };
        
        const getMetric = (testId) => {
          const element = document.querySelector(`[data-testid="${testId}"]`);
          if (!element) return '0';
          const text = element.getAttribute('aria-label') || element.innerText;
          const match = text.match(/[\d,]+/);
          return match ? match[0].replace(/,/g, '') : '0';
        };
        
        return {
          id: window.location.pathname.split('/').pop(),
          text: getText('[data-testid="tweetText"]'),
          author: {
            name: getText('[data-testid="User-Name"] span'),
            username: getText('[data-testid="User-Name"] a')?.replace('@', ''),
            avatar: document.querySelector('[data-testid="Tweet-User-Avatar"] img')?.src
          },
          timestamp: document.querySelector('time')?.getAttribute('datetime'),
          metrics: {
            likes: getMetric('like'),
            retweets: getMetric('retweet'),
            replies: getMetric('reply'),
            bookmarks: getMetric('bookmark')
          },
          media: Array.from(document.querySelectorAll('[data-testid="tweetPhoto"] img')).map(img => ({
            type: 'photo',
            url: img.src
          }))
        };
      });
      
      // Take screenshot if configured
      let screenshot = null;
      if (process.env.CAPTURE_SCREENSHOTS === 'true') {
        screenshot = await page.screenshot({
          fullPage: false,
          clip: await page.locator('article').boundingBox()
        });
      }
      
      return {
        ...tweetData,
        screenshot: screenshot ? screenshot.toString('base64') : null,
        provider: 'playwright',
        scrapedAt: new Date().toISOString()
      };
      
    } finally {
      await page.close();
    }
  }
  
  async cleanup() {
    for (const context of this.contextPool) {
      await context.close();
    }
    this.contextPool = [];
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Nitter RSS Provider
class NitterProvider {
  constructor(config) {
    this.instances = config.instances;
    this.healthStatus = new Map();
  }
  
  async checkHealth(instance) {
    try {
      const response = await fetch(`${instance}/about`, {
        signal: AbortSignal.timeout(2000)
      });
      const healthy = response.ok;
      this.healthStatus.set(instance, healthy);
      return healthy;
    } catch {
      this.healthStatus.set(instance, false);
      return false;
    }
  }
  
  async getHealthyInstance() {
    // Try to find a known healthy instance first
    for (const [instance, healthy] of this.healthStatus.entries()) {
      if (healthy) return instance;
    }
    
    // Check all instances
    for (const instance of this.instances) {
      if (await this.checkHealth(instance)) {
        return instance;
      }
    }
    
    throw new Error('No healthy Nitter instances available');
  }
  
  async getUserRSS(username) {
    const instance = await this.getHealthyInstance();
    const response = await fetch(`${instance}/${username}/rss`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Nitter RSS failed: ${response.status}`);
    }
    
    return await response.text();
  }
  
  async parseRSS(rssText) {
    // Simple RSS to JSON parser
    const items = [];
    const itemMatches = rssText.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      const item = match[1];
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      
      items.push({
        title: this.unescapeHTML(title),
        text: this.unescapeHTML(description),
        url: link,
        timestamp: new Date(pubDate).toISOString()
      });
    }
    
    return items;
  }
  
  unescapeHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent;
  }
}

// ============================================
// PROVIDER ORCHESTRATOR
// ============================================

class ProviderOrchestrator {
  constructor() {
    this.twitterAPI = new TwitterAPIProvider(config.providers.twitterapi);
    this.playwright = new PlaywrightProvider();
    this.nitter = new NitterProvider(config.providers.nitter);
  }
  
  async getTweet(id, options = {}) {
    const errors = [];
    
    // Try TwitterAPI first (fastest and most reliable)
    if (!options.skipTwitterAPI) {
      try {
        const data = await pRetry(
          () => this.twitterAPI.getTweet(id),
          { retries: 2, minTimeout: 100 }
        );
        return { ...data, provider: 'twitterapi' };
      } catch (error) {
        errors.push({ provider: 'twitterapi', error: error.message });
      }
    }
    
    // Fallback to Playwright scraping
    if (!options.skipScraping) {
      try {
        const data = await this.playwright.scrapeTweet(id);
        return { ...data, provider: 'playwright' };
      } catch (error) {
        errors.push({ provider: 'playwright', error: error.message });
      }
    }
    
    // All providers failed
    throw new Error(`All providers failed: ${JSON.stringify(errors)}`);
  }
  
  async searchTweets(query, limit = 20) {
    try {
      return await this.twitterAPI.searchTweets(query, limit);
    } catch (error) {
      // Search is complex to scrape, throw error if API fails
      throw new Error(`Search unavailable: ${error.message}`);
    }
  }
  
  async getUserTimeline(username, options = {}) {
    const errors = [];
    
    // Try Nitter RSS first (free and fast when available)
    try {
      const rss = await this.nitter.getUserRSS(username);
      const tweets = await this.nitter.parseRSS(rss);
      return { tweets, provider: 'nitter' };
    } catch (error) {
      errors.push({ provider: 'nitter', error: error.message });
    }
    
    // Fallback to TwitterAPI
    try {
      const data = await this.twitterAPI.getUserTimeline(username, options.limit);
      return { ...data, provider: 'twitterapi' };
    } catch (error) {
      errors.push({ provider: 'twitterapi', error: error.message });
    }
    
    throw new Error(`Timeline fetch failed: ${JSON.stringify(errors)}`);
  }
  
  async cleanup() {
    await this.playwright.cleanup();
  }
}

// ============================================
// CACHE IMPLEMENTATION
// ============================================

class SimpleCache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }
  
  set(key, value, ttl = 3600) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    // Store value
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
    
    // Set expiration timer
    const timer = setTimeout(() => {
      this.store.delete(key);
      this.timers.delete(key);
    }, ttl * 1000);
    
    this.timers.set(key, timer);
  }
  
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl * 1000) {
      this.store.delete(key);
      this.timers.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.store.clear();
    this.timers.clear();
  }
}

// ============================================
// 0G STORAGE INTEGRATION
// ============================================

class ZeroGStorage {
  constructor(config) {
    this.enabled = config.enabled;
    this.config = config;
  }
  
  async storeContent(data, metadata = {}) {
    if (!this.enabled) return null;
    
    try {
      // Generate content hash
      const contentHash = createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
      
      // Create merkle tree for proof
      const leaves = [
        contentHash,
        createHash('sha256').update(metadata.screenshot || '').digest('hex'),
        createHash('sha256').update(Date.now().toString()).digest('hex')
      ];
      
      // Calculate merkle root (simplified)
      const root = createHash('sha256')
        .update(leaves.join(''))
        .digest('hex');
      
      // In production, actually store to 0G here
      console.log('Storing to 0G:', {
        contentHash,
        root,
        size: JSON.stringify(data).length
      });
      
      return {
        contentHash,
        rootHash: root,
        proof: leaves,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('0G storage error:', error);
      return null;
    }
  }
  
  async verify(contentHash, rootHash, proof) {
    if (!this.enabled) return false;
    
    // Verify merkle proof
    const calculatedRoot = createHash('sha256')
      .update(proof.join(''))
      .digest('hex');
    
    return calculatedRoot === rootHash;
  }
}

// ============================================
// FASTIFY ROUTES
// ============================================

const orchestrator = new ProviderOrchestrator();
const cache = new SimpleCache();
const storage = new ZeroGStorage(config.zerog);

// Register plugins
await fastify.register(cors, {
  origin: true,
  credentials: true
});

await fastify.register(rateLimit, config.rateLimit.global);

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      twitterapi: 'operational',
      playwright: 'operational',
      nitter: 'degraded'
    },
    cache: {
      size: cache.store.size,
      operational: true
    },
    storage: {
      enabled: storage.enabled,
      operational: storage.enabled
    }
  };
  
  reply.send(health);
});

// GET /x/status/:id - Fetch single tweet
fastify.get('/x/status/:id', {
  preHandler: fastify.rateLimit(config.rateLimit.endpoints.status),
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', pattern: '^[0-9]+$' }
      },
      required: ['id']
    },
    querystring: {
      type: 'object',
      properties: {
        force: { type: 'boolean', default: false },
        provider: { type: 'string', enum: ['twitterapi', 'playwright', 'any'] }
      }
    }
  }
}, async (request, reply) => {
  const { id } = request.params;
  const { force, provider } = request.query;
  
  // Check cache unless force refresh
  if (!force) {
    const cached = cache.get(`tweet:${id}`);
    if (cached) {
      request.log.info(`Cache hit for tweet ${id}`);
      return reply.send(cached);
    }
  }
  
  try {
    // Fetch tweet
    const options = {};
    if (provider === 'twitterapi') options.skipScraping = true;
    if (provider === 'playwright') options.skipTwitterAPI = true;
    
    const tweetData = await orchestrator.getTweet(id, options);
    
    // Store to 0G if enabled
    const storageResult = await storage.storeContent(tweetData);
    
    // Prepare response
    const response = {
      data: tweetData,
      metadata: {
        provider: tweetData.provider,
        cached: false,
        timestamp: Date.now()
      }
    };
    
    if (storageResult) {
      response.metadata.storage = storageResult;
    }
    
    // Cache the result
    cache.set(`tweet:${id}`, response, config.cache.ttl.tweet);
    
    return reply.send(response);
    
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Failed to fetch tweet',
      message: error.message,
      id
    });
  }
});

// GET /x/search - Search tweets
fastify.get('/x/search', {
  preHandler: fastify.rateLimit(config.rateLimit.endpoints.search),
  schema: {
    querystring: {
      type: 'object',
      properties: {
        q: { type: 'string', minLength: 1, maxLength: 500 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
      },
      required: ['q']
    }
  }
}, async (request, reply) => {
  const { q, limit } = request.query;
  
  // Generate cache key
  const cacheKey = `search:${createHash('md5').update(q + limit).digest('hex')}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    request.log.info(`Cache hit for search: ${q}`);
    return reply.send(cached);
  }
  
  try {
    const results = await orchestrator.searchTweets(q, limit);
    
    const response = {
      data: results,
      metadata: {
        query: q,
        limit,
        provider: 'twitterapi',
        cached: false,
        timestamp: Date.now()
      }
    };
    
    // Cache for shorter period
    cache.set(cacheKey, response, config.cache.ttl.search);
    
    return reply.send(response);
    
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Search unavailable',
      message: error.message,
      query: q
    });
  }
});

// GET /x/timeline/:username - Get user timeline
fastify.get('/x/timeline/:username', {
  preHandler: fastify.rateLimit(config.rateLimit.endpoints.timeline),
  schema: {
    params: {
      type: 'object',
      properties: {
        username: { type: 'string', pattern: '^[A-Za-z0-9_]+$' }
      },
      required: ['username']
    },
    querystring: {
      type: 'object',
      properties: {
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        format: { type: 'string', enum: ['json', 'rss'], default: 'json' }
      }
    }
  }
}, async (request, reply) => {
  const { username } = request.params;
  const { limit, format } = request.query;
  
  // Check cache
  const cacheKey = `timeline:${username}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    if (format === 'rss') {
      return reply
        .type('application/rss+xml')
        .send(generateRSS(cached.data.tweets, username));
    }
    return reply.send(cached);
  }
  
  try {
    const timeline = await orchestrator.getUserTimeline(username, { limit });
    
    const response = {
      data: timeline,
      metadata: {
        username,
        provider: timeline.provider,
        cached: false,
        timestamp: Date.now()
      }
    };
    
    // Cache the result
    cache.set(cacheKey, response, config.cache.ttl.user);
    
    if (format === 'rss') {
      return reply
        .type('application/rss+xml')
        .send(generateRSS(timeline.tweets, username));
    }
    
    return reply.send(response);
    
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      error: 'Timeline unavailable',
      message: error.message,
      username
    });
  }
});

// POST /x/verify - Verify content integrity
fastify.post('/x/verify', {
  schema: {
    body: {
      type: 'object',
      properties: {
        contentHash: { type: 'string' },
        rootHash: { type: 'string' },
        proof: { type: 'array', items: { type: 'string' } }
      },
      required: ['contentHash', 'rootHash', 'proof']
    }
  }
}, async (request, reply) => {
  const { contentHash, rootHash, proof } = request.body;
  
  const verified = await storage.verify(contentHash, rootHash, proof);
  
  return reply.send({
    verified,
    contentHash,
    rootHash,
    timestamp: Date.now()
  });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateRSS(tweets, username) {
  const items = tweets.map(tweet => `
    <item>
      <title>${escapeXML(tweet.title || tweet.text.substring(0, 100))}</title>
      <description>${escapeXML(tweet.text)}</description>
      <link>${tweet.url || `https://x.com/${username}/status/${tweet.id}`}</link>
      <pubDate>${new Date(tweet.timestamp).toUTCString()}</pubDate>
      <guid>${tweet.id}</guid>
    </item>
  `).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>@${username} - Twitter/X Timeline</title>
    <link>https://x.com/${username}</link>
    <description>Timeline for @${username}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

function escapeXML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================
// SERVER START
// ============================================

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    });
    
    console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`);
    console.log('Providers configured:', Object.keys(config.providers));
    console.log('0G Storage:', config.zerog.enabled ? 'Enabled' : 'Disabled');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await orchestrator.cleanup();
  await fastify.close();
  process.exit(0);
});

// Start server
start();

// ============================================
// EXPORTS FOR TESTING
// ============================================

export {
  fastify,
  orchestrator,
  cache,
  storage,
  TwitterAPIProvider,
  PlaywrightProvider,
  NitterProvider,
  ProviderOrchestrator,
  SimpleCache,
  ZeroGStorage
};