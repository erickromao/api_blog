const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const validator = require('validator')

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

    async read (request, response){
        const {categoria, data} = request.body
        
        let posts, currentPosts

        if(categoria && data){
            if(!validator.isISO8601(data, {strict:true})){
                throw new AppError('Modelo de data inválida. Use o formato YYYY-MM-DD.')
            }
            posts = await knex('posts')
            .leftJoin('comments', "posts.id","comments.id_post")
            .select([
                'posts.*',
                'comments.id as comment_id',
                'comments.conteudo as comment_conteudo',
                'comments.author as comment_author',
                'comments.likes as comment_likes',
                'comments.created_at as comment_created_at'
            ])
            .where('posts.created_at','>=',data)
            .where('posts.categoria', categoria)           
            .orderBy("posts.created_at")

            if(posts.length ===0){
                throw new AppError('Não existe posts apartir destes filtros: (data) (categoria).')
            }

            currentPosts = posts.map(post=>{
                return {
                    id: post.post_id,
                    title: post.title,
                    conteudo: post.conteudo,
                    categoria: post.categoria,
                    author: post.author,
                    likes:post.likes,
                    comments: post.comments,
                    created_at: post.created_at,
                    comment:{
                        id:post.comment_id,
                        conteudo: post.comment_conteudo,
                        author: post.comment_author,
                        likes: post.comment_likes,
                        created_at: post.comment_created_at
                    }
                }
            })
        }

        if(categoria && !data){
            [posts] = await knex('posts')
            .leftJoin('comments', "posts.id","comments.id_post")
            .select([
                'posts.*',
                'comments.id as comment_id',
                'comments.conteudo as comment_conteudo',
                'comments.author as comment_author',
                'comments.likes as comment_likes',
                'comments.created_at as comment_created_at'
            ])
            .where('posts.categoria',categoria)            
            .orderBy("posts.created_at")
            
            if(!posts){
                throw new AppError(`Nenhum post com a categoria (${categoria}), foi encontrado.`)
            }

            currentPosts = [posts].map(post=>{
                return {
                    id: post.post_id,
                    title: post.title,
                    conteudo: post.conteudo,
                    categoria: post.categoria,
                    author: post.author,
                    likes:post.likes,
                    comments: post.comments,
                    created_at: post.created_at,
                    comment:{
                        id:post.comment_id,
                        conteudo: post.comment_conteudo,
                        author: post.comment_author,
                        likes: post.comment_likes,
                        created_at: post.comment_created_at
                    }
                }
            })
        }

        if(!categoria && data){
            if(!validator.isISO8601(data, {strict:true})){
                throw new AppError('Modelo de data inválida. Use o formato YYYY-MM-DD.')
            }
            posts = await knex('posts')
            .leftJoin('comments', "posts.id","comments.id_post")
            .select([
                'posts.*',
                'comments.id as comment_id',
                'comments.conteudo as comment_conteudo',
                'comments.author as comment_author',
                'comments.likes as comment_likes',
                'comments.created_at as comment_created_at'
            ])
            .where('posts.created_at','>=',data)            
            .orderBy("posts.created_at")

            if(posts.length ===0){
                throw new AppError('Não existe posts apartir desta data.')
            }

            currentPosts = posts.map(post=>{
                return {
                    id: post.post_id,
                    title: post.title,
                    conteudo: post.conteudo,
                    categoria: post.categoria,
                    author: post.author,
                    likes:post.likes,
                    comments: post.comments,
                    created_at: post.created_at,
                    comment:{
                        id:post.comment_id,
                        conteudo: post.comment_conteudo,
                        author: post.comment_author,
                        likes: post.comment_likes,
                        created_at: post.comment_created_at
                    }
                }
            })
        }

        posts = await knex('posts')
            .leftJoin('comments', "posts.id","comments.id_post")
            .select([
                'posts.*',
                'comments.id as comment_id',
                'comments.conteudo as comment_conteudo',
                'comments.author as comment_author',
                'comments.likes as comment_likes',
                'comments.created_at as comment_created_at'
            ])            
            .orderBy("posts.created_at")

            currentPosts = posts.map(post=>{
                return {
                    id: post.post_id,
                    title: post.title,
                    conteudo: post.conteudo,
                    categoria: post.categoria,
                    author: post.author,
                    likes:post.likes,
                    comments: post.comments,
                    created_at: post.created_at,
                    comment:{
                        id:post.comment_id,
                        conteudo: post.comment_conteudo,
                        author: post.comment_author,
                        likes: post.comment_likes,
                        created_at: post.comment_created_at
                    }
                }
            })

        return response.json({
            message:"Postagens encontradas:",
            posts:currentPosts
        })
    }
   
}   


module.exports = PostsController