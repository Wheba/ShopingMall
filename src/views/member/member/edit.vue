<template>
	<el-dialog :title="title" :visible.sync="show" width="500px" center :before-close="handleClose">
		<el-form ref="form" :model="form" :rules="rules" label-width="100px" :size="sizeHeader">
		  <el-form-item label="会员名称" prop="account">
		    <el-input v-model="form.account" placeholder='请输入会员名称'></el-input>
		  </el-form-item>
			<el-form-item label="会员手机号" prop="phone">
			  <el-input v-model="form.phone" placeholder='请输入手机号'></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button :size="sizeHeader" @click="handleClose">取 消</el-button>
			<el-button :size="sizeHeader" :loading='isSubmit' type="primary" @click="submitFrom">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {editUser} from '@/api/member/member'
	export default{
		props:['title','show','editData'],
		computed:{
			...mapGetters(['sizeHeader'])
		},
		data(){
			return{
				visible:false,
				form:{},
				rules:{
					account:[{ required: true, message: '请输入会员名称', trigger: 'blur' }],
					phone:[{ required: true, message: '请输入手机号', trigger: 'blur' }]
				},
				isSubmit:false
			}
		},
		watch:{
			editData(){
				this.form=this.editData
			}
		},
		methods:{
			handleClose(){
				this.$emit('closeEdit')
			},
			submitFrom(){
				this.$refs.form.validate(valid=>{
					if(valid){
						this.isSubmit=true;
						editUser(this.form).then(res=>{
							if(res.code==0){
								this.$emit('editSuccess')
							}
							this.isSubmit=false;
						}).catch(error=>{
							this.isSubmit=false;
						})
					}else{
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
