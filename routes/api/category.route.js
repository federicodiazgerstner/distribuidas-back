var express = require('express')
var router = express.Router()
var CategoryController = require('../../controllers/Category.controller');
var Authorization = require('../../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/test', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/categories.routes');
  });

router.post("/",Authorization, CategoryController.createCategory)
router.get("/:tagId",Authorization, CategoryController.getCategory)
router.delete("/:tagId",Authorization, CategoryController.deleteCategory)
router.put("/:tagId",Authorization, CategoryController.updateCategory)

// Export the Router
module.exports = router;