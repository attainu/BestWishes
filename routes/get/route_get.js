const authenticate=require('../../middleware/authenticate')
const get=require('../../controller/get_route/get')
const router=require('express').Router()
router.get('/home',authenticate,(req,res)=>{
    res.send("welcome to protected route")
    console.log(res.provider)
    
})
router.get('/dashboard',get.dashboard)
module.exports=router