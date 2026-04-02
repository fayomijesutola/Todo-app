// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware essentiels
app.use(cors());           // Permet au frontend d'appeler l'API
app.use(express.json());   // Permet de lire le JSON dans les requêtes
app.use(express.urlencoded({ extended: true })); // Pour les formulaires

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas avec succès'))
  .catch((err) => console.error('❌ Erreur de connexion:', err));

// Route de test pour vérifier que tout fonctionne
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionne parfaitement !' });
});

// Ici on importera nos routes plus tard
app.use('/api/tasks', require('./routes/task'));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI.split('@')[1]}`);
});