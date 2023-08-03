import bcrypt from 'bcryptjs'
import 'dotenv/config'
import mongoose from 'mongoose'
import validator from 'validator'
import { USER } from '../constants'

const {Schema}= mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        validate:[validator.isEmail,"Please provide a valid email"]
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate:{
            validator:(value)=>{
            return /^[A-z][A-z0-9-_]{3,23}$/.test(value)
        },
        message:"Please provide an alphanumberic name. Special characters not allowed. '-' and '_' are allowed."
    }},
    firstName:{
        type:String,
        required:true,
        trim:true,
        validate:[validator.isAlphanumeric,"First name can be alphanumeric .Special characters not allowed."]
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        validate:[validator.isAlphanumeric,"Last name can be alphanumeric .Special characters not allowed."]
    },
    password:{
        type:String,
        select:false,
        validate:[validator.isStrongPassword,"Password must be atleast 8 characters long. And must contains atleast one uppercase , lowercase , digit and symbols."]
    },
    passwordConfirm:{
        type:String,
        validate:{
            validator:(value)=>{
                return value === this.password
            },
            message:"Passwords mismatch !!!"
        }
    },
    isEmailVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    provider:{
        type:String,
        required:true,
        default:email
    },
    googleID:String,
    avatar:String,
    businessName:String,
    phoneNumber:{
        type:String,
        default:"+91987654321",
        validate:[validator.isPhoneNumber,"Invalid phone number"]
    },
    address:String,
    city:String,
    country:String,
    passwordChangedAt:Date,
    roles:{
        type:[String],
        default:[USER]
    },
    active:{
        type:Boolean,
        default:true
    },
    refreshToken:[String]
},
{
    timestamps:true
})


userSchema.pre("save",async(next)=>{
    if(this.role.length === 0){
        this.role.push(USER);
        next();
    }
});


userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt);

    this.passwordConfirm = undefined;
    next();
})


userSchema.pre("save",async(next)=>{
    if(!this.isModified("password") || this.isNew){
        return next();
    }
    this.passwordChangedAt = Date.now();
    next();
})


userSchema.methods.comparePassword = async (givenPassword)=>{
    return await bcrypt.compare(givenPassword,this.password);
};

const User = mongoose.model("User",userSchema);

export default User;