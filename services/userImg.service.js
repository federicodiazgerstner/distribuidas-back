// Gettign the Newly created Mongoose Model we just created 
var UserImg = require('../models/UserImg.model');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

//configurar cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'camiuade', //reemplazar con sus credenciales
    api_key: '764898262693467', 
    api_secret: 'BWxqwXRxqEzjiJMINS7ehHHidPo'
});

async function createUserImg (userImg) {
    //subir imagen a cloudinary
    console.log("userImg",userImg)
    let imagen = process.env.UPLOAD_DIR + userImg.nombreImagen;
    console.log("ruta",imagen)
    var response = await cloudinary.uploader.upload(imagen, async function(result) { });
    return response.url
}

exports.guardarImagenUser = async function (file) {
    let userImg = {
        nombreImagen : file
    }    
    try {
        var object = await createUserImg(userImg);
        console.log("object",object)
        return object 
    } catch (e) {
        console.log("error guardar imagen",e)
    }

}


exports.upload = async function (req, res, next) {
    console.log(req)
    var response = await cloudinary.uploader.upload(file.tempFilePath, async function(result) { });
    res.json({ok: true, msg: 'Files uploaded succesfully!', response})
}