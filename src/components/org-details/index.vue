<template>
  <div>
    <el-form id="form1" label-position="right" label-width="150px" :model="orgDetailsObj">
      <el-row getter="20">
        <el-col :span="12">
          <el-form-item label="上级单位">
            {{ orgDetailsObj.parentName || "-" }}
          </el-form-item>
          <el-form-item label="法定代表人">
            {{ orgDetailsObj.contacts || "-" }}
          </el-form-item>
          <el-form-item label="工商注册号">
            {{ orgDetailsObj.registrationNo  || "-"}}
          </el-form-item>
          <el-form-item label="联系人">
            {{ orgDetailsObj.representative  || "-"}}
          </el-form-item>
          <el-form-item label="单位类型">
            {{ orgDetailsObj.orgTypeName  || "-"}}
          </el-form-item>
          <el-form-item label="详细地址">
            {{ orgDetailsObj.address || "-" }}
          </el-form-item>
          <el-form-item label="经营范围">
            {{ orgDetailsObj.registerAddress  || "-"}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位名称">
            {{ orgDetailsObj.name || "-" }}
          </el-form-item>
          <el-form-item label="统一社会信用代码">
            {{ orgDetailsObj.unitiedIdentifier || "-" }}
          </el-form-item>
          <el-form-item label="成立日期">
            {{ orgDetailsObj.createTime || "-" }}
          </el-form-item>
          <el-form-item label="手机号码">
            {{ orgDetailsObj.phone  || "-"}}
          </el-form-item>
          <el-form-item label="行业">
            {{ orgDetailsObj.industryName || "-" }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getOrgDetails } from "@/api/statePersonLiable/statePersonLiable";
export default {
  components: {},
  props: {
    orgId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      orgDetailsObj: {},
    };
  },
watch:{
  orgId(val){
    if(val){
      this.getOrgDetails(val)
    }
  }
  },
  computed: {},
  mounted() {
    getOrgDetails(this.orgId).then((res) => {
      this.orgDetailsObj = res.data;
    });
  },

  methods: {
    getOrgDetails(val){
      this.orgDetailsObj={}
      getOrgDetails(val).then((res) => {
        this.orgDetailsObj = res.data;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep #form1{
  .el-form-item__label {
  width: 130px !important;

} 
}
</style>
