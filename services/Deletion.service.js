// Gettign the Newly created Mongoose Model we just created 
var Restaurant = require('../models/Restaurant.model');
var Category = require('../models/Category.model');
var Item = require('../models/Item.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List

exports.deleteManyItems = async function (items) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        var deletion = await Item.deleteMany({_id:{$in:items}})
    } catch (e) {  
        throw Error(e.message)
    }
}

exports.deleteManyCategories = async function (categories) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        categories.map(async cat => {
            await this.deleteManyItems(cat.items)
        });
        var deletion = await Category.deleteMany({_id:{$in:categories}})
    } catch (e) {  
        throw Error(e.message)
    }
}


exports.deleteManyRestaurants = async function (restaurants) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        restaurants.map(async resto => {
            var res = await Restaurant.findOne({_id:resto._id}).populate({path:"menu",model:"Category"})
            await this.deleteManyCategories(res.menu)
        });
        var deletion = await Restaurant.deleteMany({_id:{$in:restaurants}})
    } catch (e) {  
        throw Error(e.message)
    }
}


