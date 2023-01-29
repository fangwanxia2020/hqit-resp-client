<template>
  <!-- <div class="content conten_tree"> -->
  <hqit-content-page type="list">
    <template slot="content">
      <div class="content_versions">
        <div class="content_versions_rigth">
          <div>
            <i class="el-icon-d-arrow-left" :style="dataNumber != 0 ? 'color: #1890FF;' : ''" @click="handleLeft()"></i>
          </div>
          <div class="content_versions_rigth_box">
            <!-- dataNumber -->
            <!-- showData -->
            <!-- v-if="index - dataNumber < 3"  -->
            <div v-for="(item) in showData" :key="item.id" :class="{back:item.status}" @click="handleSwitch(item.id)">
              {{item.name}}</div>
          </div>
          <div v-if="currentKeep.length">
            <i class="el-icon-d-arrow-right" :style="docList.length - dataNumber  > 3 ? 'color: #1890FF;' : ''"
              @click="handleRight()"></i>
          </div>
          <div class="content_versions_rigth_text" v-if="currentKeep.length">
            当前启用版本:{{currentKeep[0].name}}
          </div>
        </div>
        <div class="content_versions_left">
          <el-button type="primary" size="small" icon="el-icon-setting" @click="handleKeepUp">维护版本</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" :disabled="docList.length == 0"
            @click="handleAdd">添加项目</el-button>
        </div>
      </div>

      <ty-business-crud1 v-if="this.getListInterface.params.docId &&refreshTable" class="high-search-crud tree_table"
        :defaultExpandAll="defaultExpandAll" id="code" title :showIndex="$showIndex" :pageInfo="{ limit: 10 }"
        :getListInterface="getListInterface" tableHeight="calc(100vh - 210px)" :hidePage="true" :showSearch="false"
        :columns="columns" :treeProps="treeProps" ref="materialCrud" @filterChange="tableFilterChange">
        <template slot="itemName" slot-scope="{ data }">
          <div class="slot_name">
            <el-tag v-if="data.id" effect="dark" type="info" size="mini" style="font-size:14px">职责</el-tag>
            <el-tag v-else effect="dark" size="mini" style="font-size:14px">项目</el-tag>
            <div class="slot_name_text">{{data.itemName}}</div>
          </div>
        </template>
        <template slot="period" slot-scope="{ data }">
          <div v-if="data.id">{{periodFormat(data.period)}}</div>
        </template>
        <template slot="issueType" slot-scope="{ data }">
          <div v-if="data.id">{{data.issueType == 1?'系统触发':data.issueType == 2?'政府下发':'企业上报'}}</div>
        </template>
        <template slot="respType" slot-scope="{ data }">
          <div v-if="data.id">{{data.respType == 1?'上传证书':data.respType == 2 ?'上传文件':data.respType == 3 ?'参加培训':'落实培训'}}
          </div>
        </template>
        <template slot="isPeriodic" slot-scope="{ data }">
          <div v-if="data.id">{{data.isPeriodic == 0?'否':'是'}}</div>
        </template>
        <template slot="askTime" slot-scope="{ data }">
          <div v-if="data.id" class="slot_class">{{data.askTime}}</div>
        </template>
        <div slot="operator" style="display: flex; justify-content: flex-end" class="flex-operator handle-group">
        </div>
        <template v-slot:rowOperator="scope">
          <el-button v-if="scope.row.id" class="handle-text-btn" :icon="$editIcon" type="text"
            @click="navigater(`/resp/entryRequire/info?id=${scope.row.id}&keepName=${currentKeep[0].name}&itemName=${scope.row.parentItemName}&askTime=${scope.row.askTime}&docId=${getListInterface.params.docId}`)">
            查看
          </el-button>
          <el-button class="handle-text-btn" :icon="$editIcon" type="text" @click="handleEdit(scope.row)">修改
          </el-button>
          <el-button class="handle-text-btn info" v-if="scope.row.contentList && scope.row.contentList.length != 0"
            :icon="$editIcon" type="text">删除
          </el-button>

          <!-- <del-popover
            v-else
            :class="{info:scope.row.contentList && scope.row.contentList.length != 0}"
            :valText="scope.row.itemName"
            class="delInfo"
            @submitFun="handleDeleteConten(scope.row)"
          ></del-popover> -->

          <el-button v-else :class="{info:scope.row.contentList && scope.row.contentList.length != 0}"
            class="delInfo handle-text-btn" @click="handleDel(scope.row)" type="text">删除</el-button>

          <el-button v-if="scope.row.id && scope.row.issueType == 2" class="handle-text-btn" type="text"
            @click="handleIssue(scope.row)">下发<i class="el-icon-download"></i>
          </el-button>
          <el-button v-if="scope.row.contentList" class="handle-text-btn" :icon="$editIcon" type="text"
            @click="navigater(`/resp/entryRequire/add?itemId=${scope.row.itemId}&keepName=${showData.filter((i)=>i.status == 1)[0].name}&itemName=${scope.row.itemName}&isCheck=true&docId=${getListInterface.params.docId}`)">
            职责+
          </el-button>

        </template>
      </ty-business-crud1>

      <hqit-dialog :title="projectId==''?'添加—履职项目':'修改—履职项目'" width="500px" v-model="addShow"
        :close-on-click-modal="true" dialogType="form">
        <div class="addShow-class">
          <ty-multi-text :label="'履职项目'" :type="'textarea'" v-model="project.name" :allowUpdate="!isCheck"
            :allowNull="(isUpdate || isCheck)" :formErrorMsg.sync="projectErrorMsg.name" :validate="projectRules.name"
            :showWordLimitInInput="true" :maxlength="100">
          </ty-multi-text>
        </div>
        <span slot="footer" class="dialog-footer">
          <div @click="addShow = false" class="dialog-cancel">取消</div>
          <div class="dialog-submit" @click="handleConfirmAdd()">确认</div>
        </span>
      </hqit-dialog>

      <hqit-dialog title="维护—履职版本" width="900px" v-model="keepShow" :close-on-click-modal="true" dialogType="form">
        <div>
          <div class="" style="text-align: right;margin-bottom: 10px;">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddKeep"></el-button>
          </div>
          <el-table :data="dataEdit" border>
            <el-table-column label="序号" type="index" align="center" width="50">
            </el-table-column>
            <el-table-column label="启用" align="center" width="50">
              <template slot-scope="scope">
                <!-- <el-checkbox 
                v-model="scope.row.status"
                :checked="Boolean(scope.row.status)"
                @change="checkBoxChange(scope.$index)"
              ></el-checkbox> -->
                <el-radio v-model="radioId" :label="scope.row.id"><i></i></el-radio>
              </template>
            </el-table-column>

            <el-table-column label="版本名称" align="center" width="200">
              <template slot="header">
                <div> <span style="color:red;">*</span> 版本名称</div>
              </template>
              <template slot-scope="scope">
                <div class="ipt_box">
                  <el-input type="text" v-model="scope.row.name" maxlength="10" show-word-limit>
                  </el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="发布时间" align="center" width="160">
              <template slot="header">
                <div> <span style="color:red;">*</span> 发布时间</div>
              </template>
              <template slot-scope="scope">
                <div class="ipt_box">
                  <el-date-picker v-model="scope.row.releaseTime" type="date" size="large" style="width:140px"
                    placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center" width="250">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.remarks" maxlength="50" show-word-limit></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button v-if="currentKeep.length && scope.row.id == currentKeep[0].id" class="info" type="text">删除
                </el-button>
                <!-- <del-popover
                v-else
                :valAllText="'确定要删除'+scope.row.name+'版本的数据吗？删除该版本将无法继续使用。'"
                :valText="scope.row.name+'版本'"
                class="delInfo"
                @submitFun="handleDelet(scope.$index)"
              ></del-popover> -->
                <el-button v-else class="delInfo handle-text-btn" @click="handleDelet(scope.row,scope.$index)"
                  type="text">删除</el-button>
              </template>


            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top: 20px;">
          <div @click="handleCancelKeep()" class="dialog-cancel">取消</div>
          <div class="dialog-submit" @click="handleConfirmKeep()">确认</div>
        </span>
      </hqit-dialog>

    </template>
  </hqit-content-page>
  <!-- </div> -->
</template>
<script>
  import {
    officialDocList,
    itemAdd,
    officialDocEdit,
    treeByItemId,
    removeContent,
    removeProject,
    projectEdit,
    removeofficialDoc,
    distribute
  } from "@/api/entryRequire/entryRequire";
  import {
    errorBoundary,
    delPrompt
  } from "@/utils/tool.js";

  import utils from "@/assets/js/validator";

  export default {

    data() {
      return {
        refreshTable: true,
        defaultExpandAll: false,
        addShow: false,
        keepShow: false,
        isUpdate: false,
        isCheck: false,
        dataNumber: 0,
        radioId: '',
        title: "",
        outSiderQuery: {},
        project: {
          name: null
        },
        projectId: '',
        projectErrorMsg: {
          name: ''
        },
        projectRules: {
          name: {
            required: true,
            validator: utils.validateNull
          }
        },
        dataEdit: [],
        docList: [],
        getListInterface: {
          url: "/api/resp/content/treeByItemId",
          methodType: "post",
          resFormatFun: this.getListResFormatFun,
          params: {
            docId: ''
          }
        },
        treeProps: {
          children: 'contentList',
          hasChildren: 'hasChildren'
        },
        columns: [{
            label: "履职要求",
            prop: "itemName",
            align: "left",
            type: 'slot',
          },
          {
            label: "下发类型",
            prop: "issueType",
            filteredValue: [],
            width: 120,
            type: 'slot',
            align: "center",
            filters: [{
                text: "系统触发",
                value: 1,
              },
              {
                text: "政府下发",
                value: 2,
              },
              {
                text: "企业上报",
                value: 3,
              },
            ],
            formatter: (val) => {
              switch (val) {
                case 1:
                  return "系统触发";
                case 2:
                  return "政府下发";
                case 3:
                  return "企业上报";
                default:
                  return "";
              }
            },
          },

          {
            label: "履职方式",
            prop: "respType",
            width: 120,
            type: 'slot',
            filteredValue: [],
            align: "center",
            filters: [{
                text: "上传证书",
                value: 1,
              },
              {
                text: "上传文件",
                value: 2,
              },
              {
                text: "参加培训",
                value: 3,
              },
              {
                text: "落实培训",
                value: 4,
              }
            ],
            formatter: (val) => {
              switch (val) {
                case 1:
                  return "上传证书";
                case 2:
                  return "上传文件";
                case 3:
                  return "参加培训";
                case 4:
                  return "落实培训";
                default:
                  return "";
              }
            }
          },
          {
            label: "周期性任务",
            prop: "isPeriodic",
            width: 120,
            type: 'slot',
            align: "center",
            filteredValue: [],
            filters: [{
                text: "否",
                value: 0,
              },
              {
                text: "是",
                value: 1,
              }
            ],
            formatter: (val) => {
              switch (val) {
                case 0:
                  return "否";
                case 1:
                  return "是";
                default:
                  return "";
              }
            }
          },

          {
            label: "周期",
            prop: "period",
            width: 120,
            type: 'slot',
            align: "center",
            filteredValue: [],
            filters: [{
                text: "每天",
                value: 4,
              },
              {
                text: "每周",
                value: 3,
              },
              {
                text: "每月",
                value: 2,
              },
              {
                text: "每年",
                value: 1,
              },
            ]

          },
          {
            label: "要求完成时间",
            prop: "askTime",
            type: 'slot',

            width: 200,
            align: "left",
          },

          {
            prop: "operation",
            label: "操作",
            type: "operation",
            width: 200,
            align: "right",
          },
        ],
      }
    },

    watch: {

    },
    computed: {
      currentKeep() {
        return this.dataEdit.filter((i) => i.status == 1)
      },
      showData() {
        return this.docList
          .filter((i, index) => {
            if (index - this.dataNumber > -1 && index - this.dataNumber < 3) {
              return i
            }
          })

      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        const res = await officialDocList({
          pageNum: 1,
          pageSize: 10
        })
        let arr = JSON.parse(JSON.stringify(res.data.list))
        if (this.$route.query && this.$route.query.docId) {
          arr.forEach((item, index) => {
            if (item.status == 1) {
              item.status = 0
            }
            if (item.id == this.$route.query.docId) {
              item.status = 1
            }
          })
          this.docList = arr
          this.dataEdit = res.data.list
          if (this.dataEdit.length) {
            this.getListInterface.params.docId = this.docList.filter((i) => i.status == 1)[0].id
            this.radioId = this.dataEdit.filter((i) => i.status == 1)[0].id
            this.docList.map((item, index) => {
              if (item.id == this.$route.query.docId) {
                this.dataNumber = index
              }
            })
          }
        } else {
          let obj = {}
          arr.forEach((item, index) => {
            if (item.status == 1) {
              obj = item;
              arr.splice(index, 1)
              return;
            }
          })
          arr.unshift(obj);
          this.docList = arr
          this.dataEdit = res.data.list
          if (this.dataEdit.length) {
            this.getListInterface.params.docId = this.dataEdit.filter((i) => i.status == 1)[0].id
            this.radioId = this.dataEdit.filter((i) => i.status == 1)[0].id
          }
        }
        // this.docId = this.docList.filter((i)=>i.status == 1)[0].id
        // this.$refs.materialCrud._getListData();
      },

      handleAdd() {
        this.project.name = ''
        this.projectId = ''
        this.addShow = true
        // this.$nextTick(()=>{
        //   console.log(document.getElementsByClassName('subApp').length,11111)

        // })

        // document.getElementsByClassName('el-popup-parent--hidden')[0].style.paddingRight = '0 !important;'

      },
      handleEdit(item) {
        console.log(item)
        if (item.id) {
          this.navigater(
            `/resp/entryRequire/edit?id=${item.id}&keepName=${this.showData.filter((i)=>i.status == 1)[0].name}&itemName=${item.parentItemName || item.itemName}&docId=${this.getListInterface.params.docId}`
            )
          return
        }
        this.project.name = item.itemName
        this.projectId = item.itemId
        this.addShow = true
      },
      handleConfirmAdd() {
        console.log(this.projectRules)
        this.formValidate(
          this.project,
          this.projectRules,
          this.projectErrorMsg
        ).then(async (formDataOk) => {
          console.log(formDataOk)
          if (!formDataOk) return
          const data = {
            ...this.project,
            docId: this.showData.filter((i) => i.status == 1)[0].id
          }
          if (this.projectId == '') {
            const res = await itemAdd(data)
          } else {
            data.id = this.projectId
            const res = await projectEdit(data)
          }
          this.addShow = false
          this.$refs.materialCrud._getListData();

        })
      },
      handleCancelKeep() {
        this.keepShow = false

        // this.dataEdit = this.docList
      },
      async handleSwitch(id) {
        // if(id == this.currentKeep[0].id) return
        this.docList.map(i => i.status = 0)
        this.docList.filter(i => i.id == id)[0].status = 1
        // const res = await officialDocEdit(this.docList)
        // this.docList = res.data
        this.getListInterface.params.docId = id
        this.$refs.materialCrud._getListData();
        // this.$route.query.docId=id
        // const query=JSON.parse(JSON.stringify(this.$route.query))
        // query.docId=id;
        // this.$router.push({ path: this.$route.path, query })
      },
      async handleConfirmKeep() {
        let arrName = this.dataEdit.map((item) => item.name)
        let arrTime = this.dataEdit.map((item) => item.releaseTime)
        let arr = [...arrName, ...arrTime]
        if (arr.includes(null) || arr.includes('') || arr.includes(undefined)) {
          this.$message.error('请完整填写版本名称和发布时间！');
          return
        }
        this.dataEdit.map(i => i.status = 0)
        this.dataEdit.filter(i => i.id == this.radioId)[0].status = 1

        officialDocEdit(this.dataEdit).then(res => {
          this.keepShow = false
        }).then(async () => {
          const resEdit = await officialDocList({
            pageNum: 1,
            pageSize: 10
          })
          this.dataEdit = resEdit.data.list
          let arr = JSON.parse(JSON.stringify(resEdit.data.list))
          let obj = {}
          arr.forEach((item, index) => {
            if (item.status == 1) {
              obj = item;
              arr.splice(index, 1)
              return;
            }
          })
          arr.unshift(obj);
          this.docList = arr
          this.getListInterface.params.docId = this.dataEdit.filter(i => i.status == 1)[0].id
          this.$refs.materialCrud._getListData();
        })

      },
      handleAddKeep() {
        const obj = {
          deptName: this.$store.state.user.userInfo.deptName || '',
          status: 0,
          name: '',
          releaseTime: '',
          remarks: ''
        }
        this.dataEdit.push(obj)
        if (this.dataEdit.length == 1) this.$set(this.dataEdit[0], 'status', 1)
      },
      // async handleDeleteConten(item){
      //   if(item.contentList && item.contentList.length != 0) return
      //   let res 
      //   item.id ? res = await removeContent(item.id) : res = await removeProject(item.itemId)

      //   this.$refs.materialCrud._getListData();
      // },
      // 删除
      async handleDel(row) {
        if (row.contentList && row.contentList.length != 0) return
        const valid = await errorBoundary(delPrompt(this, row.itemName));
        if (valid) {
          const res = row.id ? await removeContent(row.id) : await removeProject(row.itemId)
          if (res.code == "200") {
            this.$message.success("删除成功");
            this.$refs.materialCrud._getListData();
          }
        } else {
          this.$message({
            message: "删除取消",
          });
        }
      },
      handleIssue(item) {
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '确定要下发'),
            h('i', {
              style: 'color: #026dff'
            }, `“ ${item.itemName} ”`),
            h('span', null, '的数据吗？'),

          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning",
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              const res = await distribute(item.id)
              if (res.code == 200) done()
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'success',
            message: '下发成功!'
          });
        });

      },
      async handleDelet(row, i) {
        // const valAllText='确定要删除'+row.name+'版本的数据吗？删除该版本将无法继续使用。'
        const valAllText = "<span>确定要删除</span> <span style='color:#4E9AF2'>“ " +
          row.name +
          " ”</span> <span>版本的数据吗？删除该版本将无法继续使用。</span>"
        ""
        if (this.dataEdit[i].id) {
          const valid = await errorBoundary(delPrompt(this, valAllText, true));
          if (valid) {
            const res = await removeofficialDoc(this.dataEdit[i].id)
            this.keepShow = false
            this.dataEdit.splice(i, 1)
            let arr = JSON.parse(JSON.stringify(this.dataEdit))
            let obj = {}
            arr.forEach((item, index) => {
              if (item.status == 1) {
                obj = item;
                arr.splice(index, 1)
                return;
              }
            })
            arr.unshift(obj);
            this.docList = arr
          } else {
            this.$message({
              message: "删除取消",
            });
          }
        } else {
          const valid = await errorBoundary(delPrompt(this, valAllText, true));
          if (valid) {
            this.$message.success("删除成功");
            this.dataEdit.splice(i, 1)
          } else {
            this.$message({
              message: "删除取消",
            });
          }
        }
      },
      // checkBoxChange(index){
      //   this.dataEdit.map(i=>i.status = 0)
      //   this.$set(this.dataEdit[index],'status',true)
      // },
      async handleKeepUp() {
        const res = await officialDocList({
          pageNum: 1,
          pageSize: 10
        })
        // this.docList = JSON.parse(JSON.stringify(res.data.list))
        this.dataEdit = res.data.list
        this.radioId = this.dataEdit.filter((i) => i.status == 1)[0].id
        // this.dataEdit.map(i =>i.status = Boolean(i.status) )
        this.keepShow = true
      },
      handleRight() {
        // if(this.showData)
        if (this.docList.length - this.dataNumber <= 3) return
        console.log(this.showData);

        this.dataNumber++

      },
      handleLeft() {
        if (this.dataNumber == 0) return

        this.dataNumber--
      },
      getListResFormatFun(res) {
        console.log("res444", res)
        res.data.map((i, index) => {
          // j.childrenItemId = j.itemId
          if (i.contentList.length > 0) {
            i.contentList.map(j => {
              if (j.isPeriodic == 1) {
                if (j.contentPeriodEx) {
                  let keyArr = Object.keys(j.contentPeriodEx)
                  let valueArr = Object.values(j.contentPeriodEx)
                  keyArr.map((i, index) => {
                    if (i != 'id') j[i] = valueArr[index]
                  })
                }

              }
              j.itemName = j.content
              j.parentItemName = i.itemName
              j.itemId = j.id
            })
          }

        })
        console.log("res.data123", res.data)
        return {
          list: res.data,
          total: 0,
        };
      },
      setDefaultFilter(col, val) {
        const column = this.$refs.materialCrud.$refs.tableObj.columns[col]
        column.filteredValue = [val]
        this.$refs.table.store.commit('filterChange', {
          column,
          values: column.filteredValue,
          silent: true
        })
      },
      //筛选
      tableFilterChange(val) {
        const {
          issueType,
          respType,
          isPeriodic,
          period
        } = val;
        if (issueType) {
          if (issueType.length > 0) {
            this.refreshTable = false
            this.defaultExpandAll = true
            this.getListInterface.params.issueTypeList = issueType;
            this.$nextTick(() => {
              this.refreshTable = true;
              this.columns = this.columns.map(item => {
                if (item.prop == "issueType") {
                  item.filteredValue = issueType
                }
                return item
              })
            })
          }
          if (issueType.length == 0) {
            this.defaultExpandAll = false
            this.refreshTable = false
            this.$nextTick(() => {
              this.refreshTable = true;
              delete this.getListInterface.params.issueTypeList;
              this.columns = this.columns.map(item => {
                if (item.prop == "issueType") {
                  item.filteredValue = undefined
                }
                return item
              })
            });
          }
          return false;
        }
        if (respType) {
          if (respType.length > 0) {
            this.refreshTable = false
            this.defaultExpandAll = true
            this.getListInterface.params.respTypeList = respType;
            this.$nextTick(() => {
              this.refreshTable = true;
              this.columns = this.columns.map(item => {
                if (item.prop == "respType") {
                  item.filteredValue = respType
                }
                return item
              })
            });
          }
          if (respType.length == 0) {
            this.defaultExpandAll = false
            this.refreshTable = false
            this.$nextTick(() => {
              this.refreshTable = true;
              delete this.getListInterface.params.respTypeList;
              this.columns = this.columns.map(item => {
                if (item.prop == "respType") {
                  item.filteredValue = undefined
                }
                return item
              })
            });
          }
          return false;
        }
        if (isPeriodic) {
          if (isPeriodic.length > 0) {
            this.refreshTable = false
            this.defaultExpandAll = true
            this.getListInterface.params.isPeriodicList = isPeriodic;
            this.$nextTick(() => {
              this.refreshTable = true;
              this.columns = this.columns.map(item => {
                if (item.prop == "isPeriodic") {
                  item.filteredValue = isPeriodic
                }
                return item
              })
            });
          }
          if (isPeriodic.length == 0) {
            this.defaultExpandAll = false
            this.refreshTable = false
            this.$nextTick(() => {
              this.refreshTable = true;
              delete this.getListInterface.params.isPeriodicList;
              this.columns = this.columns.map(item => {
                if (item.prop == "isPeriodic") {
                  item.filteredValue = undefined
                }
                return item
              })
            });
          }
          return false;
        }
        if (period) {
          if (period.length > 0) {
            this.refreshTable = false
            this.defaultExpandAll = true
            this.getListInterface.params.periodList = period;
            this.$nextTick(() => {
              this.refreshTable = true;
              this.columns = this.columns.map(item => {
                if (item.prop == "period") {
                  item.filteredValue = period
                }
                return item
              })
            });
          }
          if (period.length == 0) {
            this.defaultExpandAll = false
            this.refreshTable = false
            this.$nextTick(() => {
              this.refreshTable = true;
              delete this.getListInterface.params.periodList;
              this.columns = this.columns.map(item => {
                if (item.prop == "period") {
                  item.filteredValue = undefined
                }
                return item
              })
            });
          }
          return false;
        }
        // this.$refs.materialCrud._getListData();
      },
      handleSelectionChange(selection) {
        this.selectRows = selection;
        this.single = this.selectRows.length != 1;
        this.multiple = !this.selectRows.length;
      },
      periodFormat(value) {
        switch (value) {
          case 4:
            return '每天'
            break;
          case 3:
            return '每周'
            break;
          case 2:
            return '每月'
            break;
          case 1:
            return '每年'
            break;
          default:
            return '-'
        }
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
    },
  };
</script>

<style lang="scss" scoped>
  .el-dialog .dialog-footer .dialog-cancel {
    margin-right: 10px;
  }

  .addShow-class .item-line {
    align-items: flex-start;
  }

  .conten_tree {
    ::v-deep .el-table__expand-icon .el-icon-arrow-right:before {
      content: "\e791" !important;
    }
  }

  .el-popup-parent--hidden {
    padding-right: 0 !important;
  }

  .app-main-ctn>div>.el-form,
  .hse-form,
  ::v-deep .searchBox-form {
    border-bottom: none !important;
  }

  ::v-deep .el-tag--mini {
    border-radius: 10px;
  }

  ::v-deep .high-search-crud .el-table__row {
    background: #f5f5f5;
  }

  ::v-deep .high-search-crud .el-table__row--level-1 {
    background: #fff;
  }

  ::v-deep .el-icon-d-arrow-left {
    font-size: 24px;
    cursor: pointer;
    margin-right: 10px;

  }

  ::v-deep .el-icon-d-arrow-right {
    font-size: 24px;
    cursor: pointer;
    margin-left: 10px;
  }

  ::v-deep .cell {
    .el-button+.el-butto {}

    button {
      width: 42px;
      margin: 0;
      text-align: left;
    }
  }

  ::v-deep .el-table .cell.el-tooltip {
    display: flex;
  }

  ::v-deep .el-table .cell.el-tooltip {
    width: 100% !important;

    >div {
      width: 100%;
    }

    >.el-table__expand-icon {
      width: 13px;
      flex-grow: 2;
    }
  }

  ::v-deep .el-table__placeholder {
    width: 0;
  }

  ::v-deep .info span {
    color: #555555;
  }

  ::v-deep .el-textarea__inner {
    height: 100px !important;
  }

  .slot_name {
    display: flex;
    align-items: center;

    &_text {
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 5px;
    }

  }

  ::v-deep .delInfo button {
    text-align: left;
  }

  ::v-deep .high-search-crud .el-table th {
    background-color: #D9EBFB !important;
  }

  ::v-deep .info span {
    color: #555555;
  }

  .el-button--small {
    font-size: 14px;
  }

  ::v-deep .el-textarea__inner {
    height: 100px !important;
  }

  .slot_class {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }

  .content {
    &_versions {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 14px;

      &_rigth {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #555555;

        &_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          div {
            height: 30px;
            line-height: 30px;
            min-width: 110px;
            text-align: center;
            border-top: 1px solid #D7D7D7;
            border-left: 1px solid #D7D7D7;
            border-bottom: 1px solid #D7D7D7;
            color: #7F7F7F;
          }

          div:first-child {
            border-bottom-left-radius: 15px;
            border-top-left-radius: 15px;
          }

          div:last-child {
            border-right: 1px solid #D7D7D7;
            border-bottom-right-radius: 20px;
            border-top-right-radius: 20px;
          }

          .back {
            background: #1890FF;
            color: #fff;
          }
        }

        &_text {
          margin-left: 20px;
        }
      }
    }
  }

  .tree_table {
    padding: 0 !important;

    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
      width: 8px;
      /*滚动条宽度*/
      height: 8px;
      /*滚动条高度*/
      // background-color: red;
      background-color: #ebeef3;

    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 0px #aaa;
      // background-color: rgb(193, 193, 193); /*滚动条的背景颜色*/
      background-color: #aaa !important;
      /*滚动条的背景颜色*/
      border-radius: 4px;
    }
  }
</style>