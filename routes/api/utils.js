var express = require('express');
var router = express.Router();
var UploadController = require('../../controllers/upload.controller');
var RefreshController = require('../../controllers/Refresh.controller')
var Authorization = require('../../auth/authorization');

/* GET utils listing. */
router.get('/', function(req, res, next) {
  res.send('Utils listing');
});

router.post('/',Authorization, UploadController.uploadFilesImgUser);
router.delete('/deleteToken', RefreshController.removeRefresh);

module.exports = router;
