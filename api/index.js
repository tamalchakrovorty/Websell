import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

let pool;
let dbReady = false;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000
    });
  }
  return pool;
}

async function initDB() {
  if (dbReady) return;
  const p = getPool();
  if (!p) { console.error('No DATABASE_URL'); return; }
  try {
    await p.query(`CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, tracking_link VARCHAR(8) UNIQUE, package_name TEXT, business_name TEXT,
      business_category TEXT, content_notes TEXT, preferred_domain TEXT, reference_demo_id INT,
      contact_name TEXT, contact_email TEXT, contact_whatsapp TEXT, contact_method TEXT,
      referral_code TEXT, status VARCHAR(20) DEFAULT 'received', admin_notes TEXT, total REAL,
      maintenance BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), expires_at DATE
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS demos (
      id SERIAL PRIMARY KEY, title TEXT, category VARCHAR(50), image_url TEXT, demo_url TEXT,
      description TEXT, budget_tier VARCHAR(20), created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY, title TEXT, client_name TEXT, challenge TEXT,
      solution TEXT, outcome TEXT, metrics TEXT, live_link TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    // Seed admin user
    const email = process.env.ADMIN_EMAIL || 'admin@nexaweb.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await p.query(
      'INSERT INTO admin_users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2',
      [email, hash]
    );
    dbReady = true;
    console.log('DB ready. Admin:', email);
  } catch (e) {
    console.error('DB init error:', e.message);
  }
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function json(res, status, data) {
  cors(res);
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

function auth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret'); }
  catch { return null; }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

function routeMatch(pathname, pattern) {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) return null;
  }
  return params;
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    cors(res);
    return res.status(200).end();
  }

  await initDB();

  const p = getPool();
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  const method = req.method;

  try {
    // === HEALTH ===
    if (path === '/api/health' && method === 'GET') {
      let dbOk = false;
      try { if (p) { await p.query('SELECT 1'); dbOk = true; } } catch {}
      return json(res, 200, { ok: true, db: dbOk });
    }

    // === PUBLIC: Submit order ===
    if (path === '/api/orders' && method === 'POST') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const body = await parseBody(req);
      const { packageName, businessName, businessCategory, contentNotes, preferredDomain,
        referenceDemoId, contactName, contactEmail, contactWhatsapp, contactMethod, referralCode, maintenance, total } = body;

      if (!packageName || !contactName || !contactEmail) {
        return json(res, 400, { error: 'Package, name, and email are required.' });
      }

      const trackingLink = randomBytes(4).toString('hex');
      const expiresAt = maintenance ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] : null;

      const { rows } = await p.query(
        `INSERT INTO orders (tracking_link, package_name, business_name, business_category, content_notes, preferred_domain, reference_demo_id, contact_name, contact_email, contact_whatsapp, contact_method, referral_code, maintenance, total, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
        [trackingLink, packageName, businessName || '', businessCategory || '', contentNotes || '', preferredDomain || '', referenceDemoId || null, contactName, contactEmail, contactWhatsapp || '', contactMethod || 'email', referralCode || '', !!maintenance, total || 0, expiresAt]
      );
      return json(res, 201, { ...rows[0], tracking_link: trackingLink });
    }

    // === PUBLIC: Track order ===
    const trackParams = routeMatch(path, '/api/orders/track/:link');
    if (trackParams && method === 'GET') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const { rows } = await p.query('SELECT * FROM orders WHERE tracking_link = $1', [trackParams.link]);
      if (!rows.length) return json(res, 404, { error: 'Order not found.' });
      return json(res, 200, rows[0]);
    }

    // === PUBLIC: Demos ===
    if (path === '/api/demos' && method === 'GET') {
      if (!p) return json(res, 200, []);
      const { rows } = await p.query('SELECT * FROM demos ORDER BY created_at DESC');
      return json(res, 200, rows);
    }

    // === PUBLIC: Case studies ===
    if (path === '/api/case-studies' && method === 'GET') {
      if (!p) return json(res, 200, []);
      const { rows } = await p.query('SELECT * FROM case_studies ORDER BY created_at DESC');
      return json(res, 200, rows);
    }

    // === ADMIN: Login ===
    if (path === '/api/admin/login' && method === 'POST') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const body = await parseBody(req);
      const loginField = body.email || body.username;
      const { password } = body;

      if (!loginField || !password) {
        return json(res, 400, { error: 'Email/username and password are required.' });
      }

      const { rows } = await p.query('SELECT * FROM admin_users WHERE email = $1', [loginField]);
      if (!rows.length) return json(res, 401, { error: 'Invalid credentials.' });

      const valid = await bcrypt.compare(password, rows[0].password);
      if (!valid) return json(res, 401, { error: 'Invalid credentials.' });

      const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
      return json(res, 200, { token });
    }

    // === ADMIN: Protected routes below ===
    const adminUser = auth(req);
    if (!adminUser) return json(res, 401, { error: 'Access denied. Please log in.' });

    // Admin: list orders
    if (path === '/api/admin/orders' && method === 'GET') {
      if (!p) return json(res, 200, []);
      const status = url.searchParams.get('status');
      const { rows } = status && status !== 'all'
        ? await p.query('SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC', [status])
        : await p.query('SELECT * FROM orders ORDER BY created_at DESC');
      return json(res, 200, rows);
    }

    // Admin: update order
    const orderParams = routeMatch(path, '/api/admin/orders/:id/status');
    if (orderParams && method === 'PATCH') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const body = await parseBody(req);
      const { rows } = await p.query(
        'UPDATE orders SET status = COALESCE($1, status), admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *',
        [body.status || null, body.admin_notes || null, orderParams.id]
      );
      if (!rows.length) return json(res, 404, { error: 'Order not found' });
      return json(res, 200, rows[0]);
    }

    // Admin: stats
    if (path === '/api/admin/stats' && method === 'GET') {
      if (!p) return json(res, 200, { total: 0, monthly: 0, byPackage: {} });
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const [totalR, monthR, starterR, businessR, customR] = await Promise.all([
        p.query('SELECT COUNT(*) FROM orders'),
        p.query('SELECT COUNT(*) FROM orders WHERE created_at >= $1', [startOfMonth]),
        p.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Starter'"),
        p.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Business'"),
        p.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Custom'")
      ]);
      return json(res, 200, {
        total: parseInt(totalR.rows[0].count),
        monthly: parseInt(monthR.rows[0].count),
        byPackage: { starter: parseInt(starterR.rows[0].count), business: parseInt(businessR.rows[0].count), custom: parseInt(customR.rows[0].count) }
      });
    }

    // Admin: demos CRUD
    if (path === '/api/admin/demos' && method === 'GET') {
      if (!p) return json(res, 200, []);
      const { rows } = await p.query('SELECT * FROM demos ORDER BY created_at DESC');
      return json(res, 200, rows);
    }
    if (path === '/api/admin/demos' && method === 'POST') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const body = await parseBody(req);
      const { rows } = await p.query(
        'INSERT INTO demos (title, category, image_url, demo_url, description, budget_tier) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [body.title, body.category, body.image_url, body.demo_url, body.description, body.budget_tier]
      );
      return json(res, 201, rows[0]);
    }
    const demoParams = routeMatch(path, '/api/admin/demos/:id');
    if (demoParams && method === 'DELETE') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      await p.query('DELETE FROM demos WHERE id = $1', [demoParams.id]);
      return json(res, 200, { ok: true });
    }

    // Admin: case studies CRUD
    if (path === '/api/admin/case-studies' && method === 'GET') {
      if (!p) return json(res, 200, []);
      const { rows } = await p.query('SELECT * FROM case_studies ORDER BY created_at DESC');
      return json(res, 200, rows);
    }
    if (path === '/api/admin/case-studies' && method === 'POST') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      const body = await parseBody(req);
      const { rows } = await p.query(
        'INSERT INTO case_studies (title, client_name, challenge, solution, outcome, metrics, live_link) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [body.title, body.client_name, body.challenge, body.solution, body.outcome, body.metrics, body.live_link]
      );
      return json(res, 201, rows[0]);
    }
    const csParams = routeMatch(path, '/api/admin/case-studies/:id');
    if (csParams && method === 'DELETE') {
      if (!p) return json(res, 503, { error: 'Database not connected.' });
      await p.query('DELETE FROM case_studies WHERE id = $1', [csParams.id]);
      return json(res, 200, { ok: true });
    }

    // Admin: reminder
    if (path === '/api/admin/reminder' && method === 'POST') {
      return json(res, 200, { sent: 0, total: 0, message: 'Reminder system requires SendGrid setup.' });
    }

    // 404
    return json(res, 404, { error: 'Not found: ' + path });

  } catch (e) {
    console.error('API error:', e.message);
    return json(res, 500, { error: 'Internal server error.' });
  }
}
