/*Fonctions de plublications : 
-Créer une publication
-Supprimer une publication*/

import prisma from '../db.js';

//Fonction créer une publication 
export const createPublications = async(userId,bookId,content) =>{
    try{
        const newPublication = await prisma.publications.create({
            data: {
                user_id: userId,
                book_id: bookId,
                content,
                publication_date: new Date()
            }
        });
        return newPublication;
    }catch (error){
        console.error('Erreur lors de la création de la publication =>', error);
        throw new Error('Erreur lors de la création de la publication', error);
    }
};

//fonction de suppression de publication
export const deletePublications = async(id) =>{
    try{
        const deletePublication = await prisma.publications.delete({
            where : {id}
        });
        return deletePublication;
    }catch (error){
        console.error('Erreur lors de la suppression de la publication =>', error);
        throw new Error('Erreur lors de la suppression de la publication', error);
    }
};

//Récupérer les publication par id
export const getPublicationsById = async(id)=>{
    try{
        const getPublicationById = await prisma.publications.findUnique({
            where : {id}
        });
        return getPublicationById;
    }catch(error){
        console.error('Erreur lors de la récupération de la publication =>', error);
        throw new Error('Erreur lors de la récupération de la publication', error);
    }
};

//Récupérer les publication par autheur
export const getPublicationsByAuthor = async (user_id) => {
    try {
        const publications = await prisma.publications.findMany({
            where: { user_id }
        });
        return publications;
    } catch (error) {
        console.error('Erreur lors de la récupération de la publication =>', error);
        throw new Error('Erreur lors de la récupération de la publication', error);
    }
};