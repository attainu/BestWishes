const authenticate=require('../../middleware/authenticate')
const get=require('../../controller/get_route/get')
const router=require('express').Router()
router.get('/home',authenticate,(req,res)=>{
    res.send("welcome to protected route")
    console.log(res.provider)
    
})
router.get('/dashboard',get.dashboard)
router.get('/adminuser',authenticate,get.admin_user_dashboard)
router.get('/adminprovider',authenticate,get.admin_provider_dashboard)
router.get("/activate/:token", get.activate)
router.get("/activateClient/:token", get.activateClient)
router.get("/resetClient",get.resetClient)
router.get("/reset",get.reset)
router.get("/order",authenticate,get.order)

// handling invalid route error
router.get("*",(req,res)=>{res.status(404).send({message:"page not found"})})
module.exports=router