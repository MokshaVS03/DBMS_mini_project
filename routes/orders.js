const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/canteen.db');

// app.get('/orders', (req, res) => {
//     // Fetch orders from the database
//     const query = `
//         SELECT o.order_id, c.customer_name, o.date, o.total_amount, o.status
//         FROM OrderTable o
//         JOIN Customer c ON o.customer_id = c.customer_id
//     `;
//     db.all(query, [], (err, rows) => {
//         if (err) {
//             console.error('Error fetching orders:', err.message);
//             return res.status(500).send('Failed to retrieve orders');
//         }

//         res.json(rows); // Send orders as JSON response
//     });
// });

// Place an order
app.post('/orders', (req, res) => {
    console.log('Incoming request body:', req.body);
    const { itemId, quantity } = req.body;
    const customerId = 1; // Assuming a logged-in customer with ID 1
    const date = new Date().toISOString().slice(0, 10); // Current date in YYYY-MM-DD format
    const totalAmountQuery = `SELECT price FROM MenuItem WHERE item_id = ?`;

    // Step 1: Get the total amount for the order
    db.get(totalAmountQuery, [itemId], (err, menuItem) => {
        if (err) {
            console.error('Error fetching menu item price:', err.message);
            return res.status(500).send('Failed to place order');
        }

        const totalAmount = menuItem.price * quantity;

        // Step 2: Insert into OrderTable
        const insertOrderQuery = `
    INSERT INTO OrderTable (customer_id, date, total_amount) 
    VALUES (?, ?, ?)
`;
db.run(insertOrderQuery, [customerId, date, totalAmount], function (err) {
    if (err) {
        console.error('Error inserting into OrderTable:', err.message);
        return res.status(500).send('Failed to place order');
    }

    const orderId = this.lastID; // Get the generated order_id
    if (!orderId) {
        console.error('Order ID not generated!');
        return res.status(500).send('Failed to place order');
    }

    // Proceed to insert into OrderDetails
    const insertOrderDetailsQuery = `
        INSERT INTO OrderDetails (order_id, item_id, quantity) 
        VALUES (?, ?, ?)
    `;
    db.run(insertOrderDetailsQuery, [orderId, itemId, quantity], (err) => {
        if (err) {
            console.error('Error inserting into OrderDetails:', err.message);
            return res.status(500).send('Failed to place order');
        }

        console.log('Order placed successfully');
        res.redirect('/');
    });
});

    });
});


module.exports = router;
