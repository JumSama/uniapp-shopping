// 接口文件

// 配置接口根路径
const domain = "https://uniapp-interface.herokuapp.com/";

const interfaces = {
	// 轮播图接口
	getMallData: domain + "api/profiles/mall_list",
	// 分类数据接口
	getCategory: domain + "api/profiles/category",
	// 商品列表
	getGoodList: domain + "api/profiles/goodslist",
	// 商品详情
	getGoods: domain + "api/profiles/goods"
}

module.exports = interfaces