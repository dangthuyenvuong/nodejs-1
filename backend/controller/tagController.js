const Tag = require("../models/Tag");

function validate(data, isUpdate = false) {
    const tag = {
        title: data.title,
        slug: data.slug
    };
    const tagUpdate = {
        title: data.title,
        slug: data.slug,
        _id: data._id
    };
    return isUpdate ? tagUpdate : tag;
}

module.exports = {
    index: async(req, res) => {
        let { action, id } = req.params;
        if (action) {
            if (id && action === 'edit') {
                let tag = await Tag.detail(id);
                res.render(admin_view + 'pages/add-tag', { title: 'Edit', btnName: 'Update', className: 'btn-submit update', tag })
            } else {
                res.render(admin_view + 'pages/add-tag', { title: 'Add new', btnName: 'Create', className: 'btn-submit create', tag: {} })
            }
        } else {
            let { page = 1 } = req.query;
            let { data, paginate } = await Tag.list(page);
            res.render(admin_view + 'pages/tag', { tag: data, paginate })
        }
    },
    post: async(req, res) => {
        let { body } = req;
        let data = validate(body, true);
        let { _id } = data;
        delete data._id;

        let result = await Tag.update(_id, data)
        if (result.value) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'There are some errors when you update!' })
        }
    },
    add: async(req, res) => {
        let { body } = req;
        let data = validate(body);

        let result = await Tag.add(data);
        if (result.ops[0]) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'There are some errors when you add new a tag!' })
        }
    },
    delete: async(req, res) => {
        const { id } = req.params;
        let result = await Tag.delete(id);
        if (result.deletedCount === 1) {
            let { page = 1 } = req.query;
            let { data, paginate } = await Tag.list(page);
            res.json({ success: true, post: data, paginate });
        } else {
            res.json({ success: false, message: 'There are some errors when you delete a tag!' })
        }
    }
}