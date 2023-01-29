<!-- 查看-履职情况 -->
<template>
  <hqit-content-page type="detail" :title="'主动上报履职要求—履职'">
    <template slot="content">
      <el-row>
        <el-col :span="14">
          <hqit-form class="form-upload-btn" :config="editDataConfig" :form="editDataTwo" labelPosition="right"
            ref="ruleForm" labelSuffix="：" labelWidth="126px">
            <template slot="table">
              <div style="text-align: right;">
                <el-upload class="upload-demo" ref="upload" :action="action" :limit="99" :headers="headers"
                  :show-file-list="false" :on-success="handleAvatarSuccess"
                  accept=".png,.bmp,.jpg,.jpeg,.pptx,.ppt,.doc,.docx,.xlx,.xlsx,.pdf,.txt" :on-progress="uploadProcess"
                  :on-change="handleChangeFile">
                  <el-button type="primary" icon="el-icon-plus" size="small"></el-button>

                </el-upload>
              </div>
              <el-table :data="dataEdit" border>
                <el-table-column label="序号" type="index" align="center" width="50">
                </el-table-column>
                <el-table-column :label="editData.respType == 1?'证书文件' : editData.respType == 2?'上传文件':'培训证明文件'"
                  align="center" prop="name" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="有效期" align="center" v-if="editData.respType == 1">
                  <template slot="header">
                    <div> <span style="color:red;">*</span> 有效期</div>
                  </template>
                  <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.releaseTime" type="daterange" size="large" style="width:100%;"
                      value-format="yyyy-MM-dd hh:mm:ss" range-separator="-" start-placeholder="开始日期"
                      end-placeholder="结束日期" @change="pickerChange($event,scope.$index)">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="实际完成时间" width="135" align="center" :render-header="renderHeader">
                  <template slot-scope="scope">
                    <div class="slot_class">{{scope.row.completionTime.substring(0,16)}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="right" width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button class="info" type="text" size="small"
                                       @click="lookHandle(scope.row)">预览</el-button>

                    <el-button class="info" type="text" size="small" @click="getDownload(scope.row)">下载</el-button>

                    <!-- <el-button  class="info" type="text" size="small" @click="handleDelet(scope.$index)">删除</el-button> -->
                    <!-- <del-popover
                                        :valText="scope.row.name"
                                        class="delInfo"
                                        @submitFun="handleDelet(scope.$index)"
                                      ></del-popover> -->
                    <el-button class="delInfo handle-text-btn" @click="handleDelet(scope.row,scope.$index)" size="small"
                      type="text">删除</el-button>
                  </template>

                </el-table-column>
              </el-table>
            </template>
          </hqit-form>
        </el-col>
        <el-col :span="10" style="border-left: 1px solid #ccc;">
          <hqit-form :config="editDataConfig1" :form="editData" labelPosition="right" ref="ruleForm1" labelSuffix="："
            labelWidth="130px">
            <template slot="courseHour">
              <div>{{editData.courseHour}}小时</div>
            </template>
            <template slot="respType">
              <div v-if="editData.respType == 1">
                <el-tag size="small" type="primary" style="margin:0 10px 10px 0" v-for="tag in tags" :key="tag.name">
                  {{tag.name}}</el-tag>
              </div>
              <div v-if="editData.respType == 2">
                <el-tag size="small" type="primary" style="margin:0 10px 10px 0" v-for="tag in tags1" :key="tag.name">
                  {{tag.name}}</el-tag>
              </div>
              <div style="font-size:14px;" v-if="(tags1.length == 0 && tags.length ==0)">暂无</div>
            </template>
          </hqit-form>
        </el-col>
      </el-row>
      <view-image v-if="showViewer" :on-close="closeViewer" :url-list="srcList"></view-image>
    </template>
    <template slot="operator">
      <!--         <button-footer
                :showBackup="true"
                :showCancel="false"
                :showConfirm="false"
                :backupText="'提交'"
                @backup="handleSave"
        ></button-footer>-->
      <hqit-button btnType="primary" btnText="提交" @click="handleSave"></hqit-button>
    </template>

  </hqit-content-page>


</template>
<script>
  import {
    getContentInfo,
    getByOrgId,
    taskReport
  } from "@/api/reporting/index";
  import {
    getUdcByCode
  } from "@/api/entryRequire/entryRequire";
  import {
    fileInfo
  } from '@/api/common';
  import ViewImage from "@/components/viewImage/index.vue";
  import {
    errorBoundary,
    delPrompt
  } from "@/utils/tool.js";
  import UploadFile from "@/components/secondControlList/UploadFile"
  import {
    getBct,
    getUdc
  } from "@/api/entryRequire/entryRequire";
  import {
    getInfo,
    getDownload
  } from "@/api/performanceRecord/index"
  import {
    addList
  } from "@/api/stayPerformance/index"
  //vue
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  //vue
  import FormTitle from "@/components/formTitle/FormTitle"
  export default {
    components: {
      ButtonFooter,
      UploadFile,
      FormTitle,
      ViewImage
    },

    data() {
      return {
         src:process.env.VUE_APP_BASE_API + '/api/sysfile/file_info/download?id=',
        editDataConfig: [{
            label: "安全第一责任人",
            prop: "name",
            type: "text",
            required: false,
            properties: {},
            span: 10,
          },
          {
            label: "上任时间",
            prop: "appointmentDate",
            type: "text",
            required: false,
            properties: {},
            span: 14,
          },
          {
            slotName: "table",
            properties: {},
            span: 23,
          },
        ],
        editDataConfig1: [{
            label: "履职项目",
            prop: "itemName",
            type: "text",
            required: false,
            properties: {},
            span: 24,
          },
          {
            label: "职责内容",
            prop: "content",
            type: "text",
            required: false,
            properties: {},
            span: 24,
          },
          {
            label: "职责标准",
            prop: "standard",
            type: "text",
            required: false,
            properties: {},
            span: 24,
          },
          {
            label: "佐证材料要求",
            prop: "evidence",
            type: "text",
            required: false,
            properties: {},
            span: 24,
          },
          {
            label: "要求完成时间",
            prop: "askTime",
            type: "text",
            required: false,
            properties: {},
            span: 24,
          },
          {
            label: "要求课程",
            prop: "courseRequire",
            type: "text",
            required: false,
            properties: {},
            span: 24,
            hidden: false
          },
          {
            label: "培训人员",
            prop: "trainee",
            type: "text",
            required: false,
            properties: {},
            span: 24,
            hidden: false
          },
          {
            label: "学习时长",
            slotName: "courseHour",
            required: false,
            properties: {},
            span: 24,
            hidden: false
          },
          {
            label: "要求证书",
            slotName: "respType",
            required: false,
            properties: {},
            span: 24,
            hidden: false
          },
        ],
        tags: [],
        tags1: [],
        dataEdit: [],
        imageUrl: '',
        srcList: [],
        loading: null,
        showViewer: false,
        headers: {
          Authorization: this.$store.state.user.token
        },
        action: `${process.env.VUE_APP_BASE_API}/api/sysfile/file_info/upload`,
        outSiderQuery: {},
        statuteId: null,
        fileIdList: [],
        editData: {},
        editDataTwo: {},
        isUpdate: false,
        isCheck: false,
        fileList: []
      };
    },
    created() {
      if (this.$route.query.id) {
        this.statuteId = this.$route.query.id;
        this.getDetail();

      }
      if (this.$route.query.isUpdate) {
        this.isUpdate = true;
      }
      if (this.$route.query.isCheck) {
        this.isCheck = true;
      }
    },

    methods: {
      async handleSave() {
        if (!this.dataEdit.length) {
          this.$message.error('请添加证书文件！');
          return
        }

        if (this.dataEdit.filter(i => !i.releaseTime).length && this.editData.respType == 1) {
          this.$message.error('请完整填写有效期！');
          return
        }
        if (this.editData.respType == 1) {
          this.dataEdit.map(i => {
            i.validStartDate = i.releaseTime[0]
            i.validEndDate = i.releaseTime[1]
          })
        }
        this.dataEdit.map(i => {
          if (i.id) delete i.id
        })
        let obj = {
          contentId: this.editData.id,
          personId: this.editDataTwo.personId,
          taskProcessList: this.dataEdit,
        }
        const res = await taskReport(obj)
        if (res.code == 200) {
          this.messageSuccess("操作成功！");
          this.$router.go(-1)
        }
      },
      lookHandle(item){
        if(item.fileType == 'image'){
          this.srcList.push(this.$getFileUrl(item.fileId) )
          this.showViewer = true
          return
        }
        const url=this.$getFileUrl(item.fileId) +  '&fullfilename='+item.name
        // const url=this.$getFileUrl(item.fileId)
        this.previewFile(url)
      },
      pickerChange(data, index) {
        // console.log(data,index)

      },
      onPreview() {

      },
      closeViewer() {
        this.showViewer = false
      },
      async getBct(id) {
        const res = await getBct(id)
        this.tags.push(res.data)
      },
      async getUdc(id) {
        const res = await getUdc(id)
        this.tags1.push(res.data)
      },
      upError() {
        this.$message.error("上传失败，仅支持格式png、bmp、jpg、jpeg、pptx、ppt、doc、docx、xlx、xlsx、pdf、txt")
      },
      handleChangeFile(file, fileList) {
        if (!file) return
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isLt2M) {
          this.$refs.upload.clearFiles()
          this.$message({
            message: '上传文件大小不能超过 50MB!',
            type: 'warning'
          })
          return false
        }
      },
      uploadProcess(event, file, fileList) {
        if (!this.loading) {
          this.loading = this.$loading({
            lock: true,
            text: '上传文件中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        }
        this.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
        if (this.loadProgress >= 100) {
          this.loadProgress = 100
          this.loading.close();
          this.loading = null
        }
      },
      handleAvatarSuccess(res) {
        console.log(res)
        let obj = {}
        obj.fileId = res.data.id
        obj.name = res.data.name
        obj.fileType = res.data.fileType
        // obj.downloadUrl = res.data.downloadUrl
        obj.downloadUrl = this.src + res.data.id + '&fullfilename='+res.data.name
        obj.completionTime = res.data.updateTime
        console.log("obj", obj)
        this.dataEdit.push(obj)
      },
      async handleDelet(row, i) {
        const valid = await errorBoundary(delPrompt(this, row.name));
        if (valid) {
          this.dataEdit.splice(i, 1)
          this.msgSuccess('删除成功')
        } else {
          this.$message({
            message: "删除取消",
          });
        }

      },
      getDownload(row) {
        console.log(row)
        getDownload({
          id: row.fileId
        }).then((res) => {
          const blob = new Blob([res.data], {
            type: 'text/plain;charset=utf-8'
          })
          this.createDownLoadClick(blob, row.name);
        });
      },
      //创建a标签下载
      createDownLoadClick(content, fileName) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      renderHeader(h, {
        column,
        $index
      }) {
        // 新建一个 span
        let span = document.createElement('span');
        // 设置表头名称
        span.innerText = column.label;
        // 临时插入 document
        document.body.appendChild(span);
        // 重点：获取 span 最小宽度，设置当前列，注意这里加了 20，字段较多时还是有挤压，且渲染后的 div 内左右 padding 都是 10，所以 +20 。（可能还有边距/边框等值，需要根据实际情况加上）
        column.minWidth = span.getBoundingClientRect().width + 20;
        // 移除 document 中临时的 span
        document.body.removeChild(span);
        return h('span', column.label);
      },
      // 获取详情
      getDetail() {
        getContentInfo(this.statuteId).then((res) => {
          if (res.code == 200) {
            this.editData = res.data
            this.editData.content = res.data.content
            this.editData.askTime = res.data.askTime
            this.editData.respType = res.data.respType
            // 是否逾期 0-未逾期 1-已逾期
            let certIds = res.data.certIds
            let fileIds = res.data.fileIds
            if ((certIds != null && certIds.length != 0) || (fileIds != null && fileIds.length != 0)) {
              if (this.editData.respType == 1) {
                certIds.map(i => this.getBct(i))
              } else if (this.editData.respType == 2) {
                // fileIds.map(i=> this.getUdc(i))
                getUdcByCode("resp_file_type").then(res => {
                  if (res.data) {
                    this.tags1 = res.data.filter(item => fileIds.includes(Number(item.dictValue)))
                  }
                })
              }
            }


            if (res.data.taskProcessList) {
              let arr = res.data.taskProcessList
              arr.map(async i => {
                if (this.editData.respType == 1) i.releaseTime = [i.validStartDate, i.validEndDate]
                const pic = await fileInfo([i.fileId])
                // this.$set(i, 'downloadUrl', pic.data[0].downloadUrl)
                 this.$set(i, 'downloadUrl', this.src + i.fileId+'&fullfilename='+pic.data[0].name )
                this.$set(i, 'fileType', pic.data[0].fileType)
                this.$set(i, 'name', pic.data[0].name)
              })
              this.dataEdit = arr
            }

            this.checkFormLabel()
            // let arr = res.data.taskProcessList
            // arr.map(async i=>{
            //   i.releaseTime = [i.validStartDate,i.validEndDate]
            //   const pic = await fileInfo([i.fileId])
            //   this.$set(i, 'downloadUrl', pic.data[0].downloadUrl)
            //   this.$set(i, 'fileType', pic.data[0].fileType)
            //   this.$set(i, 'name', pic.data[0].name)
            // })
            // this.dataEdit = arr
          }
        });
        let orgId = this.$store.state.user.userInfo.orgId
        getByOrgId(orgId).then((res) => {
          this.editDataTwo = res.data
          this.editDataTwo.appointmentDate = this.editDataTwo.appointmentDate.substring(0, 10)
        })
      },
      // checkFormLabel(){
      // const {respType}=this.editData
      // if(!(respType == 3 || respType == 4)){
      //   this.editDataConfig1=this.editDataConfig1.map(item=>{
      //     if(item.slotName=="courseRequire" ||item.slotName=="trainee" ||item.slotName=="courseHour"){
      //       item.hidden=true
      //     }else{
      //       if(respType == 1&&item.slotName=="respType"){
      //           item.label="要求证书"
      //       }else if(respType == 2&&item.slotName=="respType"){
      //           item.label="要求文件"
      //       }
      //     }
      //     return item
      //   })
      // }else if(!(respType == 1 || respType == 2)){
      //   this.editDataConfig1=this.editDataConfig1.map(item=>{
      //     if(item.slotName=="respType"){
      //       item.hidden=true
      //     }
      //     return item
      //   })
      // }
      // },

      checkFormLabel() {
        const {
          respType
        } = this.editData
        console.log("respType", respType)
        if (!(respType == 3 || respType == 4)) {
          console.log("11111")
          this.editDataConfig1 = this.editDataConfig1.map(item => {
            if (item.prop == "courseRequire" || item.prop == "trainee" || item.slotName == "courseHour") {
              item.hidden = true
            } else {
              if (respType == 1 && item.slotName == "respType") {
                item.label = "要求证书"
              } else if (respType == 2 && item.slotName == "respType") {
                item.label = "要求文件"
              }
            }
            return item
          })
        } else if (!(respType == 1 || respType == 2)) {
          console.log("111112222")

          this.editDataConfig1 = this.editDataConfig1.map(item => {
            if (item.slotName == "respType") {
              item.hidden = true
            }
            return item
          })
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .item-line1-box {
    position: relative;

    .item-line1 {
      display: flex;
      font-size: 14px;
      margin-bottom: 22px;
      align-items: center;

      .item-label {
        display: flex;
        align-items: center;
        text-align: right;
        padding-right: 10px;
      }

      .item-text {
        display: flex;
        align-items: center;
        color: #555;
        width: 100%;

        div {
          width: 100%;
        }

        ::v-deep .el-input__inner {
          width: 100px;
        }
      }

      div {
        width: 126px;
      }

      span {
        color: #868a97;
      }
    }
  }

  ::v-deep .delInfo {
    margin-left: 10px;
  }

  ::v-deep .button-container.design-form-wrap__btnwrap {
    border-bottom: 0;
    position: absolute;
    bottom: 18px;
    left: 0;
    background: #fff !important;
  }

  // ::v-deep .back-bar{
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // }
  .app-main .app-main-wrap .app-main-ctn>div {
    // padding: 54px 0 0 !important;
    // padding: 0 !important;
    // position: relative;
    // height: 100%;
    // overflow-y: auto;
    // box-sizing: border-box;
  }

  .item-label {
    text-align: right;
    font-size: 14px;
    color: #868a97;
  }

  ::v-deep .el-button--primary {
    background-color: #026DFF;
    border-radius: 3px;
    height: 30px;
  }

  .form-upload-btn {

    ::v-deep .hqit-component .el-upload .el-button,
    .hqit-component .el-upload .el-button:hover,
    .hqit-component .el-upload .el-button:focus {
      min-width: 54px !important;
      height: 30px !important;
      background: #026DFF !important;
      font-size: 12px !important;
      color: #fff !important;
      padding: unset !important;
    }

    ::v-deep .hqit-component .el-upload .el-button::before {
      font-family: unset !important;
      content: unset !important;
      margin-right: unset !important;
    }
  }
</style>