const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.txt');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Registrar usuario
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        users = data.split('\n').filter(Boolean).map(line => {
            const [n, e, p] = line.split(',');
            return { name: n, email: e, password: p };
        });
    }

    if (users.some(u => u.email === email)) {
        return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const newUser = `${name},${email},${password}\n`;
    fs.appendFileSync(USERS_FILE, newUser);
    res.json({ message: 'Registro exitoso' });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!fs.existsSync(USERS_FILE)) {
        return res.status(400).json({ message: 'No hay usuarios' });
    }

    const users = fs.readFileSync(USERS_FILE, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(line => {
            const [n, e, p] = line.split(',');
            return { name: n, email: e, password: p };
        });

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login exitoso', name: user.name });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
