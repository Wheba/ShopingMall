<template>
	<div>
		<el-card>
			<el-form :inline="true" :model="searchForm" class="demo-form-inline" :size="sizeHeader">
				<el-form-item label="商品分类">
					<el-cascader :clearable="true" :show-all-levels="false" :props="props" @change="changeClass"></el-cascader>
					<!-- <el-select v-model="searchForm.category" disabled placeholder="商品分类">
						<el-option label="分类1" value="分类1"></el-option>
						<el-option label="分类2" value="分类2"></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.name" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item label="商品SKU">
					<el-input v-model="searchForm.sku" placeholder="商品SKU"></el-input>
				</el-form-item>
				<el-form-item label="商品状态">
					<el-radio-group v-model="searchForm.online">
						<el-radio :label="true">上架</el-radio>
						<el-radio :label="false">下架</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="供应商">
					<el-select v-model="searchForm.provider_id" placeholder="请选择供应商">
						<el-option :label="item.short_name" :value="item.id" v-for="item in providerList" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-button type="primary" icon='el-icon-plus' :size='sizeHeader' @click="addComponents">添加商品</el-button>
			<el-button circle icon='el-icon-refresh-left' :size='sizeHeader' style="float: right;" @click="refresh"></el-button>
			<el-table :data="tableData" border :size='sizeHeader' style='margin-top: 10px;'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column label="商品信息" align='center' min-width='200'>
					<template slot-scope="scope">
						<div style="display: flex;justify-content: center;align-items: center;">
							<el-image style="width: 80px; height: 80px;flex-basis: 80px;" :src="scope.row.product_main_pic" fit="cover"></el-image>
							<div style="text-align: left;margin-left: 10px;">
								<p v-text="scope.row.name"></p>
								<p>商品编号：{{scope.row.product_code}}</p>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品价格(元)" header-align='center'>
					<template slot-scope="scope">
						<p>销售价格：{{toMoneyStr(scope.row.price_sale)}}</p>
						<p>市场价格：{{toMoneyStr(scope.row.price_marketing)}}</p>
						<p>利润：{{toMoneyStr(scope.row.price_sale-scope.row.price_supply)}}</p>
					</template>
				</el-table-column>
				<el-table-column label="供应商信息" header-align='center'>
					<template slot-scope="scope">
						<p>供应商：{{scope.row.provider.short_name}}</p>
						<p>供应商价格：{{toMoneyStr(scope.row.price_supply)}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="category" label="商品分类" align='center'></el-table-column>
				<el-table-column prop="online" label="商品状态" align='center' :formatter="showState"></el-table-column>
				<el-table-column prop='created' label="上架日期" align='center' :formatter="showTime"></el-table-column>
				<el-table-column prop='updated' label="更新日期" align='center' :formatter="showTime"></el-table-column>
				<el-table-column label="操作" align='center' fixed="right">
					<template slot-scope="scope">
						<el-button type="text" @click="editComponents(scope.row.id)">修改</el-button>
						<el-popconfirm title="您确定要上架？" @onConfirm="editState(scope.row,true)" v-if="!scope.row.online">
							<el-button slot="reference" type="text"><span style="color: red;">上架</span></el-button>
						</el-popconfirm>
						<el-popconfirm title="您确定要下架？" @onConfirm="editState(scope.row,false)" v-else>
							<el-button slot="reference" type="text"><span style="color: red;">下架</span></el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 10px;">
				<el-pagination :current-page.sync="form.page" :page-size="10" layout="total, prev, pager, next,sizes,jumper" :total="total">
				</el-pagination>
			</div>
		</el-card>
		</el-card>
	</div>
</template>

<script>
	let id = 0;
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import {
		getProcuct,
		editProcuctInfo
	} from '@/api/commodity/commodity'
	import {
		getCategoryList
	} from '@/api/commodity/class'
	import {
		parseTime,
		toMoneyStr
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
			...mapState({
				providerList: state => state.data.providerList
			})
		},
		data() {
			return {
				searchForm: {
					online: true
				},
				form: {
					page: 1,
					num: 10,
					where: []
				},
				tableData: [],
				total: 0,
				props: {
					lazy: true,
					lazyLoad(node, resolve) {
						console.log(node)
						const {
							level,
							data
						} = node;
						getCategoryList({asc:['sort'],where: [{k: 'parent_id',v: data?data.id:0,op: '='}]}).then(res=>{
							const nodes=res.datas.map(item=>({
								value:item.code,
								id:item.id,
								label:item.name,
								leaf: level >= 2
							}))
							resolve(nodes);
						})
					}
				}
			}
		},
		created() {
			this.query()
		},
		methods: {
			indexMethod(index) {
				return (this.form.page - 1) * this.form.num + 1 + index
			},
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			showState(row, column, cellValue, index) {
				return cellValue ? '上架' : '下架'
			},
			toMoneyStr(money) {
				return toMoneyStr(money)
			},
			query() {
				var where = [];
				for (let i in this.searchForm) {
					if (i == 'online' || this.searchForm[i]) {
						where.push({
							k: i,
							v: i == 'name' ? '%' + this.searchForm[i] + '%' : this.searchForm[i],
							op: i == 'name' ? 'like' : '='
						})
					}
				}
				this.form.where = where;
				this.getProcuct();
			},
			getProcuct() {
				getProcuct(this.form).then(res => {
					this.tableData = res.datas;
					if (this.total === 0) {
						this.total = res.ext.total;
					}
				})
			},
			refresh() {
				this.tableData = [];
				this.getProcuct();
			},
			//新增商品
			addComponents() {
				this.$router.push({
					path: '/commodity/commodity/edit'
				})
			},
			//编辑商品
			editComponents(id) {
				this.$router.push({
					path: '/commodity/commodity/edit',
					query: {
						id: id
					}
				})
			},
			//上下架
			editState(data, state) {
				var {
					id,
					version,
					online
				} = data;
				var form = {
					id,
					version,
					online
				};
				form.online = state;
				editProcuctInfo(form).then(res => {
					this.$message.success('操作成功');
					this.getProcuct();
				})
			},
			changeClass(e){
				console.log(e)
			}
		}
	}
</script>

<style>
</style>
