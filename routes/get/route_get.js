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
module.exports=router