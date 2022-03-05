<template>
	<view class="">
		<!-- 状态栏解决ios android -->
		<page-status></page-status>
		
		<!-- 头部 -->
		<goods-header></goods-header>
		
		<!-- swiper -->
		<view class="swiper-box">
			<swiper autoplay="true" circular="true" @change="changeCurrentSwiper">
				<swiper-item v-for="(swiper, index) in goodsData.swiperList" :key="swiper.id">
					<image :src="swiper.img" style="width: 100%;height: 100%;" mode=""></image>
				</swiper-item>
			</swiper>
			<view class="indicator">
				{{currentSwiper + 1}}/{{goodsData.swiperList.length}}
			</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="price">￥{{goodsInfo.price}}</view>
			<view class="title">
				{{goodsInfo.name}}
			</view>
		</view>
		<!-- 选择规格 -->
		<view class="info-box">
			<view class="row" @tap="spaceInfo.showSpace = true">
				<view class="text">选择</view>
				<view class="content">
					<view>选择规格：</view>
					<view class="sp">
						<view v-for="(item,index) in goodsData.spec" :key="index" :class="{'on':item==goodsInfo.spec}">{{item}}</view>
					</view>
				</view>
				<view class="arrow"><view class="icon iconfont">&#xe6a3;</view></view>
			</view>
		</view>
		<!-- 模态框 -->
		<popup-spec :goodsData="goodsData" :goodsInfo='goodsInfo' :spaceInfo='spaceInfo' @changeShowSpace="changeShowSpace" @changeSpec="changeSpec" @changeNum="changeNum"></popup-spec>
		<!-- 评价 -->
		<view class="info-box comments">
			<view class="row">
				<view class="text">商品评价({{goodsData.comment.length}})</view>
				<view class="arrow" @tap="toRatings">
					<view class="show">
						查看全部
						<view class="icon iconfont">&#xe6a3;</view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="toRatings">
				<view class="user-info">
					<view class="face"><image :src="goodsData.comment[0].face"></image></view>
					<view class="username">{{goodsData.comment[0].username}}</view>
				</view>
				<view class="content">
					{{goodsData.comment[0].content}}
				</view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content"><rich-text :nodes="goodsData.descriptionStr"></rich-text></view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box">
					<view class="icon iconfont">&#xe7e0;</view>
					<view class="text">分享</view>
				</view>
				<view class="box" @tap="keep">
					<view class="icon iconfont" v-if="isKeep">&#xe64b;</view>
					<view class="icon iconfont" v-else>&#xe64c;</view>
					<view class="text">{{isKeep?'已':''}}收藏</view>
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="buy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsHeader from './goodsHeader.vue'
	import interfaces from '@/utils/interfaces.js'
	import popupSpec from './popupSpec.vue'
	export default {
		components: {
			goodsHeader,
			popupSpec
		},
		data() {
			return {
				goodsInfo: {
					name: "",
					price: "",
					number: 1, // 数量
					spec: "" // 规格
				},
				goodsData: {
					swiperList: [],
					spec: [],
					comment: [],
					descriptionStr: ""
				},
				spaceInfo: {
					showSpace: false // 是否展示选择规格遮罩
				},
				currentSwiper: 0,
				isKeep: false // 是否收藏
			}
		},
		onLoad(option) {
			this.goodsInfo = JSON.parse(option.goodsInfo); // 获取跳转传过来的参数
			this.initData()
		},
		methods: {
			async initData() {
				// 请求数据
				const data = await this.request({ url: interfaces.getGoods })
				data.swiperList.forEach((el) => {
					el.img = 'https://static-tapad.tapdb.net/NDIyMTQ1NDJANjFkZjlhYmU0NzFhYQ.jpg?imageView2/0/w/1920/q/80/format/jpg/interlace/1/ignore-error/1';
				})
				data.descriptionStr = "<img width=\"100%\" height=\"600px\" src='https://static-tapad.tapdb.net/NDIyMTQ1NDJANjFkZjlhYmU0NzFhYQ.jpg?imageView2/0/w/1920/q/80/format/jpg/interlace/1/ignore-error/1' >";
				this.goodsData = data
				
				// 收藏初始化
				const store = uni.getStorageSync('g_col')
				if (store.includes(this.goodsInfo.name)) {
					this.isKeep = true
				}
				
			},
			// 切换当前轮播图索引
			changeCurrentSwiper(e) {
				this.currentSwiper = e.detail.current
			},
			// 弹出尺码等选择窗口
			changeShowSpace(payload) {
				this.spaceInfo.showSpace = payload
			},
			// 改变尺码
			changeSpec(payload) {
				this.goodsInfo.spec = payload
			},
			// 打开所有评论窗口
			toRatings() {
				uni.setStorageSync('comments', this.goodsData.comment)
				uni.navigateTo({
					url: './ratings'
				})
			},
			// 选择商品数量
			changeNum(operator){
				operator == 'add' ? this.goodsInfo.number++ : this.goodsInfo.number--;
			},
			// 是否收藏
			keep() {
				// 没有后端支持 存入本地存储
				try{
					// 判断本地有无收藏列表
					const data = uni.getStorageSync('g_col')
					if (data == '') {
						console.log('创建了')
						uni.setStorageSync('g_col', [])
					}
					
					// 如果已收藏则移除
					if (this.isKeep) {
						const store = uni.getStorageSync('g_col')
						const filterStore = store.filter(el => {
							return el.name !== this.goodsData.na
						})
						uni.setStorageSync('g_col', filterStore)
						this.isKeep = false
					} else {
						const store = uni.getStorageSync('g_col')
						store.push(this.goodsInfo.name)
						uni.setStorageSync('g_col', store)
						this.isKeep = true
					}
				}catch(e){
					uni.showModal({
						content: e.message
					})
				}
			},
			// 加入购物车
			joinCart() {
				uni.getStorage({
					key: 'g_cart',
					success: (res) => {
						// 寻找有无相同商品
						const flag = res.data.some((goods, index) => {
							if (goods.goods_id == this.goodsInfo.goods_id) {
								// 已经在购物车刷新下数据
								console.log('相同商品更新数据')
								res.data[index] = this.goodsInfo
								return true
							}
							return false
						})
						// 如果没有相同的商品直接push进去
						if (!flag) {
							res.data.push(this.goodsInfo)
						}
						uni.setStorageSync('g_cart', res.data)
						console.log(uni.getStorageSync('g_cart'))
					},
					fail: (err) => {
						const cart = [this.goodsInfo]
						uni.setStorageSync('g_cart', cart)
					}
				})
			},
			// 立即购买
			buy() {
				console.log('购买')
			}
			
		}
		
	}
</script>
<style lang="scss" scoped>
.status{
	/*  #ifdef  APP-PLUS  */
	opacity: 0;
	/*  #endif  */
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
	swiper {
		width: 100%;
		height: 100vw;
		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}
	.indicator{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}
.info-box {
	width: 92%;
	padding: 20upx 4%;
	background-color: #fff;
	margin-bottom: 20upx;
}
.goods-info {
	.price {
		font-size: 46upx;
		font-weight: 600;
		color: #f47925;
	}
	.title {
		font-size: 30upx;
	}
}
.row {
	width: 100%;
	display: flex;
	align-items: center;
	margin: 0 0 30upx 0;
	.text {
		font-size: 28upx;
		color: #a2a2a2;
		margin-right: 20upx;
	}
	.content {
		font-size: 28upx;
		display: flex;
		flex-wrap: wrap;
		.serviceitem{
			margin-right: 10upx;
		}
		.sp {
			width: 100%;
			display: flex;
			view {
				background-color: #f6f6f6;
				padding: 10upx;
				color: #999;
				margin-right: 10upx;
				font-size: 20upx;
				border-radius: 5upx;
				&.on{
					border: solid 1upx #f47952;
					padding: 4upx 8upx;
				}
			}
		}
	}
	.arrow {
		position: absolute;
		right: 4%;
		.icon {
			color: #ccc;
		}
	}
}
.comments {
	.row {
		width: 100%;
		height: 40upx;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 30upx;
		}
		.arrow {
			font-size: 28upx;
			position: absolute;
			right: 4%;
			color: #17e6a1;
			.show {
				display: flex;
				align-items: center;
				.icon {
					color: #17e6a1;
				}
			}
		}
	}
	.comment {
		width: 100%;
		.user-info {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			.face {
				width: 40upx;
				height: 40upx;
				margin-right: 8upx;
				image {
					width: 40upx;
					height: 40upx;
					border-radius: 100%;
				}
			}
			.username {
				font-size: 24upx;
				color: #999;
			}
		}
		.content {
			margin-top: 10upx;
			font-size: 26upx;
		}
	}
}
.description {
	.title {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #999;
	}
}
.footer {
	position: fixed;
	bottom: 0upx;
	width: 92%;
	padding: 0 4%;
	height: 99upx;
	border-top: solid 1upx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.icons {
		display: flex;
		height: 80upx;
		margin-left: -4%;
		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.icon {
				font-size: 40upx;
				color: #828282;
			}
			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}
	.btn {
		height: 80upx;
		border-radius: 40upx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;
		.joinCart,
		.buy {
			height: 80upx;
			padding: 0 40upx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 28upx;
		}
		.joinCart {
			background-color: #f0b46c;
		}
		.buy {
			background-color: #f06c7a;
		}
	}
}
</style>