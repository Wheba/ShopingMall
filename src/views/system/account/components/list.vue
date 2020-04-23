<template>
	<div>
		<el-card>
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="add">新增账户</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="id" label="账户ID" align='center'></el-table-column>
				<el-table-column prop="account" label="账户名称" align='center'></el-table-column>
				<el-table-column prop="nick" label="联系人" align='center'></el-table-column>
				<el-table-column prop="phone" label="联系人手机号" align='center'></el-table-column>
				<el-table-column prop="created" label="创建时间" align='center' :formatter="showTime"></el-table-column>
				<!-- <el-table-column prop="state" label="状态" align='center' :formatter="showState"></el-table-column> -->
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click='edit(scope.row.id)'>编辑</el-button>
						<el-popconfirm title="您确定要停用？" @onConfirm="changeState(scope.row,0)" v-if="scope.row.state">
							<el-button slot="reference" type="text"><span style="color: red;">停用</span></el-button>
						</el-popconfirm>
						<el-popconfirm title="您确定要启用？" @onConfirm="changeState(scope.row,1)" v-else>
							<el-button slot="reference" type="text">启用</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 10px;">
				<el-pagination :current-page.sync="searchForm.page" :page-size="searchForm.num" :page-sizes="[10,20,30,40,50]" layout="total, prev, pager, next,sizes,jumper" 
				:total="total" @current-change="changePage" @size-change="changeSize">
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		parseTime
	} from '@/utils'
	import {
		getAccountPage
	} from '@/api/system/account'
	export default{
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data(){
			return{
				searchForm:{page:1,num:10},
				tableData: [],
				total: 0,
			}
		},
		created() {
			this.getAccountPage();
		},
		methods:{
			indexMethod(index){
				return (this.searchForm.page-1)*this.searchForm.num+1+index
			},
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			showState(row, column, cellValue, index){
				return cellValue?'正常':'停用'
			},
			getAccountPage(){
				getAccountPage(this.searchForm).then(res=>{
					this.tableData = res.datas;
					if (res.ext.total) {
						this.total = res.ext.total;
					}
				})
			},
			//新增账户
			add(){
				this.$router.push('/system/account/edit')
			},
			//编辑账户
			edit(id){
				this.$router.push({
					path:'/system/account/edit',
					query:{
						id:id
					}
				})
			},
			//切换状态
			changeState(data,state){
				
			},
			//换页
			changePage(e){
				this.searchForm.page=e;
				this.getAccountPage()
			},
			changeSize(e){
				this.searchForm.num=e;
				this.getAccountPage()
			}
		}
	}
</script>

<style>
</style>
