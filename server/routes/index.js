const userRouter = require("./userRoutes")
const productRouter = require("./productRoutes")
const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    //user Router
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes