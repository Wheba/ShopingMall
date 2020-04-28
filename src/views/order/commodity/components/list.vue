<template>
	<div>
		<el-card>
			
		</el-card>
		<el-card style="margin-top: 15px;"></el-card>
	</div>
</template>

<script>
	import {getOrderPage} from '@/api/order/commodity'
	export default{
		data(){
			return{
				queryForm:{},
				searchForm:{page:1,num:10,where:[]}
			}
		},
		created() {
			this.getOrderPage()
		},
		methods:{
			getOrderPage(){
				getOrderPage(this.searchForm).then(res=>{
					console.log(res)
				})
			}
		}
	}
</script>

<style>
</style>
