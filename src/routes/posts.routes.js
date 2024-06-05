const { Router } = require('express')
const postsRouter = Router()

const authentication = require('../middlewares/authentication')
const PostsController = require('../controllers/PostsController')
const CommentsController = require('../controllers/CommentsController')
const LikesController = require('../controllers/LikesController')

const postsController = new PostsController()
const commentsController = new CommentsController()
const likesController = new LikesController()

//post
postsRouter.post("/",authentication, postsController.create)
postsRouter.delete("/:id", authentication, postsController.delete)
postsRouter.put("/:id", authentication, postsController.update)

//comment
postsRouter.post("/:id/comment", authentication, commentsController.create)
postsRouter.get("/", authentication, postsController.read)

//like
postsRouter.post("/:id/like", authentication, likesController.LikePost)
postsRouter.post("/comment/:id/like", authentication, likesController.LikeComment)

module.exports = postsRouter

