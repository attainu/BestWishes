const {Users,Booking} = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
const Admin=require('../../models/admin')
const bcrypjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const privatekey = require('../../password')
const transporter = require("../mailTransporter")
const instance = require("../../razorpay")
const { v4: uuid } = require("uuid");
const createSignature = require("../../createSignature")



module.exports = {
    registeruser: (req, res) => {
        const usersobj = new Users({ ...req.body }) // cloning the data so that no memory reference issue
        usersobj.save((err, doc) => {
            if (err) {
                console.log("error of registration" + err)
            }
            else {
                console.log(usersobj)
                // creating token with array of Client Name and Client pass
                token = jwt.sign({data: [req.body.name,req.body.email]},'secret', { expiresIn: '1h' })
                
                // sending email with nodemailer
                transporter.sendMail({
                    from:"js903783@gmail.com",
                    to: req.body.email, 
                    subject: "Account activation link",
                    html: "<h1>hello "+req.body.name+",here is you activation link</h1><br><a href='http://localhost:7000/activateClient/"+token+">Activate account</a>" // html body
                },(err,info)=>{
                    if(!err){return res.status(200).send(
                        {
                            message:"registered successfully",
                            activationLink:"http://localhost:7000/activateClient/"+token,
                            data:doc
                        })}else{
                            return res.send({message:err})
                        }
                });
            }

        })
    },
    forgotPass:(req,res)=>{
        const token = jwt.sign({data:req.body.email},privatekey, { expiresIn: '1h' })
        transporter.sendMail({
            from:"js903783@gmail.com",
            to:req.body.email,
            subject:"Password reset link",
            html:"<h1>Click the link to reset you password</h><br>"+
                "<a href='http://localhost:7000/reset/"+token+">Click here</a>"
        })
        res.send({message:"reset link sent to your email"})
    },
    forgotPassClient:(req,res)=>{
        const token = jwt.sign({data:req.body.email},privatekey, { expiresIn: '1h' })
        
        transporter.sendMail({
            from:"js903783@gmail.com",
            to:req.body.email,
            subject:"Password reset link",
            html:"<h1>Click the link to reset you password</h><br>"+
                "<a href='http://localhost:7000/resetClient/"+token+">Click here</a>"
        })
        res.send({
            message:"reset link sent to your email",
            link:"http://localhost:7000/resetClient/"+token+">Click here</a>"})
    },
    // reset password is happening here for client with token varification
    resetTokenClient:(req,res)=>{
        try {
            var decoded = jwt.verify(req.params.token, privatekey);
            Users.findOne({email:decoded.data})
            .then(data=>{
                dataHash = bcrypjs.hashSync(req.body.password,10)
                Users.updateOne({email:decoded.data},{$set:{password:dataHash}})
                .then(()=>{res.status(202).send({message:"password reset succesfull"})})
                .catch(err=>res.status(400).send({message:err}))
            })
        } catch(err) {
            if(err.name =="TokenExpiredError")return res.send(400,{message:"invalid token"})
            return res.status(400).send({message:err})
        } 
            
    },
    // reset password is happening here for provider with token varification
    resetToken:(req,res)=>{
        try {
            var decoded = jwt.verify(req.params.token, privatekey);
            Provider.findOne({email:decoded.data})
            .then(data=>{
            dataHash = bcrypt.hashSync(data.pass,10)
            Provider.updateOne({email:decoded.data},{$set:{pass:dataHash}})
            .then(()=>{res.status(202).send({message:"password reset succesfull"})})
            .catch(err=>res.status(400).send({message:err}))
        })
        } catch(err) {
            if(err.name =="TokenExpiredError")return res.send(400,{message:"invalid token"})
            return res.send(400,{message:err})
        }
    },
    loginuser:async(req,res)=>{
        let email = req.body.email
        let password = req.body.password
        if (!email || !password) {
            return res.status(403).send("incorrect crediential")
        }
        //checking if email exist
        const user = await Users.findOne({ email: email })
        if (!user) return res.send("invalid email").status(403)

        if(user.status =="inactive"){return res.status(401).json({message:"activate your account first"})}
        // password is correct
        const validpass = await bcrypjs.compare(password, user.password)
        if (!validpass) res.send("invalid password").status(403)

        const token = jwt.sign({ _id: user._id }, privatekey)
        user.tokens=user.tokens.concat({token})
        console.log(token)
        await user.save()
        return res.status(200).send({message:"login sucess"})
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

        // check the status of provider
        if(user.status =="inactive"){return res.status(401).json({message:"activate your account first"})}
        
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
        console.log(res.payload)
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

    },
    admin_remove_user:async(req,res)=>{
            try {
            
                const payload_id = res.payload._id
                const admin = await Users.findById({ _id: payload_id })
                if (admin.Isadmin === true) {
                    const del= req.header('id')
                    let remove=await Users.findByIdAndDelete({_id:del})
                    return res.status(200).json(remove)
                
                }
                else{
                    res.status(500).json("only for admin")
                }
            }
            catch (error) {
                res.status(400).json(error)
            }     
    },
    admin_remove_provider:async(req,res)=>{
        try {
            
            const payload_id = res.payload._id
            const admin = await Users.findById({ _id: payload_id })
            if (admin.Isadmin === true) {
                const del= req.header('id')
                let remove=await Providers.findByIdAndDelete({_id:del})
                return res.status(200).json("sucessfully remove from website")
            
            }
            else{
                res.status(500).json("only for admin")
            }
        }
        catch (error) {
            res.status(400).json(error)
        }     
    },
    createOrder:(req,res)=>{
        const auth=req.header('auth-token')
        const something=jwt.verify(auth,privatekey)
        try{
            Venues.find({_id:something}) 
            .then(data=>{
                if(data){
                    newOrder = new Booking({userid:something,
                                        productId:req.body.productId})
                    newOrder.save().then(()=>res.status(201).send(
                        {
                            message:"order created successfully",
                            process:"login to below link to chechout your product",
                            link: "http://localhost:5000/login"
                        }
                    ))
                }else{
                    res.send("failed")
                }
            }).catch(err=>{
                if(err.name == "CastError"){
                    res.status(403).send({message:"invalid productId"})
                }else{
                    res.status(403).send(err)
                }
            })
        }catch(err){
            res.send(err)
        }
        
    },
    checkoutLogin:(req,res)=>{
        if(req.body.email){
            if(req.body.pass){
                Users.findOne({email:req.body.email})
                .then(data=>{
                    const somevar = bcrypjs.compare(req.body.pass, data.password)
                    .then(some=>{
                        if(some){
                            return res.status(200).json({id:data.id,name:data.name})
                        }else{
                            return res.status(401).json({message:"wrong credentials"})
                        }
                    })
                    
                    
                })
            }
        }else{return res.status(401).send({message:"invalid credentials"})}
        
    },
    order2:(req,res)=>{
        Booking.find({userid:req.body.userid, status:"incomplete"})
        .populate("productId")
        .then(data=>{
            // console.log(data)
            res.send(data)})
    },
    // routes for razorpay order creation
    chekcout:async (req, res)=>{
        const { user, amountInPaise, currency } = req.body;
        const transactionId = uuid();
        const orderOptions = {
            currency,
            amount: amountInPaise,
            receipt: transactionId,
            payment_capture: 0
        };
        try {
            const order = await instance.orders.create(orderOptions);
            const transaction = {
            _id: transactionId,
            user,
            order_value: `${amountInPaise / 100} INR`,
            razorpay_order_id: order.id,
            razorpay_payment_id: null,
            razorpay_signature: null,
            isPending: true
            };
            res.status(201).json({
            statusCode: 201,
            orderId: order.id,
            name: user,
            amount: transaction.order_value
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({ statusCode: 500, message: "Server Error" });
        }
    },
    checkoutVerify:async (req, res) => {
        const {
          amount,
          currency,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        } = req.body;
        try {
         const captureResponse = await instance.payments.capture(
            razorpay_payment_id,
            amount,
            currency
          );
          res.json({message:"payment complete"});
        } catch (err) {
          res.status(500).send({ statusCode: 500, message: "Server Error" });
        }
      },
      orderUpdate:(req,res)=>{
          console.log("order updated")
          Booking.updateOne({"_id":req.body.id},{$set:{status:"complete"}})
          .then(()=>res.status(200).json({message:"order updated successfully"}))
          .catch(err=>{
                res.status(400).json({"error":err})
            })
        }
   


}


