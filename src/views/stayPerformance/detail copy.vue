<!-- 查看-履职情况 -->
<template>
     <hqit-content-page  v-if="isLoad&&editData.contentDto" type="detail" :title="'待履职— 履职 —' + editData.contentDto.content">
    <template slot="content">
  <div v-if="isLoad">
      <!-- <back-bar :title="'待履职— 履职 —' + editData.contentDto.content" v-if="editData.contentDto" /> -->
      <div >
        <el-row>
          <el-col :span="16" style="border-right: 1px solid #ccc;padding: 30px 30px 0 0">
            <div class="text-rigth">
                <el-row>
                    <el-col :span='$colSpan+4'>
                        <ty-multi-text
                                :label="'安全第一责任人'"
                                v-model="editData.personName"
                                :allowUpdate="false"
                        >
                        </ty-multi-text>
                    </el-col>
                    <el-col :span='$colSpan+4'>
                        <ty-multi-text
                                :label="'上任时间'"
                                v-model="taskDate"
                                :allowUpdate="false"
                        >
                        </ty-multi-text>
                    </el-col>
                </el-row>
              <el-row v-if="!isReport">
                    <el-col :span='$colSpan+4'>
                        <ty-multi-text
                                :label="'逾期情况'"
                                v-model="editData.isOverdue"
                                :allowUpdate="false"
                        >
                        </ty-multi-text>
                    </el-col>
                    <el-col :span='$colSpan+4'>
                      <div class="item-line1-box">
                        <div class="item-line1">
                          <div class="item-label" >
                              <div>
                                  <span>距离完成时间：</span>
                              </div>
                          </div>
                          <div class="item-text">
                            <div v-html="timeRemaining"></div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                </el-row>
                <el-row>
                  
                  <el-col :span='24'>
                    <div class="" style="text-align: right;">
                      <el-upload
                        class="upload-demo"
                        ref="upload"
                        :action="action"
                        :limit="99"
                        :headers="headers"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        accept=".png,.bmp,.jpg,.jpeg,.pptx,.ppt,.doc,.docx,.xlx,.xlsx,.pdf,.txt"
                        :on-progress="uploadProcess"
                        :on-change="handleChangeFile"
                        >
                        <el-button type="primary" icon="el-icon-plus" size="small"></el-button>

                      </el-upload>
                    </div>
                    <el-table :data="dataEdit" border>
                      <el-table-column 
                        label="序号" 
                        type="index" 
                        align="center" 
                        width="80"
                      >
                      </el-table-column>
                    
                      
                      <el-table-column :label="editData.respType == 1?'证书文件' : editData.respType == 2?'上传文件':'培训证明文件'" align="center" prop="name" show-overflow-tooltip>
                        
                      </el-table-column>

                      <el-table-column label="有效期" align="center" v-if="editData.respType == 1">
                        <template slot="header" >
                          <div> <span style="color:red;">*</span> 有效期</div>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker
                              v-model="scope.row.releaseTime"
                              type="daterange"
                              size="large"
                              style="width:100%;"
                              value-format="yyyy-MM-dd hh:mm:ss"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              @change="pickerChange($event,scope.$index)"
                              >
                            </el-date-picker>
                        </template>
                      </el-table-column>

                      <el-table-column label="实际完成时间" align="center" :render-header="renderHeader">
                        <template slot-scope="scope">
                            <div class="slot_class">{{scope.row.completionTime.substring(0,16)}}</div>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="right" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button  
                          class="info" 
                          type="text"  
                          size="small"
                          @click="lookHandle(scope.row.downloadUrl,scope.row.fileType)"
                          >预览</el-button>

                          <el-button  class="info" type="text"  size="small" @click="getDownload(scope.row)">下载</el-button>

                          <!-- <el-button  class="info" type="text" size="small" @click="handleDelet(scope.$index)">删除</el-button> -->
                          <!-- <del-popover
                            :valText="scope.row.name"
                            class="delInfo"
                            @submitFun="handleDelet(scope.$index)"
                          ></del-popover> -->
                          <el-button
                            class="delInfo handle-text-btn"
                            @click="handleDelet(scope.row,scope.$index)"
                           size="small"
                            type="text"
                            style="font-size:12px"
                          >删除</el-button>
                        </template>

                      </el-table-column>
                    </el-table>
                  </el-col>
                  
                </el-row>
                
            </div>
            <button-footer
      :showBackup="true"
      :showCancel="false"
      :showConfirm="false"
      :backupText="'提交'"
      @backup="handleSave"
    ></button-footer>
          </el-col>
          <el-col :span="8"  style="padding: 30px">
            <div class="" v-if="editData.contentDto">
                <el-row>
                    <el-col :span='24'>
                      <div class="item-line1-box">
                        <div class="item-line1">
                          <div class="item-label" >
                              <div>
                                  <span>履职项目：</span>
                              </div>
                          </div>
                          <div class="item-text">
                            <div>{{editData.itemName}}</div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                      <div class="item-line1-box">
                        <div class="item-line1">
                          <div class="item-label" >
                              <div>
                                  <span>职责内容：</span>
                              </div>
                          </div>
                          <div class="item-text">
                            <div>{{editData.content}}</div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                      <div class="item-line1-box">
                        <div class="item-line1">
                          <div class="item-label" >
                              <div>
                                  <span>职责标准：</span>
                              </div>
                          </div>
                          <div class="item-text">
                            <div>{{editData.contentDto.standard}}</div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                      <div class="item-line1-box">
                        <div class="item-line1">
                          <div class="item-label" >
                              <div>
                                  <span>佐证材料要求：</span>
                              </div>
                          </div>
                          <div class="item-text">
                            <div>{{editData.contentDto.evidence}}</div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <ty-multi-text
                                :label="'要求完成时间'"
                                v-model="editData.askTime"
                                :allowUpdate="false"
                        >
                        </ty-multi-text>
                    </el-col>
                </el-row>
                <el-row v-if="editData.contentDto.respType == 3 || editData.contentDto.respType == 4">
                    <el-col :span='24'>
                        
                        <div class="item-line1-box">
                          <div class="item-line1">
                            <div class="item-label" >
                                <div>
                                    <span>要求课程：</span>
                                </div>
                            </div>
                            <div class="item-text">
                              <div>{{editData.contentDto.courseRequire}}</div>
                            </div>
                          </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="editData.contentDto.respType == 3 || editData.contentDto.respType == 4">
                    <el-col :span='24'>
                        <div class="item-line1-box">
                          <div class="item-line1">
                            <div class="item-label" >
                                <div>
                                    <span>培训人员：</span>
                                </div>
                            </div>
                            <div class="item-text">
                              <div>{{editData.contentDto.trainee}}</div>
                            </div>
                          </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="editData.contentDto.respType == 3 || editData.contentDto.respType == 4">
                    <el-col :span='24'>
                    <div class="item-line1-box">
                      <div class="item-line1">
                        <div class="item-label" >
                            <div>
                                <span>学习时长：</span>
                            </div>
                        </div>
                        <div class="item-text">
                          <div>{{editData.contentDto.courseHour}}小时</div>
                        </div>
                      </div>
                    </div>
                    </el-col>
                </el-row>
                <el-row v-if="editData.contentDto.respType == 1 || editData.contentDto.respType == 2">
                    <el-col :span='24'>
                       <div style="margin-left:50px;display: flex;justify-content: flex-start">
                           <div class="item-label" style="margin-right: 20px;white-space:nowrap;">{{(editData.contentDto.respType == 1?'要求证书':'要求文件')}}:</div>
                         <div v-if="editData.contentDto.respType == 1">
                             <el-tag size="small" type="primary"  style="margin:0 10px 10px 0"
                                     v-for="tag in tags" :key="tag.name"> {{tag.name}}</el-tag>
                         </div>
                          <div v-if="editData.contentDto.respType == 2">
                              <el-tag size="small" type="primary"  style="margin:0 10px 10px 0"
                                      v-for="tag in tags1" :key="tag.name"> {{tag.name}}</el-tag>
                          </div>
                          <div style="font-size:14px;" v-if="(tags1.length == 0 && tags.length ==0)">暂无</div>
                       </div>
                    </el-col>
                </el-row>
            </div>
          </el-col>
      </el-row>
      </div>
      
   
    <view-image v-if="showViewer" :on-close="closeViewer" :url-list="srcList" ></view-image>
    <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" /> -->
      </div>
    </template>
     </hqit-content-page>
</template>
<script>
  import {fileInfo} from '@/api/common';

  import UploadFile from "@/components/secondControlList/UploadFile"
  import ViewImage from "@/components/viewImage/index.vue";
  import {getBct,getUdc} from "@/api/entryRequire/entryRequire";
  import { errorBoundary, delPrompt } from "@/utils/tool.js";
  import {getInfo,getDownload} from "@/api/performanceRecord/index"
  import {addList} from "@/api/stayPerformance/index"
  //vue
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  //vue
  import FormTitle from "@/components/formTitle/FormTitle"
  export default {
    components: {
      ButtonFooter,
      UploadFile,
      FormTitle,
      ViewImage,
    },
    
    data() {
      return {
        isLoad:false,
        isReport:false,
        tags:[],
        tags1:[],
        dataEdit:[],
        imageUrl:'',
        srcList:[],
        loading:null,
        showViewer:false,
        headers:{
          Authorization:this.$store.state.user.token
        },
        action:`${process.env.VUE_APP_BASE_API}/api/sysfile/file_info/upload`,
        outSiderQuery:{},
        statuteId: null,
        fileIdList:[],
        editData: {},

        isUpdate: false,
        isCheck: false,
        fileList:[]
      };
    },
    computed:{
      taskDate:{
        get: function () {
          if(this.editData.appointmentDate){
            return this.editData.appointmentDate.substring(0,10)
          }else{
            return '-'
          }
          },
        set: function () {
          
        }
      },
      timeRemaining:{
        get: function () {
          if(this.editData.timeRemaining){
            let color
            this.editData.isOverdue == '是' ? color = 'red' : color = '#026DFF'
            return `${this.editData.isOverdue == '是' ? '逾期' : '剩余'}`+this.editData.timeRemaining.replace(/[0-9]+/g, `<span style="color:${color}">$&</span>`)
          }else{
            return ''
          }
        },
        set: function () {
          
        }
        
      }
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
      async handleSave(){
        if(!this.dataEdit.length){
          this.$message.error('请添加证书文件！');
          return
        }

        if(this.dataEdit.filter(i=>!i.releaseTime).length && this.editData.respType ==1){
          this.$message.error('请完整填写有效期！');
          return
        }
        if(this.editData.respType ==1){
          this.dataEdit.map(i=>{
            i.validStartDate = i.releaseTime[0]
            i.validEndDate = i.releaseTime[1]
          })
        }
        this.dataEdit.map(i=>{
          if(i.id) delete i.id
        })
        const res = await addList(this.dataEdit)
        if(res.code == 200){
          this.messageSuccess("操作成功！");
          this.$router.go(-1)
        }
      },
      lookHandle(url,type){
        console.log(type)
        if(type == 'image'){
          this.srcList.push(url)
          this.showViewer = true
          return
        }
        this.previewFile(url)
      },
      pickerChange(data,index){
        // console.log(data,index)
        
      },
      onPreview() {
        
      },
      uploadProcess(event, file, fileList){
        if(!this.loading){
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
      handleChangeFile(file, fileList){
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
      renderHeader(h, { column, $index }) {
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
      closeViewer() {
        this.showViewer = false
      },
      async getBct(id){
        const res = await getBct(id)
        this.tags.push(res.data)
      },
      async getUdc(id){
        const res = await getUdc(id)
        this.tags1.push(res.data)
      },
      handleAvatarSuccess(res){
        console.log(res)
        let obj = {}
        obj.taskId = this.statuteId
        obj.name = res.data.name
        obj.fileId = res.data.id
        obj.fileType = res.data.fileType
        obj.downloadUrl = res.data.downloadUrl
        obj.completionTime = res.data.updateTime
        obj.validStartDate = ''
        obj.validEndDate = ''
  
        this.dataEdit.push(obj)
      },
   async  handleDelet(row,i){
        const valid = await errorBoundary(delPrompt(this, row.name));
        if (valid) {
           this.dataEdit.splice(i,1)
            this.msgSuccess('删除成功')
        } else {
          this.$message({
            message: "删除取消",
          });
        }
      },
      getDownload(row){
        console.log(row)
        getDownload({id: row.fileId}).then((res) => {
          const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
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
    
      // 获取详情
      getDetail() {
        getInfo(this.statuteId).then((res) => {
            if(res.code==200){
              this.editData=res.data
              this.editData.content=res.data.contentDto.content
              this.editData.askTime=res.data.contentDto.askTime
              this.editData.respType=res.data.contentDto.respType
              this.$set(this.editData,"contentDto",res.data.contentDto,)
              this.isReport=this.editData.contentDto.issueType==3?true:false
              // 是否逾期 0-未逾期 1-已逾期
              this.editData.isOverdue=res.data.isOverdue==0?'否':'是'
              let certIds=res.data.contentDto.certIds
              let fileIds=res.data.contentDto.fileIds
              if ((certIds != null && certIds.length != 0) || (fileIds != null && fileIds.length != 0)) {
                if(this.editData.contentDto.respType == 1){
                  certIds.map(i=> this.getBct(i))
                }else if(this.editData.contentDto.respType == 2){
                  fileIds.map(i=> this.getUdc(i))
                }
              }
              let arr = res.data.taskProcessList
              arr.map(async i=>{
                if(this.editData.respType == 1) i.releaseTime = [i.validStartDate,i.validEndDate]
                const pic = await fileInfo([i.fileId])
                this.$set(i, 'downloadUrl', pic.data[0].downloadUrl)
                this.$set(i, 'fileType', pic.data[0].fileType)
                this.$set(i, 'name', pic.data[0].name)
              })
              this.dataEdit = arr
            }
              this.isLoad=true
        });
      },
      
     
    },
  };
</script>

<style lang="scss" scoped>
.text-rigth .item-line.flex-align-items{
  align-items: center;
}
.el-col-16{
  height: calc(100vh - 170px);
  position: relative;
}
.slot_class{
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
.button-container.design-form-wrap__btnwrap{
  border-top:none;
}
.item-line1-box{
      position: relative;
      .item-line1{
      display: flex;
      font-size: 14px;
      margin-bottom: 22px;
      align-items: center;
      .item-label{
        display: flex;
        align-items: center;
        text-align: right;
        padding-right: 10px;
      }
      .item-text{
        display: flex;
        align-items: center;
        color: #555;
        width: 100%;
        div{
          width: 100%;
        }
        ::v-deep .el-input__inner{
          width: 100px;
        }
      }
      div{
        width: 126px;
      }
      span{
        color: #868a97;
      }
    }
    }

::v-deep .delInfo{
  margin-left: 10px;
}
::v-deep .button-container.design-form-wrap__btnwrap{
  border-bottom:0;
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
.app-main .app-main-wrap .app-main-ctn > div {
  // padding: 54px 0 0 !important;
  // padding: 0 !important;
  // position: relative;
  // height: 100%;
  // overflow-y: auto;
  // box-sizing: border-box;
}
.item-label{
  text-align: right;
  font-size: 14px;
  color: #868a97;
}

::v-deep .el-button--primary {
  background-color: #026DFF;
  border-radius: 3px;
  height: 30px;
}
</style>
