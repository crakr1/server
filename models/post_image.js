const {Sequelize, DataTypes} = require('sequelize')
const db = require('./database')

const Post_Image = db.define('Post_Image', {
    image_url: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    timestamps: false
})

Post_Image.associte = models => {
    Post_Image.belongsTo(models.Post)
}

module.exports = Post_Image