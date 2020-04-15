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