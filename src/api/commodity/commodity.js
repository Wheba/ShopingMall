import request from '@/utils/request'
/**
 * 获取商品列表
 */
export function getProcuct(params){
	return request({
	  url: 'product/page',
	  method: 'get',
		params
	})
}
/**
 * 获取商品详情
 */
export function getProcuctDetail(params){
	return request({
	  url: 'get/product_detail',
	  method: 'get',
		params
	})
}
/**
 * 获取商品信息
 */
export function getProcuctInfo(params){
	return request({
	  url: 'get/product',
	  method: 'get',
		params
	})
}
/**
 * 新增修改商品信息
 */
export function editProcuctInfo(data){
	return request({
	  url: 'add_edit/product',
	  method: 'post',
		data
	})
}