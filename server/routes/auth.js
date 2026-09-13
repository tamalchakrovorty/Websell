import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function getAuthRoutes(pool) {
  const router = express.Router();
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
      if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  return router;
}
