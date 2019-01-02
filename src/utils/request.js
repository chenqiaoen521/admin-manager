import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { MessageBox } from 'element-ui'
import { getToken, getState } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
/*service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)*/

// response interceptor
service.interceptors.response.use(
   response => {
     const res = response.data
     if (res.data === 'logout') {
      return response
     }
     if (res.code === 1) {
      return response
     }
     if ( getToken() && (res.code === 401 || res.code === 403)) {
       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
         confirmButtonText: '重新登录',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         store.dispatch('FedLogOut').then(() => {
           location.reload()  
         })
       })
      return Promise.reject('error')
     }
     return response
   },
  error => {
    this.$message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
