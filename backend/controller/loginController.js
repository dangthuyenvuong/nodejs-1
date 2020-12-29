const Admin = require('../models/Admin')

module.exports = {

    login: async(req, res, next) => {
        if (req.method == "GET") {
            res.render(admin_view + 'pages/login')

        } else {
            let { body } = req;
            let { email, password } = body;

            let user = await Admin.getAdmin(email, password);

            if (user) {
                res.cookie('login', JSON.stringify(user))
                res.json({ success: true, redirect: '/admin' })
            } else {
                res.json({ success: false, message: 'Vui lòng nhập đúng email và password' })
            }
        }
    },
    logout: (req, res, ) => {
        res.clearCookie('login')
        res.redirect('/admin/login')
    }
}