// Gettign the Newly created Mongoose Model we just created 
var Category = require('../models/Category.model');
var Restaurant = require('../models/Restaurant.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List

exports.checkCategory = async function (category, restaurant) {
    try {
        var cat = await Category.findOne({title: category, restaurant: restaurant})
        if(cat){
            return false
        }else{
            return true
        }
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while checking Category")
    }
    
}

exports.prepareTitle = function (title) {
    var words = title.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    return words
}

exports.createCategory = async function (category) {
    var title = this.prepareTitle(category.title)
    var flag = await this.checkCategory(title, category.restaurant)
    if(!flag){
        throw Error("Category already created")
    }
    var newCat = new Category({
        restaurant: category.restaurant,
        title: title
    })
    try {
        // Saving the Category 
        var savedCategory = await newCat.save();
        return savedCategory;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Category")
    }
    
}

exports.getCategory= async function (id){
    try {
        var category = await Category.findOne({_id:id}).populate({path:"items", model: "Item"})
        return category;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the category");
    }
}

exports.addCatInResto= async function (category){
    try {
        var restaurant = await Restaurant.findOne({_id: category.restaurant})
        restaurant.menu.push(category._id)
        var upResto = await restaurant.save()
        return upResto;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while adding category in restaurant");
    }
}

exports.deleteCategory = async function (id) {
    try {
        var category = await Category.findOne({_id:id})
        var deleted = await Category.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Category Could not be deleted")
        }
        return category;
    } catch (e) {
        throw Error("Error Occured while Deleting the Category")
    }
}

exports.deleteCatInResto= async function (category){
    try {
        var restaurant = await Restaurant.findOne({_id: category.restaurant})
        restaurant.menu.pull(category._id)
        var upResto = await restaurant.save()
        return upResto;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while deleting category in restaurant");
    }
}

exports.updateCategory = async function (category) {
    var title = this.prepareTitle(category.title)
    var flag = await this.checkCategory(title, category.restaurant)
    if(!flag){
        throw Error("Category already created")
    }
    var id = {_id :category.id}
    try {
        //Find the old Object by the Id
        var oldCategory = await Category.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the Category")
    }
    // If no old Object exists return false
    if (!oldCategory) {
        return false;
    }
    //Edit the Object
    if(category.title){
        oldCategory.title = title
    }
    try {
        var savedCategory = await oldCategory.save()
        return savedCategory;
    } catch (e) {
        console.log(e)
        throw Error("Error while updating the Category");
    }
}