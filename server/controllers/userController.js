const User = require('../models/user')
const asyncHandler = require("express-async-handler")
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')

const register = asyncHandler( async (req, res) => {
    const { email, password, lastname, firstname, mobile } = req.body
    if(!email || !password || !firstname || !lastname || !mobile)
    return res.status(400).json({
        success: false,
        mes: "Missing input"
    })

    const user = await User.findOne({email, mobile})
    if(user)
        throw new Error('User has existed')
    else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Create successfully' : 'Invalid information'
        })
    }
})
//RefreshToken => cấp mới accessToken
//AccessToken => Xác thực người dùng
const login = asyncHandler( async (req, res) => {
    const { email, password } = req.body
    if(!email || !password)
    return res.status(400).json({
        success: false,
        mes: "Missing input"
    })

    const response = await User.findOne({ email })
    if(response && await response.isCorrectPassword(password)){
        //Tách password và role ra khỏi response
        const { password, role, ...userData } = response.toObject()
        //Tạo access Token
        const accessToken = generateAccessToken(response._id, role)
        //Tạo refresh token
        const refreshToken = generateRefreshToken(response._id)
        //Lưu refreshToken vào db
        await User.findByIdAndUpdate(response._id, {refreshToken} , {new: true})
        //Lưu refreshToken vào cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 720000})
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }else{
        throw new Error('Invalid credential')
    }
})

const getCurrent = asyncHandler( async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    // const { _id } = req
    if( !cookie && cookie.refreshToken) throw new Error('No refresh Token in cookie')

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh Token invalid'
    })
})

const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refresh token ở db
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    //Xóa refresh token ở trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        message: "Log out successfully"
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}