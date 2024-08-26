const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitSchema = new Schema({
    outfitName: { type: String, required: true },
    temperatureRange: { type: String, required: true },
    weatherType: { type: String, required: true},
    items: [String],
    image: { type: Buffer},
    imageType: { type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

OutfitSchema.methods.imagePath = function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`;
    }
    return null;
};


const Outfit = mongoose.model('Outfit', OutfitSchema);

module.exports = Outfit;