<template>
   <hqit-content-page type="list">
    <template slot="content">
      <div class="unauthorided">
          <div><i class="el-icon-warning" style="color:#FF3B30;font-size:48px"></i></div>
          <div>安全第一责任人（不通过）</div>
          <div>{{ remarks }}</div>
          <el-button type="primary" size="medium" @click="next">重新认证</el-button>
      </div>
      </template>
   </hqit-content-page>
</template>
<script>
    import {
        checkAuth
    } from "@/api/personLiable/personLiable"
    export default {
        data() {
            return {
                remarks:'',
                data:{}
            }
        },
   async created(){
        const res = await checkAuth()
        this.remarks = res.data.remarks
        this.data = res.data
        console.log("res",res)
 
    },
        methods: {
            next() {
                this.navigater(`/resp/personLiable/authentication?personId=${this.data.personId}&id=${this.data.id}`)
            }
        },
    }
</script>
<style lang="scss" scoped>
    .unauthorided {
        text-align: center;
        margin-top: 60px;

        div {
            line-height: 50px;
        }

        button {
            margin-top: 100px;
        }
    }
</style>