<template>
  <view class="cart-container" v-if="cart.length!==0">
    <my-address></my-address>
    <view class="cart-title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    <uni-swipe-action>
      <block v-for="(item,index) in cart" :key="index">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item.goods_id)">
          <my-goods :goods="item" :showRadio="true" :showNum="true" @radio-change="radioChangeHander"
            @num-change="numberChangeHander"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算-->
    <my-settle></my-settle>
  </view>
  <view v-else class="empty-cart">
    <image src="/static//cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'deleteGood']),
      radioChangeHander(e) {
        this.updateGoodsState(e)
      },
      numberChangeHander(e) {
        this.updateGoodsCount(e)
      },
      swipeActionClickHandler(goods_id) {
        this.deleteGood(goods_id)
      },
    }
  }
</script>


<style lang="scss">
  .cart-container {
    margin-bottom: 50px;

    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 5px;
      border-bottom: 1px solid #efefef;

      .cart-title-text {
        margin-left: 10px;
      }
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 12px;

    }
  }
</style>
