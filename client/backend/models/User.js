const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    preferences: { type:String }, 
    profileImage: { type: Buffer},
    profileImageType: { type: String}

});

UserSchema.methods.profileImagePath = function () {

    if (this.profileImage != null && this.profileImageType != null) {
        return `data:${this.profileImageType};charset=utf-8;base64,${this.profileImage.toString('base64')}`;
    }
    return null;
    
};

const User = mongoose.model('User', UserSchema);

module.exports = User;