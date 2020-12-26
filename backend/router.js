var express = require('express');
var router = express.Router();
const path = require('path');
const loginController = require('./controller/loginController');
const postController = require('./controller/postController');

global.admin_view = path.join(__dirname, 'views/')

/* GET users listing. */
router.get('/', function (req, res) {
    res.render(admin_view + 'pages/index')
    // console.log(req.signedCookies)
});


router.all('/login', loginController.login);
router.get('/logout', loginController.logout);


router.get('/post/:action?/:id?', postController.index);
router.post('/post', postController.post);



module.exports = router;
