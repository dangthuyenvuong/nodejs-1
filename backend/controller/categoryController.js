const Category = require("../models/Category");

function validate(data, isUpdate = false) {
    const category = {
        title: data.title,
        slug: data.slug
    };
    const categoryUpdate = {
        title: data.title,
        slug: data.slug,
        _id: data._id
    };
    return isUpdate ? categoryUpdate : category;
}

module.exports = {
    index: async(req, res) => {
        let { action, id } = req.params;
        if (action) {
            if (id && action === 'edit') {
                let category = await Category.detail(id);
                res.render(admin_view + 'pages/add-category', { title: 'Edit', btnName: 'Update', className: 'btn-submit update', category })
            } else {
                res.render(admin_view + 'pages/add-category', { title: 'Add new', btnName: 'Create', className: 'btn-submit create', category: {} })
            }
        } else {
            let { page = 1 } = req.query;
            let { data, paginate } = await Category.list(page);
            console.log(paginate)

            res.render(admin_view + 'pages/category', { category: data, paginate })
        }
    },
    post: async(req, res) => {
        let { body } = req;
        let data = validate(body, true);
        let { _id } = data;
        delete data._id;

        let result = await Category.update(_id, data)
        if (result.value) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'There are some errors when you update!' })
        }
    },
    add: async(req, res) => {
        let { body } = req;
        let data = validate(body);

        let result = await Category.add(data);
        if (result.ops[0]) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'There are some errors when you add new a category!' })
        }
    },
    delete: async(req, res) => {
        const { id } = req.params;
        let result = await Category.delete(id);
        if (result.deletedCount === 1) {
            let { page = 1 } = req.query;
            let { data, paginate } = await Category.list(page);
            res.json({ success: true, post: data, paginate });
        } else {
            res.json({ success: false, message: 'There are some errors when you delete a category!' })
        }
    }
}