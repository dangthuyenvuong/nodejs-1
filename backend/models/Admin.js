const MongoDB = require('../../core/mongodb');
const md5 = require('md5')


module.exports = {
    getAdmin: async (email, password) => {
        return await MongoDB('Admin').findOne({ email, password: md5(password) })
    }
}