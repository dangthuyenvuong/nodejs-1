const indexData = require('../data/index');
const Category = require('../models/Category');


module.exports = {
    list: async (req, res, next) => {
        let { slug } = req.params;

        let data = await getListInSlug(slug);
        console.log(data)
        res.render('category', data);

    }
}