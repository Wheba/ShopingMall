import request from '@/utils/request'
/**
 * 获取供应商列表-总
 */
export function getSupplierList(){
	return request({
	  url: 'list/provider',
	  method: 'get'
	})
}
/**
 * 获取供应商列表
 */
export function getSupplierPage(params){
	return request({
	  url: 'page/provider',
	  method: 'get',
		params
	})
}
/**
 * @param {Object} data
 * 获取供应商详情
 */
export function getSupplierInfo(params){
	return request({
	  url: 'get/provider',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑供应商
 */
export function editSupplier(data){
	return request({
	  url: 'add_edit/provider',
	  method: 'post',
		data
	})
}