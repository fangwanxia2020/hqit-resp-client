<template>
   <hqit-content-page type="list">
    <template slot="content">
        <hqit-table ref="table"
                      :dataSource="getTableList"
                      :columns="columns"
                      :showSeparator="true"
                      :searchConfig="searchConfig"
                      :showSelect="false"
                      :useExpr="true"
                      :showIndex="false"
                      labelWidth="130px"
                      @sort-change="sortChange"
                      @filter-change="tableFilterChange"
                      @search="handleSearch"
                      @reset="resetForm"
              >
          <template slot="orgName" slot-scope="{ rowData, index }">
                <el-button type="text" @click="getOrg(rowData.orgId)" class="orgNameText">{{rowData.orgName}}</el-button>
            </template>
            <template slot="personName"  slot-scope="{ rowData, index }">
                <el-button type="text" @click="getPer(rowData.sysPersonId)">{{rowData.personName}}</el-button>
            </template>
            <template slot="content"  slot-scope="{ rowData, index }">
                <div class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.content}}</div>
            </template>
            <template slot="askTime"  slot-scope="{ rowData, index }">
                <div class="slot_class" v-if="rowData.contentDto">{{rowData.contentDto.askTime}}</div>
            </template>
            <template slot="respType" slot-scope="{ rowData, index }">
                <span v-if="rowData.contentDto">{{formatRespType(rowData.contentDto.respType)}}</span>
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
            </template>
          </hqit-table>
                <hqit-dialog title="单位信息"
                 v-model="orgForm.dialogOrg"
                :close-on-click-modal="true"
                dialogType="form"
                 :showFooter="false"
                 width="800px">
              <org-details :orgId='orgForm.id'></org-details>
          </hqit-dialog>
        <hqit-dialog title="人员信息"
                 v-model="perForm.dialogPer"
                 :close-on-click-modal="true"
                 :showFooter="false"
                 dialogType="form"
                 width="500px">
            <person-details :personId='perForm.id'></person-details>
        </hqit-dialog>
      </template>
</hqit-content-page>
</template>
<script>
  import personDetails from "@/components/person-details/index.vue"
  import orgDetails from "@/components/org-details/index.vue"
  import {getTaskListPage } from "@/api/stayPerformance/index"

  export default {
    components: {
      personDetails,
      orgDetails
    },
    data() {
      return {
        orgForm: {
          dialogOrg: false,
          id: ''
        },
        perForm: {
          dialogPer: false,
          id: ''
        },
        columns: [
          {
            label: "单位",
            prop: "orgName",
            slotname: "orgName",
            align: "left",
            attrs:{
              minWidth: 120,
            }
          },
          {
            label: "安全第一责任人",
            prop: "personName",
            slotname: "personName",
            align: "left",
            attrs:{
              minWidth: 120,
            }
          },
          {
            label: "履职项目",
            prop: "itemName",
            align: "left",
          },
          {
            label: "职责内容",
            slotname: "content",
            prop: "content",
            align: "left",
          },
          {
            label: "履职方式",
            prop: "respType",
            slotname: "respType",
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
            label: "要求完成时间",
            prop: "askTime",
            slotname: "askTime",
            align: "left",
            attrs:{
              minWidth: 140,
            },
            formatter: (val) => {
              if (val) {
                return val
              }else{
                return "-"
              }
            },
          },
          {
            label: "实际完成时间",
            prop: "completionTime",
            sortable: "custom",
            align: "left",
            attrs:{
              minWidth: 140,
            },
            formatter: (val) => {
              if (val) {
                return val.substring(0, 16);
              }else{
                return "-"
              }
            },
          },
          {
            label: "完成状态",
            prop: "status",
             attrs: {
              minWidth: 120,
              columnKey: "status",
              filters: [
                {
                  text: "否",
                  value: 1,
                },
                {
                  text: "是",
                  value: 2,
                }
              ],
            },
            formatter: (val) => {
              switch (val) {
                case 1:
                  return "否";
                case 2:
                  return "是";
                default:
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
            prop: "personName",
            label: "安全第一责任人",
            attrs :{
                clearable: true,
                placeholder: "请输入安全第一责任人",
            }
          },
          {
            prop: "orgName",
            label: "单位",
            attrs :{
                clearable: true,
                placeholder: "请输入单位",
            }
          },
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
              statusList:[1,2],
              contentDto:{}
          },
      }
    },
    created() {

    },
    methods: {
      //获取单位信息
      getOrg(id) {
        this.orgForm.dialogOrg = true
        this.orgForm.id = id
      },

      //获取人员信息
      getPer(id) {
        this.perForm.dialogPer = true
        this.perForm.id = id
      },

      formatRespType(respType) {
        let obj = {1: '上传证书', 2: '上传文件', 3: '参加培训', 4: '落实培训'}
        return obj[respType]
      },
      handleEdit(row) {
        this.$router.push({
          path: "/resp/performanceRecord/detail?id="+row.id,
          query: {
            isCheck: true,
            name:row.itemName
          },
        });
      },

      getTableList(data){
        let searchData = {
          query:{
              ...this.searchQuery,
          },
          ...this.queryForm
        };
        console.log("searchData",searchData,data)
        return getTaskListPage({
          ...data,
           ...searchData,
           pageNum: data.page,
           pageSize: data.size,
        });
      },

      //重置查询
      resetForm() {
        this.searchQuery= {
          statusList:[1,2],
          contentDto:{}
        }
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
        delete this.searchQuery.personName
        delete this.searchQuery.orgName
        delete this.searchQuery.itemName
        delete this.searchQuery.content
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
        const {respType,status} = val;
        if (respType) {
          if (respType.length >= 1)
            this.searchQuery.contentDto.respTypeList = respType;
          if (respType.length == 0) delete this.searchQuery.contentDto.respTypeList;
          this.handleSearch();
          return false;
        }
        if (status) {
          if (status.length >= 1)
            this.searchQuery.statusList = status;
          if (status.length == 0)  this.searchQuery.statusList=[1,2];
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
    ::v-deep .searchBox-form {
        .el-form-item__label {
            width: 120px !important;
        }
    }
.searchTime{
      ::v-deep .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
      width: 100%;
      box-sizing: border-box;
    }
}
.orgNameText{
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    // width: 120px;
    text-align: left;
    overflow: hidden;
}
</style>