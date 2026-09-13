import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import { randomBytes } from 'crypto';

const app = express();
app.use(cors({ origin: '*', methods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
  });
} catch (e) { console.error('Pool creation error:', e.message); }

if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// Health check
app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try { if (pool) { await pool.query('SELECT 1'); dbOk = true; } } catch {}
  res.json({ ok: true, db: dbOk, env: { hasDbUrl: !!process.env.DATABASE_URL, hasJwt: !!process.env.JWT_SECRET, hasSendgrid: !!process.env.SENDGRID_API_KEY } });
});

// === PUBLIC ROUTES ===

// Submit order
app.post('/api/orders', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  const { packageName, businessName, businessCategory, contentNotes, preferredDomain, referenceDemoId, contactName, contactEmail, contactWhatsapp, contactMethod, referralCode, maintenance, total } = req.body;

  // Validate required fields
  if (!packageName || !contactName || !contactEmail) {
    return res.status(400).json({ error: 'Package, name, and email are required.' });
  }

  const trackingLink = randomBytes(4).toString('hex');
  try {
    const expiresAt = maintenance ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] : null;
    const { rows } = await pool.query(
      `INSERT INTO orders (tracking_link, package_name, business_name, business_category, content_notes, preferred_domain, reference_demo_id, contact_name, contact_email, contact_whatsapp, contact_method, referral_code, maintenance, total, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [trackingLink, packageName, businessName || '', businessCategory || '', contentNotes || '', preferredDomain || '', referenceDemoId || null, contactName, contactEmail, contactWhatsapp || '', contactMethod || 'email', referralCode || '', !!maintenance, total || 0, expiresAt]
    );
    const order = rows[0];

    // Send emails (non-blocking)
    if (process.env.SENDGRID_API_KEY) {
      const clientUrl = process.env.CLIENT_URL || 'https://websell.vercel.app';
      try {
        await sgMail.send({
          to: contactEmail,
          from: process.env.SENDGRID_FROM_EMAIL || 'hello@nexaweb.com',
          subject: 'Order Confirmed — NexaWeb',
          text: `Hi ${contactName},\n\nThank you for your order!\n\nPackage: ${packageName}\nBusiness: ${businessName}\nTrack your order: ${clientUrl}/order/track/${trackingLink}\n\nWe'll be in touch soon!`
        });
      } catch (e) { console.log('Client email error:', e.message); }
      try {
        await sgMail.send({
          to: process.env.ADMIN_EMAIL || 'admin@nexaweb.com',
          from: process.env.SENDGRID_FROM_EMAIL || 'hello@nexaweb.com',
          subject: `New Order: ${packageName} — ${businessName}`,
          text: `New order received!\n\nPackage: ${packageName}\nBusiness: ${businessName}\nCategory: ${businessCategory}\nContact: ${contactName} <${contactEmail}>\nPhone: ${contactWhatsapp}\nDomain: ${preferredDomain}\nNotes: ${contentNotes}\nTotal: ৳${total}\nReferral: ${referralCode || 'none'}\n\nOrder ID: ${trackingLink}`
        });
      } catch (e) { console.log('Admin email error:', e.message); }
    }

    res.status(201).json({ ...order, tracking_link: trackingLink });
  } catch (e) {
    console.error('Order creation error:', e.message);
    res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
});

// Track order (public)
app.get('/api/orders/track/:trackingLink', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE tracking_link = $1', [req.params.trackingLink]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found. Please check your tracking link.' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get demos (public)
app.get('/api/demos', async (_req, res) => {
  if (!pool) return res.json([]);
  try { const { rows } = await pool.query('SELECT * FROM demos ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Get case studies (public)
app.get('/api/case-studies', async (_req, res) => {
  if (!pool) return res.json([]);
  try { const { rows } = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// === ADMIN ROUTES ===

// Admin login - accepts BOTH 'email' and 'username' fields
app.post('/api/admin/login', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });

  const { username, email, password } = req.body;
  const loginEmail = email || username;

  if (!loginEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [loginEmail]);
    if (!rows.length) {
      console.log('Login attempt failed: no user found for', loginEmail);
      return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
    }
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      console.log('Login attempt failed: wrong password for', loginEmail);
      return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
    }
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Admin: list orders
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  const { status } = req.query;
  try {
    const { rows } = status && status !== 'all'
      ? await pool.query('SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: update order
app.patch('/api/admin/orders/:id/status', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  const { status, admin_notes } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status = COALESCE($1, status), admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *',
      [status || null, admin_notes || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: stats
app.get('/api/admin/stats', authMiddleware, async (_req, res) => {
  if (!pool) return res.json({ total: 0, monthly: 0, byPackage: {} });
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalR, monthR, starterR, businessR, customR] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COUNT(*) FROM orders WHERE created_at >= $1', [startOfMonth]),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Starter'"),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Business'"),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Custom'")
    ]);
    res.json({
      total: parseInt(totalR.rows[0].count),
      monthly: parseInt(monthR.rows[0].count),
      byPackage: { starter: parseInt(starterR.rows[0].count), business: parseInt(businessR.rows[0].count), custom: parseInt(customR.rows[0].count) }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: demos CRUD
app.get('/api/admin/demos', authMiddleware, async (_req, res) => {
  if (!pool) return res.json([]);
  try { const { rows } = await pool.query('SELECT * FROM demos ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/admin/demos', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  const { title, category, image_url, demo_url, description, budget_tier } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO demos (title, category, image_url, demo_url, description, budget_tier) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, category, image_url, demo_url, description, budget_tier]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/admin/demos/:id', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  try { await pool.query('DELETE FROM demos WHERE id = $1', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: case studies CRUD
app.get('/api/admin/case-studies', authMiddleware, async (_req, res) => {
  if (!pool) return res.json([]);
  try { const { rows } = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/admin/case-studies', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  const { title, client_name, challenge, solution, outcome, metrics, live_link } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO case_studies (title, client_name, challenge, solution, outcome, metrics, live_link) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, client_name, challenge, solution, outcome, metrics, live_link]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/admin/case-studies/:id', authMiddleware, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  try { await pool.query('DELETE FROM case_studies WHERE id = $1', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: hosting expiry reminder
app.post('/api/admin/reminder', authMiddleware, async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database not connected.' });
  try {
    const date = new Date(); date.setDate(date.getDate() + 30);
    const target = date.toISOString().split('T')[0];
    const { rows } = await pool.query("SELECT * FROM orders WHERE expires_at = $1 AND status != 'cancelled'", [target]);
    let sent = 0;
    if (process.env.SENDGRID_API_KEY) {
      for (const order of rows) {
        try {
          await sgMail.send({ to: order.contact_email, from: process.env.SENDGRID_FROM_EMAIL || 'hello@nexaweb.com', subject: 'Hosting Renewal Reminder', text: `Hi ${order.contact_name}, your hosting expires on ${order.expires_at}. Renew to keep your site live!` });
          sent++;
        } catch {}
      }
    }
    res.json({ sent, total: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// === DATABASE INIT ===
async function initDB() {
  if (!pool) { console.error('No database pool — skipping init'); return; }
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, tracking_link VARCHAR(8) UNIQUE, package_name TEXT, business_name TEXT,
      business_category TEXT, content_notes TEXT, preferred_domain TEXT, reference_demo_id INT,
      contact_name TEXT, contact_email TEXT, contact_whatsapp TEXT, contact_method TEXT,
      referral_code TEXT, status VARCHAR(20) DEFAULT 'received', admin_notes TEXT, total REAL,
      maintenance BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), expires_at DATE
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS demos (
      id SERIAL PRIMARY KEY, title TEXT, category VARCHAR(50), image_url TEXT, demo_url TEXT,
      description TEXT, budget_tier VARCHAR(20), created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS case_studies (
      id SERIAL PRIMARY KEY, title TEXT, client_name TEXT, challenge TEXT,
      solution TEXT, outcome TEXT, metrics TEXT, live_link TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    // Seed admin user — ALWAYS update password hash to match env var
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexaweb.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(adminPassword, 10);

    // First try to insert, then always update the password hash
    await pool.query(
      'INSERT INTO admin_users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2',
      [adminEmail, hash]
    );
    console.log('DB initialized. Admin user:', adminEmail);
  } catch (e) { console.error('DB init error:', e.message); }
}

let dbReady = false;

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(200).end();
  }

  if (!dbReady) { await initDB(); dbReady = true; }

  return app(req, res);
}
