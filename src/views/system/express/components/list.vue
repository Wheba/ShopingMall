<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="queryForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="快递名称">
					<el-input v-model="queryForm.name" placeholder="快递名称"></el-input>
				</el-form-item>
				<el-form-item label="快递状态">
					<el-select v-model="queryForm.state" placeholder="请选择">
						<el-option label="全部" :value="null"></el-option>
						<el-option label="正常" :value="1"></el-option>
						<el-option label="停用" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="add">新增快递</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="name" label="名称" align='center'></el-table-column>
				<el-table-column prop="code" label="快递编码" align='center'></el-table-column>
				<el-table-column prop="created" label="创建时间" align='center' :formatter="showTime"></el-table-column>
				<el-table-column prop='state' label="状态" align='center' :formatter="showState"></el-table-column>
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
		</el-card>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getExpressPage,
		addOrEditExpress
	} from '@/api/system/express'
	import {
		parseTime
	} from '@/utils'
	export default{
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data(){
			return{
				queryForm:{state:null},
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
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			showState(row, column, cellValue, index){
				return cellValue?'正常':'停用'
			},
			query(){
				var where = [];
				for (let i in this.queryForm) {
					if((i=='state'&&this.queryForm[i]==0)||this.queryForm[i]){
						where.push({
							k:i,
							v:i=='name'?'%'+this.queryForm[i]+'%':this.queryForm[i],
							op:i=='name'?'like':'='
						})
					}
				}
				this.searchForm.where = where;
				this.getExpressPage();
			},
			getExpressPage(){
				getExpressPage(this.searchForm).then(res=>{
					this.tableData = res.datas;
					if (res.ext.total) {
						this.total = res.ext.total;
					}
				})
			},
			add(){
				this.$router.push('/system/express/edit')
			},
			edit(id){
				this.$router.push({
					path:'/system/express/edit',
					query:{
						id:id
					}
				})
			},
			//修改状态
			changeState(data,state){
				var {id,version}=data;
				var form={id,version,state};
				addOrEditExpress(form).then(res=>{
					this.$message.success('操作成功');
					this.getExpressPage();
				})
			}
		}
	}
</script>

<style>
</style>
