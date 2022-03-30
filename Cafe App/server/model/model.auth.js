const mongoose = require('mongoose')

let AuthSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    userCreatedTime:{
        type:Date
    }
})

module.exports = mongoose.model('User',AuthSchema)