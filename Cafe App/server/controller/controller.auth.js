const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Auth = require('../model/model.auth')
const axios = require('axios')

exports.signout = (request,response)=>{
    response.clearCookie("JWT")
    response.status(200).send({
        success:true,
        message:'User Logged Out'
    })
}

exports.signup = async (request,response)=>{
    try
    {
        const query = {email:request.body.email}
        const existingUser = await Auth.findOne(query)
        const existingUsername = await Auth.findOne({username:request.body.username})

        // CHECKING IF USER ALREADY EXISTS
        if (existingUser || existingUsername )
        {
            response.status(401).send({
                success:false,
                message:'User already exists'
            })
        }
        else
        {
            // ENCRYPTING THE PASSWORD USING BCRYPT HASH METHOD
            const encryptedPassword = await bcrypt.hash(request.body.password,10)

            const user = await Auth.create({
                username:request.body.username,
                email:request.body.email,
                password:encryptedPassword,
                isAdmin:request.body.isAdmin,
                userCreatedTime:Date.now()
            })
        
            // SENDING RESPONSE 
            response.status(200).send({
                success:true,
                message:'User Registered Successfully',
                user:user
            })
        }
    }
    catch(err)
    {
        console.log(err)
    }  
}

exports.signin = async (request,response)=>{
    try
    {
        const {email,password} = request.body
        const userExists = await Auth.findOne({email:email})

        if(! userExists)
        {
            console.log("INSIDE SIGIN")
            response.status(401).send({
                success: false,
                error: `Invalid User Details`,
            })
        }
        else
        {
            // COMPARING THE ENCRYPTED PASSWORD AND USER PASSWORD USING BCRYPT COMPARE METHOD
            const isMatch = await bcrypt.compare(password,userExists.password)
            
            // IF ENCRYPTED PASSWORD AND USER PASSWORD MATCHES
            if (isMatch)
            {
                // GENERATING UNIQUE TOKEN USING JWT
                const token = jwt.sign(
                    {
                        id:userExists._id,
                        isAdmin:userExists.isAdmin,
                        email:userExists.email
                    },
                    process.env.REACT_APP_SECRETKEY,
                    {
                        // EXPIRES IN 10 Minutes
                        expiresIn:'600s'
                    }
                )

                // ASSIGNING TOKEN GENERATED USING JWT TO THE USER 
                userExists.token = token

                // SETTING TOKEN INTO COOKIE
                response.cookie("JWT",token, {
                    // EXPIRES IN 10 Minutes
                    expires:new Date(Date.now() + 600000),
                    httpOnly :true
                })

                // SENDING RESPONSE 
                response.status(200).send({
                    success: true,
                    id:userExists.id,
                    token:userExists.token,
                    isAdmin:userExists.isAdmin,
                })
            }
            else
            {
                response.status(400).send({
                    success: false,
                    message: `Invalid user details`,
                }) 
            }
        }
    }
    catch(err)
    {
        // console.log(err)
    }
}

exports.getUserByEmail=(request,response)=>{
    let query={email:request.params.email}
    Auth.findOne(query)
    .then((findResult) => {
        response.status(200).send({ 
            success: true, 
            user: findResult
        });
    })
    .catch((err) => {
        response.status(400).send({ 
            success: false 
        });
    });
}

exports.getCurrentUser=(request,response)=>{
    const token = request.headers.authorization.split(" ")
    const decodedData = jwt.decode(token[1])

    axios.get(`http://localhost:8000/auth/get/${decodedData.email}`, 
        {
            headers: {
                authorization:`Bearer ${token}`
            },
        })
        .then((userResp) => {
            if (userResp.data.user === null) {
                response
                    .status(400)
                    .send({ success: false, message: "Invalid user" });
            }
            response
                .status(200)
                .send({ success: true, user: userResp.data.user });
        })
        .catch((err) => {
            response
                .status(400)
                .send({ success: false, message: "Please try again! 2" });
        });
}




// exports.signin =  (request,response)=>{
//     const query = {email:request.body.email}
//     const password = request.body.password

//     Auth.find(query)
//     .then(res=>{
//         if(bcrypt.compare(password,res[0].password))
//         {
//             // GENERATING UNIQUE TOKEN USING JWT
//             const token = jwt.sign(
//                 {
//                     id:res[0]._id,
//                     isAdmin:res[0].isAdmin,
//                     email:res[0].email
//                 },
//                 process.env.REACT_APP_SECRETKEY,
//                 {
//                     expiresIn:'600s'
//                 }
//             )

//             // ASSIGNING TOKEN GENERATED USING JWT TO THE USER 
//             res[0].token = token
//             response.status(200).send({
//                 success: true,
//                 token:res[0].token,
//                 isAdmin:res[0].isAdmin
//             })
//         }
//         else 
//         {
//             response.status(400).send({
//                 success: false,
//                 message: `Unauthenticated user 1`,
//             }) 
//         }
//     })
//     .catch(err=>{
//         response.status(401).send({
//             success: false,
//             error: `Unauthenticated user`,
//         })
//     })
// }


