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
        let {username,email,password,isAdmin} = request.body
        if (username && email && password)
        {
            const query = {email:email}
            const existingUser = await Auth.findOne(query)
            const existingUsername = await Auth.findOne({username:username})

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
        else
        {
            response.status(400).send({
                message:'Please fill out all the fields',
            })
        }
    }
    catch(err)
    {
        console.log(err)
        response.status(400).send({ 
            success: false 
        });
    }
}

exports.signin = async (request,response)=>{
    try
    {
        const {email,password} = request.body
        if(email && password)
        {
            const userExists = await Auth.findOne({email:email})

            if(! userExists)
            {
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
                    // response.cookie("JWT",token, {
                    //     // EXPIRES IN 10 Minutes
                    //     expires:new Date(Date.now() + 600000),
                    //     httpOnly :true
                    // })

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
        else
        {
            response.status(400).send({
                message:'Please fill out all the fields',
            })
        }
    }
    catch(err)
    {
        console.log(err)
        response.status(400).send({ 
            success: false 
        });
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



