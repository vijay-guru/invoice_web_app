import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../../models/userModel.js'

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password} = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error('Please provide a valid email and password');
    }

    const existingUser = await User.findOne({email}).select("+password");

    if(!existingUser || !(await existingUser.comparePassword(password))) {
        res.status(401);
        throw new Error('Invalid Credentials');
    }
    if(!existingUser.isEmailVerified){
        res.status(400);
        throw new Error('You email is not verified . A verification email is sent you at the time of registration');
    }
    if(!existingUser.active){
        res.status(401);
        throw new Error('You account is inactivated . Please contact admin')
    }

    if(existingUser && (await existingUser.comparePassword(password))){

        const accessToken = jwt.sign({
            id:existingUser._id,
            roles:existingUser.roles
        },process.env.JWT_ACCESS_SECRET_KEY,{expiresIn:"1h"});

        const newRefreshToken = jwt.sign({
            id:existingUser._id,
            roles:existingUser.roles
        },process.env.JWT_REFRESH_SECRET_KEY,{expiresIn:"1d"});

        const cookies = req.cookies;

        let newRefreshTokenArray = !cookies?.jwt ? existingUser.refreshToken : existingUser.refreshToken.
        filter((refT)=>refT !== cookies.jwt);

        if(cookies?.jwt){
            const refreshToken = cookies.jwt;
            const existingRefreshToken = await User.findOne({refreshToken}).exec();

            if(!existingRefreshToken){
                newRefreshTokenArray = [];
            }

            const options = {
                httpOnly: true,
                maxAge:24*6*6*1000,
                secure:true,
                sameSite:"None"
            };

            res.clearCookie("jwt",options);

        }

        existingUser.refreshToken = [...newRefreshTokenArray,newRefreshToken];
            await existingUser.save();

            const options = {
                httpOnly: true,
                maxAge:24*6*6*1000,
                secure:true,
                sameSite:"None"
            };

            res.cookie("jwt",newRefreshToken,options);

            res.json({
                success: true,
                username:existingUser.username,
                firstName:existingUser.firstName,
                lastName:existingUser.lastName,
                provider:existingUser.provider,
                avatar:existingUser.avatar,
                accessToken
            })
    }
    else{
        res.status(401);
        throw new Error("Invalid credentials provided");
    }
})

export default loginUser;