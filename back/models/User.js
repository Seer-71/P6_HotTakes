// Importe mongoose:
const mongoose = require('mongoose');
// Importe le validateur pour l'email:
const uniqueValidator = require('mongoose-unique-validator');
// Crée le schema du user:
const userSchema = mongoose.Schema({
    // email doit ête unique:
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true} 
});
// Ajoute le validateur comme plugin au schema:
userSchema.plugin(uniqueValidator);
// Exporte le schema:
module.exports = mongoose.model('User', userSchema);