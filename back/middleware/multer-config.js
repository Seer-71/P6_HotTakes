const multer = require('multer');   // Importe multer:
const MIME_TYPES = {                // Dictionnaire d'extensions à traduire:
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};
// 2 éléments : destination, et filename que l'on passe à la méthode diskStorage: 
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        // Génère nom du fichier, change les espaces par '_' avec split et join:
        const name = file.originalname.split(' ').join('_');
        // Accès mimetype (ex: image/png) appelé par la variable:
        const extension = MIME_TYPES[file.mimetype];
        //  Génère un nom + time-stamp + extension:
        callback(null, `${name.split(`.`)[0]}_${Date.now()}.${extension}`);
        console.log('callback :');
        console.log(callback);
    }        
});
// Exporte multer configuré avec single pour un fichier image unique:
module.exports = multer({storage: storage}).single('image');