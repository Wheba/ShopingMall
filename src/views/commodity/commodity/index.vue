<template>
	<div>商品列表页面</div>
</template>

<script>
	import {
		getProcuct
	} from '@/api/commodity/commodity'
	export default{
		data(){
			return{
				form:{
					page: 1,
					num: 10,
				}
			}
		},
		created() {
			this.getProcuct()
		},
		methods:{
			getProcuct(){
				getProcuct(this.form).then(res=>{
					console.log(res)
				})
			}
		}
	}
</script>

<style>
</style>
