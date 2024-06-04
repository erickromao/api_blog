exports.up = knex => knex.schema.createTable("comments", (table)=>{
    table.increments('id')
    table.integer('id_post').references('id').inTable('posts').onDelete('CASCADE')
    table.text('conteudo')
    table.text('author')
    table.integer('likes').defaultTo(0)

    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
    
})


exports.down = knex => knex.schema.dropTable('comments')
