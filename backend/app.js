import express from 'express';
import authRoutes from './src/routes/authRoute.js';
import bookRoutes from './src/routes/bookRoute.js';
import followRoutes from './src/routes/followRoutes.js';
import publicationsRoutes from './src/routes/publicationRoutes.js';
import commentRoutes from './src/routes/commentsRoutes.js';
import libraryRoutes from './src/routes/libraryRoute.js';
import userRoutes from './src/routes/userRoutes.js';
import feedRoutes from './src/routes/feedRoutes.js';
import opinionRoutes from './src/routes/opinionRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json({
  verify: (req, res, buf) => {
    console.log('RAW BODY =>', buf.toString());
    console.log('CONTENT-TYPE =>', req.headers['content-type']);
  }
}));
//routes pour l'authentification
app.use('/auth', authRoutes);
//routes pour les livres
app.use('/book', bookRoutes);
//route pour les fonctions follow
app.use('/follow',followRoutes);
//route pour les fonctions de publications
app.use('/publications', publicationsRoutes);
//routes pour les fonctions commentaires
app.use('/comments', commentRoutes);
//routes pour les utilisateurs
app.use('/users', userRoutes);
//routes pour le fil d'actualité
app.use('/', feedRoutes);
//routes pour les avis et le détail des livres
app.use('/opinions', opinionRoutes);
//routes pour la bibliothèque
app.use('/api', libraryRoutes);


//mise en place du serveur
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
