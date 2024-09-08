const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'Affan';
const REFRESH_SECRET_KEY = 'Affan';
const TOKEN_EXPIRY = '30m';
const REFRESH_TOKEN_EXPIRY = '7d'; // Example: 7 days for refresh token

let refreshTokens = [];

// Endpoint to get a new token
app.post('/token', (req, res) => {
  const { username, password } = req.body;
  // Validate username and password (this is just a placeholder)
  if (username === 'Affan' && password === 'MySecret') {
    const accessToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(401);
  }
});

// Endpoint to refresh the token
app.post('/token/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
    res.json({ accessToken });
  });
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
