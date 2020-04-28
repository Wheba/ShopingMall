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
/**
 * 获取sku列表-list
 */
export function getSkuList(){
    return request({
	  url: 'list/sku',
	  method: 'get'
    })
}
/**
 * 编辑sku
 */
export function editSku(data){
	return request({
	url: 'edit/sku',
	method: 'post',
	data
	})
}