<template>
	<el-card>
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" :size="sizeHeader">
			<h3>基础信息</h3>
			<el-form-item label="供应商名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入供应商名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="供应商简称" prop="short_name">
				<el-input v-model="form.short_name" placeholder="请输入供应商简称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="公司地址" prop="address">
				<el-input v-model="form.address" placeholder="请输入公司地址" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<h3>联系人信息</h3>
			<el-form-item label="联系人" prop="Name">
				<el-input v-model="form.contacters[0].name" placeholder="联系人" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop='Phone'>
				<el-input v-model="form.contacters[0].phone" placeholder="请输入手机号" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="联系地址" prop="Address">
				<el-input v-model="form.contacters[0].address" placeholder="请输入联系地址" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<h3>账户信息信息</h3>
			<el-form-item label="开户银行" prop="bank_name">
				<el-input v-model="form.bank_name" placeholder="请输入开户银行" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="账户名称" prop="bank_account">
				<el-input v-model="form.bank_account" placeholder="请输入账户名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="银行账户" prop="bank_code">
				<el-input v-model="form.bank_code" placeholder="请输入银行账户" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<h3>备注信息</h3>
			<el-form-item label="备注" prop="comment">
				<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="备注信息" v-model="form.comment" :style="{width: inputWidth+'px'}">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button :loading="isSubmit" type="primary" @click="submitInfo">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getSupplierInfo,
		editSupplier
	} from '@/api/supplier/supplier'
	import {
		deepClone
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader'])
		},
		data() {
			var Name = (rule, value, callback) => {
				if(this.form.contacters[0].name){
					callback();
				}else{
					callback(new Error('请输入联系人'));
				}
			};
			var Phone = (rule, value, callback) => {
				if(this.form.contacters[0].phone){
					callback();
				}else{
					callback(new Error('请输入手机号'));
				}
			};
			var Address = (rule, value, callback) => {
				if(this.form.contacters[0].address){
					callback();
				}else{
					callback(new Error('请输入联系地址'));
				}
			};
			return {
				inputWidth: 300,
				id: null, //代理商id
				form: {
					contacters: [{
						name: '',
						phone: "",
						address: ""
					}]
				},
				isSubmit: false,
				rules: {
					name: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}],
					short_name: [{
						required: true,
						message: '请输入供应商简称',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入公司地址',
						trigger: 'blur'
					}],
					Name: [{
						required: true,
						validator: Name,
						trigger: 'blur'
					}],
					Phone: [{
						required: true,
						validator: Phone,
						trigger: 'blur'
					}],
					Address: [{
						required: true,
						validator: Address,
						trigger: 'blur'
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
					comment: [{
						required: true,
						message: '请输入备注信息',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getSupplierInfo()
			} else { //新增

			}
		},
		methods: {
			getSupplierInfo() {
				getSupplierInfo({
					id: this.id
				}).then(res => {
					if(!res.datas.contacters){
						res.datas.contacters=[{name: '',
						phone: "",
						address: ""}]
					}
					this.form = deepClone(res.datas);
					console.log(this.form)
				})
			},
			cancel() {
				this.$router.push('/supplier/supplier/list')
			},
			submitInfo() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isSubmit = true;
						var {name,short_name,address,comment,contacters,bank_name,bank_account,bank_code,version}=deepClone(this.form);
						var form={name,short_name,address,comment,contacters,bank_name,bank_account,bank_code,version};
						if(this.form.id){
							form.id=this.form.id
						}
						editSupplier(form).then(res => {
							this.isSubmit=true;
							this.$router.push('/supplier/supplier/list')
							this.$message.success('操作成功');
							this.$store.dispatch('data/providerList')
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			}
		}
	}
</script>

<style>
</style>
