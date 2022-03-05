<template>
	<view>
		<!-- 购物列表 -->
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0">购物车空空如也~</view>
			<view class="row" v-for="(row,index) in goodsList" :key="index" >
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteGoods(row)">
					<view class="icon iconfont">&#xe6a6;</view>
				</view>
				
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(row)">
						<view class="checkbox">
							<view :class="{'on':row.selected}"></view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(row)">
						<view class="img">
							<image :src="row.img"></image>
						</view>
						<view class="info">
							<view class="title">{{row.name}}</view>
							<view class="spec">{{row.spec}}</view>
							<view class="price-number">
								<view class="price">￥{{row.price}}</view>
								<counter :goodsInfo="row" @change='sum' @changeNum="changeNum"></counter>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="{'on':isAllselected}"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view></view>
				<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import counter from '@/pages/goods/counter.vue'
	export default {
		data() {
			return {
				goodsList:[],
				theIndex:null,//控制滑动效果
				oldIndex:null, // 上一个左滑的下标
				isStop:false, // 禁止触发滑动
				selectedList:[], // 选中的商品列表
				isAllselected:false, //是否全选
				sumPrice:'0.00', // 合计
				footerbottom: 0
			};
		},
		components:{
			counter
		},
		onLoad() {
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
		},
		onShow() {
			uni.getStorage({
				key:'g_cart',
				success: (res=> {
					for(let i=0;i<res.data.length;i++){
						res.data[i].selected = false
					}
					this.goodsList = res.data
					// 初始化数据
					this.selectedList = []
					this.isAllselected = false
					this.sumPrice = '0.00'
				})
			})
		},
		methods:{
			// 控制商品数量
			changeNum(payload, gId) {
				const cart = uni.getStorageSync('g_cart')
				cart.forEach((goods, index) => {
					if (goods.goods_id == gId) {
						// this.goodsList[index].number
						if (payload == 'add') {
							cart[index].number += 1
							this.goodsList[index].number++
						} else {
							cart[index].number -= 1
							this.goodsList[index].number--
						}
					}
				})
				uni.setStorageSync('g_cart', cart)
				this.sum()
			},
			
			toGoods(e){
				uni.navigateTo({
					url: '../../goods/goods?goodsInfo='+ JSON.stringify(e)
				});
			},
			
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				// 移动位置
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				// 滑动停止或移动位置小 不触发
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){ // 左滑
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){ // 右滑
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			deleteGoods(row){ // 滑动删除
			    // 更新 Storage
				uni.getStorage({
					key:'goodsList',
					success: (res=> {
						res.data.splice(res.data.indexOf(row), 1);
						uni.setStorageSync('g_cart', res.data)
					})
			    })
				// 更新数组
				this.goodsList.splice(this.goodsList.indexOf(row), 1);
				this.selectedList.splice(this.selectedList.indexOf(row), 1);
				// 全部删除取消全选状态
				this.isAllselected = this.goodsList.length>0? this.isAllselected : false;
				this.sum();
				this.oldIndex = null;
				this.theIndex = null;
			},
			deleteList(){ // 删除选中商品
				while (this.selectedList.length>0){ // 循环删除
					this.deleteGoods(this.selectedList[0]);
				}
				this.selectedList = [];
				this.isAllselected = false;
				this.sum();
			},
			selected(row){ // 单选
				row.selected = !row.selected;
				let i = this.selectedList.indexOf(row); // 数组中是否包含
				i>-1?this.selectedList.splice(i, 1):this.selectedList.push(row); // 包含取消选中删除否则添加
				this.isAllselected = this.selectedList.length == this.goodsList.length ; // 是否全选
				this.sum();
			},
			allSelect(){ // 全选
				this.isAllselected = !this.isAllselected;
				let arr = [];
				this.goodsList.forEach((item, i)=>{
					item.selected = this.isAllselected;
					arr.push(item);
				})
				this.selectedList = this.isAllselected?arr:[]; // 选中数组
				this.sum();
			},
			sum(){ // 合计
				this.sumPrice=0;
				this.goodsList.forEach((item, i)=>{
					if(item.selected) {
						this.sumPrice = this.sumPrice + (item.number*item.price);
					}
				})
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			toConfirmation(){ // 结算
				console.log(this.selectedList.length)
				if(this.selectedList.length<1){
					uni.showToast({
						title:'请选择商品结算',
						icon:'none'
					});
					return ;
				}
				uni.setStorage({
					key:'confirmList',
					data:this.selectedList,
					success: () => {
						uni.navigateTo({
							url:'../../order/confirm'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.checkbox-box{
	display: flex;
	align-items: center;
	.checkbox{
		width: 35upx;
		height: 35upx;
		border-radius: 100%;
		border: solid 2upx #f06c7a;
		display: flex;
		justify-content: center;
		align-items: center;
		.on{
			width: 25upx;
			height: 25upx;
			border-radius: 100%;
			background-color: #f06c7a;
		}
	}
	.text{
		font-size: 28upx;
		margin-left: 10upx;
	}
}
.goods-list{
	width: 100%;
	padding: 20upx 0 120upx 0;
	.tis{
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		color: #a7a7a7;
	}
	.row{
		width: calc(92%);
		height: calc(22vw + 40upx); 
		margin: 20upx auto;
		
		border-radius: 15upx;
		box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.menu{
			.icon{
				color: #fff;
				font-size: 60upx;
			}
			position: absolute;
			width: 30%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: red;
			color: #fff;
			z-index: 2;
		}
		
		.carrier{
			@keyframes showMenu {
				0% {transform: translateX(0);}100% {transform: translateX(-30%);}
			}
			@keyframes closeMenu {
				0% {transform: translateX(-30%);}100% {transform: translateX(0);}
			}
			&.open{
				animation: showMenu 0.25s linear both;
			}
			&.close{
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			.checkbox-box{
				padding-left: 20upx;
				flex-shrink: 0;
				height: 22vw;
				margin-right: 20upx;
			}
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;

			.goods-info{
				width: 100%;
				display: flex;
				padding-right: 20upx;
				.img{
					width: 22vw;
					height: 22vw;
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10upx;
					image{
						width: 22vw;
						height: 22vw;
					}
				}
				.info{
					width: 100%;
					height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;
					.title{
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}
					.spec{
						font-size: 20upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						height: 30upx;
						display: flex;
						align-items: center;
						padding: 0 10upx;
						border-radius: 15upx;
						margin-bottom: 20vw;
					}
					.price-number{
						position: absolute;
						width: 100%;
						bottom: 0upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 60upx;
						.price{
						}
						
					}
				}
			}
		}
	}
}
.footer{
	width: 92%;
	padding: 0 4%;
	background-color: #fbfbfb;
	height: 100upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28upx;
	position: fixed;
	bottom: 0upx;
	z-index: 5;
	.delBtn{
		border: solid 1upx #f06c7a;
		color: #f06c7a;
		padding: 0 30upx;
		height: 50upx;
		border-radius: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.settlement{
		width: 60%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.sum{
			width: 50%;
			font-size: 28upx;
			margin-right: 10upx;
			display: flex;
			justify-content: flex-end;
			.money{
				font-weight: 600;
			}
		}
		.btn{
			padding: 0 30upx;
			height: 50upx;
			background-color: #f06c7a;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			
			border-radius: 30upx;
		}
	}
}
</style>
