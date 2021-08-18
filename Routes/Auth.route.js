const express = require('express')
const createHttpError = require('http-errors')
const User = require('../Models/User.model')
const router = express.Router()
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
router.post('/register', async (req, res, next) => {
    console.log(req.body)
    try {
        //const { email, password } = req.body
        //if (!email || !password) throw createHttpError.BadRequest()
        const result = await authSchema.validateAsync(req.body)
        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createHttpError.Conflict(`${result.email} is already been registered`)
        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        res.send({ accessToken })
    } catch (err) {
        if (err.isJoi === true) err.status = 422
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })
        if (!user) {
            throw createHttpError.NotFound("User not registered")
        }
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createHttpError.Unauthorized("UserName/Password not valid")

        const accessToken = await signAccessToken(user.id)
        res.send({ accessToken })
    } catch (err) {
        if (err.isJoi === true) return next(createHttpError.BadRequest('Invalid username/password'))
        next(err)
    }
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh-token route')
})

router.delete('/logout', async (req, res, next) => {
    res.send('logout route')
})

module.exports = router