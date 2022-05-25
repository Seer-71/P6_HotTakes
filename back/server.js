
const http = require('http');   // Importe le package http:
const app = require('./app');   // Importe l'application "app":
const normalizePort = val =>{   // Renvoi d'un port valide:
  const port = parseInt(val, 10);
  if(isNaN(port)){
    return val;
  }if(port >= 0){
    return port;
  }
  return false;
};
// Indique à express sur quel port elle doit tourner:
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// Gestion des erreurs de ports:
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' Privilèges élevés requis');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' Déjà utilisé.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création du server avec creteServer et la fonction app:
const server = http.createServer(app);
// Appel de la fonction de gestion d'erreurs:
server.on('error', errorHandler);
// Ecoute le port du serveur:
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Ecoute les requêtes envoyées par le port disponible:
server.listen(port);

