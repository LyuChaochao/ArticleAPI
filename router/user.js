const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user')

const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')
    // 注册用户路由
router.post('/reguser', expressJoi(reg_login_schema), userHandler.reguser)

// 用户登录路由
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router