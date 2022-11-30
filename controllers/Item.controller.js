var ItemService = require('../services/Item.service');
var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List

exports.createItem = async function (req, res, next) {
    var token = res.locals.token ? res.locals.token : ""
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var Item = {
        category: mongoose.Types.ObjectId(req.body.category),
        title: req.body.title,
        veggie: Boolean(req.body.veggie),
        staac: Boolean(req.body.staac),
        ingredients: req.body.ingredients,
        image: req.body.image,
        price: parseInt(req.body.price)
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdItem = await ItemService.createItem(Item)
        var upCategory = await ItemService.addItemInCat(createdItem)
        return res.status(201).json({createdItem,token:token, message: "Succesfully Created Item"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.getItem = async function (req, res, next){
    var token = res.locals.token ? res.locals.token : ""
    try {
        var id = mongoose.Types.ObjectId(req.params.tagId)
        var items = await ItemService.getItem(id)
        return res.status(200).json({status: 200, data: items,token:token, message: "Succesfully retrieved item"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.deleteItem = async function (req, res, next){
    var token = res.locals.token ? res.locals.token : ""
    var id = mongoose.Types.ObjectId(req.params.tagId)
    try {
        var deleted = await ItemService.deleteItem(id)
        var upCat = await ItemService.deleteItemInCat(deleted)
        res.status(200).json({status: 200,token:token, message: "Succesfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.updateItem = async function (req, res, next){
    try {
        var token = res.locals.token ? res.locals.token : ""
        var item = {
            category: mongoose.Types.ObjectId(req.body.category),
            id : mongoose.Types.ObjectId(req.params.tagId),
            title : req.body.title ? req.body.title : null,
            veggie : req.body.veggie ? Boolean(req.body.veggie): false,
            staac : req.body.staac ? Boolean(req.body.staac) : false,
            image : req.body.image ? req.body.image : null,
            ingredients: req.body.ingredients ? req.body.ingredients : null,
            price: req.body.price ? parseInt(req.body.price) : null
        }
        var items = await ItemService.updateItem(item)
        return res.status(200).json({status: 200, data: items,token:token, message: "Succesfully updated item"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}