const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
    gender:{
    type:String,
    enum:['Male','Female']
}
})

module.exports = mongoose.model('Personal',personalSchema)