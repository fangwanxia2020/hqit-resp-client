<template>
  <div class="cl-r-container">
    <el-form ref="ruleForm"  :model="form" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名: " >
            <el-input v-model="form.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="部门: " >
            <el-input v-model="form.deptName" placeholder="请输入部门" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号: ">
            <el-input v-model="form.idNo" placeholder="请输入身份证号" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="岗位: ">
            <el-input v-model="form.postName" placeholder="请输入岗位" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号: ">
            <el-input v-model="form.phone" placeholder="请输入手机号" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="职位: ">
            <el-input v-model="form.professionTitle" placeholder="请输入职位" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>

        </el-col>
        <el-col :span="6">
          <el-form-item  label-width="20px">
            <el-button @click="handleSearch" >查询</el-button>
            <el-button type="primary" @click="handleReset"  >重置</el-button>
            <!-- <span class="cl-highSel" @click="handleHighSel(highSel)">
              {{ highSel ? "收起" : "更多" }}
              <i
                :class="highSel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </span> -->
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <el-table ref="table" :data="tableData" :row-key="rowKey" @selection-change="handleSelection"  tooltip-effect="light">
      <el-table-column v-if="isSelect" type="selection" width="30" :reserve-selection="true" />
      <el-table-column width="30">
        <template slot-scope="scope">
          <el-radio v-if="isRadio" v-model="radioId" :label="scope.row.personBaseId"
            @change.native="handleRadio(scope.row)">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>

      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="genderName"></el-table-column>
      <el-table-column label="身份证号" prop="idNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="部门" prop="deptName"></el-table-column>
      <el-table-column label="岗位" prop="postName"></el-table-column>
      <el-table-column label="职位" prop="professionTitle"></el-table-column>
    </el-table>
    <Pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="handleGetPageData" />
  </div>
</template>

<script>
  import dataMixin from "../mixin/data";
  import {
    deepClone
  } from "@/utils/tool.js";
  import {
    getPersonList,
    getOrgList,
  } from "@/api/access-control-permission/organization-control.js";

  import Treeselect from "@riophae/vue-treeselect";
  import Pagination from "../Pagination/index.vue";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "right-table",
    components: {
      Treeselect,
      Pagination
    },
    mixins: [dataMixin],
    props: {
      // 右边被选中的人员（复选）
      personarr: {
        type: Array,
        default: () => [],
      },
      // 右边被选中的人员（单选）
      personobj: {
        type: Object,
        default: () => {},
      },
      isPersonBaseId: {
        type: Boolean,
        default: true,
      },
    },
    // 该组件是复选还是单选
    inject: ["isSelect", "isRadio"],
    data() {
      return {
        radioId: this.isPersonBaseId ?
          this.personobj.personBaseId :
          this.personobj.personId, // 单选时 回显选中的人员
        tableData: [],
        allData: [], // 拿回所有的数据，用于过滤传出去
        multipleSelection: [], // 选中的数据
        treeList: [],
        pageNum: 1,
        pageSize: 5,
        total: 0,
        id: this.isPersonBaseId ? "personBaseId" : "personId",
        highSel: false,
      };
    },
    watch: {
      personarr() {
        this.multipleSelection = this.personarr;
      },
      multipleSelection: {
        handler(val, oldval) {
          if (this.multipleSelection == null) return; //避免切换分页的时候重置值
          if (!val) val = [];
          if (!oldval) oldval = [];
          const selList = this.allData.concat(val); //复制一个备份并且
          if (oldval.length > val.length) {
            //删除
            const delItem = oldval.filter((item) => {
              const isDel = val.findIndex((o) => o[this.id] == item[this.id]) < 0;
              const inPage =
                this.tableData.findIndex((o) => o[this.id] == item[this.id]) >= 0;
              return isDel && inPage;
            });
            if (delItem.length > 0) {
              delItem.forEach((obj) => {
                const delIndex = selList.findIndex(
                  (item) => item[this.id] == obj[this.id],
                );
                if (delIndex >= 0) {
                  selList.splice(delIndex, 1);
                }
              });
            }
          } else {
            //添加
            const addItem = val.filter((item) => !oldval.includes(item));
            if (addItem.length > 0) {
              addItem.forEach((obj) => {
                selList.push(obj);
              });
            }
          }
          this.allData = this.unique(selList); //去重
        },
        deep: true,
      },
    },
    mounted() {
      this.getList();
      getOrgList().then((res) => {
        this.treeList = res.data;
      });
    },
    methods: {
      // 获取列表数据
      getList() {
        console.log("lolo",localStorage.getItem('orgId'))
        let params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          query: {
                "hasOrg": true,
                "orgId":localStorage.getItem('orgId'),
                'withDept':false
          },
        };
        console.log("this.form",this.form)
        this.form.name && (params.query["name"] = this.form.name); // 姓名
        this.form.deptName && (params.query["deptName"] = this.form.deptName); // 部门
        this.form.idNo && (params.query["idNo"] = this.form.idNo); // 身份证号
        this.form.phone && (params.query["phone"] = this.form.phone); // 手机号
        this.form.postName && (params.query["postName"] = this.form.postName); // 岗位
        this.form.professionTitle && (params.query["professionTitle"] = this.form.professionTitle); // 职位
        // this.form.sealedOrgId && (params.query["orgId"] = this.form.sealedOrgId); // 单位
        console.log("params",params)
        getPersonList(params).then((res) => {
        this.tableData = res.data.list.map(item=>{
            // for (let key in item) {
            //  if(!item[key]){
            //    item[key]="-"
            //  }
            // }
            if(!item.name){
              item.name="-"
            }
            if(!item.genderName){
              item.genderName="-"
            }
            if(!item.idNo){
              item.idNo="-"
            }
            if(!item.phone){
              item.phone="-"
            }
            if(!item.deptName){
              item.deptName="-"
            }
            if(!item.postName){
              item.postName="-"
            }
            if(!item.professionTitle){
              item.professionTitle="-"
            }
            return item
          })
          this.total = res.data.pagination.total;
          this.handleHasSel(res.data.list);
        });
      },
      // 搜索
      handleSearch() {
        this.pageNum = 1;
        this.getList();
      },
      // 重置
      handleReset() {
        this.form = {};
        this.handleSearch();
      },
      // 分页切换
      handleGetPageData({
        page,
        limit
      }) {
        this.pageNum = page;
        this.pageSize = limit;
        this.getList();
      },
      rowKey(row) {
        return row.personId;
      },
      // 高级查询条件显示/隐藏
      handleHighSel(val) {
        this.highSel = val ? false : true;
      },
      // 单选
      handleRadio(row) {
        this.$emit("update:personobj", deepClone(row));
      },
      // 复选
      handleSelection(selections) {
        this.multipleSelection = selections;
        this.$emit("update:personarr", selections);
      },
      // 复选 复选框回显选中
      handleHasSel(tableData) {
        if (!this.personarr.length) return;
        this.allData.forEach((sitem) => {
          tableData.forEach((titem) => {
            if (sitem.personBaseId == titem.personBaseId) {
              this.$nextTick(() => {
                this.$refs.table.toggleRowSelection(titem, true);
              });
            }
          });
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        const children =
          node.children === null || node.children === undefined ?
          [] :
          node.children;
        if (Array.isArray(children) && children.length == 0) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        };
      },
      unique(arr) {
        const hash = {};
        const newArray = arr.reduce((item, next) => {
          hash[next[this.id]] ?
            "" :
            (hash[next[this.id]] = true && item.push(next));
          return item;
        }, []);
        return newArray;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cl-r-container {
    margin-bottom: 20px;
  }

  .el-form {
    ::v-deep .el-form-item__label {
      color: #666;
      font-weight: 400;
    }

    ::v-deep .el-input__inner {
      height: 36px;
    }

    ::v-deep .el-button {
      height: 36px;
      width: 70px;
      padding: 0;
    }
  }

  .el-table {
    margin-bottom: 10px;
  }

  .el-pagination {
    text-align: center;
    margin-bottom: 20px;
  }
</style>