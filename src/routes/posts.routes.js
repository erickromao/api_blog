const { Router } = require('express')
const postsRouter = Router()

const authentication = require('../middlewares/authentication')
const PostsController = require('../controllers/PostsController')
const CommentsController = require('../controllers/CommentsController')

const postsController = new PostsController()
const commentsController = new CommentsController()

postsRouter.post("/",authentication, postsController.create)
postsRouter.delete("/:id", authentication, postsController.delete)
postsRouter.put("/:id", authentication, postsController.update)
postsRouter.post("/:id/comment", authentication, commentsController.create)
postsRouter.get("/", authentication, postsController.read)

module.exports = postsRouter

