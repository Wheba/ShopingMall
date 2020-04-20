import request from '@/utils/request'
/**
 * 获取商品分类列表
 */
export function getCategoryList(){
	return request({
	  url: 'list/category',
	  method: 'get'
	})
}
