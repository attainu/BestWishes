const { Users, Booking } = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
const bcrypjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const privatekey = require('../../password')
const transporter = require("../mailTransporter")
const instance = require("../../razorpay")
const { v4: uuid } = require("uuid");
const createSignature = require("../../createSignature")
const AppError = require('../../utils/apperror')

const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
module.exports = {
    registeruser: catchAsync(async (req, res, next) => {
        const usersobj = new Users({ ...req.body }) // cloning the data so that no memory reference issue
        usersobj.save((err, doc) => {
            if (err) return next(new AppError(err, 403))
            else {
               // console.log(usersobj)
                // creating token with array of Client Name and Client pass
                token = jwt.sign({ data: [req.body.name, req.body.email] }, 'secret', { expiresIn: '1h' })
                // sending email with nodemailer
                transporter.sendMail({
                    from: "js903783@gmail.com",
                    to: req.body.email,
                    subject: "Account activation link",
                    html: "<h1>hello " + req.body.name + ",here is you activation link</h1><br><a href='http://localhost:7000/activateClient/" + token + ">Activate account</a>" // html body
                }, (err, info) => {
                    if (!err) {
                        return res.status(200).send(
                            {
                                message: "registered successfully",
                                activationLink: "http://localhost:7000/activateClient/" + token,
                                data: doc
                            })
                    } else {
                        return next(new AppError(err, 401))
                    }
                });
            }

        })
    }),
    forgotPass_Prrovider: catchAsync(async (req, res, next) => {

        const email = req.body.email
        let response = await Providers.findOne({ email: email })
        if (response) {
            const token = jwt.sign({ data: req.body.email }, privatekey, { expiresIn: '1h' })

            transporter.sendMail({
                from: "js903783@gmail.com",
                to: req.body.email,
                subject: "Password reset link",
                html: "<h1>Click the link to reset you password</h><br>" +
                    "<a href='http://localhost:7000/resetClient/" + token + ">Click here</a>"
            })
            res.send({
                message: "reset link sent to your email",
                link: "http://localhost:7000/reset/" + token + ">Click here</a>"
            })
        }
        return next(new AppError("The email id enter is invalid", 404))
    }),

    forgotPassClient: catchAsync(async (req, res, next) => {
        const email = req.body.email
        let response = await Users.findOne({ email: email })
        if (response) {
            const token = jwt.sign({ data: req.body.email }, privatekey, { expiresIn: '1h' })

            transporter.sendMail({
                from: "js903783@gmail.com",
                to: req.body.email,
                subject: "Password reset link",
                html: "<h1>Click the link to reset you password</h><br>" +
                    "<a href='http://localhost:7000/resetClient/" + token + ">Click here</a>"
            })
            res.send({
                message: "reset link sent to your email",
                link: "http://localhost:7000/resetClient/" + token + ">Click here</a>"
            })
        }
        return next(new AppError("The email id enter is invalid", 404))
    }),
    // reset password is happening here for client with token varification
    resetTokenClient: catchAsync(async (req, res, next) => { // reset thing for user

        var decoded = jwt.verify(req.params.token, privatekey);
         await Users.findOne({ email: decoded.data })
            const dataHash = bcrypjs.hashSync(req.body.password, 10)
            const response = await Users.updateOne({ email: decoded.data }, { $set: { password: dataHash } })
            if (response) {
                return res.status(202).send("password reset succesfull")
            }
            else return next(new AppError("Something went wrong", 400))
        
    

    }),
    // reset password is happening here for provider with token varification
    resetToken_Provider: catchAsync(async(req, res,next) => {
        var decoded = jwt.verify(req.params.token, privatekey);
             await Providers.findOne({ email: decoded.data })
            const dataHash = bcrypjs.hashSync(req.body.password, 10)
            const response = await Providers.updateOne({ email: decoded.data }, { $set: { password: dataHash } })
            if (response) {
                return res.status(202).send("password reset succesfull")
            }
            else return next(new AppError("Something went wrong", 400))
        
    
    }),
    loginuser: catchAsync(async (req, res, next) => {
        let email = req.body.email
        let password = req.body.password
        if (!email || !password) return next(new AppError("incorrect crediential", 403))

        //checking if email exist
        const user = await Users.findOne({ email: email })
        if (!user) next(new AppError("email id is not valid", 403))

        // checking if user is activate or not
        if (user.status == "inactive")
            return next(new AppError("activate your account first", 403))

        // password is correct
        const validpass = await bcrypjs.compare(password, user.password)
        if (!validpass) return next(new AppError("invalid password", 403))

        const token = jwt.sign({ _id: user._id }, privatekey,{expiresIn:'1h'})
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return res.status(200).send({ message: "login sucess" })
    }),

    logoutuser: catchAsync(async (req, res) => {
        const id = res.payload._id
        let logoutuser = await Users.findById({ _id: id })
        console.log(logoutuser.tokens)
        logoutuser.tokens.splice(0, logoutuser.tokens.length)
        await logoutuser.save()
        return res.status(200).send("logout sucess")
    }),

    registerprovider: catchAsync(async (req, res, next) => {
        //     const providersobj = new Providers({ ...req.body })
        //  await providersobj.save()
        //  return res.status(200).send("provider save sucessfully")

        const providersobj = new Providers({ ...req.body })
        providersobj.save((err, doc) => {
            if (err) return next(new AppError(err, 402))
            else {
                token = jwt.sign({ data: [req.body.name, req.body.email] }, 'secret', { expiresIn: '1h' })

                // sending email with nodemailer
                transporter.sendMail({
                    from: "js903783@gmail.com",
                    to: req.body.email,
                    subject: "Account activation link",
                    html: "<h1>hello " + req.body.name + ",here is you activation link</h1><br><a href='http://localhost:7000/activate/" + token + ">Activate account</a>" // html body
                }, (err, info) => {
                    if (!err) {
                        return res.status(200).send(
                            {
                                message: "registered successfully",
                                activationLink: "http://localhost:7000/activate/" + token,
                                data: doc
                            })
                    } else {
                        return res.send({ message: err })
                    }
                });
            }

        })



    }),

    loginprovider: catchAsync(async (req, res, next) => {
        let email = req.body.email
        let password = req.body.password
        if (!email || !password) return next(new AppError("incorrect crediential", 403))

        //checking if email exist
        const provider = await Providers.findOne({ email: email })
        if (!provider) next(new AppError("email id is not valid", 403))

        // checking if user is activate or not
        if (provider.status == "inactive")
            return next(new AppError("activate your account first", 403))

        // password is correct
        const validpass = await bcrypjs.compare(password, provider.password)
        if (!validpass) return next(new AppError("invalid password", 403))

        const token = jwt.sign({ _id: provider._id }, privatekey,{expiresIn:'1h'})
        provider.tokens = provider.tokens.concat({ token })
        console.log(token)
        await provider.save()
        return res.status(200).send({ message: "login sucess" })
    }),
    logoutprovider: catchAsync(async (req, res, next) => {
        const id = res.payload._id
        let logoutuser = await Providers.findById({ _id: id })
        console.log(logoutuser.tokens)
        logoutuser.tokens.splice(0, logoutuser.tokens.length)
        await logoutuser.save()
        return res.status(200).send("logout sucess")
    }),
    venue: async (req, res, next) => {
        const venueimg = req.file.path
      
        const id = res.payload._id
        const a = await Providers.findById({ _id: id })

        const venues = new Venues({ ...req.body, venueimg })
        venues.validate(function(err){
            if(err)return next(new AppError(err),404)
        else{
        // now wiring the venues and providers
        venues.provider = id // in the venues schema we have provided the providers id
        a.venue_id.push(venues._id);// in  the provider schema we have given the venues id 
        // in the above 2 line we just have swap both id with each other for connection
        a.save((err, doc) => {
            if (err) {
                return next(new AppError("there is a problem ",404))
            }
            else {
             //   console.log("sucess")
            }
        })
        venues.save((err, doc) => {
            if (err) return next(new AppError("there is a problem ",404))// console.log("error in venues", err)
            else res.status(200).send(doc)
        })
    }
    })
    },
    provider_update_venue: catchAsync(async (req, res, next) => {
        const providerid = res.payload._id
        console.log(providerid)
        let response = await Providers.findById({ _id: providerid })
        console.log(response)
        if (response) {
            let charges = req.body.charges
            let capacity = req.body.capacity
            let id = req.query.id
            Venues.updateMany(
                { _id: id }, { $set: { capacity: capacity, charges: charges } }).then(function (doc) {
                    res.status(200).send("update sucess")
                })

        }
        else return next(new AppError("not found Provider", 401))
    }),
    provider_delete_venue: catchAsync(async (req, res, next) => {
        const providerid = res.payload._id
       // const response = await Providers.findById({ _id: providerid })
        //console.log("entering the venues")
        //if (response) {
            let id = req.query.id
        Providers.findByIdAndUpdate(providerid, 
                { $pull: { venue_id: {$in:[id]} } }, 
                        function (err, doc) {
                        if (!err) {
                            Venues.deleteOne({_id:id},function(err,doc){
                                if(err)console.log(err)
                               else res.send({message:"sucessfully"})
                            })
                        } else {
                            return next(new AppError("Provider not found"))
                        }
                    })
        // }
        // else return next(new AppError("could not found out the provider",404))
    }),
    admin_remove_user: catchAsync(async (req, res, next) => {
        const payload_id = res.payload._id
        const admin = await Users.findById({ _id: payload_id })
        if (admin && admin.Isadmin === true) {
            const del = req.params.id
            let remove = await Users.findByIdAndDelete({ _id: del })
            if(remove){
                return res.status(200).json("sucessfully remove")
            }
            else return next(new AppError("could not found the User"))
        }
        else return next(new AppError("only for admin", 402))
    }),
    admin_remove_provider: catchAsync(async (req, res, next) => {
        const payload_id = res.payload._id
        const admin = await Users.findById({ _id: payload_id })
        if (admin && admin.Isadmin === true) {
            const del = req.params.id
             Providers.findById({ _id: del },function(err,doc){
                 if(err)return next(new AppError("could not found the provider"))
               else { 
                   doc.remove()
                  return res.status(200).json("sucessfully remove")
               }
             })
        }
        else return next(new AppError("only for admin", 402))

        
    }),
    createOrder:async (req, res, next) => {   
        const auth = req.header('auth-token')
        const something = jwt.verify(auth, privatekey)
        try {
            const venue = await Venues.findOne({_id:req.body.venueid})
            if(venue){
                const newOrder = new Booking({
                    userid:something,
                    productId:req.body.venueid
                })
                await newOrder.save()
                const user = await Users.findOne({_id:something})
                user.booking.push(newOrder._id)
                await user.save()
                return res.status(200).json({message:"order created successfully",user:user})
            }else{
                res.status(400).json({message:"invalid venueid"})
            }


            // Venues.find({ _id: something })
            //     .then(data => {
            //         if (data) {
            //             newOrder = new Booking({
            //                 userid: something,
            //                 productId: req.body.productId
            //             })
            //             newOrder.save().then(() => res.status(201).send(
            //                 {
            //                     message: "order created successfully"
            //                 }
            //             ))
            //         } else {
            //             res.send("failed")
            //         }
            //     }).catch(err => {
            //         if (err.name == "CastError") {
            //             res.status(403).send({ message: "invalid productId" })
            //         } else {
            //             res.status(403).send(err)
            //         }
            //     })
        } catch (err) {
            res.send(err)
        }

    },
    checkoutLogin: catchAsync(async (req, res, next) => {
        if (req.body.email) {
            if (req.body.pass) {
                const data = await Users.findOne({ email: req.body.email })
                if (data) {
                    const somevar = await bcrypjs.compare(req.body.pass, data.password)
                    if (somevar) {
                        return res.status(200).json({ id: data.id, name: data.name })
                    } else {
                        return next(new AppError("wrong credientials", 401))
                    }
                }
            }
        }
        else return next(new AppError("invalid credential", 401))
        // else{res.status(401).send({message:"invalid credentials"})}
        // .then(async(data)=>{
        //     const somevar = await bcrypjs.compare(req.body.pass, data.password)
        //     if(somevar){
        //         return res.status(200).json({id:data.id,name:data.name})
        //     }else{
        //         res.status(401).json({message:"wrong credentials"})
        //     }
        // })



    }),
    order2: catchAsync(async (req, res, next) => {
        let data = await Booking.find({ userid: req.body.userid, status: "incomplete" })
            .populate("productId")
            res.send(data)
    }),
    // routes for razorpay order creation
    chekcout: catchAsync(async (req, res, next) => {
        const { user, amountInPaise, currency } = req.body;
        const transactionId = uuid();
        const orderOptions = {
            currency,
            amount: amountInPaise,
            receipt: transactionId,
            payment_capture: 0
        };
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
    }),
    checkoutVerify: catchAsync(async (req, res, next) => {
        const {
            amount,
            currency,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const captureResponse = await instance.payments.capture(
            razorpay_payment_id,
            amount,
            currency
        );
        res.json({ message: "payment complete" });
        // try {

        // } catch (err) {
        //   res.status(500).send({ statusCode: 500, message: "Server Error" });
        // }
    }),
    orderUpdate: catchAsync(async (req, res, next) => {
        console.log("order updated")
        await Booking.updateOne({ "_id": req.body.id }, { $set: { status: "complete" } })
        res.status(200).json({ message: "order updated successfully" })
        //   .then(()=>res.status(200).json({message:"order updated successfully"}))
        //   .catch(err=>{
        //         res.status(400).json({"error":err})
        //     })
    }),
    search: async (req, res, next) => {
        const search = req.query.search
        console.log(search)
        const limit = req.query.limit
        const skip = req.query.skip

        const query = await Venues.find(

            { $text: { $search: search } },
            { score: { $meta: "textScore" } }

        ).sort({ charges: -1 }).limit(parseInt(limit)).skip(parseInt(skip))
        console.log(query)
        console.log(query.length)
        if (query.length > 0) {
            return res.status(401).json(query)
        }
        else {
            return next(new AppError("please enter the valid venue name"))
        }
    }



}


