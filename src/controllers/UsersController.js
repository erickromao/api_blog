const AppError = require("../utils/AppError")
const knex = require('../database/knex')
const jwt = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs')
const validator = require('validator')

class UsersController {

    async create(request, response){
        const {name, email, password, avatarURL, bio} = request.body
        
        if(!name || (!email || !password)){
            throw new AppError('Preencha todos os campos obrigatórios: (name) (email) (password)')
        }

        if(!validator.isEmail(email)){
            throw new AppError('Formato de email inválido.')
        }

        if(avatarURL && !validator.isURL(avatarURL)){
            throw new AppError('URL de avatar inválida.')
        }

        const [checkEmail] = await knex('users').where({email})
        if(checkEmail){
            throw new AppError('Este email já está em uso.')
        }

        const heshedPassword = await hash(password, 8)

        await knex('users').insert({
            name,
            email, 
            password: heshedPassword,
            avatar: avatarURL,
            bio
        })
       
        return response.json({
            message:"Cadastro feito com sucesso!",
            name,
            email,
            bio, 
            avatarURL
        })
    }
    async login(request, response){
        const KEY = '123'
        const {email, password} = request.body
        
        if(!email || !password){
            throw new AppError('Preenche os campos (email) e (password)')
        }

        if(!validator.isEmail(email)){
            throw new AppError('Formato de email inválido.')
        }

        const [user] = await knex('users').where({email})
        if(!user){
            throw new AppError('Esse usuário não existe.')
        }
        
        const checkPassword = await compare(password, user.password)
        if(!checkPassword){
            throw new AppError('Senha incorreta.')
        }

        const token = jwt.sign({id: user.id}, KEY, {expiresIn:"10m"})

        return response.json({
            message:`Login feito com sucesso! Bem-vindo ${user.name}!`,
            token
        })
    }
    async delete(request, response){
        const userId = request.user.id

        const [user] = await knex('users').where({id:userId})

        const oldUser = [user].map(({id,password, ...rest})=>rest)

        await knex('users').where({id:user.id}).delete()
        
        return response.json({
            message:'Usuário deletado com sucesso!',
            oldUser
        })
    }
}

module.exports = UsersController