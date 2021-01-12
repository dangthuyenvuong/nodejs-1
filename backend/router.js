var express = require('express');
var router = express.Router();
const path = require('path');
const loginController = require('./controller/loginController');
const postController = require('./controller/postController');
const categoryController = require('./controller/categoryController');
const tagController = require('./controller/tagController');
const mediaController = require('./controller/mediaController');
const adminMiddleware = require('./middleware')

global.admin_view = path.join(__dirname, 'views/')

/* GET users listing. */
router.get('/', adminMiddleware(), function (req, res) {

    res.render(admin_view + 'pages/index')
    // console.log(req.signedCookies)
});


router.all('/login', loginController.login);
router.get('/logout', loginController.logout);

// Editor
router.all('/post/add-new', adminMiddleware('post-add'), postController.add);
router.delete('/post/:id', adminMiddleware('post-detail'), postController.add);
router.get('/post', adminMiddleware('post-list'), postController.list);
// router.get('/post/:action?/:id?', adminMiddleware('post-add'), postController.add);




router.post('/category/add', adminMiddleware('category-add'), categoryController.add);
router.delete('/category/:id', adminMiddleware('category-add'), categoryController.delete);
router.get('/category/:action?/:id?', adminMiddleware('category-list'), categoryController.index);
router.post('/category', adminMiddleware('category-list'), categoryController.post);

router.post('/tag/add', adminMiddleware('supper-admin'), tagController.add);
router.delete('/tag/:id', adminMiddleware('supper-admin'), tagController.delete);
router.get('/tag/:action?/:id?', adminMiddleware('supper-admin'), tagController.index);
router.post('/tag', adminMiddleware('supper-admin'), tagController.post);


// Media
router.post('/media-list-file', adminMiddleware('supper-admin'), mediaController.index)
router.post('/filemanager-upload', adminMiddleware('supper-admin'), mediaController.upload)
router.post('/filemanager-delete', adminMiddleware('supper-admin'), mediaController.delete)

router.post('/filemanager-add-folder', adminMiddleware('supper-admin'), mediaController.addFolder)
router.post('/filemanager-rename-folder', adminMiddleware('supper-admin'), mediaController.renameFolder)
router.post('/filemanager-delete-folder', adminMiddleware('supper-admin'), mediaController.deleteFolder)



exports.router = router;


exports.middleware = mediaController.middleware