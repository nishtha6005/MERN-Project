const jwt = require('jsonwebtoken')
const Auth = require('../model/model.auth')

const verifyAdmin = async (req,res,next)=>{
    // const token = req.body.token || req.query.token || req.headers["x-access-token"]
    // if (!token)
    // {
    //     res.status(400).send({
    //         success:false,
    //         message:"Please Login"
    //     })
        
    // }
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
        // const decoded = jwt.verify(token,process.env.REACT_APP_SECRETKEY)
        // req.user=decoded
        // console.log('x',x)
        // Auth.findById({_id:x.id})
        // .then(result=>{
        //     if(result.isAdmin)
        //         next()
        //     else
        //     {
        //         res.status(400).send({
        //             success:false,
        //             message:"Verification Failed"
        //         })
        //     }
        // })
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