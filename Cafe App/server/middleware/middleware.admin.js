const jwt = require('jsonwebtoken')
const Auth = require('../model/model.auth')

const verifyAdmin = async (req,res,next)=>{
    const token= req.headers.authorization.split(" ")
    try
    {
        const user = jwt.decode(token[1])
        if(user.isAdmin===true)
        {
            next()
        }
        else
        {
            res.status(400).send({
                success:false,
                message:"Unauthenticated Request"
            })
        }
    }
    catch(err)
    {
        res.status(400).send({
            success:false,
            message:"Unauthenticated Request. Please Login Again"
        })
    }
}

module.exports = verifyAdmin