import { USER,ADMIN } from "../constants/index.js";

const ROLE = {
    User:USER,
    Admin:ADMIN
}

const checkRole = (...allowedRoles)=>{
    return(req,res,next)=>{
        if(!req?.user || !req?.roles){
            res.status(401);
            throw new Error("You are not authorized to use our platform");
        }

        const rolesArray = [...allowedRoles]
        const roleFound = req.roles
        .map((role)=>rolesArray.includes(role))
        .find((value)=>value === true)

        if(!roleFound){
            res.status(401);
            throw new Error("You are not authorized to platform this request");
        }
        next();
    }
}

const role = {ROLE,checkRole}

export default role;