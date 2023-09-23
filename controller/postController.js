const models = require('../models')
const fs = require('fs/promises')

exports.newPost= async(req, res) => {
    const {title, contents, steps, country, region } = req.body
    const url = req.protocol + '://' + req.get('host')

    try{
        const post = await models.Post.create({
            title,
            contents,
            steps,
            country,
            region,
            UserId: req.currentUser.id
        })
        if (req.files && Array.isArray(req.files)) {
            await Promise.all(req.files.map(async function (file) {
                const post_img = await models.Post_Image.create({
                    image_url: url + '/public/images/' + file.filename,
                    PostId: post.id
                });
            }));
        }
        res.status(200).json({message: "postied"})
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}

exports.getAllPosts = async (req, res) => {
    try{
        const gitPosts = await models.Post.findAll({
            include: [
                {
                    model: models.User,
                    attributes: { exclude: ['password', 'email']}
                },
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(gitPosts)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.getPost = async (req, res) => {
    try{
        const post = await models.Post.findOne({
            where: {id: req.params.PostId}, 
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['password', 'email']},
                },
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(post)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.myAllPosts = async(req, res) => {
    try{
        const myPosts = await models.Post.findAll({
            where: {UserId: req.currentUser.id},
            include: [
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(myPosts)
    } catch(e) {
        res.status(500).json(e)
    }
}


exports.getMyPost = async (req,res) =>{
    try{
        const myPost = await models.Post.findOne({
            where: {
                UserId: req.currentUser.id,
                id: req.params.PostId
            }
        })
        res.status(200).json(myPost)
    } catch(e) {
        res.status(500).json(e)
    }
}


exports.updateMyPost = async (req, res) => {
    const {title, contents, steps} = req.body
    try {
        const updatePost = await models.Post.update(
            {
                title,
                contents,
                steps
            },
            {
                where: {
                    id: req.params.PostId,
                    UserId: req.currentUser.id
                }
            }
        )
        res.status(200).json({message: 'updated'})
    }catch(e) {
        res.status(500).json(e)
    }
}


exports.deleteMyPost = async (req, res) => {
    const {PostId} = req.body
    try {
        await models.Post_Image.findAll({
            where: {PostId: PostId}
        }).then(res => {
            res.map((img) => {
                fs.unlink('./public/images/' + img.image_url.split("/")[5], function(err){
                    if (err) throw err
                })
            })
        })
        await models.Comment.destroy({
            where: {PostId: PostId}
        })
        await models.Like.destroy({
            where: {PostId: PostId}
        })
        await models.Post_Image.destroy({
            where: {PostId: PostId}
        });
         await models.Post.destroy({
            where: {id: PostId}
         })
         res.status(200).json({message: 'deleted'})
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}