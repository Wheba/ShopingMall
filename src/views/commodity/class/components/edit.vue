<template>
	<div id="classEditPage">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>分类信息</span>
				</div>
				<el-alert style="margin-bottom: 10px;width: 380px;" title="限上传一张缩略图,尺寸最佳为180x180像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="缩略图" prop="icon" class="mainBox">
					<el-upload accept="image/png, image/jpeg" class="avatar-uploader" :action="uploadApi" :show-file-list="false"
					 :with-credentials="true" :before-upload="beforeUpload" :on-success="handleMainSuccess">
						<img v-if="form.icon" :src="form.icon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入分类名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="当前排序" prop="sort">
					<el-input v-model="form.sort" placeholder="请输入当前排序" oninput="value=value.replace(/[^\d]/g,'')" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
			</el-card>
			<el-card style="margin-top: 15px;" class="box-card" v-if="id&&Depth!=3">
				<div slot="header" class="clearfix">
					<span>子分类</span>
					<el-button icon='el-icon-plus' style="float: right; padding: 3px 0" type="text" @click="addCategory">新增</el-button>
				</div>
				<el-table :data="subcategoryList" border :size='sizeHeader'>
					<el-table-column label='缩略图' align='center' width='110'>
						<template slot-scope="scope">
							<el-image style="width: 70px; height: 70px;border: 1px dashed #d9d9d9;" :src="scope.row.icon" fit="contain"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="分类名称" align='center'></el-table-column>
					<el-table-column prop="sort" label="当前排序" align='center'></el-table-column>
					<el-table-column prop="created" label="创建时间" align='center' :formatter="showTime"></el-table-column>
					<el-table-column label="调整排序" align='center' width="100">
						<template slot-scope="scope">
							<el-button icon="el-icon-bottom" type="text" @click="changeSort(scope.row,true)"></el-button>
							<el-button icon="el-icon-top" type="text" @click="changeSort(scope.row,false)"></el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" align='center'>
						<template slot-scope="scope">
							<el-button type="text" @click='editCategory(scope.row)'>编辑</el-button>
							<el-popconfirm title="您确定要删除？" @onConfirm="remove(scope.row.id)">
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
		<el-dialog :title="subcategoryTitle" :visible.sync="showCategory" width="500px" :show-close="false" :center="true">
			<el-form ref="categoryForm" :model="categoryForm" :rules="rules2" label-width="80px" :size="sizeHeader">
				<el-form-item label="缩略图" prop="icon" class="mainBox">
					<el-upload accept="image/png, image/jpeg" class="avatar-uploader" :action="uploadApi" :show-file-list="false"
					 :with-credentials="true" :before-upload="beforeUpload" :on-success="handleSubSuccess">
						<img v-if="categoryForm.icon" :src="categoryForm.icon" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="categoryForm.name" placeholder="请输入分类名称" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
				<el-form-item label="当前排序" prop="sort">
					<el-input v-model="categoryForm.sort" placeholder="请输入当前排序" oninput="value=value.replace(/[^\d]/g,'')" :style="{width: inputWidth+'px'}"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :size="sizeHeader" type="primary" :loading="isSubmit2" @click="submitCategory">提 交</el-button>
				<el-button :size="sizeHeader" @click="showCategory = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		getCategoryInfo,
		editCategory,
		addCategory,
		getCategoryList,
		removeCategory
	} from '@/api/commodity/class'
	import {
		parseTime
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader', 'uploadApi']),
		},
		data() {
			return {
				inputWidth: 300,
				id: null, //分类id
				Depth: null,
				form: {
					Depth: 1
				},
				isSubmit: false,
				subcategoryList: [],
				subcategoryTitle:'新增',
				showCategory:false,
				categoryForm:{},
				isSubmit2: false,
				rules: {
					icon: [{
						required: true,
						message: '请先上传缩略图',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请输入当前排序',
						trigger: 'blur'
					}]
				},
				rules2:{
					icon: [{
						required: true,
						message: '请先上传缩略图',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请输入当前排序',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.Depth = this.$route.query.Depth;
				this.getCategoryInfo()
				if (this.Depth < 3) {
					this.getCategoryList();
				}
			}
		},
		methods: {
			showTime(row, column, cellValue, index) {
				return parseTime(cellValue)
			},
			getCategoryInfo() {
				getCategoryInfo({
					id: this.id
				}).then(res => {
					this.form = res.datas;
					console.log(res)
				})
			},
			getCategoryList() {
				getCategoryList({
					asc:['sort'],
					where: [{
						k: 'parent_id',
						v: this.id,
						op: '='
					}]
				}).then(res => {
					this.subcategoryList = res.datas;
				})
			},
			//主缩略图上传
			beforeUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传缩略图大小不能超过 2MB!');
				}
				return isLt2M;
			},
			handleMainSuccess(res, file) {
				if (res.code == 0) {
					this.$set(this.form, 'icon', res.datas)
				} else {
					this.$message.error('图片上传失败！请重新上传');
				}
			},
			//提交
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.isSubmit = true;
						var {
							id,
							version,
							name,
							icon,
							sort,
							Depth
						} = this.form;
						var form = {
							name,
							icon,
							sort,
							Depth
						}
						if (id) { //编辑
							form.id = id;
							form.version = version;
							editCategory(form).then(this.submitSuccess).catch(error => {
								this.isSubmit = false;
							})
						} else {
							addCategory(form).then(this.submitSuccess).catch(error => {
								this.isSubmit = false;
							})
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			submitSuccess(res) {
				this.isSubmit = false;
				this.$router.push({
					path: '/commodity/class/list'
				})
				this.$message.success('操作成功');
			},
			//取消
			cancel() {
				this.$router.push({
					path: '/commodity/class/list'
				})
			},
			addCategory(){
				this.subcategoryTitle='新增';
				this.categoryForm={Depth:parseInt(this.Depth)+1,parent_id:this.id}
				this.showCategory=true;
			},
			editCategory(data){
				var {id,version,Depth,parent_id,icon,name,sort}=data;
				this.subcategoryTitle='编辑';
				this.categoryForm={id,version,Depth,parent_id,icon,name,sort}
				this.showCategory=true;
			},
			submitCategory(){
				this.$refs.categoryForm.validate(valid=>{
					if(valid){
						this.isSubmit2=true;
						var {id,version,icon,name,sort,Depth,parent_id}=this.categoryForm;
						var form={icon,name,sort,Depth,parent_id};
						if(id){//编辑
							form=Object.assign(form,{id,version});
							editCategory(form).then(res=>{
								this.isSubmit2=false;
								this.$message.success('操作成功');
								this.getCategoryList();
								this.showCategory=false;
							}).catch(error=>{
								this.isSubmit2=false;
							})
						}else{//新增
							addCategory(form).then(res=>{
								this.isSubmit2=false;
								this.$message.success('操作成功');
								this.getCategoryList();
								this.showCategory=false;
							}).catch(error=>{
								this.isSubmit2=false;
							})
						}
					}else{
						console.log('error submit!!');
						return false;
					}
				})
			},
			handleSubSuccess(res, file){
				if (res.code == 0) {
					this.$set(this.categoryForm, 'icon', res.datas)
				} else {
					this.$message.error('图片上传失败！请重新上传');
				}
			},
			changeSort(data,state){
				var {id,version,sort}=data;
				sort=state?sort+1:sort-1;
				var form={id,version,sort};
				editCategory(form).then(res=>{
					this.$message.success('操作成功');
					this.getCategoryList()
				})
			},
			remove(id){
				removeCategory({id:id}).then(res=>{
					this.$message.success('操作成功');
					this.getCategoryList()
				})
			}
		}
	}
</script>

<style lang="scss">
	#classEditPage {
		.avatar-uploader .el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}

		.avatar-uploader .el-upload:hover {
			border-color: #409EFF;
		}

		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 80px;
			height: 80px;
			line-height: 80px;
			text-align: center;
		}

		.avatar {
			width: 80px;
			height: 80px;
			display: block;
			object-fit: contain;
		}
	}
</style>
