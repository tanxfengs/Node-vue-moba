import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})

// 拦截器
http.interceptors.request.use(config=> {
    // Do something before request is sent
    let token = localStorage.token
    config.headers.Authorization = 'Bearer' + token
    console.log(config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });



http.interceptors.response.use(res=>{
    return res
}, err=>{
    if(err.response.data.message){
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
    }
    

    return Promise.reject(err)
})

export default http