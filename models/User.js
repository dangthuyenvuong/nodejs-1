const Post = require('../core/mongodb').Post;


module.exports = {
    getPostIndex: () => {
        Post.find().toArray((err, result) => {

        })
    }
}