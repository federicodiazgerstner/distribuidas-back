var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ObjectId = mongoose.Schema.ObjectId;
var ItemSchema = new mongoose.Schema({
    category: mongoose.Types.ObjectId,
    title: String,
    veggie: Boolean,
    staac: Boolean,
    ingredients: String,
    image: String,
    price: Number
})

ItemSchema.plugin(mongoosePaginate)
const Item = mongoose.model('Item', ItemSchema)

module.exports = Item;