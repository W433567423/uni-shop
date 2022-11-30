<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 金额 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}} </text>
    </view>
    <!-- 结算 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        seconds: 3,
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
        if (!this.addstr) return uni.$showMsg('请选择收货地址!')
        if (!this.token) return this.delayNavigate()
        this.payOrder()
      },
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算!' + n + '秒后跳转到登陆页面',
          mask: true,
          duration: 1500
        })
      },
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder() {
        const orderInfo = {
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        const {
          data: res
        } = await this.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败!')
        const orderNumber = res.message.order_number
        const {
          data: res2
        } = await this.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        if (res2.meta.status !== 200) return uni.$showError('预付订单失败')
        const payInfo = res2.message.pay
        const [err, succ] = await uni.requestPayment(payInfo)
        if (err) return uni.$showMsg('订单未支付1!')
        const {
          data: res3
        } = uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付2!')
        uni.showToast({
          title: '支付完成',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-self: center;
    // bottom: 50px;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #f5f5f5;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      height: 50px;
      line-height: 50px;

      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #C00000;
      height: 50px;
      line-height: 50px;
      color: white;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>
