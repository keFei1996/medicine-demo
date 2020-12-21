/*
系统菜单管理
 */
import request from '@/utils/request'
const baseUrl = window.baseUrl.manageSys_url

// 获取系统用户菜单列表
export function userMenus(data) {
  return request({
    url: '/japi/v1/manage/sys-user/menus',
    method: 'get',
    baseURL: baseUrl,
    param: data
  })
}
