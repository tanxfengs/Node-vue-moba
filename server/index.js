const express = require('express')


const app = express()

app.set('secret', 'lavoz')
// 使用Json模块 跨域模块
app.use(require('cors')())
app.use(express.json())
app.use('/upload', express.static(__dirname+'/upload'))

require('./routes/admin')(app)
require('./plugins/db')(app)


app.listen(3000, ()=>{
    console.log('http://localhost:3000');
})