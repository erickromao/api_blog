
exports.up = knex => knex.schema.createTable('posts', (table)=>{
    table.increments('id')
    table.text('title')
    table.text('conteudo')
    table.text('categoria')
    table.integer('id_author').references('id').inTable('users').onDelete('CASCADE')
    table.text('author')
    table.integer('likes').defaultTo(0)

    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())

})
  
exports.down = knex => knex.schema.dropTable('posts')

