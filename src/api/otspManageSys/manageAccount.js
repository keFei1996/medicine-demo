/*
系统账号管理
 */
import request from '@/utils/request'
const baseUrl = window.baseUrl.manageSys_url

// 获取系统账号信息
export function sysAccountGet(data) {
  return request({
    url: '/japi/v1/manage/sys-account',
    method: 'get',
    baseURL: baseUrl,
    param: data
  })
}
