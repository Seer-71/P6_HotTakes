// Importe jsonwebtoken:
const jwt = require('jsonwebtoken');
// Exporte l'authentification:
module.exports = (req, res, next) => {
    try{
        // Récupère le token dans le header (authorization),
        // split: retourne un tableau avec bearer en 0 et le token en 1: 
        const token = req.headers.authorization.split(' ')[1];
        // Décode le token avec verify:
        const decodedToken = jwt.verify(token, process.env.MY_TOKEN);
        // Récupère le userId du token:
        const userId = decodedToken.userId;
        // Ajoute le userId du token à l'objet requête:
        req.auth = { userId };
        // Vérifie que le userId de la requête correspond à celui du token:
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        }else{
            next();
        }
    } catch(error){
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};