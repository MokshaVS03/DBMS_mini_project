const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/canteen.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) console.error(err.message);
    else console.log('Tables in database:', tables.map(table => table.name));
});

db.close();
