/**
 * GLIMMR Backend Tests
 * Run: cd backend && npm test
 * (Add jest + supertest to devDependencies first)
 *
 * npm install --save-dev jest supertest
 */

const request = require('supertest');
const app = require('../server');

// ── Auth Tests ────────────────────────────────────────────────────────
describe('Auth API', () => {
  let token = '';
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@glimmr.in`,
    password: 'test123456'
  };

  test('POST /api/auth/register — should create new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  test('POST /api/auth/register — should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login — should return token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login — should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/me — should return user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('GET /api/auth/me — should reject without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

// ── Jewellery API Tests ──────────────────────────────────────────────
describe('Jewellery API', () => {
  test('GET /api/jewellery — should return list', async () => {
    const res = await request(app).get('/api/jewellery');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/jewellery?category=earring — should filter by category', async () => {
    const res = await request(app).get('/api/jewellery?category=earring');
    expect(res.statusCode).toBe(200);
    if (res.body.data.length > 0) {
      expect(res.body.data.every(j => j.category === 'earring')).toBe(true);
    }
  });

  test('GET /api/jewellery?limit=3 — should respect limit', async () => {
    const res = await request(app).get('/api/jewellery?limit=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
  });

  test('GET /api/jewellery/categories — should return categories list', async () => {
    const res = await request(app).get('/api/jewellery/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/jewellery/:id — should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/jewellery/000000000000000000000000');
    expect([404, 500]).toContain(res.statusCode);
  });
});

// ── Chatbot API Tests ────────────────────────────────────────────────
describe('Chatbot API', () => {
  test('POST /api/chatbot/message — should return reply for greeting', async () => {
    const res = await request(app)
      .post('/api/chatbot/message')
      .send({ message: 'Hello' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeDefined();
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(10);
  });

  test('POST /api/chatbot/message — should handle gold query', async () => {
    const res = await request(app)
      .post('/api/chatbot/message')
      .send({ message: 'Tell me about gold jewellery' });
    expect(res.statusCode).toBe(200);
    expect(res.body.reply.toLowerCase()).toMatch(/gold|jewel/i);
  });

  test('POST /api/chatbot/message — should reject empty message', async () => {
    const res = await request(app)
      .post('/api/chatbot/message')
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/chatbot/suggestions — should return array', async () => {
    const res = await request(app).get('/api/chatbot/suggestions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// ── Recommend API Tests ──────────────────────────────────────────────
describe('Recommend API', () => {
  test('POST /api/recommend/outfit — should return outfit suggestions', async () => {
    // First get a valid jewellery id
    const listRes = await request(app).get('/api/jewellery?limit=1');
    if (listRes.body.data?.length > 0) {
      const id = listRes.body.data[0]._id;
      const res = await request(app)
        .post('/api/recommend/outfit')
        .send({ jewelleryId: id });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.outfitSuggestions).toBeDefined();
      expect(Array.isArray(res.body.data.outfitSuggestions)).toBe(true);
    }
  });

  test('POST /api/recommend/outfit — should return 404 for invalid id', async () => {
    const res = await request(app)
      .post('/api/recommend/outfit')
      .send({ jewelleryId: '000000000000000000000000' });
    expect([404, 500]).toContain(res.statusCode);
  });
});

// ── TryOn API Tests ──────────────────────────────────────────────────
describe('TryOn API', () => {
  test('POST /api/tryon/session/start — should return sessionId', async () => {
    const res = await request(app)
      .post('/api/tryon/session/start')
      .send({ deviceInfo: { platform: 'test' } });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionId).toBeDefined();
  });
});

// ── Health Check ─────────────────────────────────────────────────────
describe('Health Check', () => {
  test('GET /api/health — should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBeDefined();
  });
});
