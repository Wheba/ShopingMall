<template>
	<el-card>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<el-form-item label="账户名称" prop="account">
				<el-input v-model="form.account" placeholder="请输入账户名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="账户密码" prop="password">
				<el-input ref="password" :type="passwordType" v-model="form.password" placeholder="请输入账户密码" :style="{width: inputWidth+'px'}">
					<span slot="append" class="show-pwd" @click="showPwd(1)">
						<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
					</span>
				</el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input ref="password2" :type="passwordType2" v-model="form.password2" placeholder="请再次输入账户密码" :style="{width: inputWidth+'px'}">
					<span slot="append" class="show-pwd" @click="showPwd(2)">
						<svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
					</span>
				</el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="nick">
				<el-input v-model="form.nick" placeholder="请输入开户者真实姓名" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="form.phone" placeholder="请输入开户者手机号" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="账户角色" prop="role_ids">
				<el-select v-model="form.role_ids[0]" placeholder="请选择" :style="{width: inputWidth+'px'}">
					<el-option :key="item.id" v-for="item in roleList" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item style='margin-top: 15px;'>
				<el-button :loading="isSubmit" type="primary" @click="submit">提交</el-button>
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
		getAccountInfo,
		addOrEditAccount
	} from '@/api/system/account'
	import {
		getRoleList
	} from '@/api/system/role'
	import md5 from 'md5'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data() {
			var password = (rule, value, callback) => {
				if (value !== this.form.password2) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var password2 = (rule, value, callback) => {
				if (value === '' && this.form.password) {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.form.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				inputWidth: 300,
				form: {
					role_ids: [],
					password: '',
					password2: ''
				},
				roleList: [], //角色列表
				isSubmit: false,
				passwordType: 'password',
				passwordType2: 'password',
				rules: {
					account: [{
						required: true,
						message: '请输入账户名称',
						trigger: 'blur'
					}],
					nick: [{
						required: true,
						message: '请输入开户者真实姓名',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入开户者手机号',
						trigger: 'blur'
					}],
					role_ids: [{
						type: 'array',
						required: true,
						message: '请选择一个角色',
						trigger: 'change'
					}],
					password: [{
						validator: password,
						trigger: 'blur'
					}],
					password2: [{
						validator: password2,
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getAccountInfo()
			}
			this.getRoleList();
		},
		methods: {
			showPwd(code) {
				var passwordType;
				var refName;
				if (code == 1) {
					passwordType = 'passwordType'
					refName = 'password'
				} else {
					passwordType = 'passwordType2'
					refName = 'password2'
				}
				if (this[passwordType] === 'password') {
					this[passwordType] = ''
				} else {
					this[passwordType] = 'password'
				}
				this.$nextTick(() => {
					this.$refs[refName].focus()
				})
			},
			getAccountInfo() {
				getAccountInfo({
					id: this.id
				}).then(res => {
					var {
						id,
						version,
						account,
						nick,
						phone,
						role_ids
					} = res.datas;
					this.form = {
						id,
						version,
						account,
						nick,
						phone,
						role_ids,
						password: '',
						password2: ''
					};
					//console.log(res)
				})
			},
			getRoleList() {
				getRoleList({}).then(res => {
					this.roleList = res.datas;
					//console.log(res)
				})
			},
			//提交
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.isSubmit = true;
						var {id,version,account,nick,phone,role_ids,password}=this.form;
						var form={account,nick,phone,role_ids};
						if(id){//编辑
							form.id=id;
							form.version=version;
						}
						if(password){//修改密码
							form.pwd=md5(password)
							form.token=''
						}
						addOrEditAccount(form).then(res=>{
							this.isSubmit=false;
							this.$message.success('操作成功');
							this.cancel();
						}).catch(error=>{
							this.isSubmit=false;
						})
						console.log(form)
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			//取消
			cancel() {
				this.$router.push('/system/account/list')
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.show-pwd {
		cursor: pointer;
	}
</style>
