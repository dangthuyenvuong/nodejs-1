const indexData = require('../data/index');
const Post = require('../models/Post');


module.exports = {
    detail: async (req, res) => {

        let { slug } = req.params;

        // let result = await Post.getPostSlug(slug);
        let highlight = await Post.getHighlight(2);

        let result = await Post.getPostBySlug(slug)

        res.render('post_detail', { ...result, highlight });
    },

}