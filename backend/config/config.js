require('dotenv').config();

module.exports = {
  secret:  "fallbackSecretKey", // JWT_SECRET vendrá del archivo .env o variables de entorno del sistema
  port: 3000,
  mongoURI: "mongodb+srv://ricardocandelo07:panama2024@utpdss.ejvcklv.mongodb.net/?retryWrites=true&w=majority&appName=UTPDSS" ,
};
