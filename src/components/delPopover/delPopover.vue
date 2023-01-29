<template>
  <el-popover :placement="placement" :width="width" v-model="visible">
    <div class="content">
      <template v-if="valAllText">
        <div v-html="filterData(valAllText)"></div>
      </template>
      <template v-else>
        确定要删除<span class="highlight-text">“ {{ valText }} ”</span>的数据吗？
      </template>
    </div>
    <div class="delbtn">
      <div class="del-popcancel" @click="visible = false">取消</div>
      <div class="del-popsubmit" @click="submitMethods">确定</div>
    </div>
    <el-button slot="reference" class="handle-text-btn" type="text" size="mini"
      >删除</el-button
    >
  </el-popover>
</template>
<script>
export default {
  props: {
    popoverVisible: {
      type: Boolean,
      default: false,
    },
    valAllText: {
      type: String,
      default: "",
    },
    // 传入每行的数据
    valText: {
      type: String,
      default: "当前",
    },
    // 宽度设置
    width: {
      type: String || Number,
      default: "400",
    },
    // 放置位置
    placement: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      visible: this.popoverVisible || false,
    };
  },
  methods: {
    // 删除事件
    submitMethods() {
      this.visible = false
      this.$emit("submitFun");
    },
    filterData(val){
      let text 
      if(val.split(this.valText).length == 2){
        text = `${val.split(this.valText)[0]}<span style="color: #026dff;">“${ this.valText }”</span>${val.split(this.valText)[1]}`
      }else{
        text = '确定要删除该数据吗？'
      }
      
      return text
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  color: #333333;
  font-size: 14px;
  padding: 20px 30px;
  text-align: center;
  .highlight-text {
    color: #026dff;
  }
}

.delbtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    .del-popcancel {
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 3px;
        background: #F2F3F5;
        color: #333333;
        font-size: 14px;
        cursor: pointer;
        margin-right: 10px;
    }
    .del-popsubmit {
        width: 100px;
         height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 3px;
        background: #EB4747;
        color: #FFF;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>