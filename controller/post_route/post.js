const Users = require('../../models/users')
const Providers=require('../../models/providers')
const bcrypjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const privatekey=require('../../password')
module.exports = {
    registeruser: (req, res) => {
        const usersobj = new Users({ ...req.body }) // cloning the data so that no memory reference issue
        usersobj.save((err, doc) => { 
            if (err) {
                console.log("error of registration" + err)
            }
            else {
                console.log(usersobj)
                res.json(doc).status(200)
            }

        })
    },

  registerprovider:(req,res)=>{

    const providersobj = new Providers({ ...req.body })
    providersobj.save((err, doc) => {
        if (err) {
            console.log("error of registration" + err)
        }
        else {
            console.log(providersobj)
            res.json(doc).status(200)
        }

    })
},
loginprovider:async(req,res)=>{
let email=req.body.email
let password=req.body.password
if(!email || !password){
    return res.status(403).send("incorrect crediential")
}
//checking if email exist
const provider=await Providers.findOne({email:email})
if(!provider)res.send("invalid email").status(403)
// password is correct
const validpass=await bcrypjs.compare(password,provider.password)
if(!validpass)res.send("invalid email").status(403)

const token=jwt.sign({_id:provider._id},privatekey,{expiresIn:60*10})
console.log(token)
 res.header('auth-token',token).send("login sucess")

//res.send("success login").status(200)
    
  },


}

  
