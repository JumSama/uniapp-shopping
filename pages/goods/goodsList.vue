<template>
	<view>
		<!-- 排序 -->
		<view class="header">
			<view class="target" v-for="(target,index) in filterByList" @tap="changeSelected(index)" :key="index" :class="{'on':target.selected}">
				{{target.text}}
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in goodsData" :key="goods.goods_id" @tap="toGoodsDetail(goods)">
					<image mode="widthFix"  :src="goods.img"></image>
					<view class="name">{{goods.name}}</view>
					<view class="info">
						<view class="price"><text>￥</text>{{goods.price}}</view>
						<view class="slogan">{{goods.slogan}}<text>人付款</text></view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	import interfaces from '@/utils/interfaces.js'
	export default {
		onLoad(option) {
			// 动态修改navbarTitle
			uni.setNavigationBarTitle({
				title: option.name
			})
			this.loadData()
		},
		
		data() {
			return {
				goodsData: [],
				filterByList: [
					{text: "全部", selected: true, filterby: "all"},
					{text: "口碑", selected: false, filterby: "public"},
					{text: "热门", selected: false, filterby: "hot"}
				],
				filterBy: 'all',
				page: 1,
				size: 6,
				loadingText: '加载中...'
			}
		},
		
		methods: {
			// 初始化参数
			initGoodList() {
				this.page = 1
				loadingText: '加载中...'
				this.goodsData = []
				this.loadData()
			},
			// 选择
			changeSelected(index) {
				for(let item in this.filterByList) {
					if (item == index) {
						this.filterByList[item].selected = true
					} else {
						this.filterByList[item].selected = false
					}
				}
				this.filterBy = this.filterByList[index].filterby
				this.initGoodList()
			},
			
			// 数据获取
			async loadData() {
				const data = await this.request({
					url: `${ interfaces.getGoodList }/${ this.filterBy }/${ this.page }/${ this.size }`
				})
				if (data.length > 0) {
					data.forEach((good) => {
						this.goodsData.push(good)
					})
				} else {
					this.loadingText = '到底了...'
				}
			},
			
			// 上拉获取数据
			onPullDownRefresh() {
				setTimeout(() => {
					this.initGoodList();
					uni.stopPullDownRefresh();
				}, 1000)
			},
			
			onReachBottom() {
				this.page++
				this.loadData()
			},
			
			toGoodsDetail(goods) {
				uni.navigateTo({
					url: './goods?goodsInfo=' + JSON.stringify(goods)
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.header{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;
	.target{
		width: 20%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-bottom: -2upx;
		color: #aaa;
		
		&.on{
			color: #555;
			border-bottom: 4upx solid #f06c7a;
			font-weight: 600;
			font-size: 30upx;
		}
		.icon {
			font-size:26upx;
		}
	}
}
.place{
 background-color: #ffffff;
 height: 100upx;
}
.goods-list{
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 92%;
			padding: 0 4% 3vw 4%; 
			column-count:2;
			column-gap:1em;
			.product{
				break-inside: avoid;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 6upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical; // 
					-webkit-line-clamp: 2; // 指定显示多少行
					text-align: justify;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
					.slogan{
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
			
		}
	}
	
</style>
