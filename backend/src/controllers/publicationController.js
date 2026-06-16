//Controllers des fonctions application
import {createPublications,deletePublications, getPublicationsById,getPublicationsByAuthor} from '../services/publicationServices.js';

//Controller de la création de publication
export const publicationsController = async(req,res)=>{
    const {userId,bookId,content}= req.body;
    try{
        const createPublication = await createPublications(userId,bookId,content);
        res.status(201).json(createPublication)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

//Controller de la suppression de la publication
export const deletePublicationController = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        if (!id) {
            return res.status(400).json({ error: 'L’identifiant de la publication est requis.' });
        }
        const deletePublication = await deletePublications(id);
        res.status(200).json(deletePublication);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//controller de la récupération des publications par id
export const getPublicationById = async(req,res) =>{
    try{
        const id = req.params.id || req.body.id;
        if (!id){
            return res.status(400).json({ error: 'L’identifiant de la publication est requis.' });
        }
        const getPublication = await getPublicationsById(id);
        res.status(200).json(getPublication);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

//COntroller pour récuperer la publication par autheur
export const getPublicationByAuthor = async(req,res)=>{
    try{
        const {user_id} = req.params;
        if (!user_id){
            return res.status(400).json({ error: 'L’auteur de la publication est requis.' });
        }
        const getPublicationByAuthor = await getPublicationsByAuthor(user_id);
        res.status(200).json(getPublicationByAuthor);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};