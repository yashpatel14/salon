import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {pool} from "../db/index.js";
import bcrypt from "bcrypt";

// STEP 1: Create base user (mobile + GST)
const registerStep1 = asyncHandler(async(req,res)=>{
    const {mobile_number,gst_number} = req.body;

    if(!mobile_number){
        throw new ApiError(400,"Please provide mobile number")
    }

    const [result] = await pool.query(`INSERT INTO users(mobile_number,gst_number) VALUES(?,?)`,[mobile_number,gst_number]);

    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));

})

// STEP 2: Mobile OTP verification
const registerStep2 = asyncHandler(async(req,res)=>{
    const {user_id,otp} = req.body;

    if(!user_id || !otp){
        throw new ApiError(400,"Please provide user id and otp")
    }

    const [result] = await pool.query(`SELECT user_id,otp_code FROM otp_verifications WHERE user_id = ? AND otp_code = ? AND type = "mobile"`,[user_id,otp]);

    if(result.length === 0){
        throw new ApiError(400,"Invalid OTP")
    }

    await pool.query(`UPDATE users SET mobile_verified = 1 WHERE id = ?`, [user_id]);


    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully")); 
    
})

// STEP 3: Full name, email, password
const registerStep3 = asyncHandler(async(req,res)=>{
    const {user_id,full_name, email, password} = req.body;

    if(!user_id || !full_name || !email || !password){
        throw new ApiError(400,"Please provide user id and otp")
    }

    const hashPassword = await bcrypt.hash(password,10);

    const [result] = await pool.query(`UPDATE users SET full_name = ?, email = ?, password = ? WHERE id = ?`,[full_name,email,hashPassword,user_id]);


    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));
})

// STEP 4: Email OTP verification
const registerStep4 = asyncHandler(async(req,res)=>{
    const {user_id,otp} = req.body;

    if(!user_id || !otp){
        throw new ApiError(400,"Please provide user id and otp")
    }

    const [result] = await pool.query(`SELECT user_id,otp_code FROM otp_verifications WHERE user_id = ? AND otp_code = ? AND type = "email"`,[user_id,otp]);

    if(result.length === 0){
        throw new ApiError(400,"Invalid OTP")
    }

    await pool.query(`UPDATE users SET email_verified = 1 WHERE id = ?`, [user_id]);


    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));
})

// STEP 5: Business details
const registerStep5 = asyncHandler(async(req,res)=>{
    const { user_id, business_name, business_type, business_address } = req.body;

    if(!user_id || !business_name || !business_type || !business_address){
        throw new ApiError(400,"All Fields are required")
    }

    const [result] = await pool.query(`INSERT INTO business_details (user_id, business_name, business_type, business_address)
    VALUES (?, ?, ?, ?)`,[user_id, business_name, business_type, business_address])

    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));

})

// STEP 6: Documents (PAN, Aadhaar last4, file path)
const registerStep6 = asyncHandler(async(req,res)=>{
    const { user_id, pan_number, aadhaar_number, professional_license_path } = req.body;

    if(!user_id || !pan_number || !aadhaar_number || !professional_license_path){
        throw new ApiError(400,"All Fields are required")
    }

    const [result] = await pool.query(`INSERT INTO user_documents (user_id, pan_number, aadhaar_number, professional_license_path)
    VALUES (?, ?, ?, ?)`,[user_id, pan_number, aadhaar_number, professional_license_path])

    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));
})

// STEP 7: Bank details
const registerStep7 = asyncHandler(async(req,res)=>{
    const { user_id, account_holder_name, bank_name, account_number, ifsc_code } = req.body;

    if(!user_id || !account_holder_name || !bank_name || !account_number || !ifsc_code){
        throw new ApiError(400,"All Fields are required")
    }

    const [result] = await pool.query(`INSERT INTO bank_details (user_id, account_holder_name, bank_name, account_number, ifsc_code)
    VALUES (?, ?, ?, ?, ?)`,[user_id, account_holder_name, bank_name, account_number, ifsc_code])

    return res
    .status(201)
    .json(new ApiResponse(201,result,"User created successfully"));
})

export {registerStep1,registerStep2,registerStep3,registerStep4,registerStep5,registerStep6,registerStep7}