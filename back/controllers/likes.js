const Sauce = require('../models/Sauce');// Importe la Sauce à liker depuis le model:
exports.likeSauce = (req, res, next) =>{ // Exporte la fonction liker une sauce:
    const likeStatus = req.body.like;    // Récupère le champs like:
    const sauceId = req.params.id;      // Récupère l'id de l'URL:
    const userId = req.body.userId;     // Récupère le userId:
    switch(likeStatus){     // Ajoute un like:
        case 1:
            // Vérifie qu'il n'y a pas déjà un like avec findOne,
            // sur la sauce selectionnée:
            Sauce.updateOne({ _id: sauceId},
            {   // Incermente 1, dans l'objet like:
                $inc: {likes: +1},
                // Ajoute le userId au tableau usersLiked: 
                $push: {usersLiked: req.body.userId}
            })
            .then(() => res.status(201).json({ message: 'Ajout du like !'}))
            .catch(error => res.status(400).json({error}));
            break;
        case -1:    // Ajoute un dislike: 
            Sauce.updateOne({ _id: sauceId},
            {// Incermente 1, dans l'objet dislike:
                $inc: {dislikes: +1},
                // Ajoute le userId au tableau usersDisliked:
                $push: {usersDisliked: req.body.userId}
            })
            .then(() => res.status(201).json({message: "Ajout d'un dislike ! "}))
            .catch(error => res.status(400).json({error}));
            break;
        case 0: // Supprime like et dislike:
            Sauce.findOne({ _id: sauceId })
            .then(sauce =>{
                // Supprime un like de UsersLiked:
                if(sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: sauceId},
                        {
                            $inc: {likes: -1},
                            $pull: {usersLiked: userId}
                        })
                    .then(() => res.status(201).json({ message: "Suppression du like !"}))
                    .catch((error) => res.status(400).json({error}));
                }else if(sauce.usersDisliked.includes(userId)){
                    // Supprime son dislike de usersDisliked:
                    Sauce.updateOne({_id: sauceId},
                        {
                            $inc: {dislikes: -1},
                            $pull: {usersDisliked: userId}
                        })
                    .then(() => res.status(201).json({ message: "Suppression du dislike ! "}))
                    .catch((error) => res.status(400).json({error}));
                }else{
                    res.status(403).json({ message: "requête impossible !"})
                }
            })
            .catch(() => res.status(404).json({ message: "Sauce introuvable !"}));
            break;
    }
};