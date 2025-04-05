import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { user } from '../models/user.models.js'

const userRegister = asyncHandler ((res, req) => {
    req.body = {name, email, password, role};

    if(!name){
        throw new ApiError(400, "Name is Required");
    }

    if(!email){
        throw new ApiError(400, "Email is Required");
    }

    if(!password){
        throw new ApiError(400, "Password is Required");
    }

    if(!role){
        throw new ApiError(400, "Role is Required");
    }

    
    
})