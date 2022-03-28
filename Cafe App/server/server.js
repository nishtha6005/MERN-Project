require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser=require('body-parser')
const auth = require('../server/route/route.auth')
const menu = require('../server/route/route.menu')
const cookieParser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use('/public',express.static('public'))

app.use('/auth',auth)
app.use('/menu',menu)

mongoose.connect(process.env.MONGOURL)
.then(
    console.log("Mongoose Connected")
)
.catch(error=>{
    console.log(error)
})

mongoose.Promise = global.Promise

mongoose.connection.on('error',console.error.bind(console,'MongoDB Connection Error'))

app.listen(process.env.SERVERPORT,()=>{
    console.log(`Server is running on port ${process.env.SERVERPORT}`)
})