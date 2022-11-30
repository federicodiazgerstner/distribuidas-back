var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ObjectId = mongoose.Schema.ObjectId;
var RestaurantSchema = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, ref: 'user' },
    name: String,
    description: String,
    specialty: String,
    price: Number,
    close: Boolean,
    location:{
        latitude: String,
        longitude: String
    },
    dayTime:{
        monday:{open: String,close: String},
        tuesday:{open: String,close: String},
        wednesday:{open: String,close: String},
        thursday:{open: String,close: String},
        friday:{open: String,close: String},
        saturday:{open: String,close: String},
        sunday:{open: String,close: String},
        holiday:{open: String,close: String}
    },
    images: [String],
    totalRatings: Number,
    cantRatings: Number,
    stars: Number,
    menu: [{ type: mongoose.Types.ObjectId, ref: 'category' }],
    comments: [{
        comment: String, 
        point: Number,
        date: Date,
        author: { type: mongoose.Types.ObjectId, ref: 'user' }
    }]
})

RestaurantSchema.plugin(mongoosePaginate)
const Restaurant = mongoose.model('Restaurant', RestaurantSchema)

module.exports = Restaurant;