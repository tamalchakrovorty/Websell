import express from 'express';

export function getCaseStudyRoutes(pool, authMiddleware) {
  const router = express.Router();
  router.get('/', async (_req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM case_studies ORDER BY id');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.post('/', authMiddleware, async (req, res) => {
    const { title, clientName, clientBackground, challenge, solution, outcome, metrics, liveLink } = req.body;
    try {
      const { rows } = await pool.query('INSERT INTO case_studies (title, client_name, client_background, challenge, solution, outcome, metrics, live_link) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [title, clientName, clientBackground, challenge, solution, outcome, metrics, liveLink]);
      res.status(201).json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.put('/:id', authMiddleware, async (req, res) => {
    const { title, clientName, clientBackground, challenge, solution, outcome, metrics, liveLink } = req.body;
    try {
      const { rows } = await pool.query('UPDATE case_studies SET title=$1, client_name=$2, client_background=$3, challenge=$4, solution=$5, outcome=$6, metrics=$7, live_link=$8 WHERE id=$9 RETURNING *', [title, clientName, clientBackground, challenge, solution, outcome, metrics, liveLink, req.params.id]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      await pool.query('DELETE FROM case_studies WHERE id = $1', [req.params.id]);
      res.json({ message: 'Case study deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  return router;
}
