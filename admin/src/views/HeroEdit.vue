<template>
  <div class="about">
      <h1>{{ id?'编辑':'新建' }}英雄 </h1>

      <el-form label-width="120px" @submit.native.prevent="save">   
          <el-tabs type="border-card" value="skills">

        <el-tab-pane label="基础信息" > 
            <el-form-item label="名称">
                    <el-input v-model="model.name"></el-input>
            </el-form-item>

            <el-form-item label="称号">
                <el-input v-model="model.title"></el-input>
            </el-form-item>

            <el-form-item label="类型">
                <el-select v-model="model.categories" multiple>
                    <el-option v-for="category in categories"
                            :key="category._id"
                            :label="category.name"
                            :value="category._id">
                    </el-option>
                </el-select>
            </el-form-item>
                
            <el-form-item label="难度">
                <el-rate :max="9" show-score style="margin-top:0.6rem" v-model="model.scores.difficult"></el-rate>
            </el-form-item>

            <el-form-item label="技能">
                    <el-rate :max="9" show-score style="margin-top:0.6rem" v-model="model.scores.skills"></el-rate>
            </el-form-item>
                
            <el-form-item label="攻击">
                <el-rate :max="9" show-score style="margin-top:0.6rem" v-model="model.scores.attack"></el-rate>
            </el-form-item>
            
            <el-form-item label="生存">
                <el-rate :max="9" show-score style="margin-top:0.6rem" v-model="model.scores.survive"></el-rate>
            </el-form-item>

            <el-form-item label="顺风装备">
                <el-select v-model="model.items1" multiple>
                    <el-option v-for="item in items"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                    </el-option>
                    <!-- <li v-for="item in items1" :key="item._id">{{item.name}}</li> -->
                </el-select>
            </el-form-item>


            <el-form-item label="逆风装备">
                <el-select v-model="model.items2" multiple>
                    <el-option v-for="item in items"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                    </el-option>
                    <!-- <li v-for="item in items1" :key="item._id">{{item.name}}</li> -->
                </el-select>
            </el-form-item>

            <el-form-item label="使用技巧">
                <el-input type="textarea"  v-model="model.usageTips" ></el-input>
            </el-form-item>
                
            <el-form-item label="对抗技巧">
                <el-input type="textarea" v-model="model.battleTips" ></el-input>
            </el-form-item>
                
            <el-form-item label="团战思路">
                <el-input type="textarea" v-model="model.teamtips" placeholder=""></el-input>  
            </el-form-item>
                
            <el-form-item label="图标">
                <el-upload
                        class="avatar-uploader"
                        :action="$http.defaults.baseURL+'/upload'"
                        :show-file-list="false"
                        :on-success="afterUpload"
                        >
                <img v-if="model.avatar" :src="model.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="技能" name="skills" >
            <el-button size="small" @click="model.skills.push({})"><i class="el-icon-plus"></i>添加技能</el-button>

            <el-row type="flex" style="flex-wrap:wrap;">
                <el-col :md="12" v-for="(item, i) in model.skills" :key="i" >
                    <el-form-item label="名称">
                        <el-input type="text" v-model="item.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-upload
                        class="avatar-uploader"
                        :action="$http.defaults.baseURL+'/upload'"
                        :show-file-list="false"
                        :on-success="res=>$set(item, 'icon', res.url)"
                        >
                        <img v-if="item.icon" :src="item.icon" class="avatar">
                        
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
            </el-form-item>
            <el-form-item label="小提示">
                <el-input type="textarea" v-model="item.tips"></el-input>
            </el-form-item>
             <el-form-item>
              <el-button type="danger" @click="model.skills.splice(i, 1)">删除</el-button>
              
            </el-form-item>
            
        </el-col>
            
    </el-row>
            
            
        </el-tab-pane>
    </el-tabs> 
        <el-form-item style="margin-top: 1rem">
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
            model:{
                name: '',
                avatar: '',
                scores: {}

            },
            categories:[],
            items:[]
        }
    },
    methods:{

        afterUpload(res){
            //用$set给对象不存在字段赋值
            this.$set(this.model, 'avatar', res.url)
},

        //异步写法
        async save(){
            // 分新增 和  修改接口
            let res

            if(this.id){
                res =  await this.$http.put(`rest/heroes/${this.id}`, this.model)

            }else{
                res =  await this.$http.post('rest/heroes', this.model)
                
            }
            this.$router.push('/heroes/list')
            this.$message({
                type: 'success',
                message: '保存成功'
            })
        },

        async fetch(){
            let res = await this.$http.get(`rest/heroes/${this.id}`)
            // this.model = res.data
            this.model = Object.assign({}, this.model, res.data)
        },

          async fetchCategories(){
            let res = await this.$http.get(`rest/categories/`)
            this.categories = res.data
        },

        async fetchItems(){
            let res = await this.$http.get(`rest/items/`)
            this.items = res.data
        },

    },
    created(){
        this.fetchCategories()
        this.fetchItems()
        this.id && this.fetch()

    }
}
</script>
    
<style>

</style>