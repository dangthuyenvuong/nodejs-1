const indexData = require('../data/index');
const Post = require('../models/Post');

module.exports = {
    index: () => {
        return new Promise(async (resolve, reject) => {

            let feature = await Post.getFeature(4);
            let trending = await Post.getTrending(8);
            let posts = await Post.getNormalPost(9);
            let hightlight = await Post.getHighlight(5);

            resolve({
                featured1: feature[0],
                featured: feature.slice(1),
                trending: trending.slice(0, 4),
                trending1: trending.slice(4),
                post1: posts.slice(0, 3),
                post2: posts.slice(3, 7),
                post3: posts.slice(7),
                highlight1: hightlight[0],
                highlight: hightlight.slice(1)
            })

        })
    },
    category_lifestyle: () => {
        let lifestyle = Post.getLifeStyle()


        return { asdfsdf: 'asdfsdf' }
    },
    category_culture: () => {
        return { category_culture: { pageName: 'Culture' } }
    },
    author: () => {

    }
}