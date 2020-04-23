<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="queryForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="渠道名称">
					<el-input v-model="queryForm.name" placeholder="渠道名称"></el-input>
				</el-form-item>
				<el-form-item label="渠道状态">
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
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="add">新增渠道</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="name" label="渠道名称" align='center'></el-table-column>
				<el-table-column prop="code" label="渠道代码" align='center'></el-table-column>
				<el-table-column label="渠道链接" align='center'>
					<template slot-scope="scope">
						<a :href="scope.row.url" target="_blank" style="color: #409eff;">{{scope.row.url}}</a>
					</template>
				</el-table-column>
				<el-table-column prop='state' label="状态" align='center' :formatter="showState"></el-table-column>
				<el-table-column prop='created' label="创建日期" align='center' :formatter="showTime"></el-table-column>
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
				<el-pagination :current-page.sync="searchForm.page" :page-size="searchForm.num" :page-sizes="[10,20,3.,40,50]" layout="total, prev, pager, next,sizes,jumper" 
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
		getChannelPage,
		addOrEditChannel
	} from '@/api/channel/channel'
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
				this.getChannelPage();
			},
			getChannelPage(){
				getChannelPage(this.searchForm).then(res=>{
					this.tableData = res.datas;
					if (res.ext.total) {
						this.total = res.ext.total;
					}
				})
			},
			add(){
				this.$router.push('/channel/channel/edit')
			},
			edit(id){
				this.$router.push({
					path:'/channel/channel/edit',
					query:{
						id:id
					}
				})
			},
			changeState(data,state){
				var {id,version}=data;
				var form={id,version,state};
				addOrEditChannel(form).then(res=>{
					this.$message.success('操作成功');
					this.getChannelPage();
				})
			},
			//换页
			changePage(e){
				this.searchForm.page=e;
				this.getChannelPage();
			},
			changeSize(e){
				this.searchForm.num=e;
				this.getChannelPage();
			}
		}
	}
</script>

<style>
</style>
