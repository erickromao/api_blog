const { Router } = require('express')
const router = Router()

const userRouter = require('./user.routes')
const postsRouter = require('./posts.routes')


router.use("/user", userRouter)
router.use("/post", postsRouter)

module.exports = router