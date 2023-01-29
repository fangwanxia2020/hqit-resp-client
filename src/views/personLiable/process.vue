<template>
   <hqit-content-page type="list">
    <template slot="content">
        <div class="unauthorided">
            <div><i class="el-icon-success" style="color:#0079FE;font-size:48px" ></i></div>
            <div>安全第一责任人（审核中）</div>
            <div>您的信息正在审核中！请耐心等待，审核预计需要 15个 工作日左右。</div>
        </div>
      </template>
   </hqit-content-page>
</template>
<script>
export default {
    data(){
        return{

        }
    },

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