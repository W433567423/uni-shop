<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none" focus></uni-search-bar>
    </view>
    <!-- 建议搜索列表 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item , i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>历史记录</text>
        <uni-icons type="trash" size="17px" @click="cleanHistory"></uni-icons>
      </view>
      <!-- <hr> -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>

    </view>
  </view>
</template>

<script>
  import {
    $http
  } from '@escook/request-miniprogram';
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        searchVal: '',
        searchResults: [],
        historyList: []
      };
    },
    computed: {
      historys() {
        //reverse会修改原数组
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 防抖处理
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchList()
        }, 1000)
      },
      async getSearchList() {
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        const {
          data: res
        } = await $http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        this.saveSearchHistory()
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id' + goods_id
        })
      },
      saveSearchHistory() {
        //利用Set对象解决了重复的问题
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      cleanHistory() {
        this.historyList = ''
        uni.setStorageSync('kw', '')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
    background-color: #C00000;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 3px;
      }
    }
  }

  .history-box {
    padding: 0 2px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
        background-color: rgba(219, 220, 225, .3);
        border: none;
        color: #000;
      }
    }
  }
</style>
