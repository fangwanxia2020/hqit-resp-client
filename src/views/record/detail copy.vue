<!-- 查看-履职情况 -->
<template>
     <hqit-content-page type="detail" title="履职记录— 查看 —安全生产知识和管理能力合格">
    <template slot="content">
    <div>
        <!-- <back-bar title="履职记录— 查看 —安全生产知识和管理能力合格"/> -->
            <el-row>
                <el-col :span="16" style="border-right: 1px solid #ccc;padding-right: 30px">
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

                      <el-table-column label="有效期" align="center" width="200" prop="validDate" v-if="editData.respType == 1">
                        
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

                        </template>

                      </el-table-column>
                    </el-table>
                    </div>
                </el-col>
                <el-col :span="8" style="padding: 30px">
                    <div class="">
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
                            <div>{{editData.standard}}</div>
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
                                    <div>{{editData.evidence}}</div>
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
        <view-image v-if="showViewer" :on-close="closeViewer" :url-list="srcList" ></view-image>
        <!-- <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" /> -->
    </div>
    </template>
     </hqit-content-page>
</template>
<script>
  import {fileInfo} from '@/api/common';
  import {getBct, getUdc} from "@/api/entryRequire/entryRequire";
  import {getInfo, getDownload, addList} from "@/api/performanceRecord/index"
  //vue
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import UploadFile from "@/components/secondControlList/UploadFile"
    import {getUdcByCode} from "@/api/entryRequire/entryRequire";
  //vue
  import FormTitle from "@/components/formTitle/FormTitle"
  import ViewImage from "@/components/viewImage/index.vue";

  export default {
    components: {
      ButtonFooter,
      UploadFile,
      FormTitle,
      ViewImage

    },
    computed:{
      taskDate:{
        get: function () {
          if(this.editData.appointmentDate){
            return this.editData.appointmentDate.substring(0,10)
          }else{
            return ''
          }
          },
        set: function () {
          
        }
      },
      timeRemaining:{
        get: function () {
                if(this.editData.timeRemaining == "-"){
            return '-'
          }
         else if(this.editData.timeRemaining){
            let color
            this.editData.isOverdue == '是' ? color = 'red' : color = '#026DFF'
            return `${this.editData.isOverdue == '是' ? '逾期' : '剩余'}`+this.editData.timeRemaining.replace(/[0-9]+/g, `<span style="color:${color}">$&</span>`)
          }
        },
        set: function () {
          
        }
        
      }
    },
    data() {
      return {
        isReport:false,
        imageUrl:'',
        srcList:[],
        dataEdit:[],
        showViewer:false,
        tags: [],
        tags1: [],
        outSiderQuery: {},
        statuteId: null,
        //列表字段定义
        columns: [
          {
            label: "证书文件",
            align: "left",
            prop: "fileId",
          },
          {
            label: "有效期",
            align: "left",
            prop: "validEndDate",
          },
          {
            label: "实际完成时间",
            prop: "completionTime",
            width: 160,
            formatter: (val) => {
              if (val) {
                return val.substring(0, 16);
              }
            },
          },
          {
            prop: "operation",
            label: "操作",
            type: "operation",
            width: 120,
            fixed: 'right',
            align: 'right',
          },
        ],
       
        fileIdList: [],
        editData: {},

        isUpdate: false,
        isCheck: false,
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
      async getBct(id) {
        const res = await getBct(id)
        this.tags.push(res.data)
        console.log(res)
      },
      async getUdc(id) {
        const res = await getUdc(id)
        this.tags1.push(res.data)
      },
      lookHandle(url,type){
        if(type == 'image'){
          this.srcList.push(url)
          this.showViewer = true
          return
        }
        this.previewFile(url)
      },
      closeViewer() {
        this.showViewer = false
      },
      getDownload(row) {
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
          if (res.code == 200) {
            this.editData = res.data
            this.editData.content = res.data.contentDto.content
            this.editData.standard = res.data.contentDto.standard
            this.editData.evidence = res.data.contentDto.evidence
            this.editData.askTime = res.data.contentDto.askTime
            this.editData.respType = res.data.contentDto.respType
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
                  // fileIds.map(i=> this.getUdc(i))
                   getUdcByCode("resp_file_type").then(res=>{
            if(res.data){
               this.tags1=res.data.filter(item=> fileIds.includes(Number(item.dictValue)))
            }
          })
                }
              }
              let arr = res.data.taskProcessList
              arr.map(async i=>{
                if(i.validStartDate){
 this.$set(i, 'validDate', i.validStartDate.slice(0,10) + '~'+ i.validEndDate.slice(0,10))
                }
                
                if(this.editData.respType == 1) i.releaseTime = [i.validStartDate,i.validEndDate]
                const pic = await fileInfo([i.fileId])
                console.log("pic",pic)
                this.$set(i, 'downloadUrl', pic.data[0].downloadUrl)
                this.$set(i, 'fileType', pic.data[0].fileType)
                this.$set(i, 'name', pic.data[0].name)
              })
              this.dataEdit = arr
            }
        });
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
      back() {
        let path = "/safe/laws";
        if (this.$route.query.isQuery) {
          path = "/safe/lawsQuery";
        }
        this.navigater(path);
      },
    },
  };
</script>

<style lang="scss" scoped>
.text-rigth .item-line.flex-align-items{
  align-items: center;
}
.item-line1-box{
      position: relative;
      .item-line1{
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 22px;
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
    .app-main .app-main-wrap .app-main-ctn > div {
        // padding: 0px !important;
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
</style>
