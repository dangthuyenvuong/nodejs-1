const fs = require('fs');
const path = require('path')
const express = require('express');
const pageController = require('../controllers/pageController');
const app = require('../app');

var cookieParser = require('cookie-parser')

const router = express.Router();


// router.get('/contact', (req, res) => {

//     res.render('contact');

// })

router.get('/detail', (req, res, next) => {

    next();

})

cookieParser.signedCookie('aaa', '345345345')


router.get('/:page?/:level1?', async (req, res, next) => {



    let { page, level1 } = req.params;

    if (!page) page = 'index';

    let pageDir;
    let pagePug = page;
    let pageNameController = page;

    if (level1) {
        pageDir = path.join(__dirname, `../views/page/${page}/${level1}.pug`)
        pagePug += '/' + level1
        pageNameController += '_' + level1
    } else {
        pageDir = path.join(__dirname, `../views/page/${page}.pug`)
    }

    let data = {};
    if (pageNameController in pageController) {
        data = await pageController[pageNameController]();
    }


    if (fs.existsSync(pageDir)) {
        return res.render('page/' + pagePug, data);
    }

    next();

})




module.exports = router;