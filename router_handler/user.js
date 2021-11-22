const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
    // 注册用户的处理函数
exports.reguser = (req, res) => {

    const userinfo = req.body
        // if (!userinfo.username || !userinfo.password) {
        //     // return res.send({ status: 1, message: '用户名或密码不能为空' })
        //     return res.cc('用户名或密码不能为空')
        // }
    const sql = 'select * from ev_users where username=?'
    db.query(sql, [userinfo.username], (err, results) => {

        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // console.log(results);
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' })
            return res.cc('用户名被占用，请更换其他用户名')
        }
    })

    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const sqlStr = 'insert into ev_users set ?'

    db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.affectedRows !== 1) {
            // return res.send({ status: 1, message: '注册失败，请重试！' })
            return res.cc('注册失败，请重试！')
        }
        // res.send({ status: 0, message: '注册成功' })
        res.cc('注册成功', 0)
    })

}

// 用户登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body

    const sql = 'select * from ev_users where username=?'

    db.query(sql, userinfo.username, function(err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('没有该用户名，登录失败！')

        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密是否一致
        const compareResults = bcrypt.compareSync(userinfo.password, results[0].password)

        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResults) {
            return res.cc('密码错误，登录失败！')
        }

        const user = {...results[0], password: '', user_pic: '' }

        const tokenStr = jwt.sign(user, config.jwtScrectKey, {
            expiresIn: '10h'
        })

        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}