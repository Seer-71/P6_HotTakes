const express = require('express');   // Importe Express:
const cors = require('cors')          // Importe cors:
const mongoose = require('mongoose'); // Importe les dépendences:
const path = require('path');
//*******************   DEBUG TOOLS START  ********************** */
// Logger http (les req et res) pour le dev uniquement:
const morgan = require('morgan');
mongoose.set('debug', true);    // debug mongoose:
//********************   DEBUG TOOLS END  ********************** */

require('dotenv').config(); // Importe donEnv:
const app = express();
app.use(cors());
app.use(morgan('dev'));
// Importe les routes:
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
mongoose.connect(   // Connexion à la database de mongoDB:
 `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true})
    .then(()=> console.log('Connexion à MongoDB réussie :)'))
    .catch(() => console.log('Connexion à MongoDB échouée :('));  

app.use(express.json());  //Express converti les datas reçu en json:
app.use((req, res, next)=>{ // Prévention des erreurs CORS:
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// Routes d'accès (login, sauces, etc...):
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;