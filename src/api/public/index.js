import request from '@/utils/request'
/**
 * 获取支付方式
 */
export function getPayMentList() {
	return request({
		url: 'type_payment/list',
		method: 'get'
	})
}
/**
 * 获取活动类型
 */
export function getTypeActivityList() {
	return request({
		url: 'type_activity/list',
		method: 'get'
	})
}
/**
 * 获取sku列表-list
 */
export function getSkuList() {
	return request({
		url: 'list/sku',
		method: 'get'
	})
}
/**
 * 获取spu列表-list
 */
export function getSpuList() {
	return request({
		url: 'list/spu',
		method: 'get'
	})
}
/**
 * 新增或编辑sku
 */
export function addOrEditSku(data) {
	return request({
		url: 'sku/add_edit',
		method: 'post',
		data
	})
}
/**
 * 新增或编辑spu
 */
export function addOrEditSpu(data) {
	return request({
		url: 'add_edit/spu',
		method: 'post',
		data
	})
}
