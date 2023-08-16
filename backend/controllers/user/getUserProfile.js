import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js' 

const getUserProfile = asyncHandler(async(req,res)=>{
    console.log(req.user)
    const userId = req.user._id;

    const userProfile = await User.findById(userId,{
        refreshToken:0,
        roles:0,
        _id:0
    }).lean();

    if(!userProfile){
        res.status(204);
        throw new Error('User profile not found')
    }

    res.status(200).json({
        success:true,
        userProfile
    });
})

export default getUserProfile;