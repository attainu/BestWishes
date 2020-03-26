const mongoose=require('mongoose')
const bcryptjs=require('bcryptjs')
mongoose.connect("mongodb://127.0.0.1:27017/BestWishes",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
.then(()=>{
    console.log("Db connected sucessfully")
})
.catch((err)=>{
console.log("error message",err)
})







