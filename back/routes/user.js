// Importe express:
const express = require('express');
// Créer un routeur:
const router = express.Router();
// Validation du mot de passe:
const pwd = require('../middleware/password')
// Importe du controller du user:
const userCtrl = require('../controllers/user');

// limite les requêtes:
const rateLimit = require('express-rate-limit').default;
const limit = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 min // 60 * 60 * 1000, // 1 hour // 15 * = 15 min
  max: 10,                   // Chaque IP à 3 requêtes par 5 min
  message: "Try again in 5 minutes",
  standardHeaders: true,    // Retourne l'info de limite dans les headers
  legacyHeaders: false,     // Désactive le 'X-rateLimit-*' headers
});

// Routes pour user:
router.post('/signup', pwd, userCtrl.signup);
router.post('/login', limit, userCtrl.login);

// Exporte ce router
module.exports = router;