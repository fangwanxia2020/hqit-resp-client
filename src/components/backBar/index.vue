<template>
  <div class="back-bar">
    <span class="back-bar-icon" @click="back">
      <i class="el-icon-back"></i> 返回
    </span>
    <span class="line"></span>
    <span class="back-bar-text">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: "back-bar",
  props: {
    title: {
      type: String,
      default: "标题",
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.back-bar {
  font-size: 16px;
  display: flex;
  align-content: center;
  padding: 15px 0px;
  border-bottom: 1px solid #f0f2f5;
  &-icon {
    color: #0079fe;
    // margin: 0 10px 0 30px;
    margin-left:30px ;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 80px;
    .el-icon-back {
      font-size: 22px;
      margin-right: 10px;
    }
  }
  &-text {
    color: #303133;
    font-weight: bold;
    line-height: 23px;
    overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
  }
  .line {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-top: 3px;
    width: 2px;
    height: 16px;
    background: #dadede;
  }
}
</style>
