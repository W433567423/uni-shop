<template>
  <view>
    <!-- 搜索组件 -->
    <my-search @myclick='gotoSearch'></my-search>
    <!-- 分类滚动区域 -->
    <view class="scroll-view-container">
      <!-- 左侧滚动视图 -->
      <scroll-view scroll-y class="left-scroll-view" :style="{height:wh+'px'}">
        <block v-for="(item ,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active':'']" @click="activeChanged(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滚动视图 -->
      <scroll-view scroll-y class="right-scroll-view" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item ,i) in cateLevel2" :key="i">
          <view class="cate-lv2-title">/{{item.cat_name}}/</view>
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,i3) in item.children" :key="i3" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0,
        scrollTop: 0,
        cateList: [],
        active: 0,
        cateLevel2: []
      };
    },
    onLoad() {
      this.getCateList()
      let sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i
        this.cateLevel2 = this.cateList[i].children
        // this.scrollTop = this.scrollTop === 0 ? 1 : 0
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #fff;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translatey(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }

  }
</style>
