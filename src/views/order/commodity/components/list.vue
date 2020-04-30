<template>
	<div>
		<el-card>
			
		</el-card>
		<el-card style="margin-top: 15px;">
			<el-table :data="tableData" border :size='sizeHeader'>
				<el-table-column type="index" :index="indexMethod" label='编号' align='center'></el-table-column>
				<el-table-column label="商品信息" header-align='center'>
					<template slot-scope="scope">
						<p>商品名称</p>
						<p>编号：</p>
						<p>供应商：</p>
					</template>
				</el-table-column>
				<el-table-column label="订单信息" header-align='center'>
					<template slot-scope="scope">
						<p>订单编号：{{scope.row.order_no}}</p>
						<p>销售价格：{{toMoneyStr(scope.row.order_pay.amount)}}元</p>
						<p>商品数量：</p>
					</template>
				</el-table-column>
				<el-table-column label="用户信息" header-align='center'>
					<template slot-scope="scope">
						<p>用户账号：{{scope.row.user.account}}</p>
						<p>用户手机号：{{scope.row.user.phone}}</p>
						<p>用户姓名：{{scope.row.user.nick}}</p>
					</template>
				</el-table-column>
				<el-table-column label="订单状态" header-align='center'>
					<template slot-scope="scope">
						<p>维权状态：</p>
						<p>物流状态：</p>
					</template>
				</el-table-column>
				<el-table-column label="时间" header-align='center'>
					<template slot-scope="scope">
						<p>下单时间：{{showTime(scope.row.created)}}</p>
						<p>支付时间：{{showTime(scope.row.order_pay.created)}}</p>
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
		toMoneyStr,
		parseTime
	} from '@/utils'
	import {getOrderPage} from '@/api/order/commodity'
	export default{
		computed: {
			...mapGetters(['sizeHeader'])
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
			this.getOrderPage()
		},
		methods:{
			indexMethod(index) {
				return (this.searchForm.page - 1) * this.searchForm.num + 1 + index
			},
			toMoneyStr(money) {
				return toMoneyStr(money)
			},
			showTime(time) {
				return parseTime(time)
			},
			getOrderPage(){
				getOrderPage(this.searchForm).then(res=>{
					this.tableData = res.datas;
					if (this.total === 0) {
						this.total = res.ext.total;
					}
					console.log(res)
				})
			}
		}
	}
</script>

<style>
</style>
