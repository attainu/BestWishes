const providers=require('./providers')
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const venuesSchema=new Schema({
    name:{type:String,required:["please enter"]}
})