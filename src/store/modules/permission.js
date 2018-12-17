import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  /* if (route.meta && route.meta.roles) {
    return roles.some(role => {
      return route.path === role.path
    })
  } else {
    return true
  } */
  return roles.some(role => {
    return route.path === role.permission_uri
  })
}
function hasPath(roles, path, father) {
    if(path === '*') {
        return true
    }
  if (father) {
    return roles.some(role => {
      return role.permission_uri === father + '/' + path
    })

  } else {
    return roles.some(role => {
      return role.permission_uri.indexOf(path) !== -1
    })
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles, father) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPath(roles, route.path, father)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles, route.path)
      }
      return true
    } else {
      return false
    }
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters // eslint-disable-line
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
