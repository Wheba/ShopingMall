import request from '@/utils/request'
/**
 * 获取商品列表
 */
export function getProcuct(params){
	return request({
	  url: 'page/product',
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