import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve all articles"
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await PostModel.findByIdAndDelete(
            { _id: postId }
        );

        if (!deletedPost) {
            return res.status(404).json({
                message: "There article was not deleted",
            });
        }

        res.json(deletedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve article"
        });
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findByIdAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: "after" }
        );
      
        if (!updatedPost) {
            return res.status(404).json({
                message: "The article is not found",
            });
        }
    
        res.json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve article"
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
        console.log('doc is', doc);

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({
        message: "Post creation is failed"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.updateOne(
            { _id: postId },
            { 
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );
      
        if (!updatedPost) {
            return res.status(404).json({
                message: "The article was not updated",
            });
        }
    
        res.json({
            success: true,
            ...updatedPost
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve article"
        });
    }
}
