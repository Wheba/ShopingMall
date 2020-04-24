import request from '@/utils/request'
/**
 * 获取角色列表-page
 */
export function getRolePage(params){
	return request({
	  url: 'page/Role',
	  method: 'get',
		params
	})
}
/**
 * @param {Object} params
 * 获取角色列表-list
 */
export function getRoleList(params){
	return request({
	  url: 'list/Role',
	  method: 'get',
		params
	})
}
/**
 * 获取角色信息
 */
export function getRoleInfo(params){
	return request({
	  url: 'get/Role',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑角色
 */
export function addOrEditRole(data){
	return request({
	  url: 'add_edit/Role',
	  method: 'post',
	  data
	})
}