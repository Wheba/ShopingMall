import request from '@/utils/request'

/**
 * 获取会员列表
 */
export function getUserList(params){
	return request({
	  url: 'page/user',
	  method: 'get',
		params
	})
}
/**
 * 编辑会员
 */
export function editUser(data){
	return request({
	  url: 'add_edit/user',
	  method: 'post',
	  data
	})
}