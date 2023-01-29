<template>
<hqit-content-page type="detail" :title="barTitle" >
 <template slot="content" >
            <el-row >
                <el-col :span="12" style="border-right: 1px solid #ccc; padding-top:40px ">
                    <el-row class="row_1" style="border-bottom: 1px solid #ccc; ">
                         <el-col :span="24">
                            <hqit-form
                              :config="
                                disableFlag
                                  ? configListLook
                                  : configList"
                              :form="editData"
                              labelPosition="right"
                              ref="ruleForm"
                              formName="ruleForm"
                              labelSuffix="："
                              labelWidth="92px"
                            >
                                  <!-- :labelWidth="disableFlag ? '100px' : '108px'" -->
                              <template slot="step">
                                    <template v-if="disableFlag">
                                    <el-radio v-model="editData.step" label="2"  v-if="editData.step !== '3' ">已认证</el-radio>
                                    <el-radio v-model="editData.step" label="3" v-if=" editData.step=='3'">不通过</el-radio>
                                    </template>
                                      <template v-if="!disableFlag">
                                    <el-radio v-model="editData.step" label="2"  >已认证</el-radio>
                                    <el-radio v-model="editData.step" label="3" >不通过</el-radio>
                                    </template>
                              </template>
                              <template slot="operator">
                                    <el-button type="primary" @click="handleSave()" v-if='!disableFlag'>提交
                                    </el-button>
                              </template>
                            </hqit-form>
                         </el-col>
                    </el-row>
                    <el-row class="row_2" style="padding-top:40px">
                        <el-col :span="24">
                            <hqit-form
                              :config="configRecord"
                              :form="editData"
                              labelPosition="right"
                              ref="ruleForm1"
                            >
                              <template slot="record">
                                  <div class="record">
                                      <div class="box">
                                          <div class="box_1" v-for="(item,index) in recorsDetail" :key="index">
                                              <span class="time_date">{{item.date}}</span>
                                              <span class="round"></span>
                                              <span class="remark">{{item.remarks1}} <span
                                                      class="remarks2">{{item.remarks2}}</span> </span>
                                              <span class="time_tiem">{{item.time}}</span>
                                          </div>
                                      </div>
                                  </div>
                              </template>
                           </hqit-form>
                        </el-col> 
                    </el-row>
                </el-col>

                <el-col :span="12" style="padding-left:30px;padding-top:40px">
                    <el-row class="row_3">
                          <el-col :span="22" :offset="2">
                            <hqit-form
                              :config="configpersonDetail"
                              :form="personDetail"
                              labelPosition="right"
                              ref="ruleForm2"
                              labelSuffix="："
                              labelWidth="135px" 
                            >
                              <!-- labelWidth="120px" -->
                              <template slot="idTypeId">
                                  <div style="position: relative;overflow: hidden;">
                                    <el-image v-if="personDetail.idTypeId"  lazy style="width: 100px; " :src='personDetail.idTypeId' @click="bigPic(personDetail.idTypeId)"></el-image>
                                    <span v-else style=" display: block;">-</span>
                                    </div>
                              </template>
                              <template slot="fileIdList">
                                <div style="position: relative;overflow: hidden;=">
                                  <template v-if="personDetail.fileIdList&&personDetail.fileIdList.length">
                                    <el-image lazy style="width: 100px;margin:6px" :src='item'
                                        v-for="(item,index) in personDetail.fileIdList" :key="index" @click="bigPic1(personDetail.fileIdList)"></el-image>
                                  </template>
                                   <span v-else style=" display: block;">-</span>      
                                </div>
                              </template>
                            </hqit-form>
                          </el-col>
                       <div class="ticketBox" v-if="disableFlag && editData.step !== '3' ">
                            <pass></pass>
                        </div>
                        <div class="ticketBox" v-if="disableFlag && editData.step=='3'">
                            <no-pass></no-pass>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        <view-image v-if="dialogPic" :on-close="closeViewer" :url-list="picUrl" ></view-image>
    </template>
     </hqit-content-page>
</template>
<script>
    import {
        fileInfo
    }
    from '@/api/common';
    import utils from "@/assets/js/validator";
  import ViewImage from "@/components/viewImage/index.vue";
    import {
        auth,
        getPerson,
        getPerson2,
        authRecord,
        authDetail
    } from "@/api/statePersonLiable/statePersonLiable"
    import pass from "@/components/ticket/pass.vue"
    import noPass from "@/components/ticket/noPass.vue"
import { Radio } from 'element-ui';
    export default {
        components: {
            pass,
            noPass,
            ViewImage
        },
        data() {
            return {
               src:process.env.VUE_APP_BASE_API + '/api/sysfile/file_info/download?id=',
              configListLook:[
                   {
                      type:"title",
                      label:"认证信息"
                    },
                    {
                      label: "认证结果",
                      slotName: "step",
                      // slotName: "step",
                      required: true,
                      properties: {
                        disabled: true,
                      },
                      span: 24,
                    },
                    {
                      label: "认证意见",
                      prop: "remarks",
                      type: "textarea",
                      required: true,
                      properties: {
                        disabled: true,
                        rows:4
                      },
                      span: 24,
                    },
              ],
              configList:[
                    {
                      type:"title",
                      label:"认证信息"
                    },
                    {
                      label: "认证结果",
                      slotName: "step",
                      required: true,
                      properties: {
                      },
                      span: 24,
                    },
                    {
                      label: "认证意见",
                      prop: "remarks",
                      type: "textarea",
                      required: true,
                      span: 20,
                      properties:{
                        maxlength:140,
                        showWordLimit:true,
                        rows:4
                      }
                    },
              ],
              configRecord:[
                    {
                      type:"title",
                      label:"认证记录"
                    },
                    {
                      label: "",
                      slotName: "record",
                      span: 24,
                    },
              ],
              configpersonDetail:[
                    {
                      type:"title",
                      label:"履职人信息"
                    },
                    {
                      type:"text",
                      label:"安全第一责任人",
                      prop:"name",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                   {
                      type:"text",
                      label:"单位",
                      prop:"orgName",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      type:"text",
                      label:"上任日期",
                      prop:"appointmentDate",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      type:"text",
                      label:"任命有效期",
                      prop:"effectiveDate",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      type:"text",
                      label:"身份证",
                      prop:"idNo",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      type:"text",
                      label:"手机号",
                      prop:"phone",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      type:"text",
                      label:"职位",
                      prop:"professionTitle",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      label:"任命文件",
                      slotName: "idTypeId",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
                    {
                      label:"从业资格证",
                      slotName: "fileIdList",
                      required:true,
                      properties: {
                        // disabled:true,
                      },
                      span: 24,
                    },
              ],
              barTitle:"",
                dialogPic:false,
                picUrl:[],
                backTitle: '认证详情',
                disableFlag: false,
                isCheck: false,
                isUpdate: false,
                personId: '',
                id: '',
                orgId: '',
                recorsDetail: [],
                personDetail: {
                    name: '-',
                    orgName: '-',
                    appointmentDate: '-',
                    effectiveDate: '-', //任命有效期
                    idNo: '-',
                    phone: '-',
                    professionTitle: '-',
                    idTypeId: '', //任命文件
                    fileIdList: [], //从业资格证
                },
                editData: {
                    step: "2",
                    remarks: ''
                },
                rules: {
                    step: [{
                        required: true,
                        message: '请选择认证结果',
                        trigger: 'blur'
                    }, ],
                    remarks: [{
                        required: true,
                        message: '请输入认证意见',
                        trigger: 'blur'
                    }, ],


                },

            }
        },
        created() {
            console.log("query", this.$route.query)
            this.personId = this.$route.query.personId
            this.id = this.$route.query.id
            this.orgId = this.$route.query.orgId
            if (this.$route.query.type) {
                this.disableFlag = true
                this.getAuthDetail()
            }
            this.getPersonDetail()
            this.getAuthRecord()
            this.barTitle=this.$route.query.type?"安全第一责任人—查看—"+this.$route.query.name||"":"安全第一责任人—认证—"+this.$route.query.name||""
        },
        methods: {
            //获取履职人信息
            getPersonDetail() {
                getPerson(this.personId).then(res => {
                    console.log("res", res)
                    Object.keys(this.personDetail).forEach(key => {
                       if(key!="idTypeId"&&key!="fileIdList"){
                        this.personDetail[key] = res.data.sysPersonDetails[key] || "-"
                       }else{
                        this.personDetail[key] = res.data.sysPersonDetails[key]
                       }
                    })
                    this.getPersonDetail2()

 this.personDetail.fileIdList = []
res.data.baseCertificateDto.fileIdList.forEach( item =>{
this.personDetail.fileIdList.push(this.src + item)
})

                    // fileInfo(res.data.baseCertificateDto.fileIdList).then(res => {
                    //     if (res.code == 200) {
                    //         this.personDetail.fileIdList = []
                    //         this.personDetail.fileIdList = [...this.personDetail.fileIdList, ...res
                    //             .data
                    //         ]
                    //     }
                    // })
                })


            },
            getPersonDetail2() {
                getPerson2(this.id).then(res => {
                    console.log("res", res)
                    this.personDetail.appointmentDate = res.data.appointmentDate.slice(0, 10)
                    this.personDetail.effectiveDate = res.data.effectiveStartDate.slice(0, 10) + " ~ " + res
                        .data.effectiveEndDate.slice(0, 10)
                        this.$set(this.personDetail, 'idTypeId', this.src + res.data.appointmentFileId)
                    // let arr = []
                    // arr[0] = res.data.appointmentFileId
                    // fileInfo(arr).then(pic => {
                    //     this.$set(this.personDetail, 'idTypeId', pic.data[0].downloadUrl)
                    // })
                })
            },

            getAuthRecord() {
                authRecord(this.orgId).then(res => {
                    let arr = []
                    res.data.forEach(item => {
                        if (item.remarks.indexOf('已认证') > -1) {
                            let strArr = item.remarks.split('已认证')
                            item.remarks1 = strArr[0]
                            item.remarks2 = '已认证'
                        } else if (item.remarks.indexOf('不通过') > -1) {
                            let strArr = item.remarks.split('不通过')
                            item.remarks1 = strArr[0]
                            item.remarks2 = '不通过'
                        } else {
                            item.remarks1 = item.remarks
                        }
                        let date = item.createTime.slice(0, 10)
                        item.date = item.createTime.slice(0, 10)

                        item.time = item.createTime.slice(11, 16)

                        arr.forEach(i => {
                            if (i == date) {
                                item.date = ''
                            }
                        })
                        arr.push(date)
                    })



                    this.recorsDetail = [...this.recorsDetail, ...res.data]
                    console.log("this.recorsDetail", this.recorsDetail)
                })
            },
            getAuthDetail() {
                authDetail(this.id).then(res => {
                    if (res.code == 200) {
                        this.editData.step =  res.data.authStatus.toString()
                        this.editData.remarks = res.data.remarks
                    }
                })
            },
            //提交
            handleSave() {
                  this.$refs['ruleForm'].$refs['ruleForm'].validate((valid) => {
                    console.log("valid", valid)
                    if (valid) {
                        console.log("this.editData", this.editData)
                        let obj = {}
                        obj = {
                            ...obj,
                            ...this.editData
                        }
                        obj.orgId = this.orgId
                        obj.id = this.id
                        obj.authStatus = this.editData.step
                        auth(obj).then(res => {
                            this.navigater("/resp/statePersonLiable")
                        })
                    }
                })
            },
            // //查看大图
            bigPic(url) {
              this.dialogPic = true
              // this.picTitle = "任命文件"
              this.picUrl = [url]
            },
            bigPic1(list) {
              this.dialogPic = true
              this.picUrl = list
            },
            closeViewer() {
              this.dialogPic = false
              this.picUrl = []
            },

        }
    }
</script>
<style lang="scss" scoped>
    .title {
        // margin-bottom: 10px;
        font-size: 16px;
        height: 30px;
    }


    .topic {
        margin-bottom: 20px;
        color: rgba(0, 0, 0, 0.911) !important;
        ;

        span {

            font-size: 18px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ccc;
        }

    }

    .row_1 {
        padding-bottom: 30px;
        // border-bottom: 1px solid #ccc;
    }

    .row_2 {
        padding-top: 30px;
    }

    .row_3 {
        div {
            // margin-bottom: 20px;
            // // color: #868a97;
            //  color: #606266;
            //  font-size: 14px;
            //  font-family: "Noto Sans S Chinese, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
            //  font-weight: 600
        }
    }


    .row3_title {
        width: 130px;
        text-align: right;
        display: inline-block;

    }

    .title-left {
        text-align: right;
        font-size: 14px;
        // color: #868a97;
        color: #606266;
        line-height: 40px;
        font-weight: 700;
    }

    em {
        padding-left: 4px;
        color: #f56c6c;
        font-size: 14px;
        padding-right: 4px;
    }

    ::v-deep .el-step__icon {
        width: 8px !important;
        height: 8px !important;
        right: -8px;

        div {
            display: none;
        }
    }

    .step_time {
        position: relative;
        width: 70px;
        top: 20px;
        text-align: right;
    }

    ::v-deep .el-step {
        left: 70px;

    }

    .record {
      // margin-left: 24px;
          margin-left: -2px;
           font-size: 14px;
          font-weight: 400;
          color: #999;
        .box_1 {
            width: 100%;

            .time_date {
                display: inline-block;
                width: 74px;
                text-align: right;
            }

        }

        .box_1::after {


            display: block;
            height: 30px;
            width: 1px;
            background-color: #ccc;
            content: '';
            margin-left: 100px;
        }

        .box_1:last-child::after {
            display: none;
        }

        height: 300px;
        overflow: auto;

        .round {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ccc;
            margin: 2px 8px;
        }

        .remark {
            width: 60%;
            display: inline-block;
        }


    }

    .ticketBox {
        width: 100px;
        position: relative;
        top: 80px;
        left: 70%;
    }

    ::v-deep .remarks2 {
        color: #0079FE;
    }

::v-deep .contentBox {
  margin-top: -20px !important;
}




</style>