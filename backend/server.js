const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = 3000;
const usersFile = path.join(__dirname, 'users.json');
const expensesFile = path.join(__dirname, 'expenses.json');

// Ensure JSON files exist
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
if (!fs.existsSync(expensesFile)) fs.writeFileSync(expensesFile, '[]');

// Register
app.post('/register', (req, res) => {
    const users = JSON.parse(fs.readFileSync(usersFile));
    const { firstName, lastName, email, phone, password } = req.body;

    if (users.some(u => u.email === email || u.phone === phone)) {
        return res.status(400).send('User already exists.');
    }

    users.push({ firstName, lastName, email, phone, password });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.send('Registered successfully');
});

// Login
app.post('/login', (req, res) => {
    const { loginId, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find(u =>
        (u.email === loginId || u.phone === loginId) && u.password === password
    );

    if (user) res.send('Login successful');
    else res.status(401).send('Invalid credentials');
});

// Save Expense
app.post('/add-expense', (req, res) => {
    const { regNumber, vehicleName, expenseType, date, through, amount } = req.body;
    const expenses = JSON.parse(fs.readFileSync(expensesFile));

    expenses.push({ regNumber, vehicleName, expenseType, date, through, amount });
    fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
    res.send('Expense added');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
