<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/static/iconfont/iconfont.css';
	// 设置整个项目的背景色
	page {
		background-color: #FFFFFF;
		position: relative;
	}

</style>
