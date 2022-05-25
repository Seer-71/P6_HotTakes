const Sauce = require('../models/Sauce'); // Importe le modèle de Sauce:
const fs = require('fs');                 // Importe de file system :

exports.createSauce= (req, res, next) => {// Ajouter une sauce:
  // récupére les champs du corps de la requête:
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({ // Nouvelle instance de Sauce:
    ...sauceObject, // spread operateur (selectionne tout de l'objet):
    // Résolution de l'URL de l'image:
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()  // Enregistre l'objet dans la DB:
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json({ error }));
};
// Modifie une sauce avec updateOne:
exports.modifySauce = (req, res, next) => {
    if(req.file){
      Sauce.findOne({ _id: req.params.id })
      .then((findSauce) =>{ // Recherche la sauce selectionnée dans le dossier du serveur:
        const fileName = findSauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, (error) =>{ // supprime l'image du dossier du serveur
          if(error) throw error;
        })
      })
      .catch(error => res.status(404).json({ error}))
    }  // Opérateur ternaire("?") pour vérifier si le fichier image existe ou non:
    const sauceObject = req.file ?
      { // Mêt à jour la modification:
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    // Utilise l'id de la requête pour trouver la Sauce et la
    // modifie avec le meme _id, sans en générer un nouveau:
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(404).json({ error
    }));
};
// Supprime une sauce si sauce.userId == créateur de la sauce:
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Trouve la sauce: 
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: new Error("Cette sauce n'existe pas !")});
      }
      // ID mis dans objet requête utilisé pour le comparer le userId de la sauce:
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ error: new Error('Requête non autorisée !')});
      }
      return sauce;
    })
    .then(sauce => {
      // Récupère le nom de fichier:
      const filename = sauce.imageUrl.split('/images/')[1];
      // Supprime le fichier puis effectue le callback qui supprime de la DB:
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupére une sauce avec findOne:
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Récupére toutes les sauces avec find:
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};