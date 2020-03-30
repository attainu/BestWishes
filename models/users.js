const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema

const usersSchema = new Schema(
  {
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
    tokens: [{
      token: {
        type:
        {
          String,
          required: true
        }
      }
    }],
    Isadmin:{type:Boolean,
     default:false,
      
    }
  },

  { timestamps: true }
);

// usersSchema.statics.findByEmailAndPassword = function(email, password) {
//     var usersObj = null;
//     return new Promise(function(resolve, reject) {
//       User.findOne({ email: email })
//         .then(function(user) {
//           if (!user) reject("Incorrect credentials");
//           userObj = user;
//           return bcrypt.compare(password, user.password);
//         })
//         .then(function(isMatched) {
//           if (!isMatched) reject("Incorrect credentials");
//           resolve(userObj);
//         })
//         .catch(function(err) {
//           reject(err);
//         });
//     });
//   };
// usersSchema.statics.findByEmailAndPassword=(email,password)=>{
//     const usersObj=null;
//     return new Promise((resolve,reject)=>{

//     })
// }
usersSchema.pre("save", function (next) { // A middleware use so that we can hash a password here only
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
const Users = mongoose.model("users", usersSchema)
module.exports = Users