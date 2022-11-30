var express = require('express')
var router = express.Router()
var UserController = require('../../controllers/User.controller');
var Authorization = require('../../auth/authorization');



router.get('/:tagId',Authorization,UserController.getUsers)
router.post('/', UserController.createUser)
router.put('/:tagId',Authorization, UserController.updateUser)
router.delete('/:tagId',Authorization, UserController.deleteUser)

router.post('/login', UserController.loginUser)
router.post('/resetPassword',UserController.resetPassword)

router.put('/:tagId/favorites',Authorization,UserController.handleFav)


// Export the Router
module.exports = router;