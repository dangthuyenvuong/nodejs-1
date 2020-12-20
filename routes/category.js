var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController');


/* GET users listing. */
router.get('/:slug', categoryController.list);

module.exports = router;
