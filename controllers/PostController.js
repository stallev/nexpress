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

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndUpdate({
            _id: postId,
        },
        {
            $inc: { viewsCount: 1 },
        })
        const post = await PostModel.findById().populate('user').exec();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to retrieve all articles"
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
