const mongodb = require("../core/mongodb");
const hook = require('../core/hook')
let menus = [
    {
        title: 'DASHBOARDS',
        subs: [
            {
                title: 'General',
                icon: 'metismenu-icon pe-7s-rocket',
                link: '/admin',
                permission: 'report'
            }
        ]
    },
    {
        title: 'CONTENT MANAGEMENT',
        permission: 'content',
        subs: [
            {
                title: 'Post',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/post',
                // permission: 'editor|reporter',
                subs: [
                    {
                        title: 'Thêm mới',
                        link: '/admin/post/add-new',
                        permission: 'post-add',
                    },
                    {
                        title: 'Danh sách',
                        link: '/admin/post',
                        permission: 'post-list',
                    }
                ]
            },
            {
                title: 'Page',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/page',
                subs: [
                    {
                        title: 'Thêm mới',
                        link: '/admin/page/add-new'
                    },
                    {
                        title: 'Danh sách',
                        link: '/admin/page'
                    }
                ]
            },
            {
                title: 'Category',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/category',
                subs: [
                    {
                        title: 'Thêm mới',
                        link: '/admin/category/add-new'
                    },
                    {
                        title: 'Danh sách',
                        link: '/admin/category'
                    }
                ]
            },
            {
                title: 'Tag',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/tag',
                subs: [
                    {
                        title: 'Thêm mới',
                        link: '/admin/tag/add-new'
                    },
                    {
                        title: 'Danh sách',
                        link: '/admin/tag'
                    }
                ]
            }
        ]

    },
    {
        title: 'SYSTEM MANAGEMENT',
        // permission: 'admin',
        subs: [
            {
                title: 'Media',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/admin/media'
            },
            {
                title: 'Account',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/admin/account'
            },
            {
                title: 'Setting',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/admin/setting'
            },
        ]
    }
]

function permissionMenu(e, login) {

    // Kiểm tra nếu là admin thì trả về luôn
    if (login.account_type === 'admin') return e;

    // Nếu là Array thì loop từng element con
    if (Array.isArray(e)) {

        let menus = e.map(e => permissionMenu(e, login))
        menus = menus.filter(e => Boolean(e))

        return menus;
    }

    let permission = e.permission || false

    // if (permission) {
    //     permission = permission.split('|')
    // } else {
    //     permission = []
    // }

    if (Array.isArray(e.subs)) {
        e.subs = e.subs.map(e => permissionMenu(e, login))
        e.subs = e.subs.filter(e => Boolean(e))

        if (e.subs.length === 0) delete e.subs;

        if (permission.length === 0) return e

        if (!permission || login.rule.includes(permission)) return e

        return undefined;

    }

    // if (permission.length === 0) return e

    if (!permission || login.rule.includes(permission)) return e

    return undefined;
}




module.exports = (rule) => {
    return async (req, res, next) => {

        // let group = await mongodb('GroupAdmin').insertOne({
        //     title: 'Editor',
        //     key: 'editor',
        //     rule: ['post-add', 'post-list', 'post-delete']
        // })

        let { login } = req;

        let menuPermission = JSON.parse(JSON.stringify(menus))


        hook.doHook('admin-menu', menuPermission)

        menuPermission = permissionMenu(menuPermission, login);

        // menuPermission = menuPermission.map(e => permissionMenu(e, login))

        // menuPermission = menuPermission.map(e => menuLevel1(e, login))

        // menuPermission = menuPermission.filter(e => e !== undefined)

        // menuPermission = menuPermission.filter(e => e.subs.length > 0)

        res.locals.menus = menuPermission

        // return res.json(menuPermission)


        if (!(!rule || login.rule.includes(rule))) {
            return res.json({ 'error': 'Bạn không có quyền truy cập vào trang này' })
        }

        // res.json(menuPermission)
        next();
    }
}