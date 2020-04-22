import request from '@/utils/request'
/**
 * 获取支付方式
 */
export function getPayMentList(){
	return request({
	  url: 'type_payment/list',
	  method: 'get'
	})
}