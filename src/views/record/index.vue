<template>
   <hqit-content-page type="list">
    <template slot="content">
        <hqit-table ref="table"
                      v-if="personId"
                      :dataSource="getTableList"
                      :columns="columns"
                      :showSeparator="true"
                      :searchConfig="searchConfig"
                      :showSelect="false"
                      :useExpr="true"
                      :showIndex="false"
                       labelWidth=""
                      @sort-change="sortChange"
                      @filter-change="tableFilterChange"
                      @search="handleSearch"
                      @reset="resetForm"
              >
            <template slot="content" slot-scope="{ rowData, index }">
                <div class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.content}}</div>
            </template>
            <template slot="askTime" slot-scope="{ rowData, index }">
                <div class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.askTime}}</div>
            </template>
            <template slot="respType" slot-scope="{ rowData, index }">
                <span v-if="rowData.contentDto">{{formatRespType(rowData.contentDto.respType)}}</span>
            </template>
            <template slot="issueType" slot-scope="{ rowData, index }">
                <span v-if="rowData.contentDto">{{formatIssueType(rowData.contentDto.issueType)}}</span>
            </template>
            <template slot="opts" slot-scope="{ rowData, index }">
                <el-button
                        class="handle-text-btn"
                        size="mini"
                        :icon="$editIcon"
                        type="text"
                        @click="handleEdit(rowData)"
                >查看
                </el-button>
                <el-button
                        class="handle-text-btn"
                        size="mini"
                        :icon="$editIcon"
                        type="text"
                        @click="withdraw(rowData)"
                >撤回
                </el-button>
            </template>
          </hqit-table>
      </template>
</hqit-content-page>
</template>
<script>
  import {checkAuth } from "@/api/personLiable/personLiable"
  import {revokeTask} from "@/api/performanceRecord/index"
  import {getTaskListPage } from "@/api/stayPerformance/index"
  
  export default {
    data() {
      return {
        columns: [
          {
            label: "履职项目",
            prop: "itemName",
            align: "left",
          },
          {
            label: "职责内容",
            type: "slot",
            prop: "content",
             align: "left",
            slotname: "content",
          },
          {
            label: "履职方式",
            // prop: "respType",
            slotname: "respType",
            type:'slot',
            align: "left",
            attrs: {
              minWidth: 120,
              columnKey: "respType",
              filters: [
                {
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
            },
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
                  return "-";
              }
            }
          },
          {
            label: "提交类型",
            // prop: "issueType",
            slotname: "issueType",
             type: "slot",
            align: "left",
            attrs: {
              minWidth: 120,
              columnKey: "issueType",
              filters: [
                {
                  text: "履职任务",
                  value: 1,
                },
                {
                  text: "主动上报",
                  value: 3,
                }
              ],
            },
            formatter: (val) => {
              switch (val) {
                case 1:
                  return "履职任务";
                case 2:
                  return "履职任务";
                case 3:
                  return "主动上报";
                default:
                  return "-";
              }
            }
          },
          {
            label: "要求完成时间",
            // prop: "askTime",
           slotname: "askTime",
            type: "slot",
             align: "left",
             attrs:{
                minWidth: 140,
             }
          },
          {
            label: "实际完成时间",
            prop: "completionTime",
            width: 140,
            sortable: "custom",
            align: "left",
            formatter: (val) => {
              if (val) {
                return val.substring(0, 16);
              }
            },
          },
          {
            label: "逾期情况",
            prop: "isOverdue",
            align: "left",
            attrs: {
              columnKey: "isOverdue",
              filters: [
                {
                  text: "否",
                  value: 0,
                },
                {
                  text: "是",
                  value: 1,
                }
              ],
              minWidth: 120,
            },
            formatter: (val,row) => {
             if(row.contentDto){
  if(row.contentDto.issueType==3){
              return "-";
            }else{
              switch (val) {
                case 0:
                  return "否";
                case 1:
                  return "是";
                default:
                  return "-";
              }
            }
             }else{
               return "-";
             }
          
            }
          },
          {
            prop: "opts",
            label: "操作",
            slotname: "opts",
            width: "100",
            fixed: "right",
            align: "right",
          },
        ],
        searchConfig: [
          {
            prop: "itemName",
            label: "履职项目",
            attrs :{
                clearable: true,
                placeholder: "请输入履职项目",
            }
          },
          {
            prop: "content",
            label: "职责内容",
            attrs :{
                clearable: true,
                placeholder: "请输入职责内容",
            }
          },
          {
            prop: "completionTime",
            label: "实际完成时间",
            type: "daterange",
            startKey: "completionBeginTime",
            endKey: "completionEndTime",
            attrs:{
                  startPlaceholder: "开始时间",
                  endPlaceholder: "结束时间",
            }
          },
        ],
        queryForm: {
              "order": "completionTime",
              "sort": "DESC",
        },
        searchQuery:{
              statusList:[2],
              contentDto:{},
              personId: null
        },
        personId:null,
      }
    },
    async created() {
      const res = await checkAuth()
      if(res.data&&res.data.authStatus==2&&res.data.isExpired !==1){ 
        this.personId = res.data.id
      }else{
        this.$router.replace("/resp/personLiable")
      }
    },
    methods: {
      withdraw(e){
        const isReport=e.contentDto.issueType==3?"主动上报":"待履职"
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '确定要撤回'),
            h('span', { style: 'color: #026dff' }, `" ${e.itemName||''} "`),
            h('span', null, `的数据吗？撤回成功后该任务将回到${isReport}任务清单里。`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          type: "warning",
          cancelButtonText: '取消',
        }).then(function() {
          console.log(e.id)
          return revokeTask(e.id);
        }).then(() => {
          this.$message.success("撤回成功");
          this.$refs.table.getData({}, true);
        }).catch(function() {});
      },
      formatRespType(respType) {
        let obj = {1: '上传证书', 2: '上传文件', 3: '参加培训', 4: '落实培训'}
        return obj[respType]
      },
      formatIssueType(issueType) {
        let obj = {1: '履职任务', 2: '履职任务', 3: '主动上报'}
        return obj[issueType]
      },
      handleEdit(row) {
          this.$router.push({
            path: "/resp/record/detail",
            query: {
              isCheck: true,
              id: row.id,
              name:row.itemName
            },
          });
        },
      getTableList(data){
        let searchData = {
          query:{
              ...this.searchQuery,
              personId: this.personId
          },
          ...this.queryForm
        };
        return getTaskListPage({
          order: "completionTime",
          sort:'DESC',
          ...data,
           ...searchData,
           pageNum: data.page,
           pageSize: data.size,
        });
      },
      //重置查询
      resetForm() {
        this.searchQuery= {
            statusList:[2],
            contentDto:{},
            personId: this.personId,
        }
        // this.queryForm={
        //       "order": "createTime",
        //       "sort": "DESC",
        // },
              this.queryForm={
              "order": "completionTime",
              "sort": "DESC",
        },
       this.$refs.table.$refs.table.clearFilter();
       this.$refs.table.getData({}, true);
      },

      //排序方法
      sortChange({column, prop, order }){
        if(order){
          this.queryForm.sort=order=="descending"?'DESC':'ASC'
          this.queryForm.order=prop
        }else{
          this.queryForm={
              "order": "completionTime",
              "sort": "DESC",
          }
        }
        this.$refs.table.getData({}, true);
      },
      handleSearch(form){
        delete this.searchQuery.completionBeginTime
        delete this.searchQuery.completionEndTime
        delete this.searchQuery.itemName
        this.searchQuery.contentDto = {}
            if(form?.query.length){
                let obj={}
              const searchQuery=form.query.filter(item=>item.expression=="LIKE")
              searchQuery.map(v=>{
                if(v.key=="content"){
                  obj.contentDto={
                    [v.key]:v.value
                  }
                }else{
                obj[v.key]=v.value
                }
              })
            form.query.filter(item=>item.expression!=="LIKE").map(v=>{
              if(v.key=="completionBeginTime"){
                obj[v.key]=v.value + ' 00:00:00'
              }
              if(v.key=="completionEndTime"){
                obj[v.key]=v.value + ' 23:59:59'
              }
              })
              this.searchQuery={
                ...this.searchQuery,
                ...obj
              }
              console.log(this.searchQuery)
              this.queryForm = {
                ...this.queryForm
              };
             }
            this.$refs.table.getData({}, true);
      },
      //筛选
      tableFilterChange(val) {
        const {respType,issueType,isOverdue} = val;
        if (isOverdue) {
          if (isOverdue.length >= 1)
            this.searchQuery.isOverdueList = isOverdue;
          if (isOverdue.length == 0) delete this.searchQuery.isOverdueList;
          this.handleSearch();
          return false;
        }
        if (respType) {
          if (respType.length >= 1)
            this.searchQuery.contentDto.respTypeList = respType;
          if (respType.length == 0) delete this.searchQuery.contentDto.respTypeList;
          this.handleSearch();
          return false;
        }
        if (issueType) {
          if (issueType.length >= 1)
            this.searchQuery.contentDto.issueTypeList = issueType;
          if (issueType.length == 0) delete this.searchQuery.contentDto.issueTypeList;
          this.handleSearch();
          return false;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.slot_class{
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
    ::v-deep .searchBox-btn{
        width: 210px !important;
    }

    ::v-deep .searchBox-form {
        .el-form-item__label {
            width: 100px !important;
        }
    }
    ::v-deep .searchBox .el-form .el-form-item{
        flex: 0 0 30% !important;
        white-space:nowrap;
    }
    ::v-deep  .searchBox .el-form {
        margin-right: 145px !important;
    }
</style>