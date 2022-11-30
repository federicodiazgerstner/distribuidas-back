var CategoryService = require('../services/Category.service');
var DeletionService = require('../services/Deletion.service');
var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List

exports.createCategory = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var Category = {
        restaurant: mongoose.Types.ObjectId(req.body.restaurant) ,
        title: req.body.title
    }
    try {
        var token = res.locals.token ? res.locals.token : ""
        // Calling the Service function with the new object from the Request Body
        var createdCat = await CategoryService.createCategory(Category)
        var restaurant = await CategoryService.addCatInResto(createdCat)
        return res.status(201).json({createdCat,token:token, message: "Succesfully Created Category"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.getCategory = async function (req, res, next){
    try {
        var token = res.locals.token ? res.locals.token : ""
        var id = mongoose.Types.ObjectId(req.params.tagId)
        var category = await CategoryService.getCategory(id)
        return res.status(200).json({status: 200, data: category,token:token, message: "Succesfully retrieved category"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.deleteCategory = async function (req, res, next){
    var id = mongoose.Types.ObjectId(req.params.tagId)
    var token = res.locals.token ? res.locals.token : ""
    try {
        var deleted = await CategoryService.deleteCategory(id)
        var upResto = await CategoryService.deleteCatInResto(deleted)
        var deletion = await DeletionService.deleteManyItems(deleted.items)
        res.status(200).json({status: 200,token:token, message: "Succesfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.updateCategory = async function (req, res, next){
    try {
        var token = res.locals.token ? res.locals.token : ""
        var category = {
            id : mongoose.Types.ObjectId(req.params.tagId),
            title : req.body.title ? req.body.title : null,
            restaurant: mongoose.Types.ObjectId(req.body.restaurant) 
        }
        var category = await CategoryService.updateCategory(category)
        return res.status(200).json({status: 200, category,token:token, message: "Succesfully updated category"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}