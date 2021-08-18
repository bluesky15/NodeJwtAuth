const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const Joi = require('joi')
const createHttpError = require('http-errors')


module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {

            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "1h",
                issuer: "lkb.com",
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    //reject(err)
                    console.log(err.message)
                    reject(createHttpError.InternalServerError())
                }

                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createHttpError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET, (error,payload)=>{
            if(error){
                const message = 
                error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message
                return next(createHttpError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    }
}