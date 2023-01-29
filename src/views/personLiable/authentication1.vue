<template>
  <hqit-content-page type="detail" title="安全第一责任人认证">
    <template slot="content">
      <div class="personLiable">
        <el-row>
          <el-col :span="11" style="overflow: hidden">
            <hqit-form
              :config="configpersonDetail1"
              :form="form"
              :rules="rules"
              labelPosition="right"
              ref="ruleForm"
              formName="ruleForm"
              labelSuffix="："
              labelWidth="140px"
            >
              <template slot="personId">
                <el-button
                  style="margin-right: 10px"
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="chosePeople"
                >
                  选择人员</el-button
                >
                <el-tag
                  closable
                  v-show="name.length > 0"
                  @close="handleClose"
                  >{{ name }}</el-tag
                >
              </template>

              <template slot="appointmentDate">
                <el-date-picker
                  size="small"
                  format="yyyy-MM-dd "
                  style="width: 260px"
                  value-format="yyyy-MM-dd"
                  v-model="form.appointmentDate"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>

              <template slot="effectiveDate">
                <el-date-picker
                  style="width: 260px"
                  size="small"
                  v-model="form.effectiveDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </template>
                       <template slot="appointmentFileId">
           <ty-upload :action="action" v-model="this.form.appointmentFileId" :multiple="false" :length='1' :imgMaxSize="2" :imgSuffixs='["png","bmp","jpg", "jpeg"]'
                  resFormat="data" :width="100" :height="100" @change="imgChange" :disabled="false">
                  <div slot="tip">
                    <div style="line-height: 30px">提示:</div>
                    <div style="line-height: 30px; font-size: 12px">
                      1.图片格式：png,bmp,jpeg,jpg；
                    </div>
                    <div style="line-height: 30px; font-size: 12px">
                      2.图片大小：小于或等于2M；
                    </div>
                    <div style="line-height: 30px; font-size: 12px">
                      3.图片数量：最多上传1张；
                    </div>
                  </div>
                </ty-upload>
        
              </template>
                  <template slot="operator">
                                    <el-button style="margin-right: 10px" type="primary" size="small" @click="next">提交</el-button>
                              </template>
            </hqit-form>
          </el-col>
          <el-col :span="2">
            <div class="">
              <div class="content_line"></div>
            </div>
          </el-col>
          <el-col :span="11" style="overflow: hidden">
            <hqit-form
              :config="configpersonDetail"
              :form="personDetail"
              labelPosition="right"
              ref="ruleForm2"
              formName="ruleForm2"
              labelSuffix="："
              labelWidth="140px"
            >
              <template slot="fileIdList">
                <template
                  v-if="
                    personDetail.fileIdList &&
                    personDetail.fileIdList.length &&
                    personDetail.fileIdList !== '-'
                  "
                >
                  <el-image
                    lazy
                    style="width: 100px; margin: 6px"
                    :src="item.downloadUrl"
                    v-for="(item, index) in personDetail.fileIdList"
                    :key="index"
                    @click="bigPic(personDetail.fileIdList)"
                  ></el-image>
                </template>
                <div v-else>-</div>
              </template>
            </hqit-form>
          </el-col>
        </el-row>
        <el-dialog
          title="选择—安全第一责任人"
          :visible.sync="dialogVisible"
          width="68%"
        >
          <person-sel :isRadio="true" :radiodata.sync="radiodata"></person-sel>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="config">确 定</el-button>
          </span>
        </el-dialog>
        <view-image
          v-if="dialogPic"
          :on-close="closeViewer"
          :url-list="picUrl"
        ></view-image>
      </div>
    </template>
  </hqit-content-page>
</template>
<script>
import {
  add,
  getPerson,
  edit,
  checkAuth,
  getPerson2,
} from "@/api/personLiable/personLiable";
import { fileInfo } from "@/api/common";
import personSel from "@/components/person-sel";
import UploadImg from "@/components/secondControlList/UploadImg";
import { status } from "nprogress";
import ViewImage from "@/components/viewImage/index.vue";

export default {
  components: {
    personSel,
    UploadImg,
    ViewImage,
  },
  data() {
    return {
          headers:{
          Authorization:this.$store.state.user.token
        },
      dialogPic: false,
      picUrl: [],
      id: "",
      radiodata: {},
      fileIdListUrl: [],
      name: "",
      form: {
        personId: null, //认证人
        appointmentDate: null, //上任日期
        effectiveDate: [],
        effectiveEndDate: "", //任命有效期(结束日期)
        effectiveStartDate: "", // 任命有效期(开始日期)
        appointmentFileId: [], //任命文件
        certId: "",
        orgId: "",
        tenantId: "",
      },
      personDetail: {
        name: "",
        genderName: "",
        idNo: "",
        phone: "",
        deptName: "",
        postName: "",
        professionTitle: "",
        fileIdList: [], //从业资格证
      },
      configpersonDetail1: [
        {
          // type: "text",
          label: "安全第一责任人",
          slotName: "personId",
          required: true,
          properties: {
            // disabled:true,
          },
          rules:[
            {
              required: true,
              message: "请选择认证人",
              trigger: "change",
            }
          ],
          span: 24,
        },
        {
          // type: "text",
          label: "上任日期",
          slotName: "appointmentDate",
          required: true,
          properties: {
            // disabled:true,
          },
          rules:[
            {
            required: true,
            message: "请选择上任日期",
            trigger: "change",
            }
          ],
          span: 24,
        },

        {
          type: "text",
          label: "认命有效期",
          slotName: "effectiveDate",
          required: true,
          properties: {
            // disabled:true,
          },
          span: 24,
          rules:[
            {
            required: true,
            message: "请选择任命有效期",
            trigger: "blur",
            }
          ],
        },

        {
          label: "认命文件",
          slotName: "appointmentFileId",
          required: true,
          properties: {
            // disabled:true,
          },
          rules:[
            {
            required: true,
            message: "请选择任命文件",
            trigger: "blur",
            }
          ],
          span: 24,
        },
      ],
      configpersonDetail: [
        {
          type: "text",
          label: "姓名",
          prop: "name",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          type: "text",
          label: "性别",
          prop: "genderName",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },

        {
          type: "text",
          label: "身份证",
          prop: "idNo",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          type: "text",
          label: "手机号",
          prop: "phone",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          type: "text",
          label: "部门",
          prop: "deptName",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          type: "text",
          label: "岗位",
          prop: "postName",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          type: "text",
          label: "职位",
          prop: "professionTitle",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
        {
          label: "从业资格证",
          slotName: "fileIdList",
          required: false,
          properties: {
            // disabled:true,
          },
          span: 24,
        },
      ],
      uploadVal: [],
      value1: "",
      dialogVisible: false,

      rules: {
        personId: [
          {
            required: true,
            message: "请选择认证人",
            trigger: "change",
          },
        ],
        appointmentDate: [
          {
            required: true,
            message: "请选择上任日期",
            trigger: "change",
          },
        ],
        effectiveDate: [
          {
            required: true,
            message: "请选择任命有效期",
            trigger: "blur",
          },
        ],
        appointmentFileId: [
          {
            required: true,
            message: "请选择任命文件",
            trigger: "blur",
          },
        ],
      },
      action: "/api/sysfile/file_info/upload",
    };
  },
  watch: {
    "form.personId": {
      handler(newVal, oldVal) {
        console.log("newVal", newVal);
        if (newVal !== undefined && newVal !== "") {
          this.getPersonDetail(this.form.personId);
        } else {
          Object.keys(this.personDetail).forEach((key) => {
            this.personDetail[key] = "";
          });
        }
      },
      deep: true,
    },
  },
  async created() {
    if (this.$route.query.personId) {
      // const res = await checkAuth()
      console.log("this.$route.query.personId", this.$route.query.personId);
      //  this.getPersonDetail(this.$route.query.personId )
      this.form.personId = this.$route.query.personId;
      this.getPersonDetail2(this.$route.query.id);

      this.id = this.$route.query.id;
    } else {
      this.form.personId = this.$store.state.user.personId;
      this.form.tenantId = this.$store.state.user.tenantId;
      this.form.orgId = localStorage.getItem("orgId");
    }
  },

  methods: {
    
      // 提加
      next() {
        this.$refs['ruleForm'].$refs['ruleForm'].validate((valid) => {
console.log("valid",valid)
          if (valid) {
            console.log("valid1", this.form)
            let obj = {}
            obj.personId = this.form.personId
            obj.orgId = this.form.orgId
            obj.tenantId = this.form.tenantId
            obj.certId = this.form.certId
            obj.effectiveStartDate = this.form.effectiveDate[0] + " 00:00:00"
            obj.effectiveEndDate = this.form.effectiveDate[1] + " 00:00:00"
            obj.appointmentDate = this.form.appointmentDate + " 00:00:00"
            obj.appointmentFileId = this.form.appointmentFileId[0].id
            if (this.$route.query.personId) {
              obj.id = this.id
              obj.authStatus = 1
              edit(obj).then(res => {
                if (res.data) {
                  this.$message.success("验证成功")
                  this.navigater("/resp/personLiable/process")
                }
              })
            } else {
              add(obj).then(res => {
                if (res.data) {
                  this.$message.success("验证成功")
                  this.navigater("/resp/personLiable/process")
                }
              })
            }

          }
        })

      },

    // 获取安全第一责任人详情
    async getPersonDetail(personId) {
      const res = await getPerson(personId);
      console.log("res===", res);
      this.name = res.data.sysPersonDetails.name;
      // if (res.data.certId) {
      //   this.form.certId = res.data.certId
      // } else {
      //   this.$message.error("该人员没有认证资格")
      // }
      this.form.certId = res.data.certId;
      if (res.data.sysPersonDetails) {
        Object.keys(this.personDetail).forEach((key) => {
          // this.personDetail[key] = res.data.sysPersonDetails[key]
          this.$set(this.personDetail, key, res.data.sysPersonDetails[key]);
          if (
            this.personDetail[key] == "" ||
            this.personDetail[key] == undefined
          ) {
            this.personDetail[key] = "-";
          }
        });
        if (res.data.baseCertificateDto) {
          fileInfo(res.data.baseCertificateDto.fileIdList).then((res) => {
            if (res.code == 200) {
              this.personDetail.fileIdList = [];
              this.personDetail.fileIdList = [
                ...this.personDetail.fileIdList,
                ...res.data,
              ];
            }

            res.data.forEach((item) => {
              this.fileIdListUrl.push(item.downloadUrl);
            });
          });
        }
      }
    },
    getPersonDetail2(id) {
      getPerson2(id).then((res) => {
        console.log("res", res);
        this.form.orgId = res.data.orgId;
        this.form.tenantId = res.data.tenantId;
        this.form.appointmentDate = res.data.appointmentDate.slice(0, 10);
        // this.form.effectiveDate = res.data.effectiveStartDate.slice(0, 10) + " ~ " + res
        //     .data.effectiveEndDate.slice(0, 10)
        this.form.effectiveDate = [];
        this.form.effectiveDate[0] = res.data.effectiveStartDate.slice(0, 10);
        this.form.effectiveDate[1] = res.data.effectiveEndDate.slice(0, 10);

        let arr = [];
        arr[0] = res.data.appointmentFileId;
        fileInfo(arr).then((pic) => {
          let obj = {};
          obj.url = pic.data[0].downloadUrl;
          obj.id = pic.data[0].id;
          obj.name = pic.data[0].name;
          status: "sucess";
          // this.$set(this.form, 'appointmentFileId', pic.data[0].downloadUrl)
          this.form.appointmentFileId[0] = obj;
        });
        console.log(
          " this.form.appointmentFileId",
          this.form.appointmentFileId
        );
      });
    },
    // 选择人员
    chosePeople() {
      this.dialogVisible = true;
    },
    config() {
      this.dialogVisible = false;
      this.form.personId = this.radiodata.personId;
      this.form.orgId = this.radiodata.orgId;
      this.form.tenantId = this.radiodata.tenantId;
      this.name = this.radiodata.name;
      this.$refs.ruleForm.$refs.personIdFormItem.$emit(
        "el.form.change",
        this.radiodata.personId
      );
    },
    imgChange(val) {
      console.log("val", val);
      // this.form.appointmentFileId[0] = val.file
      console.log("this.form.appointmentFileId", this.form.appointmentFileId);
      // console.log("this.uploadVal", this.uploadVal)
    },
    handleClose() {
      this.name = "";
      this.form.personId = "";
      this.$refs.ruleForm.$refs.personIdFormItem.$emit("el.form.change", null);
    },
    // //查看大图
    bigPic(list) {
      this.dialogPic = true;
      this.picUrl = list.map((item) => item.downloadUrl);
    },
    closeViewer() {
      this.dialogPic = false;
      this.picUrl = [];
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .personLiable {
  height: 100%;
  padding: 0 !important;
}

.content_line {
  width: 1px;
  height: 600px;
  background: #ccc;
  margin: 0 auto 120px;
}

::v-deep .el-range-separator {
  width: 10% !important;
}
::v-deep .ty-upload{
.ty-upload-add{
    border: none !important;
}
} 
</style>