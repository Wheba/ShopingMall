<template>
	<el-card>
		<el-form :inline="true" :model="queryForm" class="demo-form-inline" :size="sizeHeader">
			<el-form-item label="活动名称">
				<el-input v-model="queryForm.name" placeholder="活动名称"></el-input>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getActivityPage
	} from '@/api/activity/activity'
	export default{
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data(){
			return{
				queryForm:{},
				searchForm:{page:1,num:10,where:[]},
				tableData: [],
				total: 0,
			}
		},
		created() {
			this.query();
		},
		methods:{
			query(){
				this.getActivityPage();
			},
			getActivityPage(){
				getActivityPage(this.searchForm).then(res=>{
					console.log(res)
				})
			}
		}
	}
</script>

<style>
</style>
