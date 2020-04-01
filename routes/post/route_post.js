const post=require('../../controller/post_route/post')
const express=require('express')
const authenticate=require('../../middleware/authenticate')
const upload=require('../../middleware/upload')
const router=express.Router()
router.post('/registeruser',post.registeruser)
router.post('/loginuser',post.loginuser)
router.post('/logoutuser',authenticate,post.logoutuser)
router.post('/provider',post.registerprovider)
router.post('/loginprovider',post.loginprovider)
router.post('/addvenues',authenticate,upload,post.venue)
router.post('/logoutprovider',authenticate,post.logoutprovider)
router.delete('/admin/removeuser',authenticate,post.admin_remove_user)
router.delete('/admin/removeprovider',authenticate,post.admin_remove_provider)
router.post("/forgotClient", post.forgotPassClient)
router.post("/forgot", post.forgotPass)
router.post("/reset/:token",post.resetToken)
router.post("/resetClient/:token", post.resetTokenClient)
router.post("/order",post.createOrder)
router.post("/checkoutLogin", post.checkoutLogin)
router.post("/order2",post.order2)
router.post("/checkout",post.chekcout)
router.post("/checkoutVerify", post.checkoutVerify)
router.post("/orderUpdate", post.orderUpdate)

// handling invalid route error
router.post("*",(req,res)=>{res.status(404).send({message:"page not found"})})
module.exports=router