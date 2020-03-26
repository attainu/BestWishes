const post=require('../../controller/post_route/post')
const express=require('express')
const app=express()
const router=express.Router()
router.post('/registeruser',post.registeruser)
router.post('/provider',post.registerprovider)
router.post('/loginprovider',post.loginprovider)

module.exports=router