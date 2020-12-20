const { ObjectID } = require('mongodb');
const Mongodb = require('../core/mongodb');

const aggregateCategory = [
    {
        $lookup: {
            from: 'post',
            localField: '_id',
            foreignField: 'category',
            as: 'posts'
        }
    },
]

module.exports = {
    getCategory: () => {

    },
    getListInSlug: async (slug) => {
        return await Mongodb('Category').aggregate([
            ...aggregateCategory,
            {
                $math: {
                    slug
                }
            }
        ])
    }
}