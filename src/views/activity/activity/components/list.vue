<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="queryForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="活动名称">
					<el-input v-model="queryForm.name" placeholder="活动名称" :clearable="true"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="addActivity">新增活动</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="name" label="活动名称" align='center'></el-table-column>
				<el-table-column prop="type" label="活动类型" align='center' :formatter="showType"></el-table-column>
				<el-table-column label="渠道限定" align='center'>
					<template slot-scope="scope">
						<span v-if="scope.row.payment_channel_id">{{scope.row.payment_channel_id.name}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='start_time' label="开始时间" align='center' :formatter="showTime"></el-table-column>
				<el-table-column prop='end_time' label="结束时间" align='center' :formatter="showTime"></el-table-column>
				<el-table-column prop='state' label="状态" align='center' :formatter="showState"></el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click='editActivity(scope.row.id)'>编辑</el-button>
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
		mapGetters,
		mapState
	} from 'vuex'
	import {
		getActivityPage,
		addOrEditActivity
	} from '@/api/activity/activity'
	import {
		deepClone,
		parseTime
	} from '@/utils'
	export default{
		computed: {
			...mapGetters(['sizeHeader']),
			...mapState({
				typeActivityList: state => state.data.typeActivityList
			})
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
			indexMethod(index){
				return (this.searchForm.page-1)*this.searchForm.num+1+index
			},
			showTime(row, column, cellValue, index){
				return parseTime(cellValue)
			},
			showState(row, column, cellValue, index){
				return cellValue?'正常':'停用'
			},
			showType(row, column, cellValue, index){
				return this.typeActivityList[cellValue]
			},
			query(){
				var where = [];
				for (let i in this.queryForm) {
					if(this.queryForm[i]){
						where.push({
							k:i,
							v:i=='name'?'%'+this.queryForm[i]+'%':this.queryForm[i],
							op:i=='name'?'like':'='
						})
					}
				}
				this.searchForm.where = where;
				this.getActivityPage();
			},
			getActivityPage(){
				getActivityPage(this.searchForm).then(res=>{
					this.tableData = res.datas;
					if (res.ext.total) {
						this.total = res.ext.total;
					}
				})
			},
			//添加活动
			addActivity(){
				this.$router.push('/activity/activity/edit')
			},
			//编辑
			editActivity(id){
				this.$router.push({
					path:'/activity/activity/edit',
					query:{
						id:id
					}
				})
			},
			//修改状态
			changeState(data,state){
				var {id,version}=data;
				var form={id,version,state}
				addOrEditActivity(form).then(res=>{
					this.$message.success('操作成功');
					this.getActivityPage();
				})
			},
			//换页
			changePage(e){
				this.searchForm.page=e;
				this.getActivityPage();
			},
			changeSize(e){
				this.searchForm.num=e;
				this.getActivityPage();
			}
		}
	}
</script>

<style>
</style>
