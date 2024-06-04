const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class PostsController{

    async create(request, response){
    const { title, conteudo, categoria } = request.body
    const userId = request.user.id

        if(!title || (!conteudo || !categoria)){
            throw new AppError('Informe todos os campos: (title) (conteudo) (categoria)')
        }

    const [user] = await knex('users').where({id:userId})
    
    const post = await knex('posts').insert({
        title, 
        conteudo,
        categoria,
        id_author: userId,
        author:user.name
    }).returning('*')

    const currentPost = post.map(({id_author, ...rest })=> rest)

    return response.json({
        message:"Post criado com sucesso!",
        post: currentPost
    })
}

    async delete(request, response){
        const userId = request.user.id
        const {id} = request.params
        
        if(!id){
            throw new AppError("Necessário passar o (id) da postagem.")
        }
        
        const [post] = await knex('posts').where({id})
        if(!post){
            throw new AppError('Postagem não encontrada.')
        }

        if(post.id_author != userId){
            throw new AppError('Acesso restrito a esta postagem.')
        }

        const currentPost = [post].map(({id, ...rest})=>rest)

        await knex('posts').where({id}).delete()

        return response.json({
            message:"Post apagado com sucesso!",
            post: currentPost
        })
        
    }

    async update(request, response){
        const userId = request.user.id
        const {id} = request.params
        const {title, conteudo, categoria} = request.body

        if(!id){
            throw new AppError('Informe o (id) da postagem.')
        }
    
        const [post] = await knex('posts').where({id})
        if(!post){
            throw new AppError('Postagem não encontrada.')
        }  

        if(post.id_author != userId){
            throw new AppError('Acesso restrito a esta postagem.')
        }

        const currentPost = [post].map(({id_author,updated_at, ...rest})=> rest)

        post.title = title ?? post.title
        post.conteudo = conteudo ?? post.conteudo
        post.categoria = categoria ?? post.categoria

        const newPost = await knex('posts').update({
            title:post.title, 
            conteudo: post.conteudo,
            categoria: post.categoria,
            updated_at: knex.raw('now()')
        }).where({id}).returning('*')

        const newPostCurrent =  newPost.map(({id_author, ...rest})=> rest)

        return response.json({
            message:"Post atualizado com sucesso!",
            oldPost:currentPost,
            newPost:newPostCurrent
        })
    }

}


module.exports = PostsController