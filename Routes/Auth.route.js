const express = require('express')
const createHttpError = require('http-errors')
const User = require('../Models/User.model')
const router = express.Router()
const {authSchema} = require('../helpers/validation_schema')

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
        res.send(savedUser)
    } catch (err) {
        if(err.isJoi === true) err.status = 422
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    res.send('login route')
})

router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh-token route')
})

router.delete('/logout', async (req, res, next) => {
    res.send('logout route')
})

module.exports = router