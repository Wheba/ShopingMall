<template>
	<el-card>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<el-form-item label="活动名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入活动名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="活动类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择活动类型" :style="{width: inputWidth+'px'}">
					<el-option :key="index" v-for="(item,index) in typeActivityList" :label="item" :value="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="渠道限定" prop="payment_channel_id">
				<el-select v-model="form.payment_channel_id" placeholder="请选择渠道" :style="{width: inputWidth+'px'}">
					<el-option :key="item.id" v-for="item in channelList" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="开始时间" prop="start_time">
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.start_time" type="datetime" placeholder="选择开始时间"
				 :style="{width: inputWidth+'px'}">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" prop="end_time">
				<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.end_time" type="datetime" placeholder="选择结束时间"
				 :style="{width: inputWidth+'px'}">
				</el-date-picker>
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
		addOrEditActivity,
		getActivityInfo
	} from '@/api/activity/activity'
	import {
		getChannelList
	} from '@/api/channel/channel'
	import {
		parseTime
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader']),
			...mapState({
				typeActivityList: state => state.data.typeActivityList
			})
		},
		data() {
			return {
				inputWidth: 300,
				id:null,//活动id
				form: {},
				channelList: [], //渠道列表
				isSubmit: false,
				rules: {
					name: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择活动类型',
						trigger: 'change'
					}],
					payment_channel_id: [{
						required: true,
						message: '请选择渠道',
						trigger: 'change'
					}],
					start_time: [{
						required: true,
						message: '选择开始时间',
						trigger: 'change'
					}],
					end_time: [{
						required: true,
						message: '选择结束时间',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getActivityInfo()
			}
			this.getChannelList()
		},
		methods: {
			getActivityInfo(){
				getActivityInfo({id:this.id}).then(res=>{
					var {id,name,type,payment_channel_id,start_time,end_time,version}=res.datas;
					//时间转换
					start_time=parseTime(start_time);
					end_time=parseTime(start_time);
					this.form={id,name,type,payment_channel_id,start_time,end_time,version};
				})
			},
			getChannelList() {
				getChannelList({
					where: [{
						k: 'state',
						v: 1,
						op: '='
					}]
				}).then(res => {
					this.channelList = res.datas;
				})
			},
			//提交
			submit() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isSubmit=true;
						var {name,type,payment_channel_id,start_time,end_time}=this.form;
						var form={name,type,payment_channel_id,start_time,end_time};
						if(this.form.id){
							form.id=this.form.id;
							form.version=this.form.version;
						}
						addOrEditActivity(form).then(res=>{
							this.$router.push('/activity/activity/list')
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
			//取消
			cancel() {
				this.$router.push('/activity/activity/list')
			}
		}
	}
</script>

<style>
</style>
