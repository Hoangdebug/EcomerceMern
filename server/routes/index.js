const userRouter = require("./userRoutes")
const productRouter = require("./productRoutes")
const categoryRoutes = require("./categoryRoute")
const blogCategoryRoutes = require("./blogCategoryRoutes")
const blogRoutes = require("./blogRoutes")
const brandRoutes = require("./brandRoutes")
const couponRoutes = require("./couponRoutes")
const orderRoutes = require("./orderRoutes")
const { notFound, errHandler } = require('../middlewares/errorHandler')

const initRoutes = (app) => {
    //user Router
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/category', categoryRoutes)
    app.use('/api/blog-category', blogCategoryRoutes)
    app.use('/api/blog', blogRoutes)
    app.use('/api/brand', brandRoutes)
    app.use('/api/coupon', couponRoutes)
    app.use('/api/order', orderRoutes)
    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes