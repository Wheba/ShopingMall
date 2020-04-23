import request from '@/utils/request'
/**
 * 获取活动列表-Page
 */
export function getActivityPage(params){
	return request({
	  url: 'page/activity',
	  method: 'get',
		params
	})
}
/**
 * 新增或编辑活动
 */
export function addOrEditActivity(data){
	return request({
	  url: 'add_edit/activity',
	  method: 'post',
	  data
	})
}