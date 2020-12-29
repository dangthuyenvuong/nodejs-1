var express = require('express');
var router = express.Router();
const path = require('path');
const loginController = require('./controller/loginController');
const postController = require('./controller/postController');
const categoryController = require('./controller/categoryController');
const tagController = require('./controller/tagController');
const mediaController = require('./controller/mediaController');

global.admin_view = path.join(__dirname, 'views/')

/* GET users listing. */
router.get('/', function (req, res) {
    res.render(admin_view + 'pages/index')
    // console.log(req.signedCookies)
});


router.all('/login', loginController.login);
router.get('/logout', loginController.logout);


router.post('/post/add', postController.add);
router.delete('/post/:id', postController.delete);
router.get('/post/:action?/:id?', postController.index);
router.post('/post', postController.post);

router.post('/category/add', categoryController.add);
router.delete('/category/:id', categoryController.delete);
router.get('/category/:action?/:id?', categoryController.index);
router.post('/category', categoryController.post);

router.post('/tag/add', tagController.add);
router.delete('/tag/:id', tagController.delete);
router.get('/tag/:action?/:id?', tagController.index);
router.post('/tag', tagController.post);



// Media
router.post('/media-list-file', mediaController.index)


exports.router = router;


exports.middleware = mediaController.middleware