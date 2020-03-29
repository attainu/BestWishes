const Users = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
const bcrypjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const privatekey = require('../../password')




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
    loginuser:async(req,res)=>{
        let email = req.body.email
        let password = req.body.password
        if (!email || !password) {
            return res.status(403).send("incorrect crediential")
        }
        //checking if email exist
        const user = await Users.findOne({ email: email })
        if (!user) res.send("invalid email").status(403)
        // password is correct
        const validpass = await bcrypjs.compare(password, user.password)
        if (!validpass) res.send("invalid password").status(403)

        const token = jwt.sign({ _id: user._id }, privatekey, { expiresIn: 60 * 10 })
        user.tokens=user.tokens.concat({token})
        console.log(token)
      await user.save()
      //   res.header('auth-token', token).send("login sucess")
            return res.status(200).send("login sucess")
    },
    logoutuser:async (req,res)=>{
        try{
            const id=res.payload._id
            let logoutuser =await Users.findById({_id:id})
            console.log(logoutuser.tokens)
            logoutuser.tokens.splice(0,logoutuser.tokens.length)
            await logoutuser.save()
           return res.status(200).send("logout sucess")
            }
            catch (error){
                 return   res.status(500).send(error)
            }
    
    },

    registerprovider: (req, res) => {

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
    loginprovider: async (req, res) => {
        let email = req.body.email
        let password = req.body.password
        if (!email || !password) {
            return res.status(403).send("incorrect crediential")
        }
        //checking if email exist
        const provider = await Providers.findOne({ email: email })
        if (!provider) res.send("invalid email").status(403)
        // password is correct
        const validpass = await bcrypjs.compare(password, provider.password)
        if (!validpass) res.send("invalid email").status(403)

        const token = jwt.sign({ _id: provider._id }, privatekey,/* { expiresIn: 60 * 10 }*/)
        provider.tokens=provider.tokens.concat({token})
       // console.log(token)
      await provider.save()
      //   res.header('auth-token', token).send("login sucess")
            return res.status(200).send("login sucess")

        //res.send("success login").status(200)

    },
    logoutprovider:async(req,res)=>{
        try{
        const id=res.payload._id
        let logoutuser =await Providers.findById({_id:id})
        console.log(logoutuser.tokens)
        logoutuser.tokens.splice(0,logoutuser.tokens.length)
        await logoutuser.save()
       return res.status(200).send("logout sucess")
        }
        catch (error){
             return   res.status(500).send(error)
        }

    },
    venue:async (req, res) => {
        const venueimg=req.file.path
        console.log("hrt",venueimg)
        const id = res.payload._id
        const a = await Providers.findById({ _id: id })
       
        const venues = new Venues({ ...req.body,venueimg})
      
        
        // now wiring the venues and providers
        venues.provider = id // in the venues schema we have provided the providers id
        a.venue_id.push(venues._id);// in  the provider schema we have given the venues id 
        // in the above 2 line we just have swap both id with each other for connection
        a.save((err,doc)=>{
            if(err){
                console.log("error in wiring",err)
            }
            else{
                console.log("sucess")
            }
        })
        venues.save((err,doc)=>{
            if(err)console.log("error in venues",err)
            else res.status(200).send(doc)
        })

    }


}


