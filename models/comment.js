const {Sequelize, DataTypes} = require('sequelize')
const db = require('./database')
const models = require('.')

const Comment = db.define('Comment', {
    type: Sequelize.DataTypes.STRING
}, {
    timestamps:false
})

Comment.associte = models => {
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Post)
}

module.exports = Comment