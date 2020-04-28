import request from '@/utils/request'
/**
 * 获取商品订单列表-page
 */
export function getOrderPage(params){
	return request({
	  url: 'page/Order',
	  method: 'get',
		params
	})
}