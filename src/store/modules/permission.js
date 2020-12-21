import { constantRoutes } from '@/router'
import Layout from '@/layout'

// 生成动态路由入口
export function modifyServerRoutes(serverRoutes, pid = '0') {
  let res = []
  // console.table(serverRoutes)
  serverRoutes.forEach(route => {
    const { code: tmpName, url: tmpUrl, name: title, type: isPage, icon: ico, num, id } = { ...route } // 类型isPage 0：目录 1：菜单 2：按钮
    // debugger
    // console.log('pid', route.parentId, title)
    if (hideParentMenu(tmpName)) {} // 隐藏未上线的菜单
    else if (route.parentId === pid && isPage === 0) {
      const tmpRoute = {
        path: '/' + tmpName.toLowerCase(), // 20190918修改
        alwaysShow: true, // 始终显示在侧边栏
        component: Layout,
        name: tmpName,
        meta: { title: title, icon: 'sidebar_' + ico, isPage: isPage, num: num, id }
      }
      tmpRoute.children = addChildrenRoutes(serverRoutes, id)
      res.push(tmpRoute)
    } else if (route.parentId === pid && isPage === 1) {
      // 判断iframe页面
      const reg = /^http/
      if (reg.test(tmpUrl)) {
        const tmpRoute = {
          path: '/' + tmpName.toLowerCase(),
          component: Layout,
          redirect: '/' + tmpUrl,
          meta: { isPage: isPage },
          children: [{
            path: 'index',
            name: tmpName,
            component: resolve => require(['@/views/outPage/index'], resolve),
            meta: { title: title, icon: 'sidebar_' + ico, isPage: isPage, outPage: tmpUrl, num: num, id }
          }]
        }
        res.push(tmpRoute)
      } else {
        // 当component文件路径不存在时, 使用专门的error页面进行代替
        const tmpComp = validateUrlExist(tmpUrl)
        const tmpRoute = {
          path: '/' + tmpName.toLowerCase(),
          component: Layout,
          redirect: '/' + tmpUrl,
          meta: { isPage: isPage, num: num },
          children: [{
            path: 'index',
            name: tmpName,
            component: resolve => require(['@/views/' + tmpComp], resolve),
            meta: { title: title, icon: 'sidebar_' + ico, isPage: isPage, id }
          }]
        }
        res.push(tmpRoute)
      }
    }
  })
  sortMenu(res)
  // 给父级菜单增加重定位功能
  res = addRedirect(res)
  return res
}

function addChildrenRoutes(serverRoutes, pid) {
  let res = []
  serverRoutes.forEach(route => {
    const { code: tmpName, url: tmpUrl, name: title, num, parentId, status, id } = { ...route }
    let hidden = route.hidden
    if (parentId === pid) {
      const path = tmpUrl.split('/')
      const reg = /^http/ // 判断iframe页面
      // 隐藏未完成的二级菜单
      if (hideSubMenu(tmpName)) {}
      else if (reg.test(tmpUrl)) {
        const tmpRoute = {
          path: tmpName.toLowerCase(),
          name: tmpName,
          component: resolve => require(['@/views/outPage/index'], resolve),
          meta: { title: title, icon: 'form', outPage: tmpUrl, num: num, id }
        }
        res.push(tmpRoute)
      } else {
        if (isHiddenMenu(tmpName)) { hidden = true } // Hidden菜单
        // 当component文件路径不存在时, 使用专门的error页面进行代替
        // console.log('tmpUrl', tmpUrl, route)
        const tmpComp = validateUrlExist(tmpUrl)
        let tmpRoute = {
          path: path.length === 3 ? path[1] : path[0], // 菜单层级写死为2层 "contract/contract-management/index"
          name: tmpName,
          component: resolve => require(['@/views/' + tmpComp], resolve), // 懒加载
          hidden: status === 0, // 20191127 不可用的菜单暂时不显示在侧边栏中
          meta: { title: title, num: num, id, roles: buttonRoles(serverRoutes, id) }
        }
        // console.log('tmpRoute', tmpRoute, hidden)
        hidden ? tmpRoute.hidden = true : null
        // 根据url, 添加对应的页面以及附属页面
        res.push(tmpRoute)
      }
      // addAdditionalPage(res, tmpUrl) // 本系统暂不需要
    }
  })
  // 二级菜单排序
  if (res.length > 1) {
    sortMenu(res)
  }
  return res
}

function buttonRoles(serverRoutes, pid) {
  const res = [];
  serverRoutes.forEach(ev => {
    if(ev.parentId === pid && ev.type === 2) {
      res.push(ev.code)
    }
  })
  return res
}

/* 根据url添加对应的附属页面 */
function addAdditionalPage(res, url) {
  const pageMap = {}
  const targetPage = pageMap[url]
  if (targetPage) {
    targetPage.forEach(route => {
      const tmpRoute = { ...route }
      res.push(tmpRoute)
    })
  }
}

function sortMenu(sourceMenu) {
  sourceMenu.sort(function(a, b) {
    const key1 = a.meta.num ? parseInt(a.meta.num) : 9999
    const key2 = b.meta.num ? parseInt(b.meta.num) : 9999
    if (key1 < key2) { // 升序, 排序码为1的放在首位
      return -1
    } else if (key1 === key2) {
      return 0
    } else {
      return 1
    }
  })
}

/* 给根目录添加重定位 */
function addRedirect(parentMenu) {
  const res = parentMenu
  // 1. 每个一级菜单重定位到它的第一个子菜单
  res.forEach(pMenu => {
    if (pMenu.meta.isPage === 0) {
      if (pMenu.children.length > 0) {
        pMenu.redirect = pMenu.path + '/' + pMenu.children[0].path
      }
    }
  })
  let redirectPath = ''
  // 2. 登入系统后跳入到第一个模块
  if (parentMenu.length > 0) {
    // 给菜单的第一个页面添加affix属性
    parentMenu[0].children[0].meta.affix = true
    if (parentMenu[0].meta.isPage === 1) {
      redirectPath = parentMenu[0].path
    } else {
      redirectPath = parentMenu[0].path + '/' + parentMenu[0].children[0].path
    }
  }
  const redirect = { path: '/', redirect: redirectPath, hidden: true }
  res.push(redirect)
  return res
}

function hideParentMenu(name) {
  const checkList = [
    // 'Dashboard'
    // 'Content',
  ]
  return checkList.includes(name)
}

function hideSubMenu(name) {
  const checkList = [
    'PlatformFunction' // system
  ]
  return checkList.includes(name)
}

function isHiddenMenu(name) {
  const checkList = [
    // 'BranchResource'
  ]
  return checkList.includes(name)
}

function validateUrlExist(url) {
  let resultUrl = url
  try {
    let isValidateUrl = require('@/views/' + resultUrl + '.vue')
  } catch (e) {
    resultUrl = '401'
  }
  return resultUrl
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { serverRoutes }) {
    return new Promise(resolve => {
      // 根据后台接口返回的菜单 进行动态匹配
      let accessedRoutes = modifyServerRoutes(serverRoutes)
      // let accessedRoutes = []
      const tempRoute = [
        /*        {
                  path: '/',
                  component: Layout,
                  redirect: '/dashboard',
                  children: [
                    {
                      path: 'dashboard',
                      component: () => import('@/views/dashboard/index'),
                      name: 'Dashboard',
                      meta: { title: '首页', icon: 'dashboard', affix: true }
                    }
                  ]
                },*/
        /*        {
                  path: '/system',
                  component: Layout,
                  redirect: '/system/system',
                  name: 'System',
                  meta: { title: '系统管理', icon: 'system' },
                  children: [
                    {
                      path: 'position',
                      name: 'Position',
                      component: () => import('@/views/system/position/index'),
                      meta: { title: 'posi管理', icon: 'form' }
                    },
                    {
                      path: 'dept',
                      name: 'Dept',
                      component: () => import('@/views/system/dept/index'),
                      meta: { title: 'dept管理', icon: 'form' }
                    }
                  ]
                },*/
        /*        {
                  path: '/test',
                  component: Layout,
                  meta: { isPage: 1 },
                  redirect: '/test/index',
                  children: [
                    {
                      path: 'index',
                      name: 'OrderMonitor',
                      component: () => import('@/views/order/orderMonitor/index'),
                      meta: { title: '测试', icon: 'form', isPage: 1 }
                    }
                  ]
                },*/
      ]
      accessedRoutes = accessedRoutes.concat(tempRoute)
      const errorUrl =
        {
          path: '*', redirect: '/404', hidden: true,
          meta: {
            title: '404'
          }
        }
      accessedRoutes.push(errorUrl)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
