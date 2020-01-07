<template>
  <div>
      <h1>{{ id?'编辑':'新建' }}物品 </h1>
      <el-form :model="model"  label-width="120px" @submit.native.prevent="save">   

            
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="图标">
               <el-upload
                    class="avatar-uploader"
                    :action="$http.defaults.baseURL+'/upload'"
                    :show-file-list="false"
                    :on-success="afterUpload">
                    <img v-if="model.icon" :src="model.icon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
          <el-form-item>
              <el-button type="primary" native-type='submit'>保存</el-button>
          </el-form-item>
      </el-form>
      
  </div>
</template>

<script>
export default {
    props:{
        id:{}
    },

    data(){
        return {
            model:{}
        }
    },
    methods:{

        afterUpload(res){
            //用$set给对象不存在字段赋值
            this.$set(this.model, 'icon', res.url)
},

        //异步写法
        async save(){
            // 分新增 和  修改接口
            let res

            if(this.id){
                res =  await this.$http.put(`rest/items/${this.id}`, this.model)

            }else{
                res =  await this.$http.post('rest/items', this.model)
                
            }
            this.$router.push('/items/list')
            this.$message({
                type: 'success',
                message: '保存成功'
            })
        },

        async fetch(){
            let res = await this.$http.get(`rest/items/${this.id}`)
            this.model = res.data
        },

    },
    created(){
        this.id && this.fetch()
    }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>