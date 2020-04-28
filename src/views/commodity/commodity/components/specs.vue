<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>规格参数</span>
			<el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="addSub">新增子类</el-button>
		</div>
		<el-table :data="tableData" border :size='sizeHeader'>
			<el-table-column v-for="(item,index) in specsCol" :label="item" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.spu_values[index].value" v-if="scope.$index!=saveState.index"></span>
					<el-input v-model="scope.row.spu_values[index].value" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="对应库存" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.stock" v-if="scope.$index!=saveState.index"></span>
					<el-input v-model="scope.row.stock" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="价格" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.price" v-if="scope.$index!=saveState.index"></span>
					<el-input v-model="scope.row.price" @input="onMoneyInput(scope.row.price,scope.$index)" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="货号" align='center'>
				<template slot-scope="scope">
					<span v-text="scope.row.sku" v-if="scope.$index!=saveState.index"></span>
					<el-input v-model="scope.row.sku" :size="sizeHeader" v-else></el-input>
				</template>
			</el-table-column>
			<el-table-column label="操作" align='center'>
				<template slot-scope="scope">
					<el-button type="text" @click="edit(scope.$index)"><span :style="{color: scope.$index==saveState.index?'#67c23a':'#409EFF'}"
						 v-text="scope.$index==saveState.index?'保存':'编辑'"></span></el-button>
					<el-button :key="scope.row.id" type="text" @click="del(scope.$index)"><span style="color: red;">删除</span></el-button>
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
	import {
		editSku
	} from '@/api/public'
	export default {
		computed: {
			...mapGetters(['sizeHeader'])
		},
		props: ['data', 'code'],
		data() {
			return {
				tableData: [],
				specsCol: [],
				addObj: {
					price: '',
					stock: '',
					spu_values: [],
					sku: ''
				},
				saveState:{
					index:-1,
					state:0,//0待编辑 1编辑中 2保存中
				}
			}
		},
		created() {
			var list = deepClone(this.data).map(function(item) {
				var {
					id,
					price,
					product_code,
					sku,
					spu_value_ids,
					spu_values,
					stock
				} = item;
				price = toMoneyStr(price)
				spu_values = spu_values.map(function(item2) {
					var {
						id,
						name,
						spu_id,
						value
					} = item2
					return {
						id,
						name,
						spu_id,
						value
					}
				})
				return {
					id,
					price,
					product_code,
					sku,
					spu_value_ids,
					spu_values,
					stock
				}
			});
			if (list.length > 0) {
				for (var i = 0; i < list[0].spu_values.length; i++) {
					this.specsCol.push(list[0].spu_values[i].name)
					this.addObj.spu_values.push({
						name: list[0].spu_values[i].name,
						value: '',
						spu_id: list[0].spu_values[i].spu_id
					})
				}
			}
			console.log(this.specsCol)
			console.log(this.addObj)
			this.tableData = list;
			//console.log(this.tableData)
		},
		methods: {
			edit(index) {
				if(this.saveState.index==index){//保存
					if(this.saveState.state==2){//当前保存中
						this.$message.warning('请勿频繁操作')
					}else{
						if(this.checkSku(this.tableData[index])){
							this.saveState.state=2;//开始保存或新增
							var form=deepClone(this.tableData[index])
							form.price=Math.floor(form.price*100);
							editSku(form).then(res=>{
								this.saveState={
									index:-1,
									state:0
								}
								this.$message.success('保存成功')
							})
						}
					}
				}else{//编辑
					if(this.saveState.state==0){//可编辑
						this.saveState.index=index;
						this.saveState.state=1;
					}else{//不可编辑
						this.$message.warning('请先保存信息')
					}
				}
			},
			//检测sku
			checkSku(item) {
				var j;
				for(let i in item){
					if(item[i]){
						if(i=='spu_values'){
							for(j=0;j<item[i].length;j++){
								if(!item[i][j].value){
									this.$message.warning('请先填写完信息')
									return false
								}
							}
						}
					}else{
						this.$message.warning('请先填写完信息')
						return false
					}
				}
				return true
			},
			del(index) {
				this.tableData.splice(index, 1)
			},
			onMoneyInput(e, index) {
				this.$set(this.tableData[index], 'price', checkMoney(e));
			},
			addSub() {
				for (var i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].isEdit) {
						this.$message.warning('请先保存信息')
						return
					}
				}
				var addObj = deepClone(this.addObj);
				this.tableData.push(addObj)
			}
		}
	}
</script>

<style>
</style>
