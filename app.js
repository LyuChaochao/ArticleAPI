const express = require('express')
const app = express()


const joi = require('joi')

const cors = require('cors')
app.use(cors())

app.use('/uploads', express.static('./uploads'))

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

app.use(function(req, res, next) {
    res.cc = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

const config = require('./config')
    // 解析token中间件
const expressJWT = require('express-jwt')
app.use(expressJWT({ secret: config.jwtScrectKey }).unless({ path: [/^\/api\//] }))

// 注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 注册用户个人信息路由
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 注册文章分类路由
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 注册文章管理路由
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 错误中间件
app.use(function(err, req, res, next) {
    //数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)

    //捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    //未知错误
    res.cc(err)
})

app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})