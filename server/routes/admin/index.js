// admin 路由模块
module.exports = app=>{
    const express = require('express')

    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')
    const router = express.Router({
        mergeParams: true
    })
    // const Category = require('../../models/Category')


    router.post('/', async(req, res)=>{

        let model = await req.Model.create(req.body)
        res.send(model)
    })
    // 资源列表

    router.get('/',async(req, res, next)=>{

        const token = String(req.headers.authorization || '').split(' ').pop()
        const { id } = jwt.verify(token, app.get('secret'))
        let user = AdminUser.findById({id})
        req.user = user
        await next()

    }, async(req, res)=>{  //关联查询 返回的字段是对象
        let queryOptions = {}
        if(req.params.resource==='categories'){
            queryOptions.populate = 'parent'
        }
        console.log(req);
        console.log(queryOptions);
        let items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })


    router.get('/:id', async(req, res)=>{
        let model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    //修改
    router.put('/:id', async(req, res)=>{   //放置body来的数据即可
        let model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        console.log(model);
        res.send(model)
    })


    //删除
    router.delete('/:id', async(req, res)=>{  
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })



app.use('/admin/api/rest/:resource',async(req, res, next)=>{
         // 类名转换
         const ModelName = require('inflection').classify(req.params.resource)
         req.Model = require(`../../models/${ModelName}`)
         //继续下一个请求
         next()
    } ,router)


const multer = require('multer')
const upload = multer({dest: __dirname + '/../../upload'})

app.post('/admin/api/upload', upload.single('file'),async(req, res)=>{//获取文件
    const file = req.file
    file.url = `http://localhost:3000/upload/${file.filename}`
    res.send(file)

})

app.post('/admin/api/login', async(req, res)=>{
    let {username, password} = req.body
    //1. 根据用户名查找用户
    user = await AdminUser.findOne({username}).select('+password')
    assert(user, 422, '用户不存在')
    // if(!user){
    //     res.status(422).send({'message': '用户不存在'})
    // }
    //2. 校验密码
    const isValid = require('bcryptjs').compareSync(password, user.password)
    console.log(user);
    assert(isValid, 422, '密码错误')
    // if(!isValid){
    //     res.status(422).send({'message': '密码错误'})
    // }
    //3. 返回token
    const token = jwt.sign({id: user._id}, app.get('secret'))
    res.send({token})
})

app.use(async(err, req, res, next)=>{

    res.status(err.statusCode).send({
        message: err.message
    })
})

}



