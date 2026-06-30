#  RS-BOOK - Plateforme Sociale de Partage de Livres

Version : 1.0.0 | Dernière mise à jour : 19 juin 2026
- `backend/` : API Node.js avec Express, Prisma et PostgreSQL
- `frontend/` : application React simple

## Architecture

### Backend
- Point d'entrée : `backend/app.js`
- Framework : Express
- Base de données : PostgreSQL via Prisma
- Authentification, livres, publications, commentaires et follows sont gérés par des routes dédiées
- ORM : Prisma

### Frontend
- Point d'entrée : `frontend/src/main.jsx`
- Composant principal : `frontend/src/App.jsx`
- Application React

## Pré-requis

- Node.js 18+ (ou version compatible avec les dépendances)
- PostgreSQL
- npm

## Installation

### Backend

1. Ouvrir un terminal dans `backend/`
2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer un fichier `.env` dans `backend/` avec la variable suivante :
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

4. Générer le client Prisma si nécessaire :
   ```bash
   npx prisma generate
   ```

### Frontend

1. Ouvrir un terminal dans `frontend/`
2. Installer les dépendances :
   ```bash
   npm install
   ```

## Exécution

### Démarrer le backend

Depuis `backend/`
```bash
npm run dev
```
Le serveur écoute par défaut sur `http://localhost:3000`.

### Démarrer le frontend

Depuis `frontend/`
```bash
npm run dev
```

> Note : le frontend est configuré avec un script `dev` qui lance `nodemon ./src/main.js`. Selon votre setup, vous pouvez avoir besoin d'un bundler / serveur de développement adapté pour React.

## Base de données Prisma

Le schéma Prisma se trouve dans `backend/prisma/schema.prisma`.

Modèles principaux :
- `users`
- `books`
- `opinions`
- `publications`
- `comments`
- `follow`

## Routes backend

Routes présentes dans `backend/app.js` :
- `/auth` : routes d'authentification
- `/book` : routes des livres
- `/follow` : routes de suivi
- `/publications` : routes de publications
- `/comments` : routes des commentaires

## Structure du projet

```
backend/
  app.js
  package.json
  prisma/
    schema.prisma
  src/
    db.js
    controllers/
    routes/
    services/
frontend/
  index.html
  package.json
  src/
    main.jsx
    App.jsx
```
