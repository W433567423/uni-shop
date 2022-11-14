<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHander">
    <view class=" my-search-box" :style="{'border-radius':radius+'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    data() {
      return {};
    },
    props: {
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    methods: {
      searchBoxHander() {
        //为自定义组件绑定事件
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    // background-color: #c00000;
    height: 50px;
    padding: 0px 10px;
    display: flex;
    align-items: center;

    .my-search-box {
      height: 36px;
      background-color: #ffffff;
      // border-radius: 15px;
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
