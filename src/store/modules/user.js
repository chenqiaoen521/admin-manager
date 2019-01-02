import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken , getState, setState, removeState} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit}, {username, password}) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(res => {
          if (res.data.success) {
            commit('SET_STATUS', res.data.success)
            commit('SET_NAME', username)
            setState(username, res.data.success)
            setToken(username)
          }
          resolve(res.data.success)
        }).catch(error => {
          reject(error)
        })
      })
    },
    resetUser({ commit}, {username, status}) {
      commit('SET_NAME', username)
      commit('SET_STATUS', status)
    },
    // 获取用户信息
    GetUserInfo({ commit , state, rootState, getters}) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.name).then(res => {
          let {row} = res.data.data
          if (row && Array.isArray(row) && row.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', row)
          } else {
            reject('错误的权限')
          }
          commit('SET_AVATAR', '/static/logo.png')
          commit('SET_INTRODUCTION', '我是大大大王')
          resolve(row)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_STATUS', false)
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          removeToken()
          removeState(state.name)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_STATUS', false)
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        removeToken()
        removeState(state.name)
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, state}, role) {
      return new Promise(resolve => {
        getUserInfo(state.name).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
