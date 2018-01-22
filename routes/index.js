var express = require('express');
var controller = require('../controllers/shortening');
var router = express.Router();

/* GET home page. */

router.post('/shorten_url',controller.shortenUrl);
router.get('/:url', controller.findUrl);


module.exports = router;
