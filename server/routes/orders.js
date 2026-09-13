import express from 'express';
import sgMail from '@sendgrid/mail';
import { randomBytes } from 'crypto';

export function getOrderRoutes(pool, authMiddleware) {
  const router = express.Router();

  router.post('/', async (req, res) => {
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
      // SendGrid notifications
      if (process.env.SENDGRID_API_KEY) {
        try {
          await sgMail.send({ to: contactEmail, from: process.env.CLIENT_FROM_EMAIL || 'hello@agency.com', subject: 'Order received', text: `Thanks ${contactName}! Your order ${trackingLink} for a ${packageName} website is confirmed.` });
          await sgMail.send({ to: process.env.ADMIN_EMAIL || 'admin@agency.com', from: process.env.CLIENT_FROM_EMAIL || 'hello@agency.com', subject: 'New order received', text: `New order ${trackingLink}: ${businessName} - ${packageName}. Contact: ${contactEmail}` });
        } catch (e) { console.log('Email skipped:', e.message); }
      }
      res.status(201).json(order);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    const { status } = req.query;
    try {
      const { rows } = status ? await pool.query('SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC', [status]) : await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Order not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    const { status, adminNotes } = req.body;
    try {
      const { rows } = await pool.query('UPDATE orders SET status = COALESCE($1, status), admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *', [status || null, adminNotes || null, req.params.id]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
}
