const MongoDB = require('../../core/mongodb');
const md5 = require('md5');
const { ObjectID } = require('mongodb');


module.exports = {
    getAdmin: async (email, password) => {
        return await MongoDB('Admin').findOne({ email, password: md5(password) })
    },

    getAdminFromID: async (_id) => {
        return await MongoDB('Admin').findOne({ _id: ObjectID(_id) })
    }
}