<template>
  <div>
      <h1>{{ id?'编辑':'新建' }}分类 </h1>
      <el-form :model="model"  label-width="120px" @submit.native.prevent="save">   
            <el-form-item label="上级分类">
            <el-select v-model="model.parent" placeholder="">
                <el-option v-for="item in parentOptions"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id">
                </el-option>
            </el-select>
            </el-form-item>
            
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
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
            model:{},
            parentOptions:[] 
        }
    },
    methods:{
        //异步写法
        async save(){
            // 分新增 和  修改接口
            let res

            if(this.id){
                res =  await this.$http.put(`rest/categories/${this.id}`, this.model)

            }else{
                res =  await this.$http.post('rest/categories', this.model)
                
            }
            this.$router.push('/categories/list')
            this.$message({
                type: 'success',
                message: '保存成功'
            })
        },

        async fetch(){
            const res = await this.$http.get(`rest/categories/${this.id}`)
            this.model = res.data
        },

         async fetchParentOptions(){
            const res = await this.$http.get('rest/categories')
            this.parentOptions = res.data
        }
    },
    created(){
        this.id && this.fetch()
        this.fetchParentOptions()
    }
}
</script>

<style>

</style>