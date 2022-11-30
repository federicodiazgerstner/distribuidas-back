var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var TokenSchema = new mongoose.Schema({
    token: String,
    refreshToken: String
})

TokenSchema.plugin(mongoosePaginate)
const Token = mongoose.model('Token', TokenSchema)

module.exports = Token;