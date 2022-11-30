// Gettign the Newly created Mongoose Model we just created 
var Item = require('../models/Item.model');
var Category = require('../models/Category.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List

exports.checkItem = async function (title, category, itemId) {
    try {
        var item = await Item.findOne({title: title, category: category})
        if(!item){
            return true
        }else if (item.title === title && item._id.toString() === itemId.toString()){
            return true
        }else{
            return false
        }
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while checking Item")
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

exports.createItem = async function (item) {
    var title = this.prepareTitle(item.title)
    var flag = await this.checkItem(title, item.category, null)
    if(!flag){
        throw Error("Item already created")
    }
    // Creating a new Mongoose Object by using the new keyword
    var newItem = new Item({
        category: item.category,
        title: title,
        veggie: item.veggie,
        staac: item.staac,
        ingredients: item.ingredients,
        image: item.image,
        price: item.price
    })
    try {
        // Saving the User 
        var savedItem = await newItem.save();
        return savedItem;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)    
        throw Error("Error while Creating Item")
    }
}

exports.addItemInCat = async function (item){
    try {
        var category = await Category.findOne(item.category)
        console.log(category)
        category.items.push(item._id)
        var upCat = await category.save()
        return upCat;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while adding Item in Category");
    }
}

exports.getItem = async function (id){
    try {
        var item = await Item.find({_id:id})
        return item;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the item");
    }
}

exports.deleteItem = async function (id) {
    try {
        var item = await Item.findOne({_id:id})
        var deleted = await Item.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("item Could not be deleted")
        }
        return item;
    } catch (e) {
        throw Error("Error Occured while Deleting the item")
    }
}

exports.deleteItemInCat= async function (item){
    try {
        var category = await Category.findOne({_id: item.category})
        console.log(category)
        category.items.pull(item._id)
        var upCat = await category.save()
        return upCat;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while deleting item in category");
    }
}

exports.updateItem = async function (item) {
    var title = this.prepareTitle(item.title)
    var flag = await this.checkItem(title, item.category, item.id)
    if(!flag){
        throw Error("Item already created")
    }
    var id = {_id :item.id}
    try {
        //Find the old Object by the Id
        var oldItem = await Item.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the Item")
    }
    // If no old Object exists return false
    if (!oldItem) {
        return false;
    }
    //Edit the Object
    if(item.title){
        oldItem.title = title
    }
    if(item.veggie || !item.veggie){
        oldItem.veggie = item.veggie
    }
    if(item.staac || !item.staac){
        oldItem.staac = item.staac
    }
    if(item.image){
        oldItem.image = item.image
    }
    if(item.ingredients){
        oldItem.ingredients = item.ingredients
    }
    if(item.price){
        oldItem.price = item.price
    }
    try {
        var savedItem = await oldItem.save()
        return savedItem;
    } catch (e) {
        console.log(e)
        throw Error("Error while updating the Item");
    }
}