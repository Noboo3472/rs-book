//Controller des fonctions de commentsServices.js
import {createComment,getAllComments,deleteComments} from "../services/commentsServices.js"

//Controller de la créationde commentaires
export const createCommentController = async (req,res)=>{
    const {publication_id,user_id,content}= req.body;
    try {
        const createNewComment = await createComment(publication_id,user_id,content);
        res.status(201).json(createNewComment);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

//Controller de la récupération des commentaires
export const getCommentsController = async (req,res)=>{
    const {publication_id} = req.params;
    try {
        const comments = await getAllComments(publication_id);
        res.status(201).json(comments);
    }catch(error){
        res.status(500).json({error:error.message});
    }
};

//Controller de la suppression de commentaire
export const deleteCommentsController = async (req,res)=>{
    const {id} = req.params;
    try{
        const deleteComment = await deleteComments(id);
        res.status(201).json(deleteComment);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}