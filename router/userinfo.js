const express = require('express')

const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')



router.get('/userinfo', userinfo_handler.getUserInfo)

router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

router.post('/updateavatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router