<template>
 <hqit-content-page type="detail" :title="barTitle">
 <template slot="content">
    <div style="padding:0 !important">
        <!-- <back-bar :title="barTitle" /> -->
       
        <div class="person_box">
            <el-row>
                <el-col :span="12" style="border-right: 1px solid #ccc;">

                    <el-row class="row_1">
                        <el-col>
                            <div class="topic">
                                <span>认证消息</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <el-form :model="editData" :rules="rules" ref='ruleForm' label-width="100px"
                                class="demo-ruleForm">

                                <el-form-item label="" prop="step">
                                    <div class="title"><em>*</em>认证结果</div>
                                    <div v-if="disableFlag">
                                    <el-radio v-model="editData.step" label="2"  v-if="editData.step !== '3' ">已认证</el-radio>
                                    <el-radio v-model="editData.step" label="3" v-if=" editData.step=='3'">不通过</el-radio>
                                    </div>
                                      <div v-if="!disableFlag">
                                    <el-radio v-model="editData.step" label="2"  >已认证</el-radio>
                                    <el-radio v-model="editData.step" label="3" >不通过</el-radio>
                                    </div>
                                </el-form-item>
                                <el-form-item label="" prop="remarks">
                                    <div class="title" style="margin-bottom:10px"><em>*</em>认证结果</div>
                                    <el-input type="textarea" :disabled='disableFlag' rows='4' placeholder="请输入内容" v-model="editData.remarks"
                                        maxlength="140" show-word-limit>
                                    </el-input>


                                </el-form-item>
                                <el-form-item>
                                    <div style="text-align:center;margin-top:30px">
                                        <el-button type="primary" @click="handleSave()" v-if='!disableFlag'>提交
                                        </el-button>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-col>

                        <!-- <el-col :span="16" >
                          
                        </el-col> -->
                    </el-row>
                    <el-row class="row_2">
                        <el-col>
                            <div class="topic"> <span>认证记录</span> </div>
                        </el-col>

                        <el-col>
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
                        </el-col>

                    </el-row>
                </el-col>

                <el-col :span="12" style="padding-left:30px">
                    <el-row class="row_3">
                        <el-col>
                            <div class="topic">
                                <span>履职人信息</span>
                            </div>
                        </el-col>
                        <el-col :span="20" :offset="4">
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">安全第一责任人：</span>
                                </div>
                                 <span>{{personDetail.name ||"-"}}</span>
                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">单位：</span>
                                </div>
                                <span>{{personDetail.orgName||"-"}}</span>

                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">上任日期：</span>
                                </div>
                                <span>{{personDetail.appointmentDate||"-"}}</span>

                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">任命有效期：</span>
                                </div>
                                <span>{{personDetail.effectiveDate||"-"}}</span>
                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">身份证：</span>
                                </div>
                                <span>{{personDetail.idNo||"-"}}</span>
                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">手机号：</span>
                                </div>
                                <span>{{personDetail.phone||"-"}}</span>
                            </div>
                            <div>
                                <div class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">职位：</span>
                                </div>
                                <span>{{personDetail.professionTitle||"-"}}</span>
                            </div>
                            <div>
                                <div style="float:left" class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">任命文件：</span>
                                </div>
                                <div style="position: relative;overflow: hidden;">
                                <el-image v-if="personDetail.idTypeId"  lazy style="width: 100px; " :src='personDetail.idTypeId' @click="bigPic(personDetail.idTypeId)"></el-image>
                                <span v-else style=" display: block;margin-top: 10px;">-</span>
                                </div>
                            </div>

                            <div>
                                <div style="float:left" class="row3_title">
                                    <em>*</em>
                                    <span class="title-left">从业资格证：</span>
                                </div>
                                <div style="position: relative;overflow: hidden;=">
                                  <template v-if="personDetail.fileIdList&&personDetail.fileIdList.length">
                                    <el-image lazy style="width: 100px;margin:6px" :src='item.downloadUrl'
                                        v-for="(item,index) in personDetail.fileIdList" :key="index" @click="bigPic1(personDetail.fileIdList)"></el-image>
                                  </template>
                                   <span v-else style=" display: block;margin-top: 10px;">-</span>      
                                </div>
                            </div>


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
        </div>
        <view-image v-if="dialogPic" :on-close="closeViewer" :url-list="picUrl" ></view-image>
    </div>
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
    export default {
        components: {
            pass,
            noPass,
            ViewImage
        },
        data() {
            return {
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
                    name: '',
                    orgName: '',
                    appointmentDate: '',
                    effectiveDate: '', //任命有效期
                    idNo: '',
                    phone: '',
                    professionTitle: '',
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

                        this.personDetail[key] = res.data.sysPersonDetails[key]
                    })
                    this.getPersonDetail2()



                    fileInfo(res.data.baseCertificateDto.fileIdList).then(res => {
                        if (res.code == 200) {
                            this.personDetail.fileIdList = []
                            this.personDetail.fileIdList = [...this.personDetail.fileIdList, ...res
                                .data
                            ]
                        }
                    })
                })


            },
            getPersonDetail2() {
                getPerson2(this.id).then(res => {
                    console.log("res", res)
                    this.personDetail.appointmentDate = res.data.appointmentDate.slice(0, 10)
                    this.personDetail.effectiveDate = res.data.effectiveStartDate.slice(0, 10) + " ~ " + res
                        .data.effectiveEndDate.slice(0, 10)
                    let arr = []
                    arr[0] = res.data.appointmentFileId
                    fileInfo(arr).then(pic => {
                        this.$set(this.personDetail, 'idTypeId', pic.data[0].downloadUrl)
                    })
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
                this.$refs['ruleForm'].validate((valid) => {
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
              this.picUrl = list.map(item=>item.downloadUrl)
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
        border-bottom: 1px solid #ccc;
    }

    .row_2 {
        padding-top: 30px;
    }

    .row_3 {
        div {
            margin-bottom: 20px;
            // color: #868a97;
             color: #606266;
             font-size: 14px;
             font-family: "Noto Sans S Chinese, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
             font-weight: 600
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
           font-size: 14px;
          font-weight: 400;
          color: #999;
        .box_1 {
            width: 100%;

            .time_date {
                display: inline-block;
                width: 90px;
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

    .person_box {
        padding: 30px;
    }



</style>