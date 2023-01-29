<template>
  <div>
    <el-form label-position="right" label-width="150px" :model="orgDetailsObj">
      <el-row getter="20">
        <el-form-item label="姓名">
          {{ orgDetailsObj.name || "-" }}
        </el-form-item>
        <el-form-item v-if="isCtr" label="承包商">
          {{ ctrName }}
        </el-form-item>
          <el-form-item label="所属单位">
          {{ orgDetailsObj.orgName  || "-"}}
        </el-form-item>
          <el-form-item label="职位">
          {{ orgDetailsObj.professionTitle  || "-" }}
        </el-form-item>
        <el-form-item label="身份证">
          {{ orgDetailsObj.idNo || "-" }}
        </el-form-item>
        <el-form-item label="手机号码">
          {{ orgDetailsObj.phone || "-" }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { personDetail } from "@/api/statePersonLiable/statePersonLiable";
export default {
  components: {},
  props: {
    isCtr: {
      type: Boolean,
      default: false,
    },
    ctrName: {
      type: String,
      default: "",
    },
    personId: {
      type: [String, Number],
    },
  },
  watch:{
  personId(val){
    if(val){
      this.getpersonDetail(val)
    }
  }
  },
  data() {
    return {
      orgDetailsObj: {},
    };
  },
  computed: {},
  mounted() {
      personDetail(this.personId).then((res) => {
        this.orgDetailsObj = res.data;
      });
  },

  methods: {
    getpersonDetail(val){
      this.orgDetailsObj={}
      personDetail(val).then((res) => {
        this.orgDetailsObj = res.data;
      });
    }
  },
};
</script>
<style lang="scss" scoped></style>
