import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import { randomBytes } from 'crypto';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ── Auth Middleware ──
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── Public Routes ──

// POST /api/orders — create order (public)
app.post('/api/orders', async (req, res) => {
  const { packageName, businessName, businessCategory, contentNotes, preferredDomain, referenceDemoId, contactName, contactEmail, contactWhatsapp, contactMethod, referralCode, maintenance, total } = req.body;
  const trackingLink = randomBytes(4).toString('hex');
  try {
    const expiresAt = maintenance ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] : null;
    const { rows } = await pool.query(
      `INSERT INTO orders (tracking_link, package_name, business_name, business_category, content_notes, preferred_domain, reference_demo_id, contact_name, contact_email, contact_whatsapp, contact_method, referral_code, maintenance, total, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [trackingLink, packageName, businessName, businessCategory, contentNotes, preferredDomain, referenceDemoId || null, contactName, contactEmail, contactWhatsapp, contactMethod, referralCode, !!maintenance, total, expiresAt]
    );
    const order = rows[0];
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({ to: contactEmail, from: process.env.CLIENT_FROM_EMAIL || 'hello@nexaweb.com', subject: 'Order Confirmed — NexaWeb', text: `Hi ${contactName}, thanks for your order! Your tracking link: ${req.get('origin') || 'https://nexaweb.com'}/order/track/${trackingLink}` });
        await sgMail.send({ to: process.env.ADMIN_EMAIL || 'admin@nexaweb.com', from: process.env.CLIENT_FROM_EMAIL || 'hello@nexaweb.com', subject: `New Order: ${packageName} — ${businessName}`, text: `Order #${trackingLink}: ${businessName} (${packageName}). Contact: ${contactName} <${contactEmail}>` });
      } catch (e) { console.log('Email error:', e.message); }
    }
    res.status(201).json({ ...order, tracking_link: trackingLink });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/orders/track/:link — public order tracking
app.get('/api/orders/track/:trackingLink', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE tracking_link = $1', [req.params.trackingLink]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/demos — public demo listing
app.get('/api/demos', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM demos ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/case-studies — public case study listing
app.get('/api/case-studies', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin Auth Routes ──

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin Orders ──

// GET /api/admin/orders — list all orders
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  const { status } = req.query;
  try {
    const { rows } = status && status !== 'all'
      ? await pool.query('SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/admin/orders/:id/status — update order status/notes
app.patch('/api/admin/orders/:id/status', authMiddleware, async (req, res) => {
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

// ── Admin Stats ──
app.get('/api/admin/stats', authMiddleware, async (_req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [ordersResult, starterResult, businessResult, customResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders WHERE created_at >= $1', [startOfMonth]),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Starter'"),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Business'"),
      pool.query("SELECT COUNT(*) FROM orders WHERE package_name = 'Custom'")
    ]);
    res.json({
      ordersThisMonth: parseInt(ordersResult.rows[0].count),
      starterCount: parseInt(starterResult.rows[0].count),
      businessCount: parseInt(businessResult.rows[0].count),
      customCount: parseInt(customResult.rows[0].count)
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin Demo CRUD ──
app.get('/api/admin/demos', authMiddleware, async (_req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM demos ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/admin/demos', authMiddleware, async (req, res) => {
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
  try { await pool.query('DELETE FROM demos WHERE id = $1', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin Case Study CRUD ──
app.get('/api/admin/case-studies', authMiddleware, async (_req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM case_studies ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/admin/case-studies', authMiddleware, async (req, res) => {
  const { title, client_name, client_background, challenge, solution, outcome, metrics, live_link } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO case_studies (title, client_name, client_background, challenge, solution, outcome, metrics, live_link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, client_name, client_background, challenge, solution, outcome, metrics, live_link]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/admin/case-studies/:id', authMiddleware, async (req, res) => {
  try { await pool.query('DELETE FROM case_studies WHERE id = $1', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Admin Reminder Trigger ──
app.post('/api/admin/reminder', authMiddleware, async (_req, res) => {
  try {
    const date = new Date(); date.setDate(date.getDate() + 30);
    const target = date.toISOString().split('T')[0];
    const { rows } = await pool.query("SELECT * FROM orders WHERE expires_at = $1 AND status != 'cancelled'", [target]);
    let sent = 0;
    if (process.env.SENDGRID_API_KEY) {
      for (const order of rows) {
        try {
          await sgMail.send({ to: order.contact_email, from: process.env.CLIENT_FROM_EMAIL || 'hello@nexaweb.com', subject: 'Hosting Renewal Reminder', text: `Hi ${order.contact_name}, your hosting expires on ${order.expires_at}. Renew to keep your site live!` });
          sent++;
        } catch (e) { /* skip */ }
      }
    }
    res.json({ sent, total: rows.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Init DB + Start ──
async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (id SERIAL PRIMARY KEY, email TEXT UNIQUE, password TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, tracking_link VARCHAR(8) UNIQUE, package_name TEXT, business_name TEXT, business_category TEXT, content_notes TEXT, preferred_domain TEXT, reference_demo_id INT, contact_name TEXT, contact_email TEXT, contact_whatsapp TEXT, contact_method TEXT, referral_code TEXT, status VARCHAR(20) DEFAULT 'received', admin_notes TEXT, total REAL, maintenance BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), expires_at DATE);
      CREATE TABLE IF NOT EXISTS demos (id SERIAL PRIMARY KEY, title TEXT, category VARCHAR(50), image_url TEXT, demo_url TEXT, description TEXT, budget_tier VARCHAR(20), created_at TIMESTAMPTZ DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS case_studies (id SERIAL PRIMARY KEY, title TEXT, client_name TEXT, client_background TEXT, challenge TEXT, solution TEXT, outcome TEXT, metrics TEXT, live_link TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
      INSERT INTO admin_users (email, password) SELECT 'admin@nexaweb.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE email='admin@nexaweb.com');
    `);
    console.log('DB tables ready');
  } finally { client.release(); }
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
init();
