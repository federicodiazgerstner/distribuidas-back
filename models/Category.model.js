var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ObjectId = mongoose.Schema.ObjectId;
var CategorySchema = new mongoose.Schema({
    restaurant: mongoose.Types.ObjectId,
    title: String,
    items: [{ type: mongoose.Types.ObjectId, ref: 'item' }]
})

CategorySchema.plugin(mongoosePaginate)
const Category = mongoose.model('Category', CategorySchema)

module.exports = Category;