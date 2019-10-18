import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/Api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null
  },
  mutations: {
    SET_DATA: (state, payload) => {
      state.data = payload
    }
  },
  actions: {
    GET_DATA: async (context, payload) => {
      const result = await api.get(payload)
      context.commit('SET_DATA', result.data)
    }
  },
  getters: {
    DATA: state => {
      return state.data
    }
  }
})
