const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/canteen.db');

// Get all menu items
router.get('/', (req, res) => {
    db.all('SELECT * FROM MenuItem', [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Add a menu item
router.post('/', (req, res) => {
    const { name, category, price } = req.body;
    db.run('INSERT INTO MenuItem (name, category, price) VALUES (?, ?, ?)', 
        [name, category, price], 
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Menu item added', id: this.lastID });
        }
    );
});

module.exports = router;
