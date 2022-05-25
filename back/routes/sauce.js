// Import d'express:
const express = require('express');
// Création d'un router: 
const router = express.Router();
// Importe l'authentification:
const auth = require('../middleware/auth');
// Importe multer:
const multer = require('../middleware/multer-config');
// Importe les controllers:
const sauceCtrl = require('../controllers/sauces');
const likeCtrl = require('../controllers/likes');

//Les routes des controlleurs et leurs paramêtres:
// auth: applique l'authentification,
// multer: applique l'ajout de fichiers aux routes:
// Crée une nouvelle sauce:
router.post('/', auth, multer, sauceCtrl.createSauce);
// Modifie une sauce, selectionnée de son propriétaire:  
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Supprime la sauce selectionnée:
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Affiche la sauce selectionnée:
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Affiche toutes les sauces:
router.get('/', auth, sauceCtrl.getAllSauces);
// Liker la sauce selectionnée:
router.post('/:id/like', auth, likeCtrl.likeSauce);

// Exporte le router:
module.exports = router;