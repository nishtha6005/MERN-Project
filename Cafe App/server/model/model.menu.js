const mongoose = require('mongoose')

let MenuSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String
    },
    price:{
        type:Number,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    menuCreatedTime:{
        type:Date,
        // default:Date.now()
    },
    menuUpdateTime:{
        type:Date,
        // default:Date.now()
    }
})

module.exports = mongoose.model('menu',MenuSchema)