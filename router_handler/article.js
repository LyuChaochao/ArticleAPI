const path = require('path')
const db = require('../db/index')

exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('请上传文章封面！')

    const artcileInfo = {
        ...req.body,
        cover_img: path.join('/upload', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id
    }

    const sql = 'insert into ev_articles set ?'
    db.query(sql, artcileInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发表文章失败！')
        res.cc('发表文章成功', 0)
    })
}

exports.getArticleList = (req, res) => {
    const sql = 'select * from ev_articles'

    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章列表成功！',
            data: results,
            total: results.length
        })
    })
}