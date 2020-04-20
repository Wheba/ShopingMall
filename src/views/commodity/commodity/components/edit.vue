<template>
	<div id="componentsEditPage">
		<el-form ref="form" :model="form" label-width="80px" :size="sizeHeader">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品详情</span>
					<el-button icon='el-icon-refresh-left' style="float: right; padding: 3px 0" type="text">刷新</el-button>
				</div>
				<div>
					<el-form-item label="商品名称">
						<el-input v-model="form.name" placeholder="请输入商品名称" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="商品分类">
						<el-input v-model="form.category" placeholder="请输入商品分类" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="商品编码">
						<el-input v-model="form.product_code" placeholder="请输入商品编码" :style="{width: inputWidth+'px'}"></el-input>
					</el-form-item>
					<el-form-item label="市场价">
						<el-input type="digit" v-model="form.price_marketing" @input="onMoneyInput(form.price_marketing,'price_marketing')"
						 placeholder="请输入商品的市场价" :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="销售价">
						<el-input type="digit" v-model="form.price_sale" @input="onMoneyInput(form.price_sale,'price_sale')" placeholder="请输入商品的销售价"
						 :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="供货价">
						<el-input type="digit" v-model="form.price_supply" @input="onMoneyInput(form.price_supply,'price_supply')"
						 placeholder="请输入商品的供货价" :style="{width: inputWidth+'px'}">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="供货商">
						<el-select v-model="form.provider_id" placeholder="请选择供货商" v-if="providerList" :style="{width: inputWidth+'px'}">
							<el-option :label="item.short_name" :value="item.id" v-for="item in providerList" :key="item.id"></el-option>
						</el-select>
					</el-form-item>
				</div>
			</el-card>
			<el-card style="margin-top: 15px;">
				<el-alert style="margin-bottom: 10px;" title="限上传一张缩略图,尺寸最佳为180x180像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="主缩略图">
					<el-upload class="avatar-uploader" :action="uploadApi" :show-file-list="false" :with-credentials="true">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-alert style="margin-bottom: 10px;" title="限上传五张缩略图,尺寸最佳为640x640像素" type="info" show-icon :closable="false"></el-alert>
				<el-form-item label="轮播顶图">
					<el-upload :action="uploadsApi" list-type="picture-card">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-card>
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
		getProcuctDetail
	} from '@/api/commodity/commodity'
	import {
		toMoneyStr,
		checkMoney
	} from '@/utils'
	export default {
		computed: {
			...mapGetters(['sizeHeader', 'uploadApi',"uploadsApi"]),
			...mapState({
				providerList: state => state.data.providerList
			})
		},
		data() {
			return {
				inputWidth: 300,
				id: null, //商品id
				form: {},
				imageUrl: ''
			}
		},
		created() {
			this.id = this.$route.query.id;
			if (this.id) { //编辑
				this.getProcuctInfo()
			} else { //新增

			}
		},
		methods: {
			getProcuctInfo() {
				getProcuctDetail({
					id: this.id
				}).then(res => {})
				getProcuctInfo({
					id: this.id
				}).then(res => {
					var {
						name,
						category,
						product_code,
						price_marketing,
						price_sale,
						price_supply,
						provider
					} = res.datas;
					//价格转换
					price_marketing = toMoneyStr(price_marketing)
					price_sale = toMoneyStr(price_sale)
					price_supply = toMoneyStr(price_supply)
					var provider_id = provider.id;
					this.form = {
						name,
						category,
						product_code,
						price_marketing,
						price_sale,
						price_supply,
						provider_id
					}
				})
			},
			onMoneyInput(e, keyName) {
				this.form[keyName] = checkMoney(e);
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
		}
		.el-upload--picture-card{
			width: 100px;
			height: 100px;
			line-height: 100px;
		}
	}
</style>
