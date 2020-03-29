const Providers = require('./providers')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const venuesSchema = new Schema({
    venuename: {
        type: String,
        required:true,
    },
    category:{
       type:String,maxlength:10,
       required:true, 
    },
    charges:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    provider:{
        type:Schema.Types.ObjectId,
        ref:"providers",
    },
    review:{
        type:String,maxlength:50,
        required:true
    },
    booking:[{
            type:Schema.Types.ObjectId,
            ref:"booking"
    }],
    capacity:{
        type:Number,
        required:true
    },
    venueimg:{
        type:String,
        required:false
    }
})
const Venues=mongoose.model('venues',venuesSchema)
module.exports=Venues