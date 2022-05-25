// Importe mongoose:
const mongoose = require('mongoose');

// Construteur du schema d'une sauce:
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    // Gestion des likes et dislikes:
    likes: { type: Number, default: 0, required: false},
    dislikes: { type: Number, default: 0, required: false},
    usersLiked: { type: Array, default: [], required: false},
    usersDisliked: { type: Array, default: [], required: false},
});

// Exporte le modèle de sauce (like inclus):
module.exports = mongoose.model('Sauce', sauceSchema);