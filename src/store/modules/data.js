import { getCategoryList } from '@/api/commodity/class'
import { getSupplierList } from '@/api/supplier/supplier'
import { getPayMentList, getTypeActivityList, getSpuList } from '@/api/public'

const state = {
  categoryList:null,//商品分类列表
	providerList:null,//供应商列表
	payMentList:null,//支付方式列表
	typeActivityList:null,//活动类型列表
	spuList:null,//spu列表
}

const mutations = {
 SET_PROVIDER: (state, list) => {
   state.providerList = list
 },
 SET_PAYMENT: (state, list) => {
   state.payMentList = list
 },
 SET_ACTIVITY: (state, list) => {
   state.typeActivityList = list
 },
 SET_SPU: (state, list) => {
   state.spuList = list
 }
}

const actions = {
  categoryList({ commit }) {
    return new Promise((resolve, reject) => {
      getCategoryList().then(response => {
        console.log(response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
	providerList({ commit }) {
		return new Promise((resolve, reject) => {
		  getSupplierList().then(response => {
		    let {datas}=response
		    commit('SET_PROVIDER', datas)
		    resolve()
		  }).catch(error => {
		    reject(error)
		  })
		})
	},
	payMentList({ commit }) {
		return new Promise((resolve, reject) => {
		  getPayMentList().then(response => {
		    let {datas}=response
		    commit('SET_PAYMENT', datas)
		    resolve()
		  }).catch(error => {
		    reject(error)
		  })
		})
	},
	typeActivityList({ commit }) {
		return new Promise((resolve, reject) => {
		  getTypeActivityList().then(response => {
		    let {datas}=response
		    commit('SET_ACTIVITY', datas)
		    resolve()
		  }).catch(error => {
		    reject(error)
		  })
		})
	},
	spuList({ commit }) {
		return new Promise((resolve, reject) => {
		  getSpuList().then(response => {
		    let {datas}=response
		    commit('SET_SPU', datas)
		    resolve()
		  }).catch(error => {
		    reject(error)
		  })
		})
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}