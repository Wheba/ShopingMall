<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="queryFrom" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="商品级别">
					<el-select v-model="queryFrom.Depth" placeholder="商品级别">
						<el-option label="全部" :value="null"></el-option>
						<el-option :key="item.name" v-for="item in levelList" :label="item.name" :value="item.level"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类名称">
					<el-input v-model="queryFrom.name" placeholder="分类名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="add">添加分类</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column label='缩略图' align='center' width='110'>
					<template slot-scope="scope">
						<el-image style="width: 80px; height: 80px;border: 1px dashed #d9d9d9;" :src="scope.row.icon" fit="contain"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="分类名称" align='center'></el-table-column>
				<el-table-column prop="Depth" label="分类级别" align='center' :formatter="showLevel"></el-table-column>
				<el-table-column prop="sort" label="展示顺序" align='center'></el-table-column>
				<el-table-column prop="created" label="创建时间" align='center' :formatter="showTime"></el-table-column>
				<el-table-column label="调整排序" align='center' width="100">
					<template slot-scope="scope">
						<el-button icon="el-icon-bottom" type="text" @click="changeSort(scope.row,true)"></el-button>
						<el-button icon="el-icon-top" type="text" @click="changeSort(scope.row,false)"></el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click='edit(scope.row)'>编辑</el-button>
						<el-popconfirm title="您确定要删除？" @onConfirm="remove(scope.row.id)">
							<el-button slot="reference" type="text"><span style="color: red;">删除</span></el-button>
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
		getCategoryPage,
		removeCategory,
		editCategory
	} from '@/api/commodity/class'
	import {
		parseTime
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader'])
		},
		data() {
			return {
				queryFrom:{name:'',Depth:null},
				searchForm: {
					page: 1,
					num: 10,
					asc:['sort'],
					where: []
				},
				tableData: [],
				total: 0,
				levelList: [{
					level: 1,
					name: '一级'
				}, {
					level: 2,
					name: '二级'
				}, {
					level: 3,
					name: '三级'
				}]
			}
		},
		created() {
			this.query()
		},
		methods: {
			indexMethod(index) {
				return (this.searchForm.page - 1) * this.searchForm.num + 1 + index
			},
			showLevel(row, column, cellValue, index) {
				return this.levelList[cellValue - 1].name
			},
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			query(){
				var where = [];
				for (let i in this.queryFrom) {
					if(this.queryFrom[i]){
						where.push({
							k:i,
							v:i=='name'?'%'+this.queryFrom[i]+'%':this.queryFrom[i],
							op:i=='name'?'like':'='
						})
					}
				}
				this.searchForm.where = where;
				this.getCategoryPage();
			},
			getCategoryPage() {
				getCategoryPage(this.searchForm).then(res => {
					this.tableData = res.datas;
					if (this.total === 0) {
						this.total = res.ext.total;
					}
					//console.log(res)
				})
			},
			add() {
				this.$router.push({
					path:'/commodity/class/edit'
				})
			},
			//编辑
			edit(data){
				this.$router.push({
					path:'/commodity/class/edit',
					query:{
						id:data.id,
						Depth:data.Depth
					}
				})
			},
			//删除
			remove(id){
				removeCategory({id:id}).then(res=>{
					this.$message.success('操作成功');
					this.getCategoryPage()
				})
			},
			//换页
			changePage(e){
				this.searchForm.page=e;
				this.getCategoryPage();
			},
			changeSize(e){
				this.searchForm.num=e;
				this.getCategoryPage();
			},
			//修改排序
			changeSort(data,state){
				var {id,version,sort}=data;
				sort=state?sort+1:sort-1;
				var form={id,version,sort};
				editCategory(form).then(res=>{
					this.$message.success('操作成功');
					this.getCategoryPage()
				})
			}
		}
	}
</script>

<style>
</style>
