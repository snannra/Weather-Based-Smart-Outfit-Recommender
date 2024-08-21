const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitSchema = new Schema({
    outfitName: { type: String, required: true },
    temperatureRange: { type: String, required: true },
    weatherType: { type: String, required: true},
    items: [{ type:String, required: true }]
})

const Outfit = mongoose.model('Outfit', OutfitSchema);

module.exports = Outfit;