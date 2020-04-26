import request from '@/utils/request'
/**
 * 获取商品分类列表-list
 */
export function getCategoryList(params){
	return request({
	  url: 'list/category',
	  method: 'get',
		params
	})
}
/**
 * 获取商品分类列表-page
 */
export function getCategoryPage(params){
	return request({
	  url: 'page/category',
	  method: 'get',
		params
	})
}
/**
 * 获取分类信息
 */
export function getCategoryInfo(params){
	return request({
	  url: 'get/category',
	  method: 'get',
		params
	})
}
/**
 * 新增分类
 */
export function addCategory(data){
	return request({
	  url: 'category/add',
	  method: 'post',
		data
	})
}
/**
 * 编辑分类
 */
export function editCategory(data){
	return request({
	  url: 'edit/category',
	  method: 'post',
		data
	})
}
/**
 * 删除分类
 */
export function removeCategory(data){
	return request({
	  url: 'del/category',
	  method: 'post',
		data
	})
}
