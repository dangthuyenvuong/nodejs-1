const { ObjectID } = require('mongodb');
const Mongodb = require('../core/mongodb');
const Category = require('./Category');


const aggregatePost = [
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
    {
        $lookup: {
            from: 'tag',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags'
        }
    },
    {
        $unwind: '$author'
    }
]

module.exports = {

    getFeature: async (number = 8) => {
        // return await Mongodb('Post').find({ feature: 1 }).limit(number).toArray()
        return await Mongodb('Post').aggregate([
            ...aggregatePost,
            {
                $match: { feature: 1 }
            },
            {
                $limit: number
            }
        ]).toArray()
    },
    getTrending: async (number = 8) => {
        return await Mongodb('Post').aggregate([
            ...aggregatePost,
            {
                $match: { trending: 1 }
            },
            {
                $limit: number
            }
        ]).toArray()
    },
    getHighlight: async (number = 8) => {
        return await Mongodb('Post').aggregate([
            ...aggregatePost,
            {
                $match: { highlight: 1 }
            },
            {
                $limit: number
            }
        ]).toArray()
    },
    getNormalPost: async (number = 8) => {
        // Category.getCategory();
        return await Mongodb('Post').aggregate([
            ...aggregatePost,
            {
                $match: {
                    feature: { $in: [null, 0] },
                    trending: { $in: [null, 0] },
                    highlight: { $in: [null, 0] },
                }
            },
            {
                $limit: number
            }
        ]).toArray()
    },


    getLifeStyle: async (number = 8) => {
        // return await Mongodb('Post').find({ category: ObjectID() }).limit(number).toArray()
    },
    // getPostIndex: async (callback) => {
    //     return await Mongodb('Post').find().toArray(callback)
    // }


    getPostSlug: (slug) => {
        return new Promise((resolve, reject) => {

            Mongodb('Post').aggregate([
                {
                    $match: {
                        slug
                    }
                },
                {
                    $limit: 1
                },
                ...aggregatePost
            ]).toArray((err, result) => {
                if (err) {
                    throw err
                } else {
                    console.log(result)
                    resolve(result?.[0] || {})
                }
            })


            // Mongodb('Post').findOne({ slug }, (err, result) => {
            //     if (err) {
            //         throw err
            //     } else {
            //         resolve(result)
            //     }
            // })
        })
    },


    getPostBySlug: (slug) => {
        return new Promise((resolve, reject) => {
            Mongodb('Post').aggregate([
                {
                    $match: { slug }
                },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
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
                //     $unwind: '$categories'
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
                //     $skip: 2 * 5
                // },
                // {
                //     $limit: 2
                // },

                // {
                //     $project: {
                //         slug: 0,
                //         'author.email': 0,
                //         'tags.title': 0
                //     }
                // }
            ]).toArray((err, result) => {
                if (err) throw err
                else {
                    resolve(result?.[0] || {})
                }

            })

        })
    }



}