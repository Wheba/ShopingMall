<template>
	<el-card>
		<el-form ref="form" :model="form" label-width="80px" :size="sizeHeader">
			<el-form-item label="账户名称" prop="account">
				<el-input v-model="form.account" placeholder="请输入账户名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="账户密码" prop="password">
				<el-input v-model="form.password" placeholder="请输入账户密码" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input v-model="form.password2" placeholder="请再次输入账户密码" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="nick">
				<el-input v-model="form.nick" placeholder="请输入开户者真实姓名" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="form.phone" placeholder="请输入开户者手机号" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="账户角色" prop="role">
				<el-select v-model="form.role" placeholder="请选择" :style="{width: inputWidth+'px'}">
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
		getAccountInfo
	} from '@/api/system/account'
	import {
		getRoleList
	} from '@/api/system/role'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data() {
			return {
				inputWidth: 300,
				form: {},
				roleList: [], //角色列表
				isSubmit:false
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
			getAccountInfo() {
				getAccountInfo({
					id: this.id
				}).then(res => {
					this.form = res.datas;
					console.log(res)
				})
			},
			getRoleList() {
				getRoleList({}).then(res => {
					this.roleList = res.datas;
					console.log(res)
				})
			},
			//提交
			submit(){
				
			},
			//取消
			cancel(){
				this.$router.push('/system/account/list')
			}
		}
	}
</script>

<style>
</style>
