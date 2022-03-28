const jwt = require('jsonwebtoken')
const Auth = require('../model/model.auth')

const verifyToken = async (req,res,next)=>{
    
    const token= req.headers.authorization.split(" ")
    // const token = req.cookie('JWT')
    // console.log("Token",req.cookies)
    try
    {
        // console.log("INSIDE VERIFY TOKEN",token[1])
        const user = jwt.verify(token[1],process.env.REACT_APP_SECRETKEY)
        // console.log(user)
        const rootUser = await Auth.findOne({_id:user.id})
        // console.log('Root',rootUser)
        if(!rootUser)
        {
            throw new Error("User not found")
        }
        req.token = token[1]
        req.rootUser = rootUser
        req.userId = rootUser._id
        next()
    }
    catch(err)
    {
        res.status(400).send({
            success:false,
            message:"Unauthenticated Request. Please Login Again "
        })
    }
}

module.exports = verifyToken;