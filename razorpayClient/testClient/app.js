const express = require("express")
const session = require("express-session")
const store = require("session-file-store")(session)
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static("static"))

app.get("/",(req,res)=>{res.sendFile(__dirname+"/static/index.html")})

app.listen(8080,()=>console.log("sever started"))