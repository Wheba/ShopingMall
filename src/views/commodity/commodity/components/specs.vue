<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>规格参数</span>
			<el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="addSub">新增子类</el-button>
		</div>
		<el-table :data="tableData" border :size='sizeHeader'>
			<el-table-column v-for="(item,index) in specsCol" :label="item" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.spu_values[index].value" v-if="!scope.row.isEdit"></span>
					<el-input v-model="scope.row.spu_values[index].value" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="对应库存" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.stock" v-if="!scope.row.isEdit"></span>
					<el-input v-model="scope.row.stock" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="价格" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.price" v-if="!scope.row.isEdit"></span>
					<el-input v-model="scope.row.price" @input="onMoneyInput(scope.row.price,scope.$index)" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="货号" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.sku" v-if="!scope.row.isEdit"></span>
					<el-input v-model="scope.row.sku" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="操作" align='center' fixed="right">
				<template slot-scope="scope">
					<el-button type="text" @click="edit(scope.$index)"><span :style="{color: scope.row.isEdit?'#67c23a':'#409EFF'}" v-text="scope.row.isEdit?'保存':'编辑'"></span></el-button>
					<!-- <el-button type="text" v-show="scope.row.isEdit">保存</el-button> -->
					<el-button :key="scope.row.id" type="text" @click="del(scope.$index)"><span style="color: red;">删除</span></el-button>
					<!-- <el-popconfirm title="您确定要上架？" @onConfirm="editState(scope.row,true)" v-if="!scope.row.online">
						<el-button slot="reference" type="text"><span style="color: red;">上架</span></el-button>
					</el-popconfirm>
					<el-popconfirm title="您确定要下架？" @onConfirm="editState(scope.row,false)" v-else>
						<el-button slot="reference" type="text"><span style="color: red;">下架</span></el-button>
					</el-popconfirm> -->
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		toMoneyStr,
		deepClone,
		checkMoney
	} from '@/utils'
	export default{
		computed: {
			...mapGetters(['sizeHeader'])
		},
		props:['data','code'],
		data(){
			return{
				tableData:[],
				specsCol:[],
				addObj:{price:'',stock:0,isEdit:true,spu_values:[],sku:''}
			}
		},
		created() {
			var list=deepClone(this.data).map(function(item){
				var {id,price,product_code,sku,spu_value_ids,spu_values,stock}=item,
				price=toMoneyStr(price)
				return {id,price,product_code,sku,spu_value_ids,spu_values,stock,isEdit:false}
			});
			if(list.length>0){
				for(var i=0;i<list[0].spu_values.length;i++){
					this.specsCol.push(list[0].spu_values[i].name)
					this.addObj.spu_values.push({name:list[0].spu_values[i].name,value:'',spu_id:list[0].spu_values[i].spu_id})
				}
			}
			this.tableData=list;
			console.log(this.tableData)
		},
		methods:{
			edit(index){
				if(!this.tableData[index].isEdit){//编辑
					this.$set(this.tableData[index],'isEdit',!this.tableData[index].isEdit);
				}else{//保存
				console.log(this.tableData[index])
					console.log('当前为保存')
				}
			},
			del(index){
				this.tableData.splice(index,1)
			},
			onMoneyInput(e, index) {
				this.$set(this.tableData[index],'price',checkMoney(e));
			},
			addSub(){
				for(var i=0;i<this.tableData.length;i++){
					if(this.tableData[i].isEdit){
						this.$message.warning('请先保存当前信息')
						return
					}
				}
				var addObj=deepClone(this.addObj);
				this.tableData.push(addObj)
			}
		}
	}
</script>

<style>
</style>
