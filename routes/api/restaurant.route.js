var express = require('express')
var router = express.Router()
var RestaurantController = require('../../controllers/Restaurant.controller');
var Authorization = require('../../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/test', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/restaurants.routes');
  });

router.post("/", Authorization, RestaurantController.createRestaurant)
router.get("/:tagId", Authorization, RestaurantController.getRestaurants)
router.get("/", Authorization, RestaurantController.getRestaurants)
router.delete("/:tagId", Authorization, RestaurantController.deleteRestaurant)
router.post("/:tagId/comments", Authorization, RestaurantController.postComment)
router.put("/:tagId", Authorization, RestaurantController.updateRestaurant)

// Export the Router
module.exports = router;