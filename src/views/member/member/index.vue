<template>
	<div class="app-container">
		<el-card>
			<el-form :inline="true" :model="searchForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="会员ID">
					<el-input v-model="searchForm.id" placeholder="会员ID"></el-input>
				</el-form-item>
				<el-form-item label="会员手机号">
					<el-input v-model="searchForm.phone" placeholder="会员手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon='el-icon-search' @click="seachFrom">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="addMember">添加会员</el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column prop="id" label="会员ID" align='center'></el-table-column>
				<el-table-column prop="account" label="会员名称" align='center'></el-table-column>
				<el-table-column prop="phone" label="会员手机号" align='center'></el-table-column>
				<el-table-column prop="created" label="状态" align='center'>
					<template slot-scope="scope">
						<span v-text="scope.row.state?'正常':'停用'"></span>
					</template>
				</el-table-column>
				<el-table-column prop='created' label="注册时间" align='center' :formatter="showTime"></el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button type="text" @click='editMember(scope.row)'>编辑</el-button>
						<el-popconfirm title="您确定要停用？" @onConfirm="changeMemberState(scope.row,'')" v-if="scope.row.state">
							<el-button slot="reference" type="text"><span style="color: red;">停用</span></el-button>
						</el-popconfirm>
						<el-popconfirm title="您确定要启用？" @onConfirm="changeMemberState(scope.row,'1')" v-else>
							<el-button slot="reference" type="text">启用</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 10px;">
				<el-pagination :current-page.sync="form.page" :page-size="form.num" :page-sizes="[10,20,3.,40,50]" layout="total, prev, pager, next,sizes,jumper"
				 :total="total" @current-change="changePage" @size-change="changeSize">
				</el-pagination>
			</div>
		</el-card>
		<edit-time :title="editTitle" :show='showEdit' :editData="editData" @editSuccess="editSuccess" @closeEdit="closeEdit"></edit-time>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getUserList,
		editUser
	} from '@/api/member/member'
	import {
		deepClone,
		parseTime
	} from '@/utils'
	import editTime from './edit.vue'
	import qs from 'qs'
	export default {
		components: {
			editTime
		},
		computed: {
			...mapGetters(['sizeHeader'])
		},
		data() {
			return {
				searchForm: {
					id: null,
					phone: ''
				},
				form: {
					page: 1,
					num: 10,
					where: []
				},
				tableData: [],
				total: 0,
				editTitle: '新增会员',
				showEdit: false,
				editData: {}
			}
		},
		created() {
			this.seachFrom();
		},
		methods: {
			indexMethod(index){
				return (this.form.page-1)*this.form.num+1+index
			},
			showTime(row, column, cellValue, index){
				return parseTime(cellValue)
			},
			getList() {
				getUserList(this.form).then(res => {
					if (res.code === 0) {
						this.tableData = res.datas;
						if (this.total === 0) {
							this.total = res.ext.total;
						}
					}
					// console.log(res)
				})
			},
			seachFrom() {
				var where = [];
				for (let i in this.searchForm) {
					if(this.searchForm[i]){
						var data={
							k:i,
							v:this.searchForm[i],
							op:'='
						}
						where.push(data)
					}
				}
				this.form.where = where;
				this.getList();
			},
			addMember() {
				this.editData = {}
				this.editTitle = '新增会员'
				this.showEdit = true;
			},
			editMember(data) {
				this.editData = deepClone(data)
				this.editTitle = '编辑会员'
				this.showEdit = true;
			},
			changeMemberState(data,state){
				data=deepClone(data);
				data.state=state
				editUser(data).then(res=>{
					if(res.code==0){
						this.$message.success('操作成功');
						this.getList();
					}
				})
			},
			closeEdit() {
				this.showEdit = false
			},
			editSuccess() {
				this.closeEdit();
				this.getList();
			},
			//分页编辑
			changePage(e){
				this.form.page=e;
				this.getList();
			},
			changeSize(e){
				this.form.num=e;
				this.getList();
			}
		}
	}
</script>

<style>
</style>
