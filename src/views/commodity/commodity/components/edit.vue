<template>
	<div id="componentsEditPage">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" :size="sizeHeader">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品信息</span>
					<el-button icon='el-icon-refresh-left' style="float: right; padding: 3px 0" type="text">刷新</el-button>
				</div>
				<div>
					<el-form-item label="标题" prop="title">
						<el-input v-model="form.title" placeholder="请输入标题" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="副标题" prop="title_sub">
						<el-input v-model="form.title_sub" placeholder="请输入副标题" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="商品名称" prop="name">
						<el-input v-model="form.name" placeholder="请输入商品名称" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="商品分类" prop="category_code">
						<el-cascader v-model="categoryList" :clearable="true" :show-all-levels="false" :props="props" @change="changeClass"
						 :style="{width: inputWidth+'px'}"></el-cascader>
					</el-form-item>
					<el-form-item label="商品编码" prop="product_code">
						<el-input disabled v-model="form.product_code" placeholder="请输入商品编码" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="市场价" prop="price_marketing">
						<el-input type="digit" v-model="form.price_marketing" @input="onMoneyInput(form.price_marketing,'price_marketing')"
						 placeholder="请输入商品的市场价" :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="销售价" prop="price_sale">
						<el-input type="digit" v-model="form.price_sale" @input="onMoneyInput(form.price_sale,'price_sale')" placeholder="请输入商品的销售价"
						 :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="供货价" prop="price_supply">
						<el-input type="digit" v-model="form.price_supply" @input="onMoneyInput(form.price_supply,'price_supply')"
						 placeholder="请输入商品的供货价" :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="供货商" prop="provider_id">
						<el-select v-model="form.provider_id" placeholder="请选择供货商" v-if="providerList" :style="{width: inputWidth+'px'}">
							<el-option :label="item.short_name" :value="item.id" v-for="item in providerList" :key="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-radio-group v-model="form.online">
							<el-radio :label="true">上架</el-radio>
							<el-radio :label="false">下架</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			</el-card>
			<Specs :code="form.product_code" :data="specsData" style="margin-top: 15px;" v-if="specsData"></Specs>
			<el-card style="margin-top: 15px;">
				<el-alert style="margin-bottom: 10px;" title="限上传一张缩略图,尺寸最佳为180x180像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="主缩略图" prop="product_main_pic">
					<el-upload accept="image/png, image/jpeg" class="avatar-uploader" :action="uploadApi" :show-file-list="false"
					 :with-credentials="true" :before-upload="beforeAvatarUpload1" :on-success="handleAvatarSuccess1">
						<img v-if="form.product_main_pic" :src="form.product_main_pic" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-alert style="margin-bottom: 10px;" title="限上传五张缩略图,尺寸最佳为640x640像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="轮播顶图" prop="slideList">
					<el-upload accept="image/png, image/jpeg" :action="uploadApi" :file-list="slideList" :multiple="true" :limit="5"
					 :on-exceed="onExceedUpload" :before-upload="beforeAvatarUpload1" :on-success="handleAvatarSuccess2" :on-remove="handleRemove"
					 list-type="picture-card">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-card>
			<el-card class="box-card" style="margin-top: 15px;">
				<div slot="header" class="clearfix">
					<span>商品详情</span>
				</div>
				<Tinymce ref="editor" v-model="detailForm.detail" :height="400" />
			</el-card>
			<el-card class="box-card" style="margin-top: 15px;">
				<div slot="header" class="clearfix">
					<span>商品标签</span>
				</div>
				<el-form-item label="标签名称">
					<el-tag size="medium" :key='tag' closable @close="closeTag(index)" v-for="(tag,index) in form.product_tags">{{tag}}</el-tag>
					<el-button size="mini" style="margin-left: 10px;" icon="el-icon-plus" @click="addTag">新增标签</el-button>
				</el-form-item>
				<el-alert style="margin-bottom: 10px;" title="限上传一张轮播图,尺寸最佳为180x180像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="标签主图" prop="product_tag_icons">
					<el-upload accept="image/png, image/jpeg" class="avatar-uploader" :action="uploadApi" :show-file-list="false"
					 :with-credentials="true" :before-upload="beforeAvatarUpload1" :on-success="handleAvatarSuccess3">
						<img v-if="form.product_tag_icons[0]" :src="form.product_tag_icons[0]" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-card>
			<el-form-item style='margin-top: 15px;text-align: center;'>
				<el-button :loading="isSubmit" type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import {
		getProcuctInfo,
		getProcuctDetail,
		editProcuctInfo,
		addOrEditProcuctDetail,
		getProcuctCode
	} from '@/api/commodity/commodity'
	import {
		getCategoryList
	} from '@/api/commodity/class'
	import {
		toMoneyStr,
		checkMoney,
		deepClone
	} from '@/utils'
	import Tinymce from '@/components/Tinymce'
	import Specs from './specs.vue'
	export default {
		components: { Tinymce,Specs },
		computed: {
			...mapGetters(['sizeHeader', 'uploadApi', 'uploadsApi']),
			...mapState({
				providerList: state => state.data.providerList
			})
		},
		data() {
			var slideList = (rule, value, callback) => {
				if (this.slideList.length==0) {
					callback(new Error('请至少上传一张轮播图'));
				} else {
					callback();
				}
			};
			return {
				inputWidth: 300,
				id: null, //商品id
				specsData:null,
				form: {
					online: false,
					product_main_pic: null,
					product_tags: [],
					category_code: '',
					product_tag_icons:[],
					product_code:''
				},
				detailForm:{},
				categoryList: [],
				slideList: [],
				isSubmit: false,
				props: {
					lazy: true,
					lazyLoad(node, resolve) {
						const {
							level,
							data
						} = node;
						getCategoryList({
							asc: ['sort'],
							where: [{
								k: 'parent_id',
								v: data ? data.id : 0,
								op: '='
							}]
						}).then(res => {
							const nodes = res.datas.map(item => ({
								value: item.code,
								id: item.id,
								label: item.name,
								leaf: level >= 2
							}))
							resolve(nodes);
						})
					}
				},
				rules: {
					title: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}],
					title_sub: [{
						required: true,
						message: '请输入副标题',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					category_code: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}],
					product_code: [{
						required: true,
						message: '请输入商品编码',
						trigger: 'blur'
					}],
					price_marketing: [{
						required: true,
						message: '请输入商品的市场价',
						trigger: 'blur'
					}],
					price_sale: [{
						required: true,
						message: '请输入商品的销售价',
						trigger: 'blur'
					}],
					price_supply: [{
						required: true,
						message: '请输入商品的供货价',
						trigger: 'blur'
					}],
					provider_id: [{
						required: true,
						message: '请选择供货商',
						trigger: 'blur'
					}],
					provider_id: [{
						required: true,
						message: '请选择供货商',
						trigger: 'blur'
					}],
					product_main_pic: [{
						required: true,
						message: '请先上传缩略图',
						trigger: 'blur'
					}],
					slideList: [{
						validator: slideList,
						trigger: 'blur'
					}],
					product_tag_icons: [{
						type: 'array',
						required: true,
						message: '请先上传标签主图',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getProcuctInfo()
			}else{
				this.specsData=[],
				//获取新增商品的code
				getProcuctCode().then(res=>{
					this.form.product_code=res.datas;
				})
			}
		},
		methods: {
			getProcuctInfo() {
				getProcuctInfo({
					id: this.id
				}).then(res => {
					var {
						id,
						version,
						title,
						title_sub,
						name,
						online,
						category,
						product_code,
						price_marketing,
						price_sale,
						price_supply,
						provider_id,
						product_tags,
						product_main_pic,
						product_slide_pic,
						category_code,
						product_tag_icons,
						product_detail_id,
						skus
					} = res.datas;
					//商品规格数据处理
					this.handleSpecs(skus);
					//商品分类切割
					if (category_code) {
						this.categoryList = [category_code.slice(0, 4), category_code.slice(0, 8), category_code];
					}
					//价格转换
					price_marketing = toMoneyStr(price_marketing)
					price_sale = toMoneyStr(price_sale)
					price_supply = toMoneyStr(price_supply)
					this.slideList = product_slide_pic.map(function(item, index, input) {
						return {
							name: index,
							url: item
						}
					})
					this.form = {
						id,
						version,
						title,
						title_sub,
						name,
						online,
						category,
						product_code,
						price_marketing,
						price_sale,
						price_supply,
						provider_id,
						product_tags,
						product_main_pic,
						category_code,
						product_tag_icons:product_tag_icons?product_tag_icons:[]
					}
					this.getProcuctDetail(product_detail_id)
				})
			},
			getProcuctDetail(id){
				getProcuctDetail({
					id: id
				}).then(res => {this.detailForm=res.datas})
			},
			//商品规格数据处理
			handleSpecs(list){
				this.specsData=list;
			},
			onMoneyInput(e, keyName) {
				this.form[keyName] = checkMoney(e);
			},
			//上传主缩略图
			beforeAvatarUpload1(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传主缩略图大小不能超过 2MB!');
				}
				return isLt2M;
			},
			handleAvatarSuccess1(res, file) {
				if (res.code == 0) {
					this.$set(this.form, 'product_main_pic', res.datas)
				} else {
					this.$message.error('图片上传失败！请重新上传');
				}
			},
			//轮播图上传
			onExceedUpload(files, fileList) {
				this.$message.warning('仅限上传五张轮播图');
			},
			handleAvatarSuccess2(res, file, fileList) {
				var i;
				if (res.code != 0) { //失败
					for (i = 0; i < fileList.length; i++) {
						if (fileList[i].uid == file.uid) {
							fileList.splice(i, 1);
							break;
						}
					}
				}
				this.slideList = fileList;
			},
			handleRemove(file, fileList) {
				this.slideList = fileList;
			},
			//处理标签
			closeTag(index) {
				this.form.product_tags.splice(index, 1)
			},
			addTag() {
				this.$prompt('标签名称', '新增标签', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /\S/,
					inputErrorMessage: '名称不能为空'
				}).then(({
					value
				}) => {
					this.form.product_tags.push(value)
					this.$message.success('新增成功');
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消新增'
					});
				})
			},
			handleAvatarSuccess3(res, file) {
				if (res.code == 0) {
					this.$set(this.form.product_tag_icons, 0, res.datas)
				} else {
					this.$message.error('图片上传失败！请重新上传');
				}
			},
			//提交信息
			handleSlideList() {
				var list = [],
					i;
				for (i = 0; i < this.slideList.length; i++) {
					if (this.slideList[i].response) {
						list.push(this.slideList[i].response.datas)
					} else {
						list.push(this.slideList[i].url)
					}
				}
				return list;
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.isSubmit = true;
						this.addOrEditDetail();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			//新增或编辑详情
			addOrEditDetail(){
				var {id,detail,version}=this.detailForm;
				var form={detail}
				if(id){//编辑
					form.id=id;
					form.version=version;
				}
				addOrEditProcuctDetail(form).then(res=>{
					this.detailForm=res.datas;
					this.addOrEditProcuct();
				}).catch(error=>{
					this.isSubmit=false;
				})
			},
			//新增或编辑商品信息
			addOrEditProcuct(){
				var {id,version,title,title_sub,name,category_code,product_code,price_marketing,price_sale,price_supply,provider_id,online,product_main_pic,product_slide_pic,product_tags,product_tag_icons}=this.form;
				//价格转换
				price_marketing*=100;
				price_sale*=100;
				price_supply*=100;
				//轮播图筛选
				product_slide_pic=this.handleSlideList()
				var form={title,title_sub,name,category_code,product_code,price_marketing,price_sale,price_supply,provider_id,online,product_main_pic,product_slide_pic,product_tags,product_tag_icons};
				if(id){//编辑
					form.id=id;
					form.version=version;
				}else{//新增
					form.product_detail_id=this.detailForm.id;
				}
				editProcuctInfo(form).then(res=>{
					this.isSubmit=false;
					this.$message.success('操作成功');
					this.cancel();
				}).catch(error=>{
					this.isSubmit=false;
				})
			},
			cancel() {
				this.$router.push({
					path: '/commodity/commodity/list'
				})
			},
			//修改商品分类
			changeClass(e) {
				this.form.category_code = e[e.length - 1];
			}
		}
	}
</script>

<style lang="scss">
	#componentsEditPage {
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
			width: 100px;
			height: 100px;
			line-height: 100px;
			text-align: center;
		}

		.avatar {
			width: 100px;
			height: 100px;
			display: block;
			object-fit: contain;
		}

		.el-upload--picture-card {
			width: 100px;
			height: 100px;
			line-height: 100px;
		}

		.el-upload-list--picture-card .el-upload-list__item {
			width: 100px;
			height: 100px;

			img {
				object-fit: contain;
			}
		}

		.el-tag+.el-tag {
			margin-left: 10px;
		}
	}
</style>
