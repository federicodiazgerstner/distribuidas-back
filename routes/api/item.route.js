var express = require('express')
var router = express.Router()
var ItemController = require('../../controllers/Item.controller');
var Authorization = require('../../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/test', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/items.routes');
  });

router.post("/",Authorization, ItemController.createItem)
router.get("/:tagId",Authorization, ItemController.getItem)
router.delete("/:tagId",Authorization, ItemController.deleteItem)
router.put("/:tagId",Authorization, ItemController.updateItem)

// Export the Router
module.exports = router;