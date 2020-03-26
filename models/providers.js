const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema
const providersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    venue_id: [
        {
            type:Schema.Types.ObjectId,
            ref:"venues"
        }
    ]
},
    { timestamps: true }
);


providersSchema.pre("save",function(next){ // A middleware use so that we can hash a password here only
    if(this.isModified("password")) // this is use ,so that we can do not hash twice
    {
        bcryptjs
        .hash(this.password,10)
        .then((hashpassword)=>{
          this.password=hashpassword
          console.log(this.password)
          next()
        })
        .catch((err)=>{
            console.log("error in userjs"+err)
        })
    }
    else{
    next()
    }
  })

  const Providers=mongoose.model("providers",providersSchema)
  module.exports=Providers

