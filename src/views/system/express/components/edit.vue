<template>
	<div>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<el-card>
				<h3>基础信息</h3>
				<el-form-item label="快递名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入快递名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="快递简称" prop="short_name">
					<el-input v-model="form.short_name" placeholder="请输入快递简称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="快递编码" prop="code">
					<el-input v-model="form.code" placeholder="请输入快递编码" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="公司地址" prop="address">
					<el-input v-model="form.address" placeholder="请输入公司地址" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="级别" prop="level">
					<el-select v-model="form.level" placeholder="请选择级别" :style="{width: inputWidth+'px'}">
						<el-option :key="item.id" v-for="item in level" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<h3>联系人信息</h3>
				<el-form-item label="联系人" prop="contacts">
					<el-input v-model="form.contacters[0].name" placeholder="请输入联系人名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="form.contacters[0].phone" placeholder="请输入联系人手机号" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="联系地址" prop="contactsAddr">
					<el-input v-model="form.contacters[0].address" placeholder="请输入联系人地址" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<h3>账户信息</h3>
				<el-form-item label="开户银行" prop="bank_name">
					<el-input v-model="form.bank_name" placeholder="请输入开户银行" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="账户名称" prop="bank_account">
					<el-input v-model="form.bank_account" placeholder="请输入账户名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="银行账户" prop="bank_code">
					<el-input v-model="form.bank_code" placeholder="请输入银行账户" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
			</el-card>
			<el-card class="box-card" style="margin-top: 15px;">
				<div slot="header" class="clearfix">
					<span>快递政策</span>
					<el-button icon='el-icon-plus' style="float: right; padding: 3px 0" type="text" @click="add">新增</el-button>
				</div>
				<el-table :data="form.price_lists" border :size='sizeHeader'>
					<el-table-column prop="name" label="政策名称" align='center'></el-table-column>
					<el-table-column prop="comment" label="政策描述" align='center'></el-table-column>
					<el-table-column label="规则" align='center'>
						<template slot-scope="scope">
							<span>{{toMoneyStr(scope.row.price)}}元</span>
						</template>
					</el-table-column>
					<el-table-column prop="start_time" label="开始时间" align='center' :formatter="showTime"></el-table-column>
					<el-table-column prop="end_time" label="结束时间" align='center' :formatter="showTime"></el-table-column>
					<el-table-column prop='state' label="状态" align='center' :formatter="showState"></el-table-column>
					<el-table-column label="操作" align='center'>
						<template slot-scope="scope">
							<el-popconfirm title="您确定要停用？" @onConfirm="changeState(scope.$index,0)" v-if="scope.row.state">
								<el-button slot="reference" type="text"><span style="color: red;">停用</span></el-button>
							</el-popconfirm>
							<el-popconfirm title="您确定要启用？" @onConfirm="changeState(scope.$index,1)" v-else>
								<el-button slot="reference" type="text">启用</el-button>
							</el-popconfirm>
							<el-popconfirm title="您确定要删除？" @onConfirm="remove(scope.$index)">
								<el-button slot="reference" type="text"><span style="color: red;">删除</span></el-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-form-item style='margin-top: 15px;text-align: center;'>
				<el-button :loading="isSubmit" type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
		<el-dialog title="新增快递政策" :visible.sync="dialogVisible" width="500px" :show-close="false" center>
			<el-form ref="addform" :model="addform" :rules="addRules" label-width="80px" :size="sizeHeader">
				<el-form-item label="政策名称" prop="name">
					<el-input v-model="addform.name" placeholder="请输入政策名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="规则" prop="price">
					<el-input v-model="addform.price" @input="onMoneyInput(addform.price)" placeholder="请输入规则金额" :style="{width: inputWidth+'px'}">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="开始时间" prop="start_time">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="addform.start_time" type="datetime" placeholder="选择开始时间"
					 :style="{width: inputWidth+'px'}">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="end_time">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="addform.end_time" type="datetime" placeholder="选择结束时间"
					 :style="{width: inputWidth+'px'}">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="政策描述" prop="comment">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addform.comment" placeholder="请输入政策描述"
					 :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :size='sizeHeader' @click="dialogVisible = false">取 消</el-button>
				<el-button :size='sizeHeader' type="primary" @click="addSuccess">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getExpressInfo,
		addOrEditExpress
	} from '@/api/system/express'
	import {
		parseTime,
		toMoneyStr,
		checkMoney,
		deepClone
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader'])
		},
		data() {
			var contacts = (rule, value, callback) => {
				if(this.form.contacters[0].name === ''){
					callback(new Error('请输入联系人名称'));
				}else{
					callback();
				}
			};
			var phone = (rule, value, callback) => {
				if(this.form.contacters[0].phone === ''){
					callback(new Error('请输入联系人手机号'));
				}else if(this.form.contacters[0].phone.length!=11){
					callback(new Error('输入的联系人手机号有误'));
				}else{
					callback();
				}
			};
			var contactsAddr = (rule, value, callback) => {
				if(this.form.contacters[0].address === ''){
					callback(new Error('请输入联系人地址'));
				}else{
					callback();
				}
			};
			return {
				inputWidth: 300,
				id: null, //快递id
				form: {
					contacters: [{}],
					price_lists: []
				},
				isSubmit:false,
				rules: {
					name: [{
						required: true,
						message: '请输入快递名称',
						trigger: 'blur'
					}],
					short_name: [{
						required: true,
						message: '请输入快递简称',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入快递编码',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入公司地址',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '请选择级别',
						trigger: 'change'
					}],
					bank_name: [{
						required: true,
						message: '请输入开户银行',
						trigger: 'blur'
					}],
					bank_account: [{
						required: true,
						message: '请输入账户名称',
						trigger: 'blur'
					}],
					bank_code: [{
						required: true,
						message: '请输入银行账户',
						trigger: 'blur'
					}],
					contacts: [{
						required: true,
						validator: contacts,
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: phone,
						trigger: 'blur'
					}],
					contactsAddr: [{
						required: true,
						validator: contactsAddr,
						trigger: 'blur'
					}]
				},
				level: [{
					id: 1,
					name: '一级'
				}, {
					id: 2,
					name: '二级'
				}],
				dialogVisible: false,
				addform: {},
				addRules: {
					name: [{
						required: true,
						message: '请输入政策名称',
						trigger: 'blur'
					}],
					price: [{
						required: true,
						message: '请输入规则金额',
						trigger: 'blur'
					}],
					start_time: [{
						required: true,
						message: '选择开始时间',
						trigger: 'change'
					}],
					end_time: [{
						required: true,
						message: '选择结束时间',
						trigger: 'change'
					}],
					comment: [{
						required: true,
						message: '请输入政策描述',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getExpressInfo()
			}
		},
		methods: {
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			showState(row, column, cellValue, index) {
				return cellValue ? '正常' : '停用'
			},
			toMoneyStr(money) {
				return toMoneyStr(money)
			},
			getExpressInfo() {
				getExpressInfo({
					id: this.id
				}).then(res => {
					this.form = res.datas;
					//console.log(res)
				})
			},
			cancel() {
				this.$router.push('/system/express/list')
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.isSubmit=true;
						var {name,short_name,code,address,level,contacters,bank_name,bank_account,bank_code,price_lists}=this.form;
						var form={name,short_name,code,address,level,contacters,bank_name,bank_account,bank_code,price_lists};
						if(this.id){//编辑
							form.id=this.id;
							form.version=this.form.version;
						}
						addOrEditExpress(form).then(res=>{
							this.$router.push('/system/express/list')
							this.$message.success('操作成功');
							this.isSubmit=false;
						}).catch(error=>{
							this.isSubmit=false;
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			//删除快递政策
			remove(index) {
				this.form.price_lists.splice(index, 1);
			},
			//修改状态
			changeState(index, state) {
				this.$set(this.form.price_lists[index], 'state', state);
			},
			//新增快递政策
			add() {
				this.addform = {
					state: 0
				}
				this.dialogVisible = true;
			},
			addSuccess() {
				this.$refs.addform.validate(valid => {
					if (valid) {
						var form = deepClone(this.addform);
						form.price *= 100;
						this.form.price_lists.push(form)
						this.$message.success('操作成功');
						this.dialogVisible = false;
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			onMoneyInput(e) {
				this.addform.price = checkMoney(e);
			}
		}
	}
</script>

<style>
</style>
