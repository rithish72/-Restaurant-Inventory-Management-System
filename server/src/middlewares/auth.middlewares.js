import jwt from 'jsonwebtoken';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { user } from '../models/user.models.js';

export const verifyJWT = (req, _, next) => {
    try {
        
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
}