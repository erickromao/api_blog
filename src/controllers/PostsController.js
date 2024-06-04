const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class PostsController{

    async create(request, response){
    const { title, conteudo, categoria } = request.body
    const userId = request.user.id

    const [user] = await knex('')
    

}
}