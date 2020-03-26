const Users=require('../../models/users')
module.exports={
registeruser:(req,res)=>{
const usersobj= new Users({...req.body})
usersobj.save((err,doc)=>{
   if(err){
       console.log("error of registration"+err)
   } 
   else{
       console.log(usersobj)
   res.json(doc).status(200)
   }
  loginuser: 
})








}   
}