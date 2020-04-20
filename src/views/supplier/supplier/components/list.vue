<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="queryForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="供应商名称">
					<el-input v-model="queryForm.name" placeholder="供应商名称"></el-input>
				</el-form-item>
				<el-form-item label="供应商状态">
					<el-select v-model="queryForm.state" placeholder="请选择">
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
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="addSupplier">添加供应商</el-button>
			<el-button circle icon='el-icon-refresh-left' :size='sizeHeader' style="float: right;" @click="refresh"></el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="name" label="名称" align='center'></el-table-column>
				<el-table-column prop="short_name" label="简称" align='center'></el-table-column>
				<el-table-column prop="state" label="状态" align='center' :formatter="showState"></el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click="editSupplier(scope.row.id)">编辑</el-button>
						<el-popconfirm title="您确定要停用？" @onConfirm="changeState(scope.row,0)" v-if="scope.row.state==1">
							<el-button slot="reference" type="text"><span style="color: red;">停用</span></el-button>
						</el-popconfirm>
						<el-popconfirm title="您确定要启用？" @onConfirm="changeState(scope.row,1)" v-else>
							<el-button slot="reference" type="text">启用</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 10px;">
				<el-pagination :current-page.sync="searchForm.page" :page-sizes="[10,20,3.,40,50]" :page-size="searchForm.num" layout="total, prev, pager, next,sizes,jumper" :total="total" @size-change="changeSize" @current-change="changePage">
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
		getSupplierPage,
		editSupplier
	} from '@/api/supplier/supplier'
	export default {
		computed: {
			...mapGetters(['sizeHeader'])
		},
		data() {
			return {
				queryForm: {},
				searchForm: {
					page: 1,
					num: 10,
					where: []
				},
				tableData: [],
				total: 0,
			}
		},
		created() {
			this.query();
		},
		methods: {
			indexMethod(index) {
				return (this.searchForm.page - 1) * this.searchForm.num + 1 + index
			},
			showState(row, column, cellValue, index) {
				return cellValue === 1 ? '正常' : '停用'
			},
			query() {
				var where = [];
				for (let i in this.queryForm) {
					if(this.queryForm[i]){
						where.push({
							k:i,
							v:this.queryForm[i],
							op:'='
						})
					}
				}
				this.searchForm.where = where;
				this.getSupplierPage();
			},
			getSupplierPage() {
				getSupplierPage(this.searchForm).then(res => {
					this.tableData = res.datas;
					if (this.total === 0) {
						this.total = res.ext.total;
					}
				})
			},
			refresh(){
				this.tableData=[];
				this.getSupplierPage();
			},
			changeState(data, state) {
				editSupplier({id:data.id,version:data.version,state:state}).then(res=>{
					this.$message.success('操作成功');
					this.getSupplierPage();
				})
			},
			//编辑代理商
			editSupplier(id){
				this.$router.push({
					path:'/supplier/supplier/edit',
					query:{
						id:id
					}
				})
			},
			addSupplier(){
				this.$router.push('/supplier/supplier/edit')
			},
			//分页编辑
			changeSize(e){
				this.searchForm.num=e;
				this.getSupplierPage()
			},
			changePage(e){
				this.searchForm.page=e;
				this.getSupplierPage()
			}
		}
	}
</script>

<style>
</style>
