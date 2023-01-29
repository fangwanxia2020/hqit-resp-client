<template>
  <hqit-content-page type="list">
      <template slot="content">
            <hqit-table ref="table"
                 v-if="this.personId"
                  :dataSource="getTableList"
                  :columns="columns"
                  :showSeparator="true"
                  :searchConfig="searchConfig"
                  :showSelect="false"
                  :useExpr="false"
                  :showIndex="false"
                  labelWidth=""
                  @reset="resetSearchFun"
                  @sort-change="sortChange"
                  @search="handleSearch"
                  @filter-change="tableFilterChange"
              >
                <template slot="itemName" slot-scope="{ rowData, index }">
                    <div class="slot_class"><span v-if="rowData.status == 3"></span> {{rowData.itemName}}</div>
                </template>
                <template slot="content" slot-scope="{ rowData, index }">
                    <div class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.content}}</div>
                </template>
              <template slot="askTime"slot-scope="{ rowData, index }">
                    <div  class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.askTime}}</div>
                </template>
              <template slot="respType"slot-scope="{ rowData, index }">
                    <span v-if="rowData.contentDto">{{formatRespType(rowData.contentDto.respType)}}</span>
               </template> 
                   <template slot="timeRemaining"slot-scope="{ rowData, index }">
                
                    <span style="color:red" v-show="rowData.isOverdue == 1" >逾期{{rowData.timeRemaining}}</span>
                    <span style="color:#026DFF" v-show="rowData.isOverdue == 0"  >剩余{{rowData.timeRemaining}}</span>
               </template> 
              <template slot="opts"slot-scope="{ rowData, index }">
                <el-button
                        class="handle-text-btn"
                        size="mini"
                        :icon="$editIcon"
                        type="text"
                        @click="handleEdit(rowData)"
                >履职
                </el-button>
               </template> 
           </hqit-table>
      </template>
  </hqit-content-page>
</template>
<script>
import {checkAuth } from "@/api/personLiable/personLiable"
import {getTaskListPage } from "@/api/stayPerformance/index"

  export default {
    data() {
      return {
        personId:'',
        columns: [
          {
            label: "履职项目",
            prop: "itemName",
            align: 'left',
            slotname: "itemName",
          },
          {
            label: "职责内容",
            prop: "content",
            align: 'left',
            slotname: "content",
          },
          {
            label: "履职方式",
            prop: "respType",
            align: 'left',
            slotname: "respType",
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
              },
            attrs:{
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
          },
          {
            label: "要求完成时间",
            prop: "askTime",
            align: 'left',
            slotname: "askTime",
            attrs:{
              minWidth: 140,
            }
          },
          {
            label: "距离完成时间",
            prop: "timeRemaining",
          slotname:'timeRemaining',
            align: 'left',
            sortable: "custom",
            // sortMethod:this.sortMethod(),
            formatter: (val) => {
                if (val) {
                  return val
                }else{
                  return "-"
                }
              },
            attrs:{
              minWidth: 140,
            }
          },
          {
            label: "逾期情况",
            prop: "isOverdue",
            align: 'left',
            attrs:{
              minWidth: 140,
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
            },
          formatter: (val,row) => {
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
              }
          },
          {
            prop: "opts",
            label: "操作",
            slotname: "opts",
            width: "120",
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
        ],
        queryForm: {
            statusList:[1,3],
            contentDto:{issueType:'1'},
            personId: null,
        },
        outsiderQuery:{}
      }
    },
    async created() {
      const res = await checkAuth()
      if(res.data&&res.data.authStatus==2 && res.data.isExpired !==1){ 
        this.$set(this.queryForm,"personId" ,res.data.id)
        this.personId = res.data.id
      }else{
        this.$router.replace("/resp/personLiable")
      }
    },
    methods: {
     getTableList(data){
   console.log("data",this.outsiderQuery)
   console.log("this.queryForm",this.queryForm)

        // 拼接查询参数
        let searchData = {
          query:{
              ...this.queryForm,
              isInitOrder:1
          },
          ...this.outsiderQuery,
          
        };
        if(this.outsiderQuery.order){
          console.log("123")
     delete searchData.query.isInitOrder
        }
           console.log('searchData',searchData)
        return getTaskListPage({
            //  order:'status',
          //  sort:'DESC',
          ...searchData,
          ...data,
           pageNum: data.page,
           pageSize: data.size,
        
        });
     },
      handleSearch(form){ 
      if(form?.content){
        this.queryForm.contentDto.content=form.content
       this.queryForm = { ...this.queryForm, ...form };
        delete this.queryForm.content
      }else{
       this.queryForm = { ...this.queryForm, ...form};
      }
      this.$refs.table.getData({}, true);
      },
    //重置查询
      resetSearchFun() {
        this.queryForm= {
            statusList:[1,3],
            contentDto:{issueType:'1'},
            personId: this.personId,
        }
        this.outsiderQuery = {}
       this.$refs.table.$refs.table.clearFilter();
       this.$refs.table.getData({}, true);
      },
      // 表单筛选
     tableFilterChange(val) {
      const { isOverdue,respType } = val;
      if (isOverdue) {
        if (isOverdue.length >= 1)
          this.queryForm.isOverdueList = isOverdue;
        if (isOverdue.length == 0) delete this.queryForm.isOverdueList;
        this.handleSearch();
        return false;
      }
      if (respType) {
        if (respType.length >= 1)
          this.queryForm.contentDto.respTypeList = respType;
        if (respType.length == 0) delete this.queryForm.contentDto.respTypeList;
        this.handleSearch();
        return false;
      }
    },
      //排序方法
      sortChange({column, prop, order }){
        console.log("order",prop,order)
        if(order){
          this.outsiderQuery.sort=order=="descending"?'DESC':'ASC'
          if(prop == 'timeRemaining'){
this.outsiderQuery.order= 'endTime'
          }else{
this.outsiderQuery.order=prop
          }
          
        }else{
          this.outsiderQuery={}
        }
        this.$refs.table.getData({}, true);
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
          path: "/resp/stayPerformance/detail",
          query: {
            isCheck: true,
            id: row.id,
          },
        });
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
  span{
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background: red;
  }
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