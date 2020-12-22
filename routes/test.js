var express = require('express');
var router = express.Router();
let author = require('../data/author.json');
let category = require('../data/category.json');
let comment = require('../data/comment.json');
let post = require('../data/post.json');
let tag = require('../data/tag.json');
let user = require('../data/user.json');

const mongodb = require('../core/mongodb');
const { ObjectID } = require('mongodb');


function installUser() {
    author.forEach(e => {
        e.avatar = e.avatar + '?r=' + Math.round(Math.random() * 100000000000)
        e.birthdate = e.birthdate.$date
        e._id = ObjectID(e._id.$oid);
        e.type = 'author';
        e.password = '132456789';
        e.name = e.title
        delete e.title;
    })

    user.forEach(e => {
        e.avatar = e.avatar + '?r=' + Math.round(Math.random() * 100000000000)
        e._id = ObjectID(e._id.$oid);
        e.birthdate = new Date();
        e.type = 'user';
        e.password = '132456789';
    })

    mongodb('User').insertMany([...user, ...author]);

    return { author, user };
}

function installCategoryTag() {
    category.forEach(e => {
        e._id = ObjectID(e._id.$oid);
    })

    tag.forEach(e => {
        e._id = ObjectID(e._id.$oid);
    })

    mongodb('Category').insertMany(category);
    mongodb('Tag').insertMany(tag);


    return { category, tag };
}

function convertToSlug(Text) {
    return Text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        ;
}


function installPost() {
    post.forEach(e => {
        e.author = ObjectID(e.author.$oid)
        e.categories = e.categories.map(e1 => ObjectID(e1.$oid))
        e.published_at = e.published_at.$date
        e._id = ObjectID(e._id.$oid);
        e.tags = e.tags.map(e1 => ObjectID(e1.$oid))
        e.cover = e.cover + '?r=' + Math.round(Math.random() * 100000000000)
        e.slug = convertToSlug(e.title) + '-' + Math.round(Math.random() * 100000)
        e.feature = Math.random() > 0.95 ? 1 : 0;
        e.trending = Math.random() > 0.95 ? 1 : 0;
        e.highlight = Math.random() > 0.95 ? 1 : 0;


        delete e.image
        delete e.id
    })
    mongodb('Post').insertMany(post);

    return post;
}



function installComment() {
    comment.forEach(e => {

        e._id = ObjectID(e._id.$oid);
        e.user = ObjectID(e.user.$oid);
        e.post = ObjectID(e.post.$oid);
        e.created_at = e.created_at.$date
        delete e.posts_id
        delete e.user_id

    })
    mongodb('Comment').insertMany(comment);

    return comment;
}

/* GET users listing. */
router.get('/raw-data', function (req, res, next) {
    let user = installUser();
    let cateogryTag = installCategoryTag();
    let post = installPost();
    let comment = installComment();
    res.json(post);
});


router.get('/join', async (req, res, next) => {

    mongodb('Post').aggregate([
        {
            $match: {
                _id: ObjectID('5fdc84bb8d7ec73efc369403')
            }
        },
        // {
        //     $project: {
        //         title: 1,
        //         cover: 1
        //     }
        // },
        {
            $lookup: {
                from: 'user',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },

        {
            $lookup: {
                from: 'category',
                localField: 'categories',
                foreignField: '_id',
                as: 'categories'
            }
        },
        // {
        //     $unwind: "$categories"
        // },
        {
            $lookup: {
                from: 'tag',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        // {
        //     $project: {
        //         'author': '$author.name'
        //     }
        // },
        // {
        //     $unwind: "$tac_gia"
        // }
    ]).toArray((err, result) => {
        if (err) throw err
        else {
            console.log(result)
            res.json(result)
        }
    })
})

module.exports = router;
