import asyncHandler from 'express-async-aandler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const checkAuth = asyncHandler(async(req,res,next)=>{
    let jwtToken;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(authHeader && authHeader.startswith('Bearer ')){
        jwtToken = authHeader.split(" ")[1];

        jwt.verify(
            jwtToken,
            process.env.JWT_ACCESS_SECRET_KEY,
            async(err,decoded)=>{
                if(err){
                    return res.sendStatus(403);
                }
                const userId = decoded.id;
                req.user = await User.findById(userId).select("-password");
                req.roles = decoded.roles;

            }
        )
        next();
    }
    else{
        res.sendStatus(403);
    }
})

export default checkAuth;