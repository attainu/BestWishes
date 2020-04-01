const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const privatekey = require('../password')

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
    status:{
        type:String,
        default:"inactive"
    },
    venue_id: [
        {
            type: Schema.Types.ObjectId,
            ref: "venues"
        }
    ],
    tokens: [{
        token: {
            type:
            {
                String,
                required:true
            }
        }
    }]

},
    { timestamps: true }
);


providersSchema.pre("save", function (next) { // A middleware use so that we can hash a password here only
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
// providersSchema.methods.generatetoken = async function () {
//     const providers=this
//     const token = jwt.sign({ id: providers._id }, privatekey, { expiresIn: 60 * 30 })
//     providers.tokens=providers.tokens.concat({token})
//     await providers.save()
//     return token
// }

const Providers = mongoose.model("providers", providersSchema)
module.exports = Providers

