/**ROUTE USER APIs. */
var express = require('express')

var router = express.Router()
var users = require('./api/user.route')
var restaurants = require('./api/restaurant.route')
var categories = require('./api/category.route')
var items = require('./api/item.route')
var utils = require('./api/utils')

router.use('/users', users);
router.use('/restaurants', restaurants);
router.use('/categories', categories);
router.use('/items', items);
router.use('/utils',utils)


module.exports = router;
