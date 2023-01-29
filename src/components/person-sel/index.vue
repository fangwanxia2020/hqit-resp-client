<template>
    <hqit-table
        ref="table"
        :dataSource="getTableList"
        :columns="columns"
        height="200px"
        labelWidth="88px"
        :showSeparator="true"
        :searchConfig="searchConfig"
        :showSelect="true"
        :singleSelect="true"
        rowKey="personId"
        :useExpr="false"
        :showIndex="false"
        @reset="resetForm"
        @search="handleSearch"
        @filter-change="tableFilterChange"
        @selectionChange="selectionChange"
      >
      </hqit-table>
</template>

<script>
  import {
    deepClone
  } from "@/utils/tool.js";
  import {
    getPersonList,
  } from "@/api/access-control-permission/organization-control.js";
  import {getUdcByCode} from "@/api/entryRequire/entryRequire";

export default {
  props:{
    // 单选时选中的数据
    radiodata: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      searchConfig: [
        {
          prop: "idNo",
          label: "身份证号",
          attrs: {
            clearable: true,
            placeholder: "请输入身份证号",
          },
        },
        {
          prop: "name",
          label: "姓名",
          attrs: {
            clearable: true,
            placeholder: "请输入姓名",
          },
        },
        {
          prop: "deptName",
          label: "部门",
          attrs: {
            clearable: true,
            placeholder: "请输入部门",
          },
        },
        {
          prop: "phone",
          label: "手机号",
          attrs: {
            clearable: true,
            placeholder: "请输入手机号",
          },
        },
        {
          prop: "postName",
          label: "岗位",
          attrs: {
            clearable: true,
            placeholder: "请输入岗位",
          },
        },
        {
          prop: "professionTitle",
          label: "职位",
          attrs: {
            clearable: true,
            placeholder: "请输入职位",
          },
        },
      ],
      columns: [
        {
          prop: "name",
          label: "姓名",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "genderName",
          label: "性别",
          formatter: (val) => {
            return val ? val : "-";
          },
          attrs: {
            filters:  [],
            columnKey: "genderIds",
          },
        },
        {
          prop: "idNo",
          label: "身份证号",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "phone",
          label: "手机号",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "deptName",
          label: "部门",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "postName",
          label: "岗位",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "professionTitle",
          label: "职位",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
      ],
      queryForm: {
          // pageNum: this.pageNum,
          // pageSize: this.pageSize,
          query: {
                "hasOrg": true,
                "orgId":localStorage.getItem('orgId'),
                'withDept':false
          },
        },
    };
  },
  created() {
    this.getSexListDict()
  },
  methods: {
    getSexListDict(){
      getUdcByCode("sys_user_sex").then(res=>{
         if(res.data){
          const list=res.data.map(item=>({
              text:item.name,
              value:item.id
          }))
            this.columns=this.columns.map(v=>{
              if(v.prop=="genderName"){
                v.attrs.filters=list
              }
              return v
            })
         }
      })
  },
    getTableList(data) {
      return getPersonList({
        ...this.queryForm,
        ...data,
      });
    },
    resetForm() {
      this.queryForm = {
        query: {
                "hasOrg": true,
                "orgId":localStorage.getItem('orgId'),
                'withDept':false
          },
      };
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    handleSearch(form) {
          const obj={}
          for (let key in form) {
            if (form[key]) {
              obj[key]=form[key]
            }
          }
          let query={
            ...this.queryForm.query,
            ...obj
          }
          this.$set(this.queryForm,"query",query)
      // this.queryForm = { ...this.queryForm, ...form };
      this.$refs.table.getData({}, true);
    },
    // 表单筛选
    tableFilterChange(val) {
      const { genderIds } = val;
      if (genderIds) {
        if (genderIds.length >= 1){
          let query={
            ...this.queryForm.query,
            genderIds
          }
          this.$set(this.queryForm,"query",query)
      }
        if (genderIds.length == 0) delete this.queryForm.query.genderIds;
        this.handleSearch();
        return false;
      }
    },
    //单选
    selectionChange(obj){
        const {selected,page}=obj
        this.$emit("update:radiodata", deepClone(selected[0]));
    }
  },
};
</script>

<style scoped lang="scss">
</style>