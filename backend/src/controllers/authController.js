//fichier de controller pour l'authentification
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
// Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
// Hasher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);
//création de l'utilisateur dans la base de données
    const newUser = await prisma.users.create({
      data: {
        user_name: name,
        email,
        password: hashedPassword,
        created_at: new Date()
      }
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('SIGNUP ERROR =>', error);
    res.status(500).json({
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};


//déconnexion d'un utilisateur (optionnel, dépend de la gestion des tokens côté client)
const logout = (req, res) => {
    // Côté client, il suffit de supprimer le token pour se déconnecter
    res.json({ message: 'Déconnexion réussie' });
};

export { signup, login, logout };