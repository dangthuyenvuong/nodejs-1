const Post = require("../models/Post");

function validate(data, isUpdate = false) {
    const post = {
        title: data.title,
        description: data.description,
        cover: data.cover,
        category: data.category,
        published_at: data.published_at,
        time_read: data.time_read,
        feature: data.feature,
        trending: data.trending,
        highlight: data.highlight,
        slug: data.slug,
        content: data.content
    };

    const postUpdate = {
        title: data.title,
        description: data.description,
        cover: data.cover,
        category: data.category,
        published_at: data.published_at,
        time_read: data.time_read,
        feature: data.feature,
        trending: data.trending,
        highlight: data.highlight,
        slug: data.slug,
        content: data.content,
        _id: data._id
    };

    return isUpdate ? postUpdate : post;
}

module.exports = {
    index: async (req, res) => {
        let { action, id } = req.params;
        if (action) {

            if (id && action === 'edit') {
                let post = await Post.detail(id);
                res.render(admin_view + 'pages/add-post', { title: 'Edit', btnName: 'Update', className: 'btn-submit update', post })
            } else {
                res.render(admin_view + 'pages/add-post', { title: 'Add new', btnName: 'Create', className: 'btn-submit create', post: {} })
            }
        } else {
            let { page = 1 } = req.query;
            let { data, paginate } = await Post.list(page);
            console.log(paginate)

            res.render(admin_view + 'pages/post', { post: data, paginate })
        }
    },
    list: async (req, res) => {
        let { page = 1 } = req.query;
        let { data, paginate } = await Post.list(page);
        res.render(admin_view + 'pages/post', { post: data, paginate })
    },
    post: async (req, res) => {
        let { body } = req;
        let data = validate(body, true);
        let { _id } = data;
        delete data._id;

        let result = await Post.update(_id, data)
        console.log(result.value);
        if (result.value) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'There are some errors when you update!' })
        }
    },
    add: async (req, res) => {
        if (req.method === "GET") {
            return res.render(admin_view + 'pages/add-post', { title: 'Edit', btnName: 'Update', className: 'btn-submit update', post: {} })
        }
        let { body } = req;
        let data = validate(body);
        let result = await Post.add(data);
        if (result.ops[0]) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'There are some errors when you add new!' })
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        let result = await Post.delete(id);
        if (result.deletedCount === 1) {
            let { page = 1 } = req.query;
            let { data, paginate } = await Post.list(page);
            res.json({ success: true, post: data, paginate });
        } else {
            res.json({ success: false, message: 'There are some errors when you delete a post!' })
        }
    }
}