<template>
  <view class="goods-item">
    <view class="goods-item-left">
      <radio color="#C00000" v-if="showRadio" :checked="goods.goods_state" @click="radioChangeHander">
      </radio>
      <image :src="goods.goods_small_logo||defaultPic" class="goods-pic"> </image>
    </view>
    <view class="goods-item-right">
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">
          ￥{{goods.goods_price+'.00'}}
        </view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHander">
        </uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      goods: {
        type: Object,
        default: {},
      },
      showRadio: {
        type: Boolean,
        default: false
      },
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 渲染图片的默认地址
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    computed: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      radioChangeHander(e) {
        this.$emit('radio-change', this.goods.goods_id)
      },
      numChangeHander(val) {
        this.$emit('num-change', {
          num: +val,
          goods_id: this.goods.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .goods-price {
          color: red;
          font-size: 16px;
        }
      }
    }
  }
</style>
