<template>
  <hqit-content-page type="list">
    <template slot="content">
      <hqit-table ref="statePersonLiable"
                  :dataSource="getStatePersonLiableTableList"
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
        <template slot="orgName"
                  slot-scope="{ rowData, index }">
          <el-button type="text"
          class="orgNameText"
                     @click="getOrg(rowData.orgId)">{{
            rowData.orgName
          }}</el-button>
        </template>
        <template slot="name" slot-scope="{ rowData, index }">
          <el-button type="text" @click="getPer(rowData.personId)">{{
            rowData.name
          }}</el-button>
        </template>
        <template slot="appointmentFileId" slot-scope="{ rowData, index }">
          <el-image
            fit="fill"
            :src="rowData.appointmentFileId"
            style="width: 40px"
            @click="bigPic(rowData.appointmentFileId, 1)"
          ></el-image>
        </template>
        <template slot="fileIdList" slot-scope="{ rowData, index }">
          <span v-if="rowData.fileIdList == '-'">{{ rowData.fileIdList }}</span>

          <el-image
            fit="fill"
            v-else
            :src="rowData.fileIdList"
            style="width: 40px"
            @click="bigPic(rowData.fileIdListarr)"
          >
          </el-image>
        </template>
        <template slot="opts" slot-scope="{ rowData, index }">
          <el-button
            v-if="rowData.authStatus == 1"
            @click="
              navigater(
                `/resp/statePersonLiable/detail?personId=${rowData.personId}&orgId=${rowData.orgId}&id=${rowData.id}&name=${rowData.name}`
              )
            "
            class="handle-text-btn"
            size="mini"
            :icon="$editIcon"
            type="text"
            >??????
          </el-button>
          <el-button
            v-else
            class="handle-text-btn"
            size="mini"
            type="text"
            :icon="$editIcon"
            @click="
              navigater(
                `/resp/statePersonLiable/detail?personId=${rowData.personId}&orgId=${rowData.orgId}&id=${rowData.id}&type=${rowData.id}&name=${rowData.name}`
              )
            "
          >
            ??????
          </el-button>
        </template>
      </hqit-table>
      <hqit-dialog
        title="????????????"
        v-model="orgForm.dialogOrg"
        :close-on-click-modal="true"
        dialogType="form"
        :showFooter="false"
        width="800px"
      >
        <org-details :orgId="orgForm.id"></org-details>
      </hqit-dialog>
      <hqit-dialog
        title="????????????"
        v-model="perForm.dialogPer"
        :close-on-click-modal="true"
        :showFooter="false"
        dialogType="form"
        width="500px"
      >
        <person-details :personId="perForm.id"></person-details>
      </hqit-dialog>
      <view-image
        v-if="dialogPic"
        :on-close="closeViewer"
        :url-list="picUrl"
      ></view-image>
    </template>
  </hqit-content-page>
</template>

<script>
import { fileInfo } from "@/api/common";
import { pageQueryListData } from "@/api/statePersonLiable/statePersonLiable";
import ViewImage from "@/components/viewImage/index.vue";
import personDetails from "@/components/person-details/index.vue";
import orgDetails from "@/components/org-details/index.vue";
export default {
  components: {
    personDetails,
    orgDetails,
    ViewImage,
  },
  data() {
    return {
      src:process.env.VUE_APP_BASE_API + '/api/sysfile/file_info/download?id=',
      //??????????????????
      searchConfig: [
        {
          prop: "name",
          label: "?????????????????????",
          attrs: {
            clearable: true,
            placeholder: "??????????????????????????????",
          },
        },
        {
          prop: "orgName",
          label: "??????",
          attrs: {
            clearable: true,
            placeholder: "???????????????",
          },
        },
        {
          prop: "phone",
          label: "?????????",
          attrs: {
            clearable: true,
            placeholder: "??????????????????",
          },
        },
        {
          prop: "appointmentDate",
          label: "????????????",
          type: "daterange",
          startKey: "searchUpDateStart",
          endKey: "searchUpDateEnd",
          attrs: {
            startPlaceholder: "????????????",
            endPlaceholder: "????????????",
          },
        },
        {
          prop: "updateTime",
          label: "????????????",
          type: "daterange",
          startKey: "searchSetDateStart",
          endKey: "searchSetDateEnd",
          attrs: {
            startPlaceholder: "????????????",
            endPlaceholder: "????????????",
          },
        },
      ],
      columns: [
        {
          prop: "orgName",
          label: "??????",
          align: "left",
          slotname: "orgName",
          attrs: {
            minWidth: 100,
          },
        },
        {
          prop: "name",
          label: "?????????????????????",
          slotname: "name",
          attrs: {
            minWidth: 120,
          },
        },
        {
          prop: "phone",
          label: "?????????",
          formatter: (val) => {
            return val ? val : "-";
          },
          attrs: {
            // minWidth: 120,
          },
        },
        {
          prop: "appointmentFileId",
          label: "????????????",
          slotname: "appointmentFileId",
          align: "center",
          formatter: (val) => {
            return val ? val : "-";
          },
          attrs: {
            // minWidth: 100,
          },
        },
        {
          label: "???????????????",
          prop: "fileIdList",
          slotname: "fileIdList",
          align: "center",
          formatter: (val) => {
            return val ? val : "-";
          },
          attrs: {
            minWidth: 100,
          },
        },
        {
          label: "?????????",
          prop: "authName",
          formatter: (val) => {
            return val ? val : "-";
          },
          attrs: {
            minWidth: 80,
          },
        },
        {
          label: "????????????",
          prop: "appointmentDate",
          sortable: "custom",
          formatter: (val) => {
            if (val) {
              return val.substring(0, 10);
            } else {
              return "-";
            }
          },
          attrs: {
            minWidth: 100,
          },
        },
        {
          label: "????????????",
          prop: "updateTime",
          sortable: "custom",
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            } else {
              return "-";
            }
          },
          attrs: {
            minWidth: 100,
          },
        },
        {
          prop: "authStatus",
          label: "??????",
          formatter: (val) => {
            switch (val) {
              case 1:
                return "?????????";
              case 2:
                return "?????????";
              case 3:
                return "?????????";
              default:
                return "-";
            }
          },
          attrs: {
            columnKey: "authStatus",
            filters: [
              {
                text: "?????????",
                value: 1,
              },
              {
                text: "?????????",
                value: 2,
              },
              {
                text: "?????????",
                value: 3,
              },
            ],
            minWidth: 100,
          },
        },
        {
          prop: "opts",
          label: "??????",
          slotname: "opts",
          width: "100",
          fixed: "right",
          align: "right",
        },
      ],
      queryForm: {
        expr: [
          {
            expression: "EQ",
            key: "deleteFlag",
            value: {},
          },
          {
            key: "authStatus",
            expression: "IN",
            value: [],
          },
          {
            key: "appointmentDate",
            expression: "GE",
            value: "",
          },
          {
            key: "appointmentDate",
            expression: "LE",
            value: "",
          },
          {
            key: "updateTime",
            expression: "GE",
            value: "",
          },
          {
            key: "updateTime",
            expression: "LE",
            value: "",
          },
        ],
        order: "createTime",
        sort: "DESC",
      },
      searchQuery: {},
      picTitle: "",
      dialogPic: false,
      picUrl: [],
      orgForm: {
        dialogOrg: false,
        id: "",
      },
      perForm: {
        dialogPer: false,
        id: "",
      },
    };
  },
  created() {},
  methods: {
    //????????????
    async getStatePersonLiableTableList(data) {
      // ??????????????????
      let searchData = {
        query: { ...this.searchQuery },
        expr: this.queryForm.expr,
        order: this.queryForm.order,
        sort: this.queryForm.sort,
      };
      const res = await pageQueryListData({
       
        ...data,
         ...searchData,
        pageNum: data.page,
        pageSize: data.size,
      });
      console.log('res',res)
      if (res.data) {
      //   let appointmentFileIdarr = [];
      //   let fileIdList = [];
      //   res.data.list.forEach((item) => {
      //     appointmentFileIdarr.push(item.appointmentFileId);
      //     if (item.baseCertificateDto) {
      //       fileIdList = fileIdList.concat(item.baseCertificateDto.fileIdList);
      //     }
      //   });
      //   let pic2  = []
      //   if(fileIdList.length > 0){
      //     pic2 = await fileInfo(fileIdList).catch((err)=>{
      //       return Promise.resolve({
      //           data: res.data, //?????????????????????
      //         });
      //     });
      //   }
      // let pic1 = []
      // if(appointmentFileIdarr.length > 0){
      //     pic1 = await fileInfo(appointmentFileIdarr).catch((err)=>{
      //       return Promise.resolve({
      //           data: res.data, //?????????????????????
      //         });
      //     })
      // }
      //   if(res.data.list.length > 0){
      //           res.data.list.filter((val) => {
      //             val.fileIdListarr = [];
      //             if (val.baseCertificateDto) {
      //               if(pic2.data.length > 0){
      //           pic2.data.forEach((val3) => {
      //                     val.baseCertificateDto.fileIdList.forEach((val4) => {
      //                       if (val4 == val3.id) {
      //                         val.fileIdListarr.push(val3.downloadUrl);
      //                       }
      //                     });
      //                   });
      //           val.fileIdList = val.fileIdListarr[0];
      //               }
      //             } else {
      //               val.fileIdList = "-";
      //             }
      //             pic1.data.forEach((val2) => {
      //               if (val.appointmentFileId == val2.id) {
      //                 val.appointmentFileId = val2.downloadUrl;
      //               }
      //             });
      //           });
      //   }



res.data.list.forEach((item) => {
  item.appointmentFileId = this.src + item.appointmentFileId
})

  if(res.data.list.length > 0){

                res.data.list.filter((val) => {
                  console.log('val',val)
                       val.fileIdListarr = [];
                  if (val.baseCertificateDto) {
                    if(val.baseCertificateDto.fileIdList.length > 0){
                      
                          val.baseCertificateDto.fileIdList.forEach((val4) => {
                            val.fileIdListarr.push(this.src + val4)
                          });
                           val.fileIdList = val.fileIdListarr[0];
                           console.log("val.fileIdListarr11",val.fileIdListarr)
                           
                    }
                  } else {
                    val.fileIdList = "-";
                  }
                });
        }
        console.log("res.data123",res.data)

        return Promise.resolve({
          data: res.data, //?????????????????????
        });
      }
    },

    //????????????
    sortChange({ column, prop, order }) {
      if (order) {
        this.queryForm.sort = order == "descending" ? "DESC" : "ASC";
        this.queryForm.order = prop;
      } else {
        this.queryForm.sort = "DESC";
        this.queryForm.order = "createTime";
      }
      this.$refs.statePersonLiable.getData({}, true);
    },
    handleSearch1() {
      console.log("456");
      if (this.searchUpDate && this.searchUpDate.length > 0) {
        let effectiveStartDate = this.toDateUtil.formatDateTime(
          this.searchUpDate[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        let effectiveEndDate = this.toDateUtil.formatDateTime(
          new Date(
            this.searchUpDate[1].toString().replace("00:00:00", "23:59:59")
          ),
          "yyyy-MM-dd HH:mm:ss"
        );
        this.outSiderQuery.expr[2].value = effectiveStartDate;
        this.outSiderQuery.expr[3].value = effectiveEndDate;
      }
      if (this.searchSetDate && this.searchSetDate.length > 0) {
        let searchSetDate1 = this.toDateUtil.formatDateTime(
          this.searchSetDate[0],
          "yyyy-MM-dd HH:mm:ss"
        );
        let searchSetDate2 = this.toDateUtil.formatDateTime(
          new Date(
            this.searchSetDate[1].toString().replace("00:00:00", "23:59:59")
          ),
          "yyyy-MM-dd HH:mm:ss"
        );

        this.outSiderQuery.expr[4].value = searchSetDate1;
        this.outSiderQuery.expr[5].value = searchSetDate2;
      }
    },
    //??????
    tableFilterChange(val) {
      console.log("val", val);
      const { authStatus } = val;
      if (authStatus) {
        if (authStatus.length >= 1) this.queryForm.expr[1].value = authStatus;
        if (authStatus.length == 0) {
          this.queryForm.expr[1].value = [];
        }
        this.handleSearch();

        return false;
      }
    },

    resetForm() {
      this.searchQuery = {};
      (this.queryForm = {
        expr: [
          {
            expression: "EQ",
            key: "deleteFlag",
            value: {},
          },
          {
            key: "authStatus",
            expression: "IN",
            value: [],
          },
          // {
          //   key: "appointmentDate",
          //   expression: "GE",
          //   value: "",
          // },
          // {
          //   key: "appointmentDate",
          //   expression: "LE",
          //   value: "",
          // },
          // {
          //   key: "updateTime",
          //   expression: "GE",
          //   value: "",
          // },
          // {
          //   key: "updateTime",
          //   expression: "LE",
          //   value: "",
          // },
        ],
        order: "createTime",
        sort: "DESC",
      }),
        this.$refs.statePersonLiable.$refs.table.clearFilter();
      this.$refs.statePersonLiable.getData({}, true);
    },
    handleSearch(form) {
      console.log("form", form);
      if (form?.query.length) {
        let obj = {};
        const searchQuery = form.query.filter(
          (item) => item.expression == "LIKE"
        );
        searchQuery.map((v) => {
          obj[v.key] = v.value;
        });
        const exprQuery = form.query
          .filter((item) => item.expression !== "LIKE")
          .map((v) => {
            console.log("v", v);
            if (v.key == "searchUpDateStart"||v.key == "searchUpDateEnd") {
              v.key = "appointmentDate";
              // v.value = v.value + " 00:00:00";
            } else if (v.key == "searchSetDateStart") {
              v.key = "updateTime";
              v.value = v.value + " 00:00:00";
            } else if (v.key == "searchSetDateEnd") {
              v.key = "updateTime";
              v.value = v.value + " 23:59:59";
            }
            return v;
          });
        this.searchQuery = {
          ...obj,
        };
        this.queryForm = {
          ...this.queryForm,
          expr: [...this.queryForm.expr, ...exprQuery],
          // expr:exprQuery,
        };
      }
      this.$refs.statePersonLiable.getData({}, true);
    },

    //??????????????????
    getOrg(id) {
      this.orgForm.dialogOrg = true;
      this.orgForm.id = id;
    },

    //??????????????????
    getPer(id) {
      this.perForm.dialogPer = true;
      this.perForm.id = id;
    },

    // //????????????
    bigPic(url, val) {
      this.dialogPic = true;
      // this.picTitle = "????????????"
      console.log("url.typeof", url);
      console.log("url.typeof", url.typeof);
      if (val == 1) {
        this.picUrl = [url];
      } else {
        this.picUrl = url;
      }
    },
    closeViewer() {
      this.dialogPic = false;
      this.picUrl = [];
    },
    //????????????
    goDetail(scope) {
      console.log("scope", scope);
      this.$router.push({
        path: "detail",
        query: {
          personId: scope.row.scope,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
