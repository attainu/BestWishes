const mongoose=require('mongoose')
const bcryptjs=require('bcryptjs')
// mongodb://127.0.0.1:27017/BestWishes
// mongodb+srv://js903783:apple4648@formfillup-zasik.mongodb.net/BestWishes?authSource=admin&replicaSet=formfillup-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true
mongoose.connect("mongodb+srv://js903783:apple4648@formfillup-zasik.mongodb.net/BestWishes?authSource=admin&replicaSet=formfillup-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true",{
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







