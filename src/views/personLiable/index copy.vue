<template>
   <hqit-content-page type="list">
    <template slot="content">
      <div class="personLiable">
        <el-row>
          <el-col :span="11" style="overflow:hidden">
            <el-form ref="form" :model="form" label-width="130px" :rules="rules" style="margin-left:10%"
              class="demo-ruleForm">
              <el-form-item label="安全第一责任人:" prop="authId">
                <el-tag>{{personDetail.name}}</el-tag>
              </el-form-item>
              <el-form-item label="上任日期:" prop="appointmentDate">
            {{form.appointmentDate}}
              </el-form-item>
              <el-form-item label="任命有效期:" prop="effectiveDate">
            
            {{form.effectiveDate}}
              </el-form-item>
              <el-form-item label="任命文件:" prop="appointmentFileId">
                <div class="demo-image__preview" >
                <el-image lazy style="width: 100px;margin:6px" :src='form.appointmentFileId' @click="bigPic(form.appointmentFileId)"></el-image>
    </div>

                        <div >
                    <div style="line-height: 30px">提示:</div>
                    <div style="line-height: 30px; font-size: 12px">
                      1.图片格式：png,bmp,jpeg,jpg；
                    </div>
                    <div style="line-height: 30px; font-size: 12px">
                      2.图片大小：小于或等于2M；
                    </div>
                    <div style="line-height: 30px; font-size: 12px">
                      3.图片数量：最多上传1张；
                    </div>
                    </div>



              </el-form-item>
          
            </el-form>
          </el-col>
          <el-col :span="2"><div class="">
            <div class="content_line"></div>
          </div></el-col>
          <el-col :span='11' style="overflow:hidden">
            <el-form ref="form" :model="form" label-width="120px" style="margin-right:10%">
              <el-form-item label="姓名:">
                <span>{{personDetail.name||"-"}}</span>
              </el-form-item>
              <el-form-item label="性别:">
                <span>{{personDetail.genderName}}</span>
              </el-form-item>
              <el-form-item label="身份证:">
                <span>{{personDetail.idNo||"-"}}</span>
              </el-form-item>
              <el-form-item label="手机号:">
                <span>{{personDetail.phone||"-"}}</span>
              </el-form-item>

              <el-form-item label="部门:">
                <span>{{personDetail.deptName||"-"}}</span>
              </el-form-item>
              <el-form-item label="岗位:">
                <span>{{personDetail.postName||"-"}}</span>
              </el-form-item>
              <el-form-item label="职位:">
                <span>{{personDetail.professionTitle||"-"}}</span>
              </el-form-item>
              <el-form-item label="从业资格证:">
                <div class="demo-image__preview">
                  <template v-if="personDetail.fileIdList&&personDetail.fileIdList.length">
          <el-image lazy style="width: 100px;margin:6px" :src='item.downloadUrl' v-for="(item,index) in personDetail.fileIdList" :key="index" @click="bigPic1(personDetail.fileIdList)" ></el-image>
                  </template>
      <div v-else>-</div>
      </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="ticket">
        <pass></pass>
        </div>
        <view-image v-if="dialogPic" :on-close="closeViewer" :url-list="picUrl" ></view-image>
      </div>
    </template>
   </hqit-content-page>
</template>
<script>
  import {
    getPerson,
    authDetail,
    getPerson2
  } from "@/api/personLiable/personLiable"
  import ViewImage from "@/components/viewImage/index.vue";
  import personSel from "@/components/person-sel";
  import UploadImg from "@/components/secondControlList/UploadImg"
  import pass from "@/components/ticket/pass.vue"
import { fileInfo } from '@/api/common';



  export default {
    components: {
      personSel,
      UploadImg,
      pass,
      ViewImage
    },
    data() {
      return {
        dialogPic:false,
         picUrl:[],
        radiodata: {},
        name: '',
         fileIdListUrl:[],
         appointmentFileUrl:[],
        form: {
          authId: null, //认证人
          appointmentDate: null, //上任日期
          effectiveDate: '',
          effectiveEndDate: '', //任命有效期(结束日期)
          effectiveStartDate: '', // 任命有效期(开始日期)
          appointmentFileId: '', //任命文件
        },
        personDetail: {
          name: '',
          genderName: '',
          idNo: '',
          phone: '',
          deptName: '',
          postName: '',
          professionTitle: '',
           fileIdList:[], //从业资格证

        },
        uploadVal: [],
        value1: "",
        dialogVisible: false,

        rules: {
          authId: [{
            required: true,
            message: '请选择认证人',
            trigger: 'blur'
          }, ],
          appointmentDate: [{
            required: true,
            message: '请选择上任日期',
            trigger: 'change'
          }, ],
          effectiveDate: [{
            required: true,
            message: '请选择任命有效期',
            trigger: 'blur'
          }, ],
          appointmentFileId: [{
            required: true,
            message: '请选择任命文件',
            trigger: 'blur'
          }, ],
        },
        action: '/api/sysfile/file_info/upload'

      };
    },

    created(){
    
   this.getPersonDetail(this.$route.query.personId)
   this.getPersonDetail2(this.$route.query.id)
    },

    methods: {


      // 获取安全第一责任人详情
      async getPersonDetail(personId) {
        const res = await getPerson(personId)
        if (res.data.sysPersonDetails) {
          Object.keys(this.personDetail).forEach((key) => {

            this.personDetail[key] = res.data.sysPersonDetails[key]
          })
          console.log("this.personDetail", this.personDetail)
        }

       fileInfo(res.data.baseCertificateDto.fileIdList).then( res =>{
        if(res.code == 200){
this.personDetail.fileIdList = []
         this.personDetail.fileIdList = [...this.personDetail.fileIdList,...res.data]
        }
              res.data.forEach( item => {
                          this.fileIdListUrl.push(item.downloadUrl)
                        })
       } )


      },
      chang(val){
        console.log(val)
      },
      getAuthDetail(id){
        authDetail(id).then( res =>{

        })
      },
                getPersonDetail2(id) {
                getPerson2(id).then(res => {
                    console.log("res", res)
                    this.form.appointmentDate = res.data.appointmentDate.slice(0, 10)
                    this.form.effectiveDate = res.data.effectiveStartDate.slice(0, 10) + " ~ " + res
                        .data.effectiveEndDate.slice(0, 10)
                    let arr = []
                    arr[0] = res.data.appointmentFileId
                    fileInfo(arr).then(pic => {
                        this.$set(this.form, 'appointmentFileId', pic.data[0].downloadUrl)
                        this.appointmentFileUrl[0] = pic.data[0].downloadUrl
                        console.log("this.appointmentFileUrl",this.appointmentFileUrl)
                    })
                })
            },
            // //查看大图
            bigPic(url) {
              this.dialogPic = true
              this.picUrl = [url]
            },
            bigPic1(list) {
              this.dialogPic = true
              this.picUrl = list.map(item=>item.downloadUrl)
            },
            closeViewer() {
              this.dialogPic = false
              this.picUrl = []
            },

      handleClose(){
        this.name = ''
        this.form.authId = ''
      }
    }
  };
</script>
<style lang="scss" scoped>
.personLiable{
  // height: 100%;
  position: relative;
  .ticket{
     position: absolute;
     top: 50px;
     left: calc(50% - 200px);
  }
}
 .content{
    &_line{
      width: 1px;
      height: 600px;
      background: #ccc;
      margin: 0 auto 120px;

    }
 }


</style>