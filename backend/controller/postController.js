const Post = require("../models/Post");

function validate(data) {
    return data;
}

module.exports = {
    index: async (req, res) => {
        let { action, id } = req.params;
        if (action) {

            if (id && action === 'edit') {
                let post = await Post.detail(id);
                res.render(admin_view + 'pages/add-post', { title: 'Edit', post })
            } else {

                res.render(admin_view + 'pages/add-post', { title: 'Add new', post: {} })
            }
        } else {
            let { page = 1 } = req.query;
            let { data, paginate } = await Post.list(page);
            console.log(paginate)

            res.render(admin_view + 'pages/post', { post: data, paginate })
        }
    },
    post: async (req, res) => {
        let { body } = req;
        let data = validate(body);
        let { _id } = data;
        delete data._id;

        let result = await Post.update(_id, data)
        console.log(result.value);
        if (result.value) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'Đã xẩy ra lỗi trong quá trình update' })
        }
    }
}