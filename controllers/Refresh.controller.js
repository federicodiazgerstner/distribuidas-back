var mongoose = require('mongoose');
const Token = require('../models/Token.model');

// Saving the context of this module inside the _the variable
_this = this;

exports.removeRefresh = async function (req, res, next){
    try {
        var query = {
            token : req.headers['x-access-token']
        }
        console.log("query",query)
        var deleted = await Token.deleteOne(query)
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("token Could not be deleted")
        }
        return res.status(200).json({status: 200, deleted:deleted, message: "Succesfully log out"})
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}