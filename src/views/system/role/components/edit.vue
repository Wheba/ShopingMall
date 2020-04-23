<template>
	<el-card>
		<el-form ref="form" :model="form" label-width="80px" :size="sizeHeader">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入角色名称" :style="{width: inputWidth+'px'}"></el-input>
			</el-form-item>
			<el-form-item label="权限选择">
				<!-- <el-input v-model="form.name" placeholder="请输入角色名称" :style="{width: inputWidth+'px'}"></el-input> -->
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
		getRoleInfo
	} from '@/api/system/role'
	export default{
		computed: {
			...mapGetters(['sizeHeader']),
		},
		data(){
			return{
				inputWidth:300,
				id:null,//角色id
				form:{},
				isSubmit:false
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getRoleInfo()
			}
		},
		methods:{
			getRoleInfo(){
				getRoleInfo({id:this.id}).then(res=>{
					this.form=res.datas;
					console.log(res)
				})
			},
			submit(){
				
			},
			cancel(){
				this.$router.push('/system/role/list')
			}
		}
	}
</script>

<style>
</style>
