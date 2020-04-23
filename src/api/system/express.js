import request from '@/utils/request'
/**
 * 获取快递列表-page
 */
export function getExpressPage(params){
	return request({
	  url: 'page/Express',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑快递信息
 */
export function addOrEditExpress(data){
	return request({
	  url: 'add_edit/Express',
	  method: 'post',
	  data
	})
}
/**
 * 获取快递信息
 */
export function getExpressInfo(params){
	return request({
	  url: 'get/Express',
	  method: 'get',
		params
	})
}