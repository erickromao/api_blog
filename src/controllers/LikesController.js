const AppError = require('../utils/AppError')
const knex = require('../database/knex')
class LikesController{

    async LikePost(request, response){
        const {id} = request.params

        if(!id){
            throw new AppError('Necessário passar o id da postagem.')
        }

        const [post] = await knex('posts').where({id})
        if(!post){
            throw new AppError('Este post não existe.')
        }

        const postAt = await knex('posts')
        .where({id})
        .increment('likes',1)
        .returning('*')

        const postCurrent = postAt.map(({id_author, ...rest})=> rest)

        return response.json({
            message:"Like adicionado com sucesso.",
            post: postCurrent
        })
    }

    async LikeComment(request, response){
        const {id} = request.params

        if(!id){
            throw new AppError('Necessário passar o (id) do comentário.')
        }

        const [checkComment] = await knex('comments').where({id})
        if(!checkComment){
            throw new AppError('Nenhum comentário com este (id) encontrado.')
        }

        const [comment] = await knex('comments')
        .where({id})
        .increment('likes', 1)
        .returning('*')

        const commentCurrent = [comment].map(({id_post, updated_at, ...rest})=> rest)

        return response.json({
            message:"Like adicionado com sucesso!",
            comment:commentCurrent
        })
    }
}

module.exports = LikesController