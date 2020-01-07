<template>
    <div><h1>管理员列表</h1>
     <el-table :data="items">
        <el-table-column prop="_id" label="ID" tableWidth="220px"></el-table-column>
        <el-table-column prop="username" label="管理员用户名" ></el-table-column>
            <el-table-column
        fixed="right"
        label="操作"
        width="180">
      <template slot-scope="scope">
        <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
        <el-button type="text" size="small" @click="$router.push(`/admin_users/edit/${scope.row._id}`)">编辑</el-button>
        <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        
      </template>
    </el-table-column>
      
      </el-table>

    </div>
    
</template>

<script>
export default {
    data(){
        return {
            items: []
        }
    },
    
    methods:{
        async fetch(){
            let res  =  await this.$http.get('/rest/admin_users')
            this.items = res.data
        },
            async remove(row){
            this.$confirm(`是否要删除分类 "${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            //删除接口
            let res  = await this.$http.delete(`rest/admin_users/${row._id}`)

          this.$message({
            type: 'success',
            message: '删除成功!'
          });

          this.fetch()
        })
    }
    },

    created(){
        this.fetch()
    }
}
</script>

<style>

</style>