var RestaurantService = require('../services/Restaurant.service');
var DeletionService = require('../services/Deletion.service');
var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List

exports.createRestaurant = async function (req, res, next) {
    var token = res.locals.token ? res.locals.token : ""
    // Req.Body contains the form submit values.
    console.log("llegue al controller",req.body)
    var Resto = {
        owner: mongoose.Types.ObjectId(req.body.owner),
        name: req.body.name,
        description: req.body.description,
        specialty: req.body.specialty,
        price: parseInt(req.body.price),
        close: req.body.close ? Boolean(req.body.close) : false,
        location: {
            latitude: parseFloat(req.body.latitude),
            longitude: parseFloat(req.body.longitude)
        },
        dayTime:{
            monday:{open: req.body.monOp,close: req.body.monCl},
            tuesday:{open: req.body.tueOp,close: req.body.tueCl},
            wednesday:{open: req.body.wedOp,close: req.body.wedCl},
            thursday:{open: req.body.thuOp,close: req.body.thuCl},
            friday:{open: req.body.friOp,close: req.body.friCl},
            saturday:{open: req.body.satOp,close: req.body.satCl},
            sunday:{open: req.body.sunOp,close: req.body.sunCl},
        },
        images: req.body.images,
        totalRatings: 0,
        cantRatings: 0,
        stars: 0
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdResto = await RestaurantService.createRestaurant(Resto)
        var upUser = await RestaurantService.addRestoInOwner(createdResto)
        return res.status(201).json({createdResto, token:token, message: "Succesfully Created Restaurant"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.getRestaurants = async function (req, res, next){
    try {
        var token = res.locals.token ? res.locals.token : ""
        if(req.params.tagId){
            var id = mongoose.Types.ObjectId(req.params.tagId)
            var restaurant = await RestaurantService.getRestaurant(id)
            return res.status(200).json({status: 200, data: restaurant, token:token, message: "Succesfully retrieved Restaurant"})
        }else if(req.query.latitude && !req.query.kilometers){
            var options = {
                offset : req.query.offset ? parseInt(req.query.offset) : 0,
                limit : req.query.limit ? parseInt(req.query.limit) : 10
            }
            var userLocation = {
                latitude: parseFloat(req.query.latitude),
                longitude: parseFloat(req.query.longitude)
            }
            var restaurants = await RestaurantService.getNearByRestaurants(userLocation,options)
            return res.status(200).json({status: 200, data: restaurants, token:token, message: "Succesfully retrieved Restaurants"})
        }else{
            var options = {
                offset : req.query.offset ? parseInt(req.query.offset) : 0,
                limit : req.query.limit ? parseInt(req.query.limit) : 10
            }
            var query={
                name : req.query.name ? req.query.name : null,
                specialty : req.query.specialty ? req.query.specialty : null,
                stars: req.query.stars ? parseInt(req.query.stars) : null,
                price: req.query.price ? parseInt(req.query.price) : null,
                kilometers: req.query.kilometers ? parseInt(req.query.kilometers) : null,
                latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
                longitude: req.query.longitude ? parseFloat(req.query.longitude) : null
            }
            var restaurants = await RestaurantService.getRestaurants(query,options)
            return res.status(200).json({status: 200, data: restaurants,token:token, message: "Succesfully retrieved Restaurants"})
        }
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.deleteRestaurant = async function (req, res, next){
    var id = mongoose.Types.ObjectId(req.params.tagId)
    var token = res.locals.token ? res.locals.token : ""
    try {
        var deleted = await RestaurantService.deleteRestaurant(id);
        var deleted2 = await RestaurantService.deleteRestoInAllFavs(id)
        var upUser = await RestaurantService.deleteRestoInOwner(deleted)
        var deletion = await DeletionService.deleteManyCategories(deleted.menu)
        res.status(200).json({status: 200, token:token, message: "Succesfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.postComment = async function (req, res, next){
    var id = mongoose.Types.ObjectId(req.params.tagId)
    var date = new Date()
    var token = res.locals.token ? res.locals.token : ""
    date.setHours(date.getHours() - 3);
    var author = mongoose.Types.ObjectId(req.body.author)
    var comment = {
        comment : req.body.comment,
        point: req.body.point,
        author: author,
        date: date
    }
    try {
        var restaurant = await RestaurantService.postComment(id,comment);
        res.status(201).json({status: 201,data: restaurant, token:token, message: "Succesfully added comment"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.updateRestaurant = async function (req, res, next){
    try {
        var token = res.locals.token ? res.locals.token : ""
        var restaurant = {
            id : mongoose.Types.ObjectId(req.params.tagId),
            name: req.body.name ? req.body.name: null,
            description: req.body.description ? req.body.description: null,
            specialty: req.body.specialty ? req.body.specialty: null,
            price: req.body.price ? parseInt(req.body.price): null,
            close:req.body.close ? Boolean(req.body.close): false,
            location: {
                latitude: req.body.latitude ? parseFloat(req.body.latitude):null,
                longitude: req.body.longitude ? parseFloat(req.body.longitude):null
            },
            dayTime:{
                monday:{
                    open: req.body.monOp ? req.body.monOp:null,
                    close: req.body.monCl ? req.body.monCl: null
                },
                tuesday:{
                    open: req.body.tueOp ? req.body.tueOp :null,
                    close: req.body.tueCl ? req.body.tueCl:null
                },
                wednesday:{
                    open: req.body.wedOp ? req.body.wedOp: null,
                    close: req.body.wedCl ? req.body.wedCl: null
                },
                thursday:{
                    open: req.body.thuOp ? req.body.thuOp:null,
                    close: req.body.thuCl ? req.body.thuCl: null
                },
                friday:{
                    open: req.body.friOp ? req.body.friOp: null,
                    close: req.body.friCl ? req.body.friCl: null
                },
                saturday:{
                    open: req.body.satOp ? req.body.satOp:null,
                    close: req.body.satCl ? req.body.satCl:null
                },
                sunday:{
                    open: req.body.sunOp ? req.body.sunOp:null,
                    close: req.body.sunCl ? req.body.sunCl:null
                },
            },
            images: req.body.images ? req.body.images: null,
        }
        var restaurant = await RestaurantService.updateRestaurant(restaurant)
        return res.status(200).json({status: 200, data: restaurant, token:token, message: "Succesfully updated restaurant"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}