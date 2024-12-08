const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db/canteen.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run('PRAGMA journal_mode = WAL;', (err) => {
            if (err) {
                console.error('Error setting journal mode to WAL:', err.message);
            } else {
                console.log('Journal mode set to WAL.');
            }
        });
    }
});

// SQL statements to create tables
const createCustomerTable = `
    CREATE TABLE IF NOT EXISTS Customer (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT
    );
`;

const createMenuItemTable = `
    CREATE TABLE IF NOT EXISTS MenuItem (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        price REAL NOT NULL,
        imagePath TEXT
    );
`;

const createOrderTable = `
    CREATE TABLE IF NOT EXISTS OrderTable (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        total_amount REAL NOT NULL,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
    );
`;

const createOrderDetailsTable = `
    CREATE TABLE IF NOT EXISTS OrderDetails (
        order_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (order_id) REFERENCES OrderTable(order_id),
        FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
    );
`;

// Initial data for the MenuItem table
const insertMenuItems = `
    INSERT INTO MenuItem (name, category, price, imagePath) VALUES 
    ('Spaghetti', 'Main Course', 8.99, 'spaghetti.jpg'),
    ('Garden Salad', 'Appetizer', 5.99, 'garden_salad.jpg'),
    ('Tomato Soup', 'Soup', 4.99, 'tomato_soup.jpg'),
    ('Cheeseburger', 'Main Course', 7.99, 'cheeseburger.jpg'),
    ('Sushi Rolls', 'Main Course', 12.99, 'sushi_rolls.jpg'),
    ('Chocolate Cake', 'Dessert', 3.99, 'chocolate_cake.jpg')
`;

// Create tables and insert initial data
db.serialize(() => {
    db.run(createCustomerTable);
    db.run(createMenuItemTable);
    db.run(createOrderTable);
    db.run(createOrderDetailsTable);

    db.run('BEGIN TRANSACTION;');
    db.run(insertMenuItems, (err) => {
        if (err) {
            console.error('Error inserting menu items:', err.message);
            db.run('ROLLBACK;');
        } else {
            console.log('Menu items inserted successfully.');
            db.run('COMMIT;');
        }
    });
});

// Close the database connection
db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    else console.log('Database setup complete.');
});
