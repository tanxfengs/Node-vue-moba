const jwt = require('jsonwebtoken')
const AdminUser = require('../models/AdminUser')
const assert = require('http-assert')

module.exports = options=>{

    return async(req, res, next)=>{

        const token = String(req.headers.authorization || '').split(' ').pop()
        console.log(token);
        assert(token, 401, '没有提供Token, 请先登录')
        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '无效Token, 请先登录')

        let user = AdminUser.findById({id})
        assert(user, 401, '请先登录')

        req.user = user
        await next()

    }
}