// Gettign the Newly created Mongoose Model we just created 
var Restaurant = require('../models/Restaurant.model');
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List

exports.createRestaurant = async function (resto) {
    // Creating a new Mongoose Object by using the new keyword
    var newResto = new Restaurant({
        owner: resto.owner,
        name: resto.name,
        description: resto.description,
        specialty: resto.specialty,
        price: resto.price,
        close: resto.close,
        location: {
            latitude: resto.location.latitude,
            longitude: resto.location.longitude
        },
        dayTime:{
            monday:{open: resto.dayTime.monday.open,
                close: resto.dayTime.monday.close},
            tuesday:{open: resto.dayTime.tuesday.open,
                close: resto.dayTime.tuesday.close},
            wednesday:{open: resto.dayTime.wednesday.open,
                close: resto.dayTime.wednesday.close},
            thursday:{open: resto.dayTime.thursday.open,
                close: resto.dayTime.thursday.close},
            friday:{open: resto.dayTime.friday.open,
                close: resto.dayTime.friday.close},
            saturday:{open: resto.dayTime.saturday.open,
                close: resto.dayTime.saturday.close},
            sunday:{open: resto.dayTime.sunday.open,
                close: resto.dayTime.sunday.close},
        },
        images: resto.images,
        totalRatings: resto.totalRatings,
        cantRatings: resto.cantRatings,
        stars: resto.stars
    })
    try {
        // Saving the User 
        var savedResto = await newResto.save();
        return savedResto;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Restaurant")
    }
    
}

exports.addRestoInOwner = async function (restaurant){
    try {
        var user = await User.findOne(restaurant.owner)
        console.log(user)
        user.restaurants.push(restaurant._id)
        var upUser = await user.save()
        return upUser;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while adding Resaurant in Owner");
    }
}

exports.getRestaurant = async function (id){
    try {
        var restaurant = await Restaurant.findOne({_id:id}).populate([
            {path:"comments.author", model: "User"},
            {path:"menu", model: "Category"},
        ])
        return restaurant;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the Restaurant");
    }
}

exports.getRestaurants = async function (query,options){
    try {
        if(!query.name && !query.specialty && !query.stars && !query.price && !query.kilometers
            && !query.latitude && !query.longitude){
            return {}
        }
        var Restaurants = Restaurant.find({close:false} ,{
            name:true, specialty:true, stars:true, price:true,
            images: true, location:true
        })
        if(query.name){
            Restaurants= Restaurants.find({name: {$regex: query.name, $options: 'i'}})
        }
        if(query.specialty){
            Restaurants= Restaurants.find({specialty: {$regex: query.specialty, $options: 'i'}})
        }
        if(query.stars){
            Restaurants= Restaurants.find({stars:{$gte:query.stars}})
        }
        if(query.price){
            Restaurants= Restaurants.find({price: { $eq:query.price}})
        }
        if(query.kilometers && query.latitude && query.longitude){
            var restaurant = await Restaurants.find({})
            Restaurants = await this.filterByDistance(restaurant,query)
            return Restaurants.slice(0,options.limit)
        }
        Restaurants = Restaurants.find({}).limit(options.limit).skip(options.offset)
        return Restaurants;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the Restaurants");
    }
}

function euclideanDistance(latUser, longUser, latResto, longResto) {
    var distance =Math.pow((latUser-latResto),2) + Math.pow((longUser-longResto),2)
    return distance
}

exports.getNearByRestaurants = async function (query,options){
    try {
        var restaurants = await Restaurant.find({close:false} ,{
            name:true, specialty:true, stars:true, price:true,
            images: true, location:true
        })
        var restaurantsDistance = []
        for(let i = 0; i<restaurants.length;i++){
            var distance = euclideanDistance(
                query.latitude,
                query.longitude,
                parseFloat(restaurants[i].location.latitude),
                parseFloat(restaurants[i].location.longitude)
            )
            restaurantsDistance.push({distance: distance,restaurant:restaurants[i]})
        }
        restaurantsDistance.sort((a,b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0))
        var restos = []
        for(let i = 0; i<restaurantsDistance.length;i++){
            restos.push(restaurantsDistance[i].restaurant)
        }
        return restos.slice(options.offset,options.limit);
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the Restaurants");
    }
}

function euclideanDistanceKilometers(latUser, longUser, latResto, longResto) {
    var distance =Math.pow((latUser-latResto),2) + Math.pow((longUser-longResto),2)
    distance = Math.sqrt(distance)
    return distance*111.139
}

exports.filterByDistance = async function (restaurants,options){
    try {
        var restaurantsDistance = []
        for(let i = 0; i<restaurants.length;i++){
            var distance = euclideanDistanceKilometers(
                options.latitude,
                options.longitude,
                parseFloat(restaurants[i].location.latitude),
                parseFloat(restaurants[i].location.longitude)
            )
            if(distance<=options.kilometers){
                restaurantsDistance.push(restaurants[i])
            }
        }
        return restaurantsDistance
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the Restaurants");
    }
}

exports.deleteRestaurant = async function (id) {
    try {
        var restaurant = await Restaurant.findOne({_id:id}).populate({path:"menu",model:"Category"})
        var deleted = await Restaurant.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Restaurant Could not be deleted")
        }
        return restaurant;
    } catch (e) {
        throw Error("Error Occured while Deleting the Restaurant")
    }
}

exports.deleteRestoInOwner= async function (restaurant){
    try {
        var owner = await User.findOne({_id: restaurant.owner})
        console.log(owner)
        owner.restaurants.pull(restaurant._id)
        var upOwner = await owner.save()
        return upOwner;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while removing restaurant in owner");
    }
}

exports.deleteRestoInAllFavs= async function (id){
    try {
        var users = await User.updateMany({},
            {$pull: {favs:id}},
            { multi: true })
        return users

    } catch (e) {
        console.log(e)
        throw Error("And Error occured while removing restaurant in favs");
    }
}

exports.postComment = async function (id,comment) {
    try {
        var oldResto = await Restaurant.findOne({
            _id: id
        })
        oldResto.comments.push(comment)
        oldResto.totalRatings += parseInt(comment.point)
        oldResto.cantRatings += 1
        oldResto.stars = (oldResto.totalRatings/oldResto.cantRatings).toFixed(1)
        resto = await oldResto.save()
        var restaurant = await Restaurant.findOne({_id:id}).populate([
            {path:"comments.author", model: "User"},
            {path:"menu", model: "Category"},
        ])
        return restaurant;
    } catch (e) {
        throw Error("Error Occured while creating comment")
    }
}

exports.updateRestaurant = async function (restaurant) {
    var id = {_id :restaurant.id}
    try {
        //Find the old Object by the Id
        var oldRestaurant = await Restaurant.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the Restaurant")
    }
    // If no old Object exists return false
    if (!oldRestaurant) {
        return false;
    }
    //Edit the Object
    if(restaurant.name){
        oldRestaurant.name = restaurant.name
    }
    if(restaurant.description){
        oldRestaurant.description = restaurant.description
    }
    if(restaurant.specialty){
        oldRestaurant.specialty = restaurant.specialty
    }
    if(restaurant.price){
        oldRestaurant.price = restaurant.price
    }
    if(restaurant.close || !restaurant.close){
        oldRestaurant.close = restaurant.close
    }
    if(restaurant.location.latitude){
        oldRestaurant.location.latitude = restaurant.location.latitude
    }
    if(restaurant.location.longitude){
        oldRestaurant.location.longitude = restaurant.location.longitude
    }
    if(restaurant.dayTime.monday.open){
        oldRestaurant.dayTime.monday.open = restaurant.dayTime.monday.open
    }
    if(restaurant.dayTime.monday.close){
        oldRestaurant.dayTime.monday.close = restaurant.dayTime.monday.close
    }
    if(restaurant.dayTime.tuesday.open){
        oldRestaurant.dayTime.tuesday.open = restaurant.dayTime.tuesday.open
    }
    if(restaurant.dayTime.tuesday.close){
        oldRestaurant.dayTime.tuesday.close = restaurant.dayTime.tuesday.close
    }
    if(restaurant.dayTime.wednesday.open){
        oldRestaurant.dayTime.wednesday.open = restaurant.dayTime.wednesday.open
    }
    if(restaurant.dayTime.wednesday.close){
        oldRestaurant.dayTime.wednesday.close = restaurant.dayTime.wednesday.close
    }
    if(restaurant.dayTime.thursday.open){
        oldRestaurant.dayTime.thursday.open = restaurant.dayTime.thursday.open
    }
    if(restaurant.dayTime.thursday.close){
        oldRestaurant.dayTime.thursday.close = restaurant.dayTime.thursday.close
    }
    if(restaurant.dayTime.friday.open){
        oldRestaurant.dayTime.friday.open = restaurant.dayTime.friday.open
    }
    if(restaurant.dayTime.friday.close){
        oldRestaurant.dayTime.friday.close = restaurant.dayTime.friday.close
    }
    if(restaurant.dayTime.saturday.open){
        oldRestaurant.dayTime.saturday.open = restaurant.dayTime.saturday.open
    }
    if(restaurant.dayTime.saturday.close){
        oldRestaurant.dayTime.saturday.close = restaurant.dayTime.saturday.close
    }
    if(restaurant.dayTime.sunday.open){
        oldRestaurant.dayTime.sunday.open = restaurant.dayTime.sunday.open
    }
    if(restaurant.dayTime.sunday.close){
        oldRestaurant.dayTime.sunday.close = restaurant.dayTime.sunday.close
    }
    if(restaurant.images){
        oldRestaurant.images = restaurant.images
    }

    try {
        var savedRestaurant = await oldRestaurant.save()
        return savedRestaurant;
    } catch (e) {
        console.log(e)
        throw Error("Error while updating the Restaurant");
    }
}