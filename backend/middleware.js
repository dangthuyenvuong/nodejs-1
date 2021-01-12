const mongodb = require("../core/mongodb");

let menus = [
    {
        title: 'DASHBOARDS',
        permission: 'reporter',
        subs: [
            {
                title: 'General',
                icon: 'metismenu-icon pe-7s-rocket',
                link: '/admin',
                permission: 'reporter'
            }
        ]
    },
    {
        title: 'CONTENT MANAGEMENT',
        permission: 'editor|reporter',
        subs: [
            {
                title: 'Post',
                icon: 'metismenu-icon pe-7s-diamond',
                link: '/post',
                permission: 'editor|reporter',
                subs: [
                    {
                        title: 'Thêm mới',
                        link: '/admin/post/add-new',
                        permission: 'editor',
                    },
                    {
                        title: 'Danh sách',
                        link: '/admin/post',
                        // permission: 'reporter',
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
        permission: 'admin',
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


function menuLevel1(e, login) {
    if (login.account_type === 'admin') return e;

    e.subs = e.subs.map(e1 => menuLevel2(e1, login))
    e.subs = e.subs.filter(e1 => e1 !== undefined)

    if (Array.isArray(e.subs) && e.subs.length > 0) {
        return e;
    }

    let permission = e.permission || false

    if (permission) {
        permission = permission.split('|')
        if (permission.includes(login.account_type)) return e;
        return undefined
    }

    return undefined;
}

function menuLevel2(e, login) {

    let permission = e.permission || false

    if (permission) {
        permission = permission.split('|')
        if (permission.includes(login.account_type)) return e;
        return undefined
    }



    if (Array.isArray(e.subs)) {
        e.subs = e.subs.map(e1 => menuLevel3(e1, login))

        e.subs = e.subs.filter(e1 => e1 !== undefined)
    }

    if (Array.isArray(e.subs) && e.subs.length > 0) {
        return e;
    }

}

function menuLevel3(e, login) {
    let permission = e.permission || false

    if (permission) {
        permission = permission.split('|')

        if (permission.includes(login.account_type)) return e;


        return undefined
    }

    return e


}

function permissionMenu(e, login, parentPermission = false) {

    if (parentPermission) return e;

    if (login.account_type === 'admin') return e;
    let permission = e.permission || ''

    permission = permission.split('|')
    if (e.subs) {
        e.subs = e.subs.map(e1 => permissionMenu(e1, login, permission.includes(login.account_type)))
        e.subs = e.subs.filter(e1 => e1 !== undefined)

        if (e.subs.length === 0) {
            delete e.subs;
        }
    }

    if (Array.isArray(e.subs) || permission.includes(login.account_type)) {
        // if (e.subs) {
        //     e.subs = e.subs.map(e1 => permissionMenu(e1, login))
        //     e.subs = e.subs.filter(e1 => e1 !== undefined)
        // }

        return e

    }
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

        // menuPermission = menuPermission.map(e => permissionMenu(e, login))

        menuPermission = menuPermission.map(e => menuLevel1(e, login))

        menuPermission = menuPermission.filter(e => e !== undefined)

        menuPermission = menuPermission.filter(e => e.subs.length > 0)

        res.locals.menus = menuPermission

        let groupAdmin = await mongodb('GroupAdmin').findOne({ key: login.account_type })

        if (login.account_type !== 'admin' && rule && !groupAdmin.rule.includes(rule)) {
            return res.json({ 'error': 'Bạn không có quyền truy cập vào trang này' })
        }

        // res.json(menuPermission)
        next();
    }
}