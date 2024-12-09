const express = require('express');
const router = express.Router();

module.exports = (pool, sectorMapping) => {
    // Route to get sector activity data
    router.get('/sector-activity', async (req, res) => {
        const { politicianName } = req.query;

        try {
            // Query trades for the given politician
            const [trades] = await pool.query(`
                SELECT symbol 
                FROM trades
                WHERE politicianName = ?
            `, [politicianName]);

            // Object to store sector counts
            const sectorCounts = {};

            // Map symbols to their sectors and count occurrences
            trades.forEach((trade) => {
                const sector = sectorMapping[trade.symbol];
                if (sector) {
                    if (!sectorCounts[sector]) {
                        sectorCounts[sector] = 0;
                    }
                    sectorCounts[sector]++;
                }
            });

            // Reformat sectorCounts for charting
            const sectorData = Object.keys(sectorCounts).map((sector) => ({
                sector: sector,
                count: sectorCounts[sector],
            }));

            // Get the top 5 sectors
            const topSectors = sectorData.sort((a, b) => b.count - a.count).slice(0, 5);

            res.status(200).json(topSectors);
        } catch (error) {
            console.error('Error fetching sector activity data:', error);
            res.status(500).json({ error: 'Failed to fetch sector activity data' });
        }
    });

    return router;
};
