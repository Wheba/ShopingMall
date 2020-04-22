<template>
	<el-card>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<h3>基础信息</h3>
			<el-form-item label="渠道名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入渠道名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="渠道代码" prop="code">
				<el-input v-model="form.code" placeholder="请输入渠道代码" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="渠道链接" prop="url">
				<el-input v-model="form.url" placeholder="请输入渠道链接地址" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<h3>积分汇率</h3>
			<el-form-item label="1元 = " prop="rate">
				<el-input v-model="form.rate" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入积分汇率" :style="{width: inputWidth+'px'}">
					<template slot="append">积分</template>
				</el-input>
			</el-form-item>
			<h3>支付方式</h3>
			<el-form-item prop="payment_methods">
				<el-checkbox-group v-model="form.payment_methods">
					<el-checkbox :key="index" v-for="(item,index) in payMentList" :label="index" name="type">{{item}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<h3>支付参数</h3>
			<el-form-item label="支付ID" prop="payment_id">
				<el-input v-model="form.payment_id" placeholder="请输入支付ID" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="支付密钥" prop="payment_key">
				<el-input v-model="form.payment_key" placeholder="请输入支付密钥" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<h3>备注信息</h3>
			<el-form-item prop="commont">
				<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="备注信息" v-model="form.commont" :style="{width: inputWidth+'px'}">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button :loading="isSubmit" type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import {
		getChannelInfo,
		addOrEditChannel
	} from '@/api/channel/channel'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
			...mapState({
				payMentList: state => state.data.payMentList
			})
		},
		data() {
			return {
				inputWidth: 300,
				id: null, //渠道id
				form: {payment_methods:[]},
				isSubmit:false,
				rules:{
					name:[{
						required: true,
						message: '请输入渠道名称',
						trigger: 'blur'
					}],
					code:[{
						required: true,
						message: '请输入渠道代码',
						trigger: 'blur'
					}],
					url:[{
						required: true,
						message: '请输入渠道链接地址',
						trigger: 'blur'
					}],
					rate:[{
						required: true,
						message: '请输入积分汇率',
						trigger: 'blur'
					}],
					payment_id:[{
						required: true,
						message: '请输入支付ID',
						trigger: 'blur'
					}],
					payment_key:[{
						required: true,
						message: '请输入支付密钥',
						trigger: 'blur'
					}],
					commont:[{
						required: true,
						message: '请输入备注信息',
						trigger: 'blur'
					}],
					payment_methods: [
            { type: 'array', required: true, message: '请至少选择一种支付方式', trigger: 'change' }
          ],
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getChannelInfo()
			}
		},
		methods: {
			getChannelInfo() {
				getChannelInfo({
					id: this.id
				}).then(res => {
					this.form = res.datas;
					console.log(res)
				})
			},
			submit(){
				this.$refs.form.validate((valid) =>{
					if(valid){
						this.isSubmit=true;
						var form;
						var {id,name,code,url,rate,payment_methods,payment_id,payment_key,commont,version}=this.form;
						if(id){//编辑
							form={id,name,code,url,rate,payment_methods,payment_id,payment_key,commont,version};
						}else{//新增
							form={name,code,url,rate,payment_methods,payment_id,payment_key,commont};
						}
						addOrEditChannel(form).then(res=>{
							this.$router.push('/channel/channel/list')
							this.$message.success('操作成功');
							this.isSubmit=false;
						}).catch(error=>{
							this.isSubmit=false;
						})
					}else{
						console.log('error submit!!');
						return false;
					}
				})
			},
			cancel(){
				this.$router.push('/channel/channel/list')
			}
		}
	}
</script>

<style>
</style>
