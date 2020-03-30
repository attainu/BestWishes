const mongoose=require('mongoose')
const Schema=mongoose.Schema
const bcryptjs=require('bcryptjs')
const adminsSchema=new Schema({
name:{
    type:String,
    required:true
},
email:
{
    type:String,
    required:[true,"please enter the email"],
    unique:true
},
password:
{
    type:String,
    required:[true,"please enter the password"]
},
tokens: [{
    token: {
        type:
        {
            String,
            required:true
        }
    },
},
{timestamps:true}
]
})
adminsSchema.pre("save", function (next) { // A middleware use so that we can hash a password here only
    if (this.isModified("password")) // this is use ,so that we can do not hash twice
    {
        bcryptjs
            .hash(this.password, 10)
            .then((hashpassword) => {
                this.password = hashpassword
                console.log(this.password)
                next()
            })
            .catch((err) => {
                console.log("error in userjs" + err)
            })
    }
    else {
        next()
    }
})








const Admin=mongoose.model("admins",adminsSchema)
module.exports=Admin