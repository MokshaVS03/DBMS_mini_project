const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/canteen.db');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route: Homepage
app.get('/', (req, res) => {
  const query = 'SELECT * FROM MenuItem';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching menu items:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.render('index', { menuItems: rows });
  });
});

// Route: Place Order
app.post('/orders', (req, res) => {
  const { itemId, quantity } = req.body;
  const orderQuery = `
    INSERT INTO OrderDetails (item_id, quantity)
    VALUES (?, ?)
  `;
  db.run(orderQuery, [itemId, quantity], (err) => {
    if (err) {
      console.error('Error placing order:', err.message);
      return res.status(500).send('Failed to place order');
    }
    res.redirect('/'); // Redirect back to homepage after placing order
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
