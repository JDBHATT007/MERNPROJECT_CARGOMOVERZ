const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const config=require('config')
const express=require('express')
const User = require('../../models/User')
const router=express.Router()

router.post('/',(req,res)=>{
    const {email,password,token}=req.body;

    

    // Simple validation

    if(!email || !password){
        return res.json({'msg':'Please enter all data...',success:false})
    }

    // Check user

    User
        .findOne({email})
        .then(user=>{
            if(!user){
                return res.json({'msg':'User does not exists...',success:false})
            }

            // Validate password

            bcrypt
                .compare(password,user.password)
                .then(isMatch=>{
                    if(!isMatch){
                        return res.json({'msg':'Invalid Credentials...',success:false})
                    }

                    jwt.sign(
                        {id:user.id},
                        config.get('jwtSecret'),
                        {expiresIn:3600},
                        (err,token)=>{
                            if(err) throw err;
                            res.json({
                                token,
                                user:{
                                    id:user.id,
                                    name:user.name,
                                    email:user.email
                                },
                                success:true
                            })
                        }
                    )
                })
        })
    
})

module.exports=router;