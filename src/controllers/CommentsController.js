const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class CommentsController{
    
    async create(request, response){
        const userId = request.user.id
        const {id} = request.params 
        const {conteudo} = request.body

        if(!id){
            throw new AppError('Necessário passar o id da postagem.')
        }

        if(!conteudo){
            throw new AppError('Preencha o campo (conteudo) para fazer um comentário.')
        }

        const [post] = await knex('posts').where({id})
        if(!post){
            throw new AppError('Postagem não encontrada.')
        }

        const [user] = await knex('users').where({id:userId})

        const comment = await knex('comments').where({id_post:id}).insert({
            conteudo,
            author: user.name,
            id_post: id
        }).returning('*')

        await knex('posts').where({id}).increment('comments', 1)

        const commentCurrent = comment.map(({updated_at, ...rest})=>rest)

        return response.json({
            message:"Comentário realizado com sucesso!",
            comment:commentCurrent
        })
    }
}



module.exports = CommentsController