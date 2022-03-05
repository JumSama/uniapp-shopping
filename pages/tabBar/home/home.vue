<template>
	<view>
		<!-- APP兼容状态栏 -->
		<page-status></page-status>
		
		<!-- 头部导航栏 -->
		<page-header></page-header>
		
		<!-- 轮播图 -->
		<view class="swiper">
			<swiper circular="true" :autoplay="true" @change="changeCurrentSwiperIdx">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper.img" style="width: 100%; height: 100%;" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="dots">
				<view class="dot" :class="{'dot-on': currentSwiperIdx >= index}" v-for="(swiper, index) in swiperList" :key="index"></view>
			</view>
		</view>
		
		<!-- 分类列表 -->
		<view class="category-list">
			<view
				class="category"
				v-for="(row, index) in categoryList"
				:key="index"
				@tap="toCategory(row)"
			>
				<view class="img"><image :src="row.img"></image></view>
				<view class="text">{{ row.name }}</view>
			</view>
		</view>
		
		<!-- 广告图 -->
		<view v-if="promotion.length > 0" class="banner">
		  <image src="/static/img/category/ad.jpg"></image>
		</view>
		<!-- 活动区 -->
		<view class="promotion" v-if="promotion.length > 0">
			<view class="text">优惠活动</view>
			<view class="list">
				<view
					class="column"
					v-for="(row, index) in promotion"
					@tap="toPromotion(row)"
					:key="index"
				>
					<view class="top">
						<view class="title">{{ row.title }}</view>
					</view>
					<view class="left">
						<view class="ad">{{ row.ad }}</view>
						<view class="into">点击进入</view>
					</view>
					<view class="right"><image :src="row.img"></image></view>
				</view>
			</view>
		</view>
		<view class="" style="height: 40vh;">
			
		</view>
	</view>
</template>

<script>
	import interfaces from '@/utils/interfaces.js'
	export default {
		data() {
			return {
				swiperList: [], // 轮播图
				categoryList: [], //分类
				promotion: [] ,//活动
				currentSwiperIdx: 0
			}
		},
		onLoad() {
			this.initData()
		},
		methods: {
			// 初始化数据
			async initData(){
				const data = await this.request({url: interfaces.getMallData})
				console.log(data)
				this.swiperList = data.swiperList
				this.categoryList = data.categoryList
				this.promotion = data.promotion	
			},
			
			// 轮播图
			changeCurrentSwiperIdx(e) {
				this.currentSwiperIdx = e.detail.current
			},
			
			// 分类菜单点击跳转
			toCategory(raw) {
				uni.navigateTo({
					url: '../../goods/goodsList?name=' + raw.name
				})
			},
			
			// 推荐商品跳转
			toPromotion(raw) {
				uni.showToast({ title: e.title, icon: 'none' });
			},
		}
	}
</script>

<style lang="scss" scoped>
.swiper {
	margin: 24upx;
	border-radius: 24upx;
	overflow: hidden;
	box-shadow: 0upx 0upx 8upx #666666;
	position: relative;
}

.dots {
	position: absolute;
	bottom: 24upx;
	left: 24upx;
	display: flex;
	flex-direction: row;
}

.dot {
	width: 64upx;
	height: 4upx;
	background-color: rgba(230, 230, 230, 0.5);
	z-index: 999;
}

.dot-on {
	background-color: #FFFFFF;
}

.category-list {
	width: 92%;
	margin: 0 4%;
	padding: 0 0 30upx 0;
	border-bottom: solid 2upx #f6f6f6;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.category {
		width: 25%;
		margin-top: 50upx;
		display: flex;
		flex-wrap: wrap;
		.img {
			width: 100%;
			display: flex;
			justify-content: center;
			image {
				width: 11vw;
				height: 11vw;
			}
		}
		.text {
			margin-top: 16upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24upx;
			color: #3c3c3c;
		}
	}
}

.banner {
	width: 92%;
	margin: 40upx 4%;
	image {
		width: 100%;
		height: 36vw;
		border-radius: 4upx;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
	}
}

.promotion {
	width: 92%;
	margin: 10upx 4% 30upx 4%;
	.text {
		width: 100%;
		height: 60upx;
		font-size: 34upx;
		font-weight: 600;
		margin: 10upx;
	}
	.list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.column {
			width: 43%;
			padding: 15upx 3%;
			background-color: #ebf9f9;
			border-radius: 10upx;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.top {
				width: 100%;
				height: 40upx;
				display: flex;
				align-items: center;
				margin-bottom: 5upx;
				.title {
					font-size: 30upx;
				}	
			}
			.left {
				width: 50%;
				height: 18.86vw;
				display: flex;
				flex-wrap: wrap;
				align-content: space-between;
				.ad {
					margin-top: 5upx;
					width: 100%;
					font-size: 22upx;
					color: #acb0b0;
				}
				.into {
					width: 100%;
					font-size: 24upx;
					color: #aaa;
					margin-bottom: 5upx;
				}
			}
			.right {
				width: 18.86vw;
				height: 18.86vw;
				image {
					width: 18.86vw;
					height: 18.86vw;
				}
			}
		}
	}
}


</style>
