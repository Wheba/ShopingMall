import request from '@/utils/request'
/**
 * 获取账户列表-page
 */
export function getAccountPage(params){
	return request({
	  url: 'page/Manager',
	  method: 'get',
		params
	})
}
/**
 * 获取账户信息
 */
export function getAccountInfo(params){
	return request({
	  url: 'get/Manager',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑账户
 */
export function addOrEditAccount(data){
	return request({
	  url: 'add_edit/Manager',
	  method: 'post',
	  data
	})
}