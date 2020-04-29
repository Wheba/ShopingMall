<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>规格参数</span>
			<el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="addSub">新增子类</el-button>
			<el-button style="float: right; padding: 3px 20px 3px 0" type="text" icon="el-icon-plus" @click="addSpecsShow">新增规格</el-button>
		</div>
		<el-table :data="tableData" border :size='sizeHeader'>
			<el-table-column :key="item.name" v-for="(item,index) in specsCol" :label="item.name" align='center'>
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
			<el-table-column label="操作" align='center'>
				<template slot-scope="scope">
					<el-button type="text" @click="edit(scope.$index)"><span :style="{color: scope.row.isEdit?'#67c23a':'#409EFF'}"
						 v-text="scope.row.isEdit?'保存':'编辑'"></span></el-button>
					<el-button :key="scope.row.id" type="text" @click="del(scope.$index)"><span style="color: red;">删除</span></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="新增规格" :show-close="false" :center="true" :visible.sync="specsShow" width="500px">
			<el-form ref="specsForm" :model="specsForm" :rules="rules" label-width="80px" :size="sizeHeader">
				<el-form-item label="规格列表">
					<el-select v-model="specsForm.id" :disabled="isAddSpecs" placeholder="请选择规格" style="width:300px" @change="changeSpecs">
						<el-option :key="item.id" v-for="item in getSpuList" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="specsForm.name" :disabled="isAddSpecs" placeholder="请输入规格名称" style="width:300px"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :size="sizeHeader" type="primary" :loading="isAddSpecs" @click="valSpecs">确 定</el-button>
				<el-button :size="sizeHeader" @click="specsShow = false">取 消</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import {
		toMoneyStr,
		deepClone,
		checkMoney
	} from '@/utils'
	import {
		addOrEditSku,
		addOrEditSpu
	} from '@/api/public'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
			...mapState({
				spuList: state => state.data.spuList
			}),
			getSpuList(){
				var list=[];
				var currentList=this.specsCol.map(function(item){
					return item.name
				})
				if(this.spuList){
					list=this.spuList.filter(function(item){
						return !currentList.includes(item.name)
					})
				}
				return list
			}
		},
		props: ['data', 'code'],
		data() {
			return {
				tableData: [],
				specsCol: [],//表头规格列表
				addObj: {
					price: '',
					stock: '',
					spu_values: [],
					sku: '',
					product_code:null,
					isEdit:true
				},//新增子类
				specsShow:false,
				specsForm:{id:null,name:''},
				isAddSpecs:false,
				rules:{
					name:[{
						required: true,
						message: '请输入规格名称',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			if(this.data.length>0){
				var list=this.handleSku(this.data)
				this.tableData = list;
			}
		},
		methods: {
			//数据处理
			handleTable(list){
				if(list){
					var index=0,maxNum=0,i,j;
					for(i=0;i<list.length;i++){
						list[i].spu_values=list[i].spu_values?list[i].spu_values:[]
						if(list[i].spu_values.length>maxNum){
							index=i
							maxNum=list[i].spu_values.length
						}
					}
					for(j=0;j<list[index].spu_values.length;j++){
						this.specsCol.push({
							id:list[index].spu_values[j].id,
							name:list[index].spu_values[j].name
						})
						this.addObj.spu_values.push({
							name: list[index].spu_values[j].name,
							value: '',
							spu_id: list[index].spu_values[j].spu_id
						})
					}
				}
			},
			handleSku(list){
				this.handleTable(list);
				var that=this;
				list=list.map(function(item,index){
					var {id,price,product_code,sku,stock,spu_values}=item;
					price = toMoneyStr(price)//金额处理
					spu_values=that.handleSupValues(spu_values)
					var isEdit=that.addSpuValues(spu_values);
					return {id,price,product_code,sku,stock,spu_values,isEdit}
				})
				return list
			},
			addSpuValues(list){
				if(list.length<this.specsCol.length){//需新增缺少的spuValues
					var deL=this.specsCol.length-list.length;
					for(var i=deL-1;i>-1;i--){
						list.unshift({name:this.specsCol[i].name,spu_id:this.specsCol[i].id})
					}
					return true
				}
				return false
			},
			handleSupValues(list){
				list=list.map(function(item){
					var {id,name,sku_id,spu_id,value}=item;
					return {id,name,sku_id,spu_id,value}
				})
				return list
			},
			edit(index) {
				if(this.tableData[index].isEdit){//编辑中
					var data=this.tableData[index];
					if(this.checkSku(data)){
						var {id,price,product_code,sku,stock,spu_values}=data;
						price=Math.floor(price * 100);
						var form;
						if(id){//编辑
							form={id,price,product_code,sku,stock,spu_values}
						}else{//新增
							form={price,product_code,sku,stock,spu_values}
						}
						addOrEditSku(form).then(res => {
							var {id,price,product_code,sku,stock,spu_values}=res.datas;
							price = toMoneyStr(price)//金额处理
							this.$set(this.tableData,index,{id,price,product_code,sku,stock,spu_values,isEdit:false})
							this.$message.success('保存成功')
						})
					}
				}else{
					this.tableData[index].isEdit=true;
				}
			},
			//检测sku
			checkSku(item) {
				console.log(item)
				var j;
				for (let i in item) {
					if (item[i]) {
						if (i == 'spu_values') {
							for (j = 0; j < item[i].length; j++) {
								if (!item[i][j].value) {
									this.$message.warning('请先填写完信息')
									return false
								}
							}
						}
					} else {
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
			//新增子类
			addSub() {
				for (var i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].isEdit) {
						this.$message.warning('请先保存信息')
						return
					}
				}
				var addObj = deepClone(this.addObj);
				addObj.product_code=this.code;
				this.tableData.push(addObj)
			},
			//显示新增规格
			addSpecsShow(){
				this.isAddSpecs=false;
				this.specsForm={id:null,name:''}
				this.specsShow=true;
			},
			valSpecs(){
				this.$refs.specsForm.validate(valid=>{
					if(valid){
						this.checkSpecs();
					}else{
						console.log('error submit!!');
						return false;
					}
				})
			},
			//检测规格
			checkSpecs(){
				var currentSpecsNameList=this.specsCol.map(function(item){
					return item.name
				})
				if(currentSpecsNameList.includes(this.specsForm.name)){
					this.$message.warning('该规格已存在')
				}else{
					var list=this.getSpuList
					for(var i=0;i<list.length;i++){
						if(list[i].name==this.specsForm.name){//现有规格列表中直接取用-不用新增
							var {id,name}=list[i]
							this.handleSpecsData({id,name})
							return
						}
					}
					this.addSpecs()
				}
			},
			//新增规格
			addSpecs(){
				this.isAddSpecs=true;
				addOrEditSpu({name:this.specsForm.name}).then(res=>{
					var {id,name}=res.datas;
					this.handleSpecsData({id,name})
				})
			},
			//处理规格数据
			handleSpecsData(item){
				this.tableData=this.tableData.map(function(tableItem){
					var {spu_values,id}=tableItem;
					spu_values.unshift({spu_id:item.id,sku_id:id,name:item.name,value:''})
					tableItem.spu_values=spu_values;
					tableItem.isEdit=true;
					return tableItem
				})
				this.addObj.spu_values.unshift({spu_id:item.id,name:item.name,value:''})
				this.specsCol.unshift(item)
				console.log(this.tableData)
				this.$message.success('新增成功')
				this.specsShow=false
			},
			//选择规格
			changeSpecs(e){
				var list=this.getSpuList
				for(var i=0;i<list.length;i++){
					if(list[i].id==e){
						this.specsForm.name=list[i].name
						break;
					}
				}
			}
		}
	}
</script>

<style>
</style>
