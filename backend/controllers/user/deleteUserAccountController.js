import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js' 

const deleteUserAccount = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);

    if(user){
        await User.deleteOne({_id:user._id},);

        res.json({
            success: true,
            message:`User ${user.firstName} was deleted successfully`
        })
    }
    else{
        res.status(400)
        throw new Error('User not found')
    }
})

export default deleteUserAccount;