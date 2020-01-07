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


    //登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    const resourceMiddleware = require('../../middleware/resource')


    router.post('/', async(req, res)=>{

        let model = await req.Model.create(req.body)
        res.send(model)
    })
    // 资源列表

    router.get('/', async(req, res)=>{  //关联查询 返回的字段是对象
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



app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware() ,router)


const multer = require('multer')
const upload = multer({dest: __dirname + '/../../upload'})

app.post('/admin/api/upload', authMiddleware(), upload.single('file'),async(req, res)=>{//获取文件
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

    res.status(err.statusCode|| 500).send({
        message: err.message
    })
})

}



