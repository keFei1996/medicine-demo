import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getLS } from '@/utils/auth'
import { getMsgByErrorCode, checkCodeWhitelist } from '@/utils/errorMsg'
import Util from '@/utils/util'
const Base64 = require('js-base64')
const Cryptojs = require('crypto-js')
const encryptFlag = false // 是否启用加密

function addAppToken(obj, encryptFlag) {
  // 0212 加密账号
  const appId = encryptFlag ? 'otsp-manage-sys-web' : 'otsp-manage-sys-web' // bmJnemprLXdlaXhpbi13ZWI=
  const secret = 'f9xcfnqmzv710jf84ft59afc61mpqa8q' // MnVkNmY5ZmJnOXoxc2RmaGd1ZWdoZnQyeGZtcHFzZGs=
  const key = 'acfe81hfcn91zmax' // ZHd6NDE0cnl0NzQxc3Bxcw==
  const iv = 'acfe81hfcn91zmax' // ZHd6NDE0cnl0NzQxc3Bxcw==
  const jetLag = localStorage.getItem('jetLag') || 0 // 服务器与本机时间差
  let timestamp = new Date().getTime()
  timestamp += Number(jetLag)
  const bs6 = Base64.Base64.encode(' {"appId":"' + appId + '","timestamp":' + timestamp + '}')
  const h256 = Cryptojs.HmacSHA256(secret + '.' + timestamp, key).toString()
  const aa = Base64.Base64.decode('YXBwVG9rZW4=')
  const bb = Base64.Base64.decode('aGVhZGVycw==')
  return (obj[bb][aa] = bs6 + '.' + h256)
}

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=utf-8'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 测试
    if (config.method === 'get' && !encryptFlag) {
      config.data = true // 随便写个值 绕过if判断 axios/lib/adapters/xhr.js-line-121
    }
    // 所有接口都添加app相关
    addAppToken(config)
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['accessToken'] = accessToken
    }

    // 20191018添加接口加密
    if (encryptFlag) {
      // 绕过上传、下载接口，配置meta:{noEcrypt:true}
      if (config.meta && config.meta.noEcrypt) return config
      console.log('config', config)
      if (config.data) {
        // 过滤不支持加密的接口
        console.log('url before', config.url)
        if (config.method === 'post' && (config.url === '/japi/v1/file/upload' || config.url === "/japi/v1/minipackage/upload")) {
          console.log('url', config.url)
        } else {
          console.log('url after', config.url)
          config.data = Util.encrypt(config.data)
        }
      } else {
        if ((config.method === 'get' || config.method === 'put' || config.method === 'delete') && config.params) {
          let str = ''
          for (const item in config.params) {
            str += item + '=' + config.params[item] + '&'
          }
          str = str.substring(0, str.length - 1)
          config.params = {
            data: Util.encrypt(str)
          }
        } else if (config.method === 'post') {
          // post Form Data
          config.params = {
            data: Util.encrypt(config.params)
          }
        }
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
