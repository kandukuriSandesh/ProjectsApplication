const mongoose = require('mongoose');


let clientModel = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phoneNo:{type:String},
    

})

module.exports = mongoose.model('Client',clientModel)