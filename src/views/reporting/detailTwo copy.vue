<!-- 查看-履职情况 -->
<template>
    <div>
     <!-- <hqit-content-page type="detail" :title="'主动上报履职要求—履职—' + editData.content"> -->
     <hqit-content-page type="detail" :title="'主动上报履职要求—履职'">
        <template slot="content">
        <div style="overflow: hidden;height: calc(100vh - 140px);overflow-y: auto;">
            <el-row>
                <el-col :span="16" style="border-right: 1px solid #ccc;padding-right: 30px">
                    <div class="">
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
                                        v-model="editData.appointmentDate"
                                        :allowUpdate="false"
                                >
                                </ty-multi-text>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <div class="" style="text-align: right;margin-bottom:10px">
                                    <el-upload
                                            class="upload-demo"
                                            :action="action"
                                            :limit="99"
                                            :headers="headers"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
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


                                    <el-table-column label="证书文件" align="center" prop="name" show-overflow-tooltip>

                                    </el-table-column>
                                    <el-table-column label="实际完成时间" align="center" width="200">
                                        <template slot-scope="scope">
                                            <div>{{scope.row.completionTime.substring(0,16)}}</div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="操作" align="right" width="200">
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
                                              >删除</el-button>
                                        </template>

                                    </el-table-column>
                                </el-table>
                            </el-col>

                        </el-row>

                    </div>
                </el-col>
                <el-col :span="8"  style="padding: 30px">
                    <div class="">
                        <el-row>
                            <el-col :span='24'>
                                <ty-multi-text
                                        :label="'履职项目'"
                                        v-model="editData.itemName"
                                        :allowUpdate="false"

                                >
                                </ty-multi-text>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <ty-multi-text
                                        :label="'职责内容'"
                                        v-model="editData.content"
                                        :allowUpdate="false"
                                >
                                </ty-multi-text>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <ty-multi-text
                                        :label="'履职标准'"
                                        v-model="editData.standard"
                                        :allowUpdate="false"
                                >
                                </ty-multi-text>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <ty-multi-text
                                        :label="'佐证材料要求'"
                                        v-model="editData.evidence"
                                        :allowUpdate="false"
                                >
                                </ty-multi-text>
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
                        <el-row v-if="editData.respType == 1 || editData.respType == 2">
                            <el-col :span='24'>
                                <div style="margin-left:50px;display: flex;align-items: center;justify-content: flex-start">
                                    <div class="item-label" style="margin-right: 20px;white-space:nowrap;">{{editData.contentDto.respType == 1?'要求证书':'要求文件'}}:</div>
                                    <div v-if="editData.respType == 1">
                                        <el-tag size="small" type="primary"  style="margin:0 10px 10px 0"
                                                v-for="tag in tags" :key="tag.name"> {{tag.name}}</el-tag>
                                    </div>
                                    <div v-if="editData.respType == 2">
                                        <el-tag size="small" type="primary"  style="margin:0 10px 10px 0"
                                                v-for="tag in tags1" :key="tag.name"> {{tag.name}}</el-tag>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
         </template>
  </hqit-content-page>
        <button-footer
                :showBackup="true"
                :showCancel="false"
                :showConfirm="false"
                :backupText="'提交'"
                @backup="handleSave"
        ></button-footer>
    <view-image v-if="showViewer" :on-close="closeViewer" :url-list="srcList" ></view-image>

    <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" /> -->
    </div>
</template>
<script>
  import {reportAgain} from "@/api/reporting/index";
  import {fileInfo} from '@/api/common';
  import { errorBoundary, delPrompt } from "@/utils/tool.js";

  import UploadFile from "@/components/secondControlList/UploadFile"
  import {getBct,getUdc} from "@/api/entryRequire/entryRequire";
  import {getUdcByCode} from "@/api/entryRequire/entryRequire";
  import {getInfo,getDownload} from "@/api/performanceRecord/index"
  import ViewImage from "@/components/viewImage/index.vue";

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
      ViewImage
    },

    data() {
      return {
        tags:[],
        tags1:[],
        dataEdit:[],
        imageUrl:'',
        srcList:[],
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
        this.dataEdit.map(i=>{
          if(i.id) delete i.id
        })
        let obj={
          id:this.editData.id,
          contentId:this.editData.contentId,
          personId:this.editData.personId,
          taskProcessList:this.dataEdit,
        }
        const res = await reportAgain(obj)
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
        obj.name = res.data.name
        obj.fileId = res.data.id
         obj.fileType = res.data.fileType
        obj.downloadUrl = res.data.downloadUrl
        obj.completionTime = res.data.updateTime
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
              this.editData.standard = res.data.contentDto.standard
            this.editData.evidence = res.data.contentDto.evidence
            this.editData.appointmentDate=this.editData.appointmentDate.substring(0,10)
            this.editData.content=res.data.contentDto.content
            this.editData.askTime=res.data.contentDto.askTime
            this.editData.respType=res.data.contentDto.respType
            // 是否逾期 0-未逾期 1-已逾期
            this.editData.isOverdue=res.data.isOverdue==0?'否':'是'
            let certIds=res.data.contentDto.certIds
            if (certIds != null && certIds.length != 0) {
              if(this.editData.respType == 1){
                certIds.map(i=> this.getBct(i))
              }else if(this.editData.respType == 2){
                // certIds.map(i=> this.getUdc(i))
                                     getUdcByCode("resp_file_type").then(res=>{
            if(res.data){
               this.tags1=res.data.filter(item=>certIds.includes(Number(item.dictValue)))
            }
          })
              }
            }
            let arr = res.data.taskProcessList
            arr.map(async i=>{
              const pic = await fileInfo([i.fileId])
              this.$set(i, 'downloadUrl', pic.data[0].downloadUrl)
              this.$set(i, 'fileType', pic.data[0].fileType)
              this.$set(i, 'name', pic.data[0].name)
            })
            this.dataEdit = arr
            console.log(arr)
          }
        });
      },


    },
  };
</script>

<style lang="scss" scoped>
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
