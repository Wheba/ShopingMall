import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
	
	{
		path:'/data',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Data',
		alwaysShow: true,
		meta: { title: '数据台', icon: 'chart' },
		children:[
			{
				path:'overview',
				component: () => import('@/views/data/overview'),
				meta: { title: '数据概览' }
			},
			{
				path:'revenue',
				component: () => import('@/views/data/revenue'),
				meta: { title: '营收数据' }
			},
			{
				path:'commodity',
				component: () => import('@/views/data/commodity'),
				meta: { title: '商品数据' }
			},
			{
				path:'user',
				component: () => import('@/views/data/user'),
				meta: { title: '用户数据' }
			}
		]
	},
	
	{
		path:'/order',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Order',
		alwaysShow: true,
		meta: { title: '订单管理', icon: 'list' },
		children:[
			{
				path:'commodity',
				component: () => import('@/views/order/commodity'),
				meta: { title: '商品订单' }
			},{
				path:'cardticket',
				component: () => import('@/views/order/cardticket'),
				meta: { title: '卡券订单' }
			}
		]
	},
	
	{
		path:'/commodity',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Commodity',
		alwaysShow: true,
		meta: { title: '商品管理', icon: 'list' },
		children:[
			{
				path:'commodity',
				redirect: '/commodity/commodity/list',
				component: () => import('@/views/commodity/commodity/index'),
				meta: { title: '商品列表'},
				children:[{
					path:'list',
					component: () => import('@/views/commodity/commodity/components/list'),
					meta: { title: '商品列表',breadcrumb: false},
				},{
					path:'edit',
					component: () => import('@/views/commodity/commodity/components/edit'),
					meta: { title: '商品详情'},
					hidden:true
				}]
			},
			{
				path:'class',
				component: () => import('@/views/commodity/class'),
				meta: { title: '分类列表' }
			}
		]
	},
	
	{
		path:'/cardticket',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Cardticket',
		alwaysShow: true,
		meta: { title: '卡券管理', icon: 'table' },
		children:[
			{
				path:'add',
				component: () => import('@/views/cardticket/add'),
				meta: { title: '添加卡券' }
			},
			{
				path:'cardticket',
				component: () => import('@/views/cardticket/cardticket'),
				meta: { title: '卡券列表' }
			}
		]
	},
	
	{
		path:'/supplier',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Supplier',
		alwaysShow: true,
		meta: { title: '供应商管理', icon: 'table' },
		children:[
			{
				path:'supplier',
				redirect: '/supplier/supplier/list',
				component: () => import('@/views/supplier/supplier'),
				meta: { title: '供应商列表' },
				children:[{
					path:'list',
					component: () => import('@/views/supplier/supplier/components/list'),
					meta: { title: '供应商列表',breadcrumb: false},
				},{
					path:'edit',
					component: () => import('@/views/supplier/supplier/components/edit'),
					meta: { title: '新增编辑'},
					hidden:true
				}]
			},
			{
				path:'settlement',
				component: () => import('@/views/supplier/settlement'),
				meta: { title: '供应商结算明细' }
			}
		]
	},
	
	{
		path:'/channel',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Channel',
		alwaysShow: true,
		meta: { title: '渠道管理', icon: 'table' },
		children:[{
			path:'channel',
			component: () => import('@/views/channel'),
			meta: { title: '渠道列表' }
		}]
	},
	
	{
		path:'/member',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Member',
		alwaysShow: true,
		meta: { title: '会员管理', icon: 'user' },
		children:[{
			path:'member',
			component: () => import('@/views/member/member'),
			meta: { title: '会员列表' }
		},{
			path:'recharge',
			component: () => import('@/views/member/recharge'),
			meta: { title: '积分充值' }
		},{
			path:'journal',
			component: () => import('@/views/member/journal'),
			meta: { title: '充值日志' }
		}]
	},
	
	{
		path:'/activity',
		component:Layout,
		redirect: 'noRedirect',
		name: 'Activity',
		alwaysShow: true,
		meta: { title: '活动管理', icon: 'table' },
		children:[{
			path:'activity',
			component: () => import('@/views/activity/activity'),
			meta: { title: '活动列表' },
			redirect: '/activity/activity/list',
			children:[{
				path:'list',
				component: () => import('@/views/activity/activity/components/list'),
				meta: { title: '活动列表' }
			}]
		}]
	},
	
	{
		path:'/system',
		component:Layout,
		redirect: 'noRedirect',
		name: 'System',
		alwaysShow: true,
		meta: { title: '系统管理', icon: 'system' },
		children:[{
			path:'account',
			component: () => import('@/views/system/account'),
			meta: { title: '账户管理' }
		},{
			path:'role',
			component: () => import('@/views/system/role'),
			meta: { title: '角色管理' }
		},{
			path:'interface',
			component: () => import('@/views/system/interface'),
			meta: { title: '界面配置' }
		},{
			path:'express',
			component: () => import('@/views/system/express'),
			meta: { title: '快递管理' }
		}]
	},

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
