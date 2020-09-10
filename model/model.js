const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {type: String, required: true,},
    address: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    technologies: {type: String, required: true},
    degree: {type: String, required: true},
    experience: {type: Number, required: true},
    company: {type: String, required: true}
});

// Export the model
module.exports = mongoose.model('User', UserSchema);