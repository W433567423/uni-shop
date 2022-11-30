export default {
  namespaced: true,
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token') || '',
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    redirectInfo: null
  }),
  mutations: {
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserinfoToStorage')
    },
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    },
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    saveUserinfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    }
  },
  getters: {
    addstr(state) {
      if (!state.address.provinceName) return ''
      else
        return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
