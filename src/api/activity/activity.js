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