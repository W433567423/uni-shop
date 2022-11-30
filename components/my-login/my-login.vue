<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button> -->
    <view class="tips-text">
      登陆后尽享更多权益
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {};
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      getUserInfo(e) {
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了授权!')
        this.updateUserInfo(e.detail.userInfo)
        this.getToken(e.detail)
      },
      async getToken(info) {
        const [err, res] = await uni.login().catch(err => err)
        if (err && res.errMsg !== 'login:ok') return uni.$showError('登录失败1!')
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        const {
          data: loginResult
        } = await this.$http.post('/api/public/v1/users/wxlogin', query)
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登陆失败2!')
        if (loginResult.meta.status === 400) {
          const moni_token =
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
          this.updateToken(moni_token)
          this.navigateBack()
          uni.$showMsg('登陆成功')
        }
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }

      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    button {
      margin-top: 100px;
    }

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 80%;
      border-radius: 100px;
      margin: 50px 0 0;
      background-color: #C00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray
    }
  }
</style>
