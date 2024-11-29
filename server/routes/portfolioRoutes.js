const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Endpoint to fetch portfolio composition
  router.get('/portfolio-composition', async (req, res) => {
    const { politicianName } = req.query;

    try {
      const [rows] = await pool.query(
        `SELECT symbol, COUNT(*) AS count
         FROM trades
         WHERE politicianName = ?
         GROUP BY symbol
         ORDER BY count DESC`,
        [politicianName]
      );
      res.json(rows); // Send the result as JSON
    } catch (err) {
      console.error('Error fetching portfolio composition data:', err);
      res.status(500).json({ error: 'Failed to fetch portfolio composition data' });
    }
  });

  return router;
};
