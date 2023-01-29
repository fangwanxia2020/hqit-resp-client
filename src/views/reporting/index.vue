<template>
  <hqit-content-page type="list">
      <template slot="content">
        <div class="reporting">
          <div class="defect" v-if="falg">
            <div style="text-align:center">
        <img v-imgscale :src="imgUrl" alt="" style="width:200px"/>
            <div style="margin-top:10px">暂无数据</div>
            </div>
        
          </div>
          <div
            v-else
            class="reporting_box clearfix"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <div @click="withdraw(index)" class="reporting_title">
              {{ item.itemName }}({{ totalNumber(item) }})
              <i
                :class="[
                  item.isActive == false
                    ? 'el-icon-caret-right'
                    : 'el-icon-caret-bottom',
                ]"
              ></i>
            </div>
            <div v-if="item.isActive == true">
              <div
                class="reporting_content"
                v-for="(list, i) in item.contentList"
                :key="i"
              >
                <div class="reporting_content_item" @click="detailTo(list.id)">
                  <div class="item_title">
                    <i
                      class="el-icon-tickets"
                      style="color: #1890ff; margin-right: 6px"
                    ></i>
                    <span>{{ list.content }}</span>
                  </div>
                  <div class="item_con">
                    <span>{{ list.standard }}</span>
                  </div>
                  <div class="item_tip clearfix">
                    <div
                      @click.stop="addShowHandle(list.id)"
                      style="float: left; color: #fb6260"
                      v-if="list.cancelNum != 0"
                    >
                      撤回 ({{ list.cancelNum }})
                    </div>
                    <div style="float: right">{{ list.reportedAsk }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hqit-dialog
          title="撤回—及时如实报告事件"
          v-model="addShow"
          width="600px"
          :close-on-click-modal="true"
           dialogType="form"
        >
          <div style="padding: 20px 0">
            <ty-business-crud1
              class="high-search-crud"
              title
              searchMode="base"
              :showOperation="[]"
              :showIndex="true"
              :showSearch="false"
              :outSiderQuery="outSiderQuery"
              :isGetListByQuery="true"
              :getListInterface="getListInterface"
              :columns="columns"
              ref="materialCrud"
            >
              <template v-slot:rowOperator="scope">
                <el-button
                  class="handle-text-btn"
                  size="mini"
                  :icon="$editIcon"
                  type="text"
                  @click="updateHandle(scope.row.id)"
                  >修改
                </el-button>
              </template>
            </ty-business-crud1>
          </div>
        </hqit-dialog>
     </template>
  </hqit-content-page>

</template>
<script>
import {
  getEnterpriseReportedList,
  currentVersion,
} from "@/api/reporting/index";
import { checkAuth } from "@/api/personLiable/personLiable";

export default {
  components: {},
  computed: {},
  data() {
    return {
      falg: false,
      outSiderQuery: {
        order: "createTime",
        sort: "DESC",
      },
      addShow: false,
      imgUrl: require("@/assets/images/defect.png"),
      //列表字段定义
      columns: [
        {
          label: "提交时间",
          prop: "startTime",
          width: 160,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
        },
        {
          label: "撤回时间",
          prop: "updateTime",
          width: 160,
          formatter: (val) => {
            if (val) {
              return val.substring(0, 16);
            }
          },
        },
        {
          prop: "operation",
          label: "操作",
          type: "operation",
          align: "right",
        },
      ],
      dataList: [],
      isActive: false,
      //列表查询接口信息
      getListInterface: {
        url: `/api/resp/task/page`,
        methodType: "post",
        resFormatFun: this.getListResFormatFun,
        params: {
          // statusList: [3],
          // contentDto: {}
          // contentId: xxx,
          orgId: localStorage.getItem("orgId"),
          status: 3,
          contentId: "",
        },
      },
    };
  },
  async created() {
    const res = await checkAuth();
    if (res.data && res.data.authStatus == 2 && res.data.isExpired !==1) {
      this.currentVersion();
    } else {
      this.$router.replace("/resp/personLiable");
    }
  },
  methods: {
    totalNumber(i) {
      let total = 0;
      if (i.itemId) {
        total = i.contentList.length;
      } else {
        const cancelNum = i.contentList.filter((v) => v.cancelNum != 0);
        total = cancelNum.length;
      }
      return total;
    },
    detailTo(id) {
      this.$router.push({
        path: "/resp/reporting/detail",
        query: {
          id: id,
        },
      });
    },
    updateHandle(id) {
      this.$router.push({
        path: "/resp/reporting/detailTwo",
        query: {
          id: id,
        },
      });
    },
    //格式化列表返回值
    getListResFormatFun(res) {
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    addShowHandle(id) {
      console.log("id", id);
      const params = {
        ...this.getListInterface.params,
        contentId: id,
      };
      this.$set(this.getListInterface, "params", params);
      this.getListInterface.params.contentId = id;
      console.log("this.getListInterface.params", this.getListInterface.params);
      this.addShow = true;
      this.$refs.materialCrud._getListData();
    },
    handleConfirmAdd() {},
    async currentVersion() {
      let res = await currentVersion();
      let resp = await getEnterpriseReportedList(res.data.id);
      if (resp.data.length == 0) {
        this.falg = true;
      }
      this.dataList = resp.data;
      this.dataList.map((item) => {
        item.isActive = false;
      });
      console.error(this.dataList);
    },
    withdraw(idx) {
      this.isActive = !this.isActive;
      this.dataList = this.dataList.map((item, index) => {
        if (idx == index) {
          item.isActive = !item.isActive;
        }
        return item;
      });
      // this.dataList[index].isActive= ! this.dataList[index].isActive
    },
  },
};
</script>


<style lang="scss" scoped>
.defect {
display: flex;
width: 100%;
height: 100%;
justify-content: center;
align-items: center;
}
.reporting {
  /* height: 100%; */
  &_box {
    margin: 30px 0;
  }
  &_title {
    color: #1890ff;
    cursor: pointer;
  }
  &_content {
    margin-top: 20px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
    float: left;
    margin-right: calc(33% - 300px);
    &_item {
      cursor: pointer;
      padding: 10px;
      .item_title {
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
        font-weight: 700;
        font-style: normal;
        line-height: 25px;
        font-size: 14px;
        letter-spacing: normal;
        color: #1f1e1e;
      }
      .item_con {
        display: flex;
        font-family: "微软雅黑", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #7f7f7f;
        line-height: 25px;
        margin: 6px 0;
        overflow: hidden; //超出的文本隐藏
display: -webkit-box;
-webkit-line-clamp: 2; // 超出多少行
-webkit-box-orient: vertical;
      }
      .item_tip {
        cursor: pointer;
        margin-top: 14px;
        font-size: 14px;
        color: #7f7f7f;
        font-family: "微软雅黑", sans-serif;
      }
    }
  }
}

.clearfix:after {
  content: "";

  display: block;

  visibility: hidden;

  clear: both;
}
</style>