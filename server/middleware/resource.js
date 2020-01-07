module.exports = options=>{

    return async(req, res, next)=>{
        // 类名转换
        const ModelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../models/${ModelName}`)
        //继续下一个请求
        next()
   }
}