require('express-async-errors')
require('dotenv').config()

const express = require('express')
const router = require('./routes')
const AppError = require('./utils/AppError')
const createDb = require('./database')


const app = express()
const PORT = process.env.PORT || 3000

createDb()

app.use(express.json())
app.use(router)

app.use((error, request, response, next)=>{
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            message: error.message
        })
    }
    console.error(error)
    return response.status(500).send('Error Internal Server')
})


app.listen(PORT, ()=> console.log(`ServerOn [ ${PORT} ]`))