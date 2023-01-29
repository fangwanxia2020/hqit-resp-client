<template>
     <!-- <hqit-content-page   type="detail" :title="'履职职责—查看—'+$route.query.itemName" > -->
     <hqit-content-page   type="detail" :title="'履职职责—查看'" @back="back">
    <template slot="content">
    <el-row>
      <el-col :span="12">
          <hqit-form
          :config="editDataConfig"
          :form="editData"
          labelPosition="right"
          ref="ruleForm"
          labelSuffix="："
          labelWidth="120px" 
        >
        <template slot="issueType">
          <span>{{issueTypeFormat(editData.issueType)}}</span>
        </template>
        <template slot="respType">
          <span>{{respTypeFormat(editData.respType)}}</span>
        </template>
        <template slot="isOverdue">
          <div class="item-text">
            <div class="tagBox" v-if="editData.respType == 1">
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                >
                {{tag.name}}
              </el-tag>
            </div>
            <div class="tagBox" v-if="(editData.respType == 2)">
              <el-tag
                v-for="tag in tags1"
                :key="tag.name"
                >
                {{tag.name}}
              </el-tag>
            </div>
          </div>
        </template>
        <template slot="courseRequire">
          <span>{{editData.courseRequire}}</span>
        </template>
        <template slot="trainee">
          <span>{{editData.trainee}}</span>
        </template>
        <template slot="courseHour">
          <span>{{editData.courseHour}}小时</span>
        </template>
        <template slot="isPeriodic">
          <span>{{editData.isPeriodic == 0?'否':'是'}}</span>
        </template>
        <template slot="period">
          <span>{{periodFormat(editData.contentPeriodEx.period)}}</span>
        </template>
        <template slot="timeRange">
          <span>{{editData.timeRange == 1?'上任期间':'自定义'}}</span>
        </template>
        <template slot="askTime">
          <span>{{editData.issueType == 3? editData.performData : editData.askTime == 'undefined' ? '暂无': editData.askTime}}</span>
        </template> 
        <template slot="startDate">
          <span>{{startDate1}}</span>
        </template> 
        <template slot="endDate">
          <span>{{endDate1}}</span>
        </template> 
       </hqit-form>
      </el-col>
      <!-- <el-col :span="1"><div class="">
        <div class="content_line"></div>
      </div></el-col> -->
      <el-col :span="12" style="border-left: 1px solid #ccc;">
          <hqit-form
          :config="editDataConfig1"
          :form="editData"
          labelPosition="right"
          ref="ruleForm"
          labelSuffix="："
          labelWidth="120px" 
        >

        </hqit-form>
      </el-col>
    </el-row>
    </template>
     </hqit-content-page>
</template>
<script>
var moment = require('moment');

import utils from "@/assets/js/validator";

  
import {getInfoContent,getBct,getUdc,getUdcByCode} from "@/api/entryRequire/entryRequire";
  //vue
  import ButtonFooter from "@/components/buttonFooter/ButtonFooter"
  import UploadFile from "@/components/secondControlList/UploadFile"
  import DateTime from "@/components/secondControlList/DateTime"

 
  export default {
    components: {
      UploadFile,
      ButtonFooter,
      DateTime
    },
    data() {
      return {
        checked:false,
        show:false,
        isCheck: false,
        isUpdate: false,
        monthlyType:'',
        tags:[],
        tags1:[],
        editDataConfig:[
          {
            label: "下发类型",
            slotName:"issueType",
            required: true,
            properties: {},
            span: 24,
          },
           {
            label: "履职方式",
            slotName: "respType",
            required: true,
            properties: {},
            span: 24,
          },
          {
            label: "履职文件要求",
            slotName:"isOverdue",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "履职课程要求",
            slotName:"courseRequire",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "培训人员",
            slotName:"trainee",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "学习时长",
            slotName:"courseHour",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },

          {
            label: "周期性任务",
            slotName: "isPeriodic",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "周期",
            slotName: "period",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "履职时间要求",
            slotName: "timeRange",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "要求完成时间",
            slotName: "askTime",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "要求开始时间",
            slotName: "startDate",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          {
            label: "要求完成时间",
            slotName: "endDate",
            required: true,
            properties: {},
            span: 24,
            hidden:true
          },
          
        ],
        editDataConfig1:[
          {
            label: "履职版本",
            prop:"keepName",
            type:"text",
            required: true,
            properties: {},
            span: 24,
          },
           {
            label: "履职项目",
            prop: "itemName",
            type:"text",
            required: true,
            properties: {},
            span: 24,
          },
          {
            label: "职责内容",
            prop: "content",
            type:"text",
            required: true,
            properties: {},
            span: 24,
          },
          {
            label: "职责标准",
            prop: "standard",
            type:"text",
            required: true,
            properties: {},
            span: 24,
          },
          {
            label: "佐证材料要求",
            prop: "evidence",
            type:"text",
            required: true,
            properties: {},
            span: 24,
          },
        ],
        editData:{
          issueType:1,
          respType:1,
          courseRequire:'',
          askTime:'',
          trainee:'',
          courseHour:'',
          fileVal:[],
          isPeriodic:0,
          timeRange:1,
          performData:'',
          contentPeriodEx:{
            period:1,
            monthRequireType:1,
            month:'',
            day:'',
            week:'',
            time:''
          },
          itemName:'',
          keepName:'',
          standard: '',
          evidence: '',
          endDate:"",
          startDate:"",
        },
       
        

        issueTypeOptions:[ 
          {
            dictValue: 1, 
            dictLabel: "系统触发",
          },
          {
            dictValue: 2,
            dictLabel: "政府下发",
          },
          {
            dictValue: 3,
            dictLabel: "企业上报",
          }
        ],
        respTypeList:[
          {
            dictValue: 1, 
            dictLabel: "上传证书",
          },
          {
            dictValue: 2,
            dictLabel: "上传文件",
          },
          {
            dictValue: 3,
            dictLabel: "参加培训",
          },
          {
            dictValue: 4,
            dictLabel: "落实培训",
          }
        ],
        isPeriodicOptions:[
          {
            dictValue: 0, 
            dictLabel: "否",
          },
          {
            dictValue: 1,
            dictLabel: "是",
          }
        ],
        timeRangeOptions:[
          {
            dictValue: 1, 
            dictLabel: "上任期间",
          },
          {
            dictValue: 2,
            dictLabel: "自定义",
          },
        ],
        periodList:[
          {
            dictValue: 1, 
            dictLabel: "每年",
          },
          {
            dictValue: 2,
            dictLabel: "每月",
          },
          {
            dictValue: 3,
            dictLabel: "每周",
          },
          {
            dictValue: 4,
            dictLabel: "每天",
          },
        ],
        options1: [{
          value: 1,
          label: '完成于月的某天'
        }, {
          value: 2,
          label: '完成于月的最后一天'
        }],
        options2: [{
          value: 1,
          label: '周一'
        }, {
          value: 2,
          label: '周二'
        }, {
          value: 3,
          label: '周三'
        }, {
          value: 4,
          label: '周四'
        }, {
          value: 5,
          label: '周五'
        }, {
          value: 6,
          label: '周六'
        }, {
          value: 7,
          label: '周日'
        }],
        options3: [],
      };
    },
    computed:{
      startDate1(){
        if(this.editData.startDate){
          return this.editData.startDate.substring(0,10)
        }
      },
      endDate1(){
        if(this.editData.endDate){
         return this.editData.endDate.substring(0,10)
        }
      },
    },
    watch:{
      
    },
    async created(){
      let date = moment().format("YYYY-MM-DD")
      const {itemId,keepName,itemName,id,askTime} = this.$route.query

      
      const res = await getInfoContent(id)
      this.editData = res.data
      if(this.editData.respType == 1 || this.editData.respType == 2){
        this.editDataConfig[2].hidden = false
      }else{
        this.editDataConfig[3].hidden = false
        this.editDataConfig[4].hidden = false
        this.editDataConfig[5].hidden = false

      }
      if(this.editData.issueType == 1) this.editDataConfig[6].hidden = false
      if(this.editData.isPeriodic == 1 && this.editData.issueType == 1) this.editDataConfig[7].hidden = false
      if(this.editData.issueType == 1 && this.editData.isPeriodic == 0) this.editDataConfig[8].hidden = false
      if(this.editData.timeRange == 1 || this.editData.isPeriodic == 1 || this.editData.issueType == 2 || this.editData.issueType == 3) this.editDataConfig[9].hidden = false
      if(this.editData.issueType == 1 && this.editData.timeRange == 2 && this.editData.isPeriodic == 0){
        this.editDataConfig[10].hidden = false
        this.editDataConfig[11].hidden = false
      }
      

      if(this.editData.contentPeriodEx && this.editData.contentPeriodEx.period == 4){
        this.editData.contentPeriodEx.time = this.editData.contentPeriodEx.time.substring(11,16)
      }else if(!this.editData.contentPeriodEx){
        this.editData.contentPeriodEx = {}
        this.editData.contentPeriodEx.period = 1
        switch (this.editData.issueType) {
          case 1:
            this.editData.performData = this.editData.monthBefore
            break;
          case 2:
            this.editData.performData = this.editData.dayOffset
            break;
          case 3:
            this.editData.performData = this.editData.reportedAsk
            break;
        }
      }
      if(this.editData.respType == 1){
        this.editData.certIds.map(i=> this.getBct(i))
      }else if(this.editData.respType == 2){
        // console.log("i",i)
        this.editData.fileIds.map(i=> this.getUdc(i))
        //  this.entryForm.tags1.push(res.data)
          getUdcByCode("resp_file_type").then(res=>{
            if(res.data){
               this.tags1=res.data.filter(item=> this.editData.fileIds.includes(Number(item.dictValue)))
            }
          })


      }
      this.editData.keepName = keepName
      this.editData.itemName = itemName
      this.editData.askTime = askTime
      this.itemId = itemId
      let dd = 0 ,mm = 0,arr = []
      for (let index = 0; index < 48; index++) {
        let obj = {
          label: `${ String(dd).length == 1 ? '0'+dd : dd }:${ String(mm).length == 1 ? '0'+mm : mm}`,
          value:`${date + ' ' + (String(dd).length == 1 ? '0'+dd : dd) }:${ String(mm).length == 1 ? '0'+mm : mm }:00`
        }
        arr.push(obj)
        mm+=30
        if(mm==60){
          dd+=1
          mm=0
        }
      }
      this.options3 = arr



    },
   
    methods: {


      async getBct(id){
        const res = await getBct(id)
        this.tags.push(res.data)
        console.log(res)
      },
      async getUdc(id){
        const res = await getUdc(id)
        this.tags1.push(res.data)
      },
      issueTypeFormat(value){
        for (let i = 0; i < this.issueTypeOptions.length; i++) {
					if (this.issueTypeOptions[i].dictValue == value) {
						return this.issueTypeOptions[i].dictLabel
					}
				}
      },
      respTypeFormat(value){
        for (let i = 0; i < this.respTypeList.length; i++) {
					if (this.respTypeList[i].dictValue == value) {
						return this.respTypeList[i].dictLabel
					}
				}
      },
      periodFormat(value){
        for (let i = 0; i < this.periodList.length; i++) {
					if (this.periodList[i].dictValue == value) {
						return this.periodList[i].dictLabel
					}
				}
      },
      back(){
        this.$router.push({
          path:"/resp/entryRequire/index",
          query:{
            docId:this.$route.query.docId
          }
        })
      }
    },
  };

</script>

<style lang="scss" scoped >
.app-main .app-main-wrap .app-main-ctn > div{
  //  padding: 54px 0 0 !important;
  //  padding:0 !important;
}
.app-main-ctn > div > .el-form, .hse-form, ::v-deep  .searchBox-form{
  border-bottom: none !important;
  padding: 30px;
}
.tagBox{
  white-space: normal;
  width: 100% !important;
  ::v-deep .el-tag{
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
::v-deep .button-container.design-form-wrap__btnwrap{
  border-bottom:0;
  position: absolute;
  bottom: 18px;
  left: 0;
  background: #fff !important;
}
.monthRequireType ::v-deep{
  .el-input--medium>.el-input__inner{
    width: 60px !important;
  }
  .el-input__inner{
    width: 180px !important;
  }
}
.issueType ::v-deep{
  .el-input__inner{
    width: 100% !important;
  }
}
 .content{
  // height: 90%;
  // box-sizing: border-box;
  // overflow: hidden;
    &_line{
      width: 1px;
      height: 350px;
      background: #ccc;
      margin: 0 auto 120px;

    }
    .item-line1-box{
      position: relative;
      .item-line1{
      display: flex;
      color: #f56c6c;
      font-size: 14px;
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
    
    .item-line1-box1{
      position: relative;
      .item-line1{
        display: flex;
        color: #f56c6c;
        font-size: 14px;
        margin-bottom: 22px;
        .item-label{
          display: flex;
          text-align: right;
          padding-right: 10px;
        }
        .item-text{
          color: #555;
          white-space: nowrap;
          flex-grow: 2;
          span{
            color: #026dff;
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

  
 }
</style>
