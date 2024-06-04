const { Router } = require('express')
const userRouter = Router()

const UsersController = require('../controllers/UsersController')
const authentication = require('../middlewares/authentication')


const usersController = new UsersController()

userRouter.post('/', usersController.create)
userRouter.post('/login', usersController.login)
userRouter.delete('/', authentication, usersController.delete)

module.exports = userRouter