const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

function authentication(request, respose, next){
    const KEY = '123'
    const token = request.headers.authorization && request.headers.authorization.split(' ')[1]
    if(!token){
        throw new AppError('Acesso negado!')
    }
    jwt.verify(token, KEY, (err, user)=>{
        if(err){
            throw new AppError('Erro de autenticação')
        }
        request.user = user
        next()
    })
}

module.exports = authentication