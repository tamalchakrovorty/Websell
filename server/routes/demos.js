import express from 'express';

export function getDemoRoutes(pool, authMiddleware) {
  const router = express.Router();
  router.get('/', async (_req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM demos ORDER BY id');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM demos WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Demo not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.post('/', authMiddleware, async (req, res) => {
    const { title, category, imageUrl, demoUrl, description, budgetTier } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO demos (title, category, image_url, demo_url, description, budget_tier) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [title, category, imageUrl, demoUrl, description, budgetTier]);
      res.status(201).json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.put('/:id', authMiddleware, async (req, res) => {
    const { title, category, imageUrl, demoUrl, description, budgetTier } = req.body;
    try {
      const { rows } = await pool.query('UPDATE demos SET title=$1, category=$2, image_url=$3, demo_url=$4, description=$5, budget_tier=$6 WHERE id=$7 RETURNING *', [title, category, imageUrl, demoUrl, description, budgetTier, req.params.id]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      await pool.query('DELETE FROM demos WHERE id = $1', [req.params.id]);
      res.json({ message: 'Demo deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  return router;
}
