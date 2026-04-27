const express = require('express');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet());

let users = [];

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const nameRegex = /^[A-Za-z0-9]{3,20}$/;
    if (!nameRegex.test(username)) {
        return res.status(400).send("Invalid username");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.send("User registered successfully");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Invalid password");

    res.send("Login successful");
});

app.post('/payment', (req, res) => {
    const { amount } = req.body;

    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!amountRegex.test(amount)) {
        return res.status(400).send("Invalid amount");
    }

    res.send("Payment processed");
});

app.listen(3001, () => console.log("Backend running on port 3001"));
