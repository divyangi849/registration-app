const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001; 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'registration_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});


app.post('/register', (req, res) => {
    const { username, email, mobile, password } = req.body;
    const query = 'INSERT INTO users (username, email, mobile, password) VALUES (?, ?, ?, ?)';
    
    db.query(query, [username, email, mobile, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ success: false, message: 'Registration failed' });
        }
        res.json({ success: true, message: 'Registration successful' });
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
        }
        res.json(results);
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, mobile, password } = req.body;
    const query = 'UPDATE users SET username = ?, email = ?, mobile = ?, password = ? WHERE id = ?';
    
    db.query(query, [username, email, mobile, password, id], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ success: false, message: 'Update failed' });
        }
        res.json({ success: true, message: 'Update successful' });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).json({ success: false, message: 'Deletion failed' });
        }
        res.json({ success: true, message: 'Deletion successful' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
