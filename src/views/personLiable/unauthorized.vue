<template>
   <hqit-content-page type="list">
    <template slot="content">
    <div class="unauthorided" v-show="isNoAnthorized">
        <div><i class="el-icon-warning" style="color:#FF3B30;font-size:48px" ></i></div>
        <div>安全第一责任人（未认证）</div>
        <div>根据国家相关规定，请您完善安全第一责任人的信息，以便正常使用履职平台相关功能，请点击 " 开始认证 " 完善信息。</div>
          <el-button type="primary" size="medium"  @click="next">开始认证</el-button>
       </div>
    </template>
   </hqit-content-page>
</template>
<script>
import {checkAuth } from "@/api/personLiable/personLiable"
export default {
    data(){
        return{
        isNoAnthorized:false
        }
    },
   async created(){
        const res = await checkAuth()
        if(res.data){
              if(res.data.authStatus == 3){
                this.navigater(`/resp/personLiable/noPass`)
            }
              if(res.data.authStatus == 1){
                this.navigater(`/resp/personLiable/process`)
            }
              if(res.data.authStatus == 2){
                this.navigater(`/resp/personLiable/index?personId=${res.data.personId}&id=${res.data.id}`)
            }
            if(res.data.isExpired == 1){
                this.navigater("/resp/personLiable/reauth")
            }else{
              // if(res.data.authStatus == 2)return
            }
        }else{
              this.isNoAnthorized=true
        }
    },
    methods:{
        next(){
     this.navigater("/resp/personLiable/authentication")
        }
    }
}
</script>
<style lang="scss" scoped>
.unauthorided {
    text-align: center;
    margin-top: 60px;
    div{
        line-height: 50px;
    }
    button{
        margin-top:100px ;
    }
}
</style>