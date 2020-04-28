import request from '@/utils/request'
/**
 * 获取商品列表
 */
export function getProcuct(params){
    return request({
	  url: 'product/page',
	  method: 'get',
        params
    })
}
/**
 * 获取商品信息
 */
export function getProcuctInfo(params){
    return request({
	  url: 'product/get',
	  method: 'get',
        params
    })
}
/**
 * 新增修改商品信息
 */
export function editProcuctInfo(data){
    return request({
	  url: 'add_edit/product',
	  method: 'post',
        data
    })
}
/**
 * 获取商品详情
 */
export function getProcuctDetail(params){
    return request({
	  url: 'get/product_detail',
	  method: 'get',
        params
    })
}
/**
 * 新增或编辑商品详情
 */
export function addOrEditProcuctDetail(data){
    return request({
	  url: 'add_edit/product_detail',
	  method: 'post',
    data
    })
}
/**
 * 获取商品code
 */
export function getProcuctCode(){
    return request({
	  url: 'product_code/get',
	  method: 'get'
    })
}