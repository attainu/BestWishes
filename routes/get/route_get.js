const authenticate=require('../../middleware/authenticate')
const router=require('express').Router()
router.get('/home',authenticate,(req,res)=>{
    res.send("welcome to protected route")
})

module.exports=router