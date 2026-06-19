//fonctions des commentaires de publications
import prisma from "../db.js";

//Fonction de création de commentaire
export const createComment = async(publication_id,user_id,content)=>{
    try{
        const newComment = await prisma.comments.create({
            data:{
                publication_id,
                user_id,
                content,
                comment_date : new Date()
            }
        });
        return newComment;
    }catch (error){
        console.error('Erreur lors de la création du commentaire =>', error);
        throw new Error('Erreur lors de la création du commentaire', error);
    }
};

//fonction de récupération des commentaires
export const getAllComments = async (publication_id) =>{
    try{
        const comments = await prisma.comments.findMany({
            where : { publication_id },
            orderBy: { comment_date: 'asc' },
            include: {
                user: {
                    select: {
                        id: true,
                        user_name: true,
                    },
                },
            },
        });
        return comments;
    }catch(error){
        console.error('Erreur lors de la récupération des commentaires =>', error);
        throw new Error('Erreur lors de la récupération des commentaires', error);   
    }
};

//fonction de suppression de commentaires
export const deleteComments = async(id)=>{
    try{
        const deleteComment = await prisma.comments.delete({
            where:{id}
        });
        return deleteComment;
    }
    catch(error){
        console.error('Erreur lors de la suppression du commentaire =>', error);
        throw new Error('Erreur lors de la suppression du commentaire', error);
    }
};