// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var Token = require('../models/Token.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List

exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        console.log("login:",user)
        var _details = await User.findOne({
            email: user.email
        });
        if (!_details) return 409
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return 401

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: '10m' // expires in 10 minutes
        });
        var refreshToken = jwt.sign({
            id: _details._id,
            email: _details.email
        }, process.env.SECRET, {
            expiresIn: '1d' // expires in 24 hours
        });
        var newToken = new Token({
            token: token,
            refreshToken: refreshToken
        })
        await newToken.save()
        return {token:token, user:_details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message)
    }

}

exports.loginGoogle = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        console.log("login:",user)
        var _details = await User.findOne({
            email: user.email
        });
        if (!_details) return 409

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: '10m' // expires in 10 minutes
        });
        var refreshToken = jwt.sign({
            id: _details._id,
            email: _details.email
        }, process.env.SECRET, {
            expiresIn: '1d' // expires in 24 hours
        });
        var newToken = new Token({
            token: token,
            refreshToken: refreshToken
        })
        await newToken.save()
        return {token, id:_details._id};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message)
    }

}

exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    
    var newUser = new User({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        owner: user.owner,
        picture: user.picture
    })
    var filter = {
        email: user.email
    }
    var flag = await this.chequearMail(filter)
    if(flag){
        try {
            // Saving the User 
            var savedUser = await newUser.save();
            if(user.owner){
                var token = "token"
                return {token,id:savedUser._id};
            }else{
                var token = jwt.sign({
                    id: savedUser._id
                }, process.env.SECRET, {
                    expiresIn: '10m' // expires in 10 minutes
                });
                var refreshToken = jwt.sign({
                    id: savedUser._id,
                    email: savedUser.email
                }, process.env.SECRET, {
                    expiresIn: '1d' // expires in 24 hours
                });
                var newToken = new Token({
                    token: token,
                    refreshToken: refreshToken
                })
                await newToken.save()
                return {token,id:savedUser._id};
            }
        } catch (e) {
            // return a Error message describing the reason 
            console.log(e)    
            throw Error("Error while Creating User")
        }
    }else{
        return false;
    }
}

exports.chequearMail = async function (query){
    try {
        console.log("Query",query)
        var user = await User.findOne(query)
        var flag = user ? false : true
        return flag
        

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while checking email');
    }
}



exports.updatePass = async function (user) {
    var id = {_id :user.id}
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        throw Error("User not found")
    }
    if(!bcrypt.compareSync(user.oldPassword, oldUser.password)){
        return 401
    }
    //Edit the User Object
    var hashedPassword = bcrypt.hashSync(user.newPassword, 8);
    oldUser.password = hashedPassword
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        console.log(e)
        throw Error(e.message);
    }
}

exports.resetPass = async function (user) {
    var id = {email :user.email}
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        throw Error("User not found")
    }
    //Edit the User Object
    var hashedPassword = bcrypt.hashSync(user.newPassword, 8);
    oldUser.password = hashedPassword
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        console.log(e)
        throw Error(e.message);
    }
}

exports.getUsers = async function (filtro){
    try {
        var user = await User.findOne(filtro).populate([
            {path: "favs",model: 'Restaurant'},
            {path: "restaurants",model: 'Restaurant'},
        ])
        return user;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while getting the User");
    }
}

exports.updateUser = async function (user) {
    var id = {_id :user.id}
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    //Edit the User Object
    if(user.name){
        oldUser.name = user.name
    }
    if(user.lastName){
        oldUser.lastName = user.lastName
    }
    if(user.picture){
        oldUser.picture = user.picture
    }
    try {
        var savedUser = await oldUser.save()
        return savedUser;
    } catch (e) {
        console.log(e)
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {
    try {
        var user = await User.findOne({_id:id}).populate({path:"restaurants",model:"Restaurant"})
        var deleted = await User.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return user;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}

exports.addFav = async function (id,idr){
    try {
        var user = await User.findOne({_id:id})
        user.favs.push(idr)
        var upUser = await user.save();
        return upUser
    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while adding Fav in User');
    }
}

exports.removeFav = async function (id,idr){
    try {
        var user = await User.findOne({_id:id})
        user.favs.pull(idr)
        var upUser = await user.save();
        return upUser
    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while removing Fav in User');
    }
}