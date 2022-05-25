const dotEnv = require('dotenv').config();  // Importe donEnv:
const bcrypt = require('bcrypt');           // Importe le cryptage bcrypt(hasher le pass):
const jwt = require('jsonwebtoken');        // Importe jsonwebtoken( créer et vérifier les tokens):
const cryptojs = require('crypto-js');      // Importe crypto-js(chiffre l'email RGPD): 
const User = require('../models/User');     // Importe du modèle User:

exports.signup = (req, res, next) => {      // Exporte signup:    
    // Chiffre l'email avant l'envoie en DB:
    const cryptEmail = cryptojs.HmacSHA256(req.body.email,`${process.env.KEY_EMAIL}`).toString();
        bcrypt.hash(req.body.password, 10)  // Crypte le pass avec hash, salt:10 tours:
        .then(hash => {
            const user = new User({         // New user envoyé en DB:
                email: cryptEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
exports.login = (req, res, next) => {   // Exporte login:
    // Crypte l'email avant l'envoie en DB:
    const cryptEmail = cryptojs.HmacSHA256(req.body.email,`${process.env.KEY_EMAIL}`).toString();
    User.findOne({email: cryptEmail})   // Cherche le user dans la DB:
    .then(user => { // Verifie si trouve un user ou non:
        if (!user) {   
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        // Compare le pass avec le hash enregistré dans le user en DB:
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {   // Si pas valide erreur:
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    // Vérifie le token avec sign (userId, clé secrete, expiration):
                    token: jwt.sign(
                        { userId: user._id},
                        `${process.env.MY_TOKEN}`,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));    
};