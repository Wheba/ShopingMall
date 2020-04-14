<template>
	<div class="app-container">
		<el-card>
			<el-form :inline="true" :model="searchForm" class="demo-form-inline" :size="sizeHeader">
			  <!-- <el-form-item label="会员ID">
			    <el-input v-model="form.user" placeholder="会员ID"></el-input>
			  </el-form-item> -->
			  <el-form-item>
			    <el-button type="primary" icon='el-icon-search' @click="seachFrom">查询</el-button>
			  </el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="addMember">添加会员</el-button>
			<el-table border :size='sizeHeader' style='margin-top: 10px;'>
				
			</el-table>
			<div style="margin-top: 10px;">
				<el-pagination
				     :current-page.sync="form.page"
				     :page-size="100"
				     layout="total, prev, pager, next,sizes,jumper"
				     :total="1000">
				   </el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {getUserList,editUser} from '@/api/member/member'
	import {deepClone} from '@/utils'
	export default{
		computed:{
			...mapGetters(['sizeHeader'])
		},
		data(){
			return{
				searchForm:{
					
				},
				form:{
					page:1,
					num:10
				}
			}
		},
		created() {
			this.seachFrom();
		},
		methods:{
			getList(){
				getUserList(this.form).then(res=>{
					console.log(res)
				})
			},
			seachFrom(){
				this.form=Object.assign({},this.form,this.searchForm)
				this.getList();
			},
			addMember(){
				
			}
		}
	}
</script>

<style>
</style>
