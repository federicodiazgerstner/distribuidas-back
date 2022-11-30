var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ObjectId = mongoose.Schema.ObjectId;
var UserSchema = new mongoose.Schema({
    owner: Boolean,
    email: String,
    name: String,
    lastName: String,
    password: String,
    picture: String,
    restaurants: [{ type: mongoose.Types.ObjectId, ref: 'restaurant' }],
    favs: [{ type: mongoose.Types.ObjectId, ref: 'restaurant' }]
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User;