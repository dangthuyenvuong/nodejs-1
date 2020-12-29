const { ObjectID } = require("mongodb");
const mongodb = require("../../core/mongodb")


let Post = null;
let timeout = setInterval(() => {
    let t = mongodb('Post');
    if (t) {
        Post = t;
        clearInterval(timeout);
    }
}, 100)


module.exports = {
    list: async(page = 1, limit = 15) => {
        let count = await Post.count();

        let totalPage = Math.ceil(count / limit);
        let paginate = {
            count,
            totalPage,
            limit,
            currentPage: parseInt(page),
            nextPage: page < totalPage ? parseInt(page + 1) : undefined,
            previousPage: page > 1 ? parseInt(page - 1) : undefined
        }

        let data = await Post.find().skip((page - 1) * limit).limit(limit).toArray();


        return { paginate, data }
    },
    detail: async(_id) => {
        return await Post.findOne({ _id: ObjectID(_id) });
    },
    update: async(_id, data) => {
        return await Post.findOneAndUpdate({ _id: ObjectID(_id) }, { $set: data }, { returnOriginal: false });
    },
    add: async(data) => {
        return await Post.insertOne(data);
    },
    delete: async(id) => {
        return await Post.deleteOne({ _id: ObjectID(id) });
    }
}