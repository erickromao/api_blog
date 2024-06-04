const { Pool } = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432
})

const nameDB = 'blog'

async function createDb(){
    try{
        const client = await pool.connect()
        const checkDB = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${nameDB}'`)
        if(checkDB.rows.length === 0 ){
            await client.query(`CREATE DATABASE ${nameDB}`)
            console.log(`Banco de dados '${nameDB}' criado com sucesso!`)
    }else{
        console.log(`Banco de dados '${nameDB}' já existe.`)
    }
    }catch(err){
        console.log('O correu algum error na criação do banco: ', err)
    }finally{
        pool.end()
    }
}

module.exports = createDb