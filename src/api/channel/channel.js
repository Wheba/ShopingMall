import request from '@/utils/request'
/**
 * 获取渠道列表-Page
 */
export function getChannelPage(params){
	return request({
	  url: 'page/payment_channel',
	  method: 'get',
		params
	})
}
/**
 * @param {Object} params
 * 获取渠道列表-list
 */
export function getChannelList(params){
	return request({
	  url: 'list/payment_channel',
	  method: 'get',
		params
	})
}
/**
 * 获取渠道信息
 */
export function getChannelInfo(params){
	return request({
	  url: 'get/payment_channel',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑渠道
 */
export function addOrEditChannel(data){
	return request({
	  url: 'add_edit/payment_channel',
	  method: 'post',
	  data
	})
}