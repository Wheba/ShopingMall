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
/**
 * 获取活动类型
 */
export function getTypeActivityList(){
	return request({
	  url: 'type_activity/list',
	  method: 'get'
	})
}