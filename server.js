const express=require('express')
const app=express()
const post=require('./routes/post/route_post')
require('./models/db')

app.use(express.urlencoded({extended:false}))
app.use(post)

app.listen(7000,(err)=>{
if(err){
    return res.json(err).status(400)
}
console.log("server running")
})