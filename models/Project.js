const mongoose = require('mongoose');

let projectSchema = new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    status:{
        type:String,
        enum:['Not Started','InProgress','Completed']
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client'
    }
})

module.exports  = mongoose.model('Project', projectSchema)