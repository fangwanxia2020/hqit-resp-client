<template>
  <div class="content">
    <hqit-content-page type="detail" :title="backTitle" @back="back">
      <template slot="content">
        <el-form ref="entryForm" :model="entryForm" label-position="right" label-width="120px" :rules="entryRules">
          <el-row style="margin-bottom:40px">
            <el-col :span="11" >
              <el-row >
                <el-col :span="24" >
                  <ty-radio2 label="下发类型" :allowNull="(isUpdate || isCheck)" :radioOptions="issueTypeOptions"
                    :value.sync="editData.issueType"></ty-radio2>
                </el-col>

                <el-col :span="20">
                  <ty-dropdown label="履职方式" :value.sync="editData.respType" :fieldMapperList="respTypeList"
                    :allowUpdate="true" :allowNull="false" :validate="editDataRules.respType"
                    :formErrorMsg.sync="editDataErrorMsg.respType">
                  </ty-dropdown>
                </el-col>
                <el-col :span='24' v-show="editData.respType == 1 || editData.respType == 2">
                  <el-form-item  class="formItem5" label="履职文件要求："
                    :prop="editData.respType == 1 ? 'tags' :editData.respType == 2 ? 'tags1': 'empty'">
                    <div class="" style="margin-left:6px">
                      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleShow()">
                        {{editData.respType == 2 ? '选择文件': '选择证书'}}</el-button>
                      <div class="tagBox" v-show="editData.respType == 1">
                        <el-tag v-for="tag in entryForm.tags" :key="tag.name" closable :type="tag.type"
                          @close="handleClose(tag)">
                          {{tag.name}}
                        </el-tag>
                      </div>
                      <div class="tagBox" v-show="(editData.respType == 2)">
                        <el-tag v-for="tag in entryForm.tags1" :key="tag.name" closable :type="tag.type"
                          @close="handleClose1(tag)">
                          {{tag.name}}
                        </el-tag>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="20" v-show="editData.respType == 3 || editData.respType == 4">
                  <ty-multi-text style="padding-left:6px" :label="'履职课程要求'" :labelStyle="labelStyle" v-model="editData.courseRequire" :allowUpdate="!isCheck"
                    :placeholder="'如有多个课程，请以（；）分开'" :allowNull="(isUpdate || isCheck)"
                    :formErrorMsg.sync="editDataErrorMsg.courseRequire" :validate="editDataRules.courseRequire"
                    :maxlength="50"  :showWordLimitInInput ="true">
                  </ty-multi-text>
                </el-col>
                <el-col :span="20" v-show="editData.respType == 3 || editData.respType == 4">
                  <ty-multi-text style="padding-left:6px" :label="'培训人员'" :labelStyle="labelStyle" v-model="editData.trainee" :allowUpdate="!isCheck"
                    :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="editDataErrorMsg.trainee"
                    :validate="editDataRules.trainee" :maxlength="50"  :showWordLimitInInput ="true">
                  </ty-multi-text>
                </el-col>
                <el-col :span="20" v-show="editData.respType == 3 || editData.respType == 4">

                  <el-form-item label="学习时长："
                  style="padding-left:6px"
                    :prop="editData.respType == 3 || editData.respType == 4?'courseHour' : 'empty'">
                    <div class="form-text">
                      <el-input size="medium"
                        oninput="value=value.replace(/[^\d]/g,'');if( value > 999)value=1" class="iputNum"
                        v-model="entryForm.courseHour" type="number" maxlength="3"></el-input>
                      <div style="margin-left:10px;">小时</div>
                    </div>
                  </el-form-item>
                </el-col>



                <el-col :span="24" v-show="editData.issueType == 1">
                  <ty-radio2 label="周期性任务" :allowNull="(isUpdate || isCheck)" :radioOptions="isPeriodicOptions"
                    :value.sync="editData.isPeriodic"></ty-radio2>
                </el-col>

                <el-col :span="20" v-show="editData.isPeriodic == 1 && editData.issueType == 1">
                  <ty-dropdown label="周期" :value.sync="editData.contentPeriodEx.period" :fieldMapperList="periodList"
                    :allowUpdate="true" :allowNull="false" :validate="editDataRules.period"
                    :formErrorMsg.sync="editDataErrorMsg.period">
                  </ty-dropdown>
                </el-col>

                <el-col :span="24" v-show="editData.issueType == 1 && editData.isPeriodic == 0">
                  <ty-radio2 label="履职时间要求" :allowNull="(isUpdate || isCheck)" :radioOptions="timeRangeOptions"
                    :value.sync="editData.timeRange"></ty-radio2>
                </el-col>

                <el-col :span='20'
                  v-show="editData.timeRange == 1 || editData.isPeriodic == 1 || editData.issueType == 2 || editData.issueType == 3">
                  <div class="item-line1-box" :class="editData.issueType == 3 ? 'issueType' : 'iputNum'">
                    <div class="item-line1">
                      <div class="item-label">
                        <div>
                          <em>*</em>
                          <span>要求完成时间：</span>
                        </div>
                      </div>
                      <div class="item-text"
                        v-show="(editData.isPeriodic == 0 && editData.issueType == 1) || editData.issueType == 2 || editData.issueType == 3">
                        <div v-show="editData.issueType != 3" style="margin-right:10px;">
                          {{editData.issueType == 1 ? "上任后" : "下发后第"}}</div>
                        <el-input size="medium" v-if="editData.issueType == 1" v-model="editData.performData"
                          type="number" oninput="value=value.replace(/[^\d]/g,'');">
                        </el-input>
                        <el-input size="medium" v-if="editData.issueType == 2" v-model="editData.performData"
                          type="number"></el-input>
                        <el-input size="medium" v-if="editData.issueType == 3" v-model="editData.performData"
                          placeholder="请输入" type="text" maxlength="50" show-word-limit></el-input>
                        <div v-show="editData.issueType != 3" style="margin-left:10px;">
                          {{editData.issueType == 1 ? "个月前" : "天前"}}</div>
                      </div>

                      <div class="item-text"
                        v-show="editData.isPeriodic == 1 && editData.contentPeriodEx.period == 1 && editData.issueType == 1">
                        <el-input size="medium" min='1' v-model="editData.contentPeriodEx.month"
                          oninput="value=value.replace(/[^\d]/g,'');if( value>12)value=1" class="iputNum"
                          type="number"></el-input>
                        <div style="margin-left:10px;margin-right:10px;">月</div>
                        <el-input size="medium" min='1' v-model="editData.contentPeriodEx.day"
                          oninput="value=value.replace(/[^\d]/g,'');if( value>31 )value=1" class="iputNum"
                          type="number"></el-input>
                        <div style="margin-left:10px;">日前</div>
                      </div>

                      <div class="item-text monthRequireType"
                        v-show="editData.isPeriodic == 1 && editData.contentPeriodEx.period == 2 && editData.issueType == 1">
                        <el-select style="width:200px;" v-model="editData.contentPeriodEx.monthRequireType"
                          placeholder="请选择">
                          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                        <div style="display: flex;align-items: center;margin-left:10px;"
                          v-show="editData.contentPeriodEx.monthRequireType == 1 && editData.issueType == 1">
                          <el-input size="medium" v-model="editData.contentPeriodEx.day"
                            oninput="value=value.replace(/[^\d]/g,'');if(value>31 )value=1" class="iputNum"
                            type="number" ></el-input>
                          <div style="margin-left:10px;">日前</div>
                        </div>
                      </div>

                      <div class="item-text"
                        v-show="editData.isPeriodic == 1 && editData.contentPeriodEx.period == 3 && editData.issueType == 1">
                        <el-select style="width:200px;" v-model="editData.contentPeriodEx.week" placeholder="请选择">
                          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                        <div style="margin-left:10px;">前</div>
                      </div>
                      <div class="item-text"
                        v-show="editData.isPeriodic == 1 && editData.contentPeriodEx.period == 4 && editData.issueType == 1">
                        <el-select v-model="editData.contentPeriodEx.time" placeholder="请选择">
                          <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                        <div style="margin-left:10px;">前</div>
                      </div>
                    </div>
                    <span class="verify verify1" v-show="finishShow">请输入完成时间</span>
                  </div>
                </el-col>


                <el-col :span="20"
                  v-show="editData.issueType == 1 && editData.timeRange == 2 && editData.isPeriodic == 0">
                  <date-time label="要求开始时间" :value.sync="editData.startDate" :allowUpdate="true" :allowNull="false"
                    :pickerOptions="pickerOptions1" :type="'date'" :timeFormat="'yyyy-MM-dd'"
                    :formErrorMsg.sync="editDataErrorMsg.startDate" :validate="editDataRules.startDate" />
                </el-col>
                <el-col :span="20"
                  v-show="editData.issueType == 1 && editData.timeRange == 2 && editData.isPeriodic == 0">
                  <date-time label="要求完成时间" :value.sync="editData.endDate" :allowUpdate="true" :allowNull="false"
                    :pickerOptions="pickerOptions" :type="'date'" :timeFormat="'yyyy-MM-dd'"
                    :formErrorMsg.sync="editDataErrorMsg.endDate" :validate="editDataRules.endDate" />
                </el-col>
              </el-row>

            </el-col>
            <el-col :span="2">
              <div class="">
                <div class="content_line"></div>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="">
                <el-col :span="20">
                  <ty-multi-text :label="'履职版本'"  :labelStyle="labelStyle" v-model="editData.keepName" :allowUpdate="isCheck"
                    :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="editDataErrorMsg.name"
                    :validate="editDataRules.name">
                  </ty-multi-text>
                </el-col>
                <el-col :span="20">

                  <div class="item-line1-box">
                    <div class="item-line1" style="align-items: flex-start;">
                      <div class="item-label">
                        <div>
                          <em>*</em>
                          <span>履职项目：</span>
                        </div>
                      </div>
                      <div class="item-text1">
                        <div>{{editData.itemName}}</div>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="20">
                  <ty-multi-text :label="'职责内容'" :labelStyle="labelStyle" v-model="editData.content" :allowUpdate="!isCheck"
                    :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="editDataErrorMsg.content"
                    :validate="editDataRules.content" :maxlength="100" :showWordLimitInInput="true">
                  </ty-multi-text>
                </el-col>
                <el-col :span="20" class="custom_item">
                  <ty-multi-text :label="'职责标准'"  :labelStyle="labelStyle" :type="'textarea'" v-model="editData.standard" :allowUpdate="!isCheck"
                    :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="editDataErrorMsg.standard"
                    :validate="editDataRules.standard" :showWordLimitInInput="true" :maxlength="200">
                  </ty-multi-text>
                </el-col>

                <el-col :span="20" class="custom_item">
                  <ty-multi-text :label="'佐证材料要求'"  :labelStyle="labelStyle" :type="'textarea'" v-model="editData.evidence" :allowUpdate="!isCheck"
                    :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="editDataErrorMsg.evidence" :maxlength="100"
                    :validate="editDataRules.evidence" :showWordLimitInInput="true">
                  </ty-multi-text>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </el-form>
        
        <hqit-dialog 
                title="选择证书" 
                v-model="show"
                :close-on-click-modal="true"
                dialogType="form"
                 width="900px"
        >
              <hqit-table
                  ref="table"
                  :dataSource="getTableList"
                  :columns="columns"
                  height="200px"
                  labelWidth="88px"
                  :showSeparator="true"
                  :searchConfig="searchConfig"
                  :showSelect="true"
                  :singleSelect="false"
                  rowKey="id"
                  :useExpr="false"
                  :showIndex="false"
                  @reset="resetForm"
                  @search="handleSearch"
                  @selectionChange="selectionChange"
                >
                </hqit-table>
          <div slot="footer" class="dialog-footer">
            <div @click="show = false" class="dialog-cancel" style="margin-right:10px">取消</div>
            <div class="dialog-submit" @click="handleComplete">确定</div>
          </div>
        </hqit-dialog>


        <!-- <el-dialog title="选择证书" :visible.sync="show" width="900px">
          <div>
            <ty-business-crud1 class="high-search-crud" id="id" :outSiderQuery="outSiderQuery" :isGetListByQuery="true"
              title searchMode="base" :showOperation="[]" :showIndex="$showIndex" :pageInfo="{ limit: 5 }"
              :getListInterface="getListInterface" :columns="columns" :showSearchFields="[]" ref="question"
              @resetSearch="resetSearchFun" showSelect @checkedChange="handleSelectionChange" @search="handleSearch">
              <template slot="search">
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label">证书编号:</label>
                  <div class="el-form-item__content">
                    <el-input size="medium" v-model="credentialData.credentialId" placeholder="请输入" clearable>
                    </el-input>
                  </div>
                </div>
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label">证书名称:</label>
                  <div class="el-form-item__content">
                    <el-input size="medium" v-model="credentialData.credentialName" placeholder="请输入" clearable>
                    </el-input>
                  </div>
                </div>
              </template>
            </ty-business-crud1>
          </div>
          <span slot="footer" class="dialog-footer">
            <div @click="show = false" class="dialog-cancel" style="margin-right:10px">取消</div>
            <div class="dialog-submit" @click="handleComplete">确定</div>
          </span>
        </el-dialog> -->

        <hqit-dialog 
                title="选择文件" 
                v-model="fileShow"
                :close-on-click-modal="true"
                dialogType="form"
                 width="900px"
        >
              <hqit-table
                  ref="table1"
                  :dataSource="getTableList1"
                  :columns="columns1"
                  height="200px"
                  labelWidth="88px"
                  :showSeparator="true"
                  :searchConfig="searchConfig1"
                  :showSelect="true"
                  :singleSelect="false"
                  rowKey="id"
                  :useExpr="false"
                  :showIndex="false"
                  @reset="resetForm1"
                  @search="handleSearch1"
                  @selectionChange="selectionChange1"
                >
                </hqit-table>
          <div slot="footer" class="dialog-footer">
            <div @click="fileShow = false" class="dialog-cancel" style="margin-right:10px">取消</div>
            <div class="dialog-submit" @click="handleComplete1">确定</div>
          </div>
        </hqit-dialog>

        <!-- <el-dialog title="选择文件" :visible.sync="fileShow" width="900px">
          <div>
            <ty-business-crud1 class="high-search-crud" id="id" title searchMode="base" :outSiderQuery="outSiderQuery1"
              :isGetListByQuery="true" :showOperation="[]" :showIndex="$showIndex" :pageInfo="{ limit: 10 }"
              :getListInterface="getListInterface1" :columns="columns1" :showSearchFields="[ ]" ref="question1"
              @resetSearch="resetSearchFun1" showSelect @checkedChange="handleSelectionChange1" @search="handleSearch1">
              <template slot="search">
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label">文件编号:</label>
                  <div class="el-form-item__content">
                    <el-input size="medium" v-model="fileData.fileId" placeholder="请输入" clearable></el-input>
                  </div>
                </div>
                <div class="el-form-item el-form-item--medium">
                  <label class="el-form-item__label">文件名称:</label>
                  <div class="el-form-item__content">
                    <el-input size="medium" v-model="fileData.fileName" placeholder="请输入" clearable></el-input>
                  </div>
                </div>
              </template>
            </ty-business-crud1>
          </div>
          <span slot="footer" class="dialog-footer">
            <div @click="fileShow = false" class="dialog-cancel" style="margin-right:10px">取消</div>
            <div class="dialog-submit" @click="handleComplete1">确定</div>
          </span>
        </el-dialog> -->



      </template>
      <template>
      <template slot="operator">
            <hqit-button
              v-if="!isCheck"
              btnType="primary"
              btnText="保存"
              @click="handleSave"
            ></hqit-button>
      </template>
      </template>
    </hqit-content-page>
  </div>
</template>
<script>
  var moment = require('moment');

  import utils from "@/assets/js/validator";


  import {
    contentAdd,
    getInfoContent,
    editContent,
    getBct,
    getUdc,
    getUdcByCode,
    getBctList,
    getUdcList
  } from "@/api/entryRequire/entryRequire";
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
       searchConfig: [
          {
            prop: "id",
            label: "证书编号",
            expression: "LIKE",
            span:10,
            attrs: {
              clearable: true,
              placeholder: "请输入",
            },
          },
          {
            prop: "name",
            label: "证书名称",
            expression: "LIKE",
            span:10,
            attrs: {
              clearable: true,
              placeholder: "请输入",
            },
          },
      ],
      searchConfig1: [
              {
                prop: "id",
                label: "文件编号",
                expression: "LIKE",
                span:10,
                attrs: {
                  clearable: true,
                  placeholder: "请输入",
                },
              },
              {
                prop: "name",
                label: "文件名称",
                expression: "LIKE",
                span:10,
                attrs: {
                  clearable: true,
                  placeholder: "请输入",
                },
              },
          ],
        queryForm: {
        order: "",
        sort: "DESC",
      },
        queryForm1: {
        query:{},
        order: "",
        sort: "DESC",
      },
        labelStyle:{
            width:"120px"
        },
        checked: false,
        show: false,
        fileShow: false,
        isCheck: false,
        isUpdate: false,
        finishShow: false,
        backTitle: '',
        monthlyType: '',
        entryForm: {
          courseHour: '',
          tags: [],
          tags1: [],
        },
        entryRules: {
          courseHour: {
            required: true,
            message: '请输入学习时长',
            trigger: 'blur'
          },
          tags: {
            type: 'array',
            required: true,
            message: '请选择证书',
            trigger: 'change'
          },
          tags1: {
            type: 'array',
            required: true,
            message: '请选择文件',
            trigger: 'change'
          },
        },
        editData: {
          issueType: 1,
          respType: 1,
          courseRequire: '',
          trainee: '',
          fileVal: [],
          isPeriodic: 0,
          timeRange: 1,
          performData: '',
          contentPeriodEx: {
            period: 1,
            monthRequireType: 1,
            month: '',
            day: '',
            week: 1,
            time: ''
          },
          itemName: '',
          keepName: '',
          standard: '',
          evidence: '',
          endDate: "",
          startDate: "",
        },
        //校验错误显示信息
        editDataErrorMsg: {
          content: '', //紧急程度
          standard: '', //紧急程度
          evidence: '', //任务内容
          fileVal: '', //任务内容
          period: '',
          courseRequire:'', //履职课程要求
          trainee:'' //培训人员
        },
        editDataRules: {
          content: {
            required: true,
            validator: utils.validateNull
          },
          standard: {
            required: true,
            validator: utils.validateNull
          },
          evidence: {
            required: true,
            validator: utils.validateNull
          },
            courseRequire: {
            required: true,
            validator: utils.validateNull
          },
                trainee: {
            required: true,
            validator: utils.validateNull
          },
        },
        pickerOptions: {
          //disabledDate是一个函数,参数time是当前选中的日期值,这个函数需要返回一个Boolean值
          disabledDate: (time) => {
            return this.dealDisabledDate(time, this.editData.startDate)
            // dealDisabledDate是自定义的时间处理函数
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return this.dealDisabledDate1(time, this.editData.endDate)
          }
        },
        credentialData: {
          credentialId: '',
          credentialName: ''
        },
        fileData: {
          fileId: '',
          fileName: ''
        },
        outSiderQuery: {
          keyWord: "",
          order: "",
          orderBy: "",
          query: [{
              value: "",
              key: "name",
              expression: "LIKE"
            },
            {
              value: "",
              key: "id",
              expression: "LIKE"
            }
          ],
          sort: "DESC",
          total: 0
        },
        //列表查询接口信息
        getListInterface: {
          url: "/api/basedata/bct/pageByExpr",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
          params: {

          },
        },
        columns: [{
            label: "证书编号",
            prop: "id",
            formatter: (val) => {
              return val ? val : "-";
            },

          },
          {
            label: "证书名称",
            prop: "name",
            formatter: (val) => {
            return val ? val : "-";
          },
          },
        ],
        outSiderQuery1: {
          expr: [{
              value: "",
              key: "name",
              expression: "LIKE"
            },
            {
              value: "",
              key: "id",
              expression: "LIKE"
            }
          ],
          code: "",
          name: "",
          updateName: "",
          updateTime: "",
          order: "createTime",
          sort: "DESC",

        },
        //列表查询接口信息
        getListInterface1: {
          url: "/api/sysudc/udc/pageByQueryExpr",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
          params: {
            udcTypeId: ''
          },
        },

        //         getListInterface1: {
        //   url: `/api/sysudc/udc/typeCodeExpr`,
        //   methodType: "post",
        //   resFormatFun: this.getListResFormatFun,
        //   params: {
        //    dictType:'resp_file_type'
        //   },
        // },
        columns1: [{
            label: "文件编号",
            prop: "id",
          },
          {
            label: "文件名称",
            prop: "name",
          },
          {
            label: "备注",
            prop: "remark",
          }
        ],


        issueTypeOptions: [{
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
        respTypeList: [{
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
        isPeriodicOptions: [{
            dictValue: 0,
            dictLabel: "否",
          },
          {
            dictValue: 1,
            dictLabel: "是",
          }
        ],
        timeRangeOptions: [{
            dictValue: 1,
            dictLabel: "上任期间",
          },
          {
            dictValue: 2,
            dictLabel: "自定义",
          },
        ],
        periodList: [{
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

    watch: {
      'entryForm.tags': {
        deep: true,
        handler(val, oldval) {
          if (val) {
            this.$refs.entryForm.validateField('tags')
          }
        }
      },
      'entryForm.tags1': {
        deep: true,
        handler(val, oldval) {
          if (val) {
            this.$refs.entryForm.validateField('tags1')
          }
        }
      },
      'entryForm.courseHour': {
        deep: true,
        handler(val, oldval) {
          if(val == ''){
            this.entryForm.courseHour = ''
             this.$refs.entryForm.validateField('courseHour')
          }
          if (val) {
            if(parseInt(val) < 1){
               this.entryForm.courseHour = 1
            }
             this.$refs.entryForm.validateField('courseHour')
          }
        }
      },
      'editData.issueType':{
         handler(val, oldval) {
          if(val){
            if(val == 1){
             if(this.editData.performData > 99){
              this.editData.performData = 1
             } 
            }
                if(val == 2){
             if(this.editData.performData > 999){
              this.editData.performData = 1
             } 
            }
                    if(val == 3){
           
              // this.editData.performData = ''
            
            }
          }
         }
      },
      'editData.performData': {
        deep: true,
        handler(val, oldval) {
          console.log("val",val)
          if (val) {
            this.finishShow = false
            if (this.editData.issueType == 1) {
              if(val == ''){
                this.editData.performData = ''
              }
             else if (parseInt(val) < 1) {
                val = 1
              }
             else if (parseInt(val) > 99) {
                val = 1
              }
              this.editData.performData = parseInt(val)
            }
            if (this.editData.issueType == 2) {
              if (parseInt(val) < 1) {
                val = 1
              }
              if (parseInt(val) > 999) {
                val = 1
              }
              this.editData.performData = parseInt(val)
            }

          }
        }
      },
      'editData.contentPeriodEx.day': {
        deep: true,
        handler(val, oldval) {
          console.log('val12', val)
          if (val) {
            if(val == ''){
              this.editData.contentPeriodEx.day = ''
            }
           else if (parseInt(val) < 1 || parseInt(val) > 31 ) {
              this.editData.contentPeriodEx.day = 1
            } else {
              this.editData.contentPeriodEx.day = parseInt(val)
            }

            if (this.editData.contentPeriodEx.month && this.editData.contentPeriodEx.period == 1) this.finishShow =
              false
            if (this.editData.contentPeriodEx.period == 2 && this.editData.contentPeriodEx.monthRequireType == 1) this
              .finishShow = false
          }
        }
      },
      'editData.contentPeriodEx.month': {
        deep: true,
        handler(val, oldval) {
          if (val) {
            if(val == ''){
              this.editData.contentPeriodEx.month = ''
            }else if(val < 1){
              this.editData.contentPeriodEx.month = 1
            } else{
 this.editData.contentPeriodEx.month = parseInt(val)
            }
           
            if (this.editData.contentPeriodEx.day && this.editData.contentPeriodEx.period == 1) this.finishShow = false
          }
        }
      },
      'editData.contentPeriodEx.monthRequireType': {
        deep: true,
        handler(val, oldval) {
          if (val == 2) {
            this.finishShow = false
          }
        }
      },
      'editData.contentPeriodEx.period': {
        deep: true,
        handler(val, oldval) {
          if (val == 3 || val == 4) {
            this.finishShow = false
          }
        }
      },

    },
    async created() {
      await getUdcByCode("resp_file_type").then(res => {
        if (res.data) {
          // this.getListInterface1.params.udcTypeId = res.data[0].udcTypeId
          this.queryForm1.query.udcTypeId = res.data[0].udcTypeId
        }
      })
      let date = moment().format("YYYY-MM-DD")
      const {
        itemId,
        keepName,
        itemName,
        id
      } = this.$route.query
      this.id = id
      // this.$route.query.isCheck ? this.backTitle = '履职职责— 新增' : this.backTitle = '履职职责— 修改—'+this.$route.query.itemName
      this.$route.query.isCheck ? this.backTitle = '履职职责— 新增' : this.backTitle = '履职职责— 修改'
      if (this.id) {
        const res = await getInfoContent(this.id)
        const resEditData = JSON.parse(JSON.stringify(res.data))
        // res.data.performData = res.data.reportedAsk
        this.editData = res.data
        console.log('this.editData',this.editData)
        //  this.$set(this.editData, "performData", this.editData.reportedAsk)
        this.entryForm.courseHour = res.data.courseHour || ''
        if (resEditData.contentPeriodEx && resEditData.contentPeriodEx.period == 4) {
          // this.editData.contentPeriodEx.time = resEditData.contentPeriodEx.time.substring(11,16)
          this.editData.contentPeriodEx.time = `${date + ' ' + resEditData.contentPeriodEx.time.substring(11,16) }:00`

          // this.$set(this.editData.contentPeriodEx, "time",this.editData.contentPeriodEx.time.substring(11,16))

        } else if (!this.editData.contentPeriodEx) {
          this.$set(this.editData, "contentPeriodEx", {})
          this.editData.contentPeriodEx = {
            period: 1,
            monthRequireType: 1,
            month: '',
            day: '',
            week: 1,
            time: ''
          }

          // this.editData.contentPeriodEx.period = 1
          console.log(this.editData)

          switch (this.editData.issueType) {
            case 1:
              // this.editData.performData = resEditData.monthBefore
              this.$set(this.editData, "performData", this.editData.monthBefore)
              break;
            case 2:
              // this.editData.performData = resEditData.dayOffset
              this.$set(this.editData, "performData", this.editData.dayOffset)
              break;
            case 3:
              console.log(1234,resEditData.reportedAsk)
              this.editData.performData = resEditData.reportedAsk
              // this.$set(this.editData, "performData", this.editData.reportedAsk)
              this.$set(this.editData, "performData", resEditData.reportedAsk)
              break;
          }
               console.log('123',this.editData)
        }
        if (this.editData.respType == 1) {
          resEditData.certIds.map(i => this.getBct(i))
        } else if (this.editData.respType == 2) {
          // resEditData.fileIds.map(i=> this.getUdc(i))

          // this.entryForm.tags1.push(res.data)
          getUdcByCode("resp_file_type").then(res => {
            if (res.data) {
              this.entryForm.tags1 = res.data.filter(item => this.editData.fileIds.includes(Number(item
                .dictValue)))
            }
          })
        }
      }
      // this.editData.respType == 1 ? this.tags = this.editData.


      this.editData.keepName = keepName
      this.editData.itemName = itemName
      this.itemId = itemId
      let dd = 0,
        mm = 0,
        arr = []
      for (let index = 0; index < 48; index++) {
        let obj = {
          label: `${ String(dd).length == 1 ? '0'+dd : dd }:${ String(mm).length == 1 ? '0'+mm : mm}`,
          value: `${date + ' ' + (String(dd).length == 1 ? '0'+dd : dd) }:${ String(mm).length == 1 ? '0'+mm : mm }:00`
        }
        arr.push(obj)
        mm += 30
        if (mm == 60) {
          dd += 1
          mm = 0
        }
      }
      this.options3 = arr
      if (!this.editData.contentPeriodEx.time) this.editData.contentPeriodEx.time = arr[0].value
    },

    methods: {
      getTableList(data) {
              // return getBctList({
              //   ...this.queryForm,
              //   ...data,
              // });
          // 生成expr
          let expr = [];
          this.searchConfig.forEach((configItem) => {
            if (
              this.queryForm[configItem.prop] &&
              this.queryForm[configItem.prop] != "" &&
              configItem.expression
            ) {
              expr.push({
                key: configItem.prop,
                value: this.queryForm[configItem.prop],
                expression: configItem.expression,
              });
            }
          });

          // 拼接查询参数
          let searchData = {
            query: expr,
            order: this.queryForm.order,
            sort: this.queryForm.sort,
          };

          return getBctList({
            ...searchData,
            ...data,
          });
        },
      getTableList1(data) {
          let expr = [];
          this.searchConfig1.forEach((configItem) => {
            if (
              this.queryForm1[configItem.prop] &&
              this.queryForm1[configItem.prop] != "" &&
              configItem.expression
            ) {
              expr.push({
                key: configItem.prop,
                value: this.queryForm1[configItem.prop],
                expression: configItem.expression,
              });
              delete this.queryForm1[configItem.prop]
            }
          });

          // 拼接查询参数
          // let searchData = {
          //   ...this.queryForm1,
          //   expr: expr,
          // };
          this.queryForm1={
            ...this.queryForm1,
            expr
          }
          return getUdcList({
            // ...searchData,
            ...this.queryForm1,
            ...data,
          });
        },
      resetForm() {
        this.queryForm = {
          order: "",
          sort: "DESC",
        };
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
      },
      resetForm1() {
        this.$set(this.queryForm1,"expr",[])
      this.$refs.table1.$refs.table.clearFilter();
      this.$refs.table1.getData({}, true);
      },
      handleSave() {
        // finishShow  monthRequireType
        const editData = this.editData
        if (editData.issueType == 1 && editData.isPeriodic == 0 && editData.timeRange == 1 && !editData.performData) {
          this.finishShow = true
        }
        if (editData.issueType == 2 && !editData.performData) {
          this.finishShow = true
        }
        if (editData.issueType == 3 && !editData.performData) {
          this.finishShow = true
        }
        if (editData.issueType == 1 && editData.isPeriodic == 1 && editData.contentPeriodEx.period == 1 && !editData
          .contentPeriodEx.month && !editData.contentPeriodEx.day) {
          this.finishShow = true
        }
        if (editData.issueType == 1 && editData.isPeriodic == 1 && editData.contentPeriodEx.period == 2 && editData
          .contentPeriodEx.monthRequireType == 1 && !editData.contentPeriodEx.day) {
          this.finishShow = true
        }

        let valid
        this.$refs['entryForm'].validate((entryValid) => {
          console.log("valid1", this.entryForm)
          valid = entryValid
        })
        let obj = {}
        if (this.editData.respType == 3 || this.editData.respType == 4) {
          obj.courseRequire = {
            required: true,
            validator: utils.validateNull
          }
          obj.trainee = {
            required: true,
            validator: utils.validateNull
          }
        }
        if (this.editData.issueType == 1 && this.editData.isPeriodic == 0 && this.editData.timeRange == 2) {
          obj.startDate = {
            required: true,
            validator: utils.validateNull
          }
          obj.endDate = {
            required: true,
            validator: utils.validateNull
          }
        }
        let editDataRules = {
          ...this.editDataRules,
          ...obj
        }

        if (this.editData.respType != 3 && this.editData.respType != 4) {
        delete   editDataRules.courseRequire
        delete   editDataRules.trainee
        delete   this.editDataErrorMsg.courseRequire
        delete   this.editDataErrorMsg.trainee
        }
        console.log("this.editData", editDataRules)
        this.formValidate(
          this.editData,
          editDataRules,
          this.editDataErrorMsg
        ).then(async (formDataOk) => {
          // const arr = [this.checked ? this.editData1.show : this.editData2.show , this.editData3.show]
          // if(arr.includes(true)) return
          console.log(!formDataOk, !valid, this.finishShow)
          if (!formDataOk || !valid || this.finishShow) return;
          let data = {
            ...this.editData,
            ...this.entryForm
          }
          if (data.isPeriodic == 0) {
            switch (data.issueType) {
              case 1:
                data.monthBefore = this.editData.performData
                break;
              case 2:
                data.dayOffset = this.editData.performData
                break;
              case 3:
                data.reportedAsk = this.editData.performData
                break;
            }
          }
          if (data.respType == 1 || data.respType == 2) {
            data.respType == 1 ? data.certIds = [] : data.fileIds = []
            // data.respType == 1 ? this.entryForm.tags.map(i=> data.certIds.push(i.id)) : this.entryForm.tags1.map(i=> data.fileIds.push(i.id))
            data.respType == 1 ? this.entryForm.tags.map(i => data.certIds.push(i.id)) : this.entryForm.tags1.map(
              i => data.fileIds.push(i.dictValue))
            delete data.fileVal
          }
          if (this.id) {
            data.id
            const res = await editContent(data)
            if (res.code == 200) {
              this.messageSuccess("操作成功！");
              // this.$router.go(-1)
              this.back()
            }
          } else {


            data.itemId = this.itemId
            console.log(data)
            const res = await contentAdd(data)
            if (res.code == 200) {
              this.messageSuccess("操作成功！");
              // this.$router.go(-1)
              this.back()
            }
          }
        });
      },
      //选择
      selectionChange(obj){
          const {selected,page}=obj
           this.temporaryData = selected
          // this.$emit("update:radiodata", deepClone(selected[0]));
      },
        selectionChange1(obj){
          const {selected,page}=obj
           this.temporaryData1 = selected
          // this.$emit("update:radiodata", deepClone(selected[0]));
      },
      dealDisabledDate(time, date) {
        return time.getTime() < new Date(date).getTime()
      },
      dealDisabledDate1(time, date) {
        return time.getTime() > new Date(date).getTime() - 8.64e7
        // 这里将其转化为时间戳进行大小比较，一天的毫秒数为8.64e7，通过是否减去8.64e7来达到巨决定当前日期可选不可选的目的

      },
      async getBct(id) {
        const res = await getBct(id)
        this.entryForm.tags.push(res.data)
      },
      async getUdc(id) {
        const res = await getUdc(id)
        this.entryForm.tags1.push(res.data)
      },
      handleClose(tag) {
        this.entryForm.tags.splice(this.entryForm.tags.indexOf(tag), 1);
      },
      handleClose1(tag) {
        this.entryForm.tags1.splice(this.entryForm.tags1.indexOf(tag), 1);
      },
      handleShow() {
        if (this.editData.respType == 1) {
          if (this.$refs.question) this.$refs.question.clearBatch()
          this.show = true
        } else {
          if (this.$refs.question1) this.$refs.question1.clearBatch()
          this.fileShow = true

        }
      },
      handleComplete() {
        let arr = [...this.entryForm.tags, ...this.temporaryData]
        //删除重复的值
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].id == arr[j].id) {
              arr.splice(j, 1); //
              j = j - 1; //因为删除了一个值，后续的数会往前移动一个位置，所以下标跟着往前移动一个
            }
          }
        }
        this.entryForm.tags = arr
        this.show = false
      },
      handleComplete1() {
        let arr = [...this.entryForm.tags1, ...this.temporaryData1]
        //删除重复的值
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].id == arr[j].id) {
              arr.splice(j, 1); //
              j = j - 1; //因为删除了一个值，后续的数会往前移动一个位置，所以下标跟着往前移动一个
            }
          }
        }
        this.entryForm.tags1 = arr
        this.fileShow = false
      },
      getListResFormatFun(res) {
        console.log(res)
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      },
      //查询
      handleSearch(form) {
        // this.outSiderQuery.query[0].value = this.credentialData.credentialName
        // this.outSiderQuery.query[1].value = this.credentialData.credentialId
          this.queryForm = { ...this.queryForm, ...form };
          this.$refs.table.getData({}, true);
      },
      handleSearch1(form) {
        // this.outSiderQuery1.expr[0].value = this.fileData.fileName
        // this.outSiderQuery1.expr[1].value = this.fileData.fileId
          this.queryForm1 = { ...this.queryForm1, ...form };
          this.$refs.table1.getData({}, true);
      },
      //重置查询
      resetSearchFun() {
        this.outSiderQuery.query[0].value = ''
        this.outSiderQuery.query[1].value = ''
        this.credentialData.credentialId = ''
        this.credentialData.credentialName = ''
      },
      resetSearchFun1() {
        this.outSiderQuery1.expr[0].value = ''
        this.outSiderQuery1.expr[1].value = ''
        this.fileData.fileId = ''
        this.fileData.fileName = ''
      },
      //列表勾选
      handleSelectionChange(val) {
        this.temporaryData = val
      },
      handleSelectionChange1(val) {
        this.temporaryData1 = val
      },
      formValidate(formData, rules, errorMsg, scroll = true, target = this) {
        return new Promise((resolve) => {
          utils.clearErrorMsg(errorMsg); //清除错误提示
          utils.validateData(formData, rules).then((err) => {
            if (err) {
              err.forEach((value) => {
                errorMsg[value.field] = value.message;
              });
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
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

<style lang="scss" scoped>
  @import '~@/assets/styles/public.scss';

  ::v-deep .searchBox-btn {
    width: 210px !important;
  }

  ::v-deep .el-table th>.cell {
    padding-left: 14px;
  }

  .app-main .app-main-wrap .app-main-ctn>div {
    // padding: 54px 0 0 !important;
    // padding:  0 !important;
  }

  ::v-deep .el-form-item {
    color: #868a97;

    .el-form-item__label {
      color: #868a97;
    }

    .el-form-item__error {
      color: red;
    }

    .form-text {
      display: flex;

      .el-input {
        width: 100px;
      }

    }

    label {
      font-weight: normal;
    }
  }

  .app-main-ctn>.content>.el-form {
    border-bottom: none !important;
    padding: 30px;
  }

  ::v-deep .app-main-ctn {
    overflow: auto !important;
    padding-bottom: 86px;
  }

  .tagBox {
    white-space: normal;
    width: 100% !important;

    ::v-deep .el-tag {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  ::v-deep .el-textarea__inner {
    height: 100px !important;
  }

  ::v-deep .button-container.design-form-wrap__btnwrap {
    border-bottom: 0;
    position: absolute;
    bottom: 20px;
    left: 0;
    background: #fff !important;
  }

  .monthRequireType ::v-deep {
    .el-input--medium>.el-input__inner {
      width: 77px !important;
    }

    .el-input__inner {
      width: 180px !important;
    }
  }

  .issueType ::v-deep {
    .item-text {
      width: 100% !important;

      .el-input--medium {
        width: 100% !important;
      }

      .item-line1-box .item-line1 div {
        flex-grow: 2 !important;
        width: 100%;
      }
    }

    .el-input__inner {
      width: 100% !important;
    }
  }

  .iputNum ::v-deep {
    .el-input__inner {
      padding-right: 0;
    }
  }

  .content {
    height: 90%;
    box-sizing: border-box;
    overflow: hidden;
    // overflow-y: auto;

    &_line {
      width: 1px;
      height: 350px;
      background: #ccc;
      margin: 0 auto 120px;

    }

    .item-line1-box {
      position: relative;

      .item-line1 {
        display: flex;
        color: #f56c6c;
        font-size: 14px;
        margin-bottom: 22px;
        padding-left: 6px;

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
          white-space: nowrap;

          ::v-deep .el-input__inner {
            width: 100px;
          }
        }

        .item-text1 {
          display: flex;
          align-items: center;
          color: #555;
          flex-grow: 2;

          >div {
            width: 100%;
          }
        }

        div {
          width: 120px;
        }

        span {
          color: #868a97;
        }
      }
    }

    .item-line1-box1 {
      position: relative;

      .item-line1 {
        display: flex;
        color: #f56c6c;
        font-size: 14px;
        margin-bottom: 22px;

        .item-label {
          display: flex;
          text-align: right;
          padding-right: 10px;
          width: 126px !important;
          div{
 width: 126px !important;
          }
           
        }

        .item-text {
          color: #555;
          white-space: nowrap;
          flex-grow: 2;

          div {
            margin-top: 10px;
           
          }

          span {
            color: #026dff;
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

    .verify {
      position: absolute;
      top: 40px;
      left: 131px;
      color: red;
      font-size: 12px;
    }

    .verify1 {
      left: 120px;
    }
  }
  .custom_item{
     ::v-deep .item-line{
      align-items: flex-start !important;
    }
      ::v-deep  .item-line .item-label{
       padding-top: 8px;
    }
  }

  ::v-deep .formItem5 {
    .el-form-item__label{
padding-right: 5px !important;
    }

  }
// ::v-deep .mb22{
//   padding-left: 6px !important;
// }

</style>