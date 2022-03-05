function requestModel(params) {
	let _url = params.url
	let _method = params.method && params.method.toUpperCase() || 'GET'
	let _header = params.header || {}
	let _data = params.data || {}
	
	if (_method == "POST") {
		// 按照后端返回数据的类型 灵活设置
		_header = {"content-type":"application/x-www-form-urlencoded"}
	}
	
	if (!params.hideLoading) {
		uni.showLoading({
			title: "加载中..."
		})
	}
	
	// 提取成独立函数方便递归回调
	const request = (resolve, reject) => {
		uni.request({
		    url: _url,
		    data: _data,
			method: _method,
			header: _header,
		    success: (res) => {
				// 可以补充statusCode不为200的情况
				resolve(res.data.data)
		    },
			fail: async (err) => {
				const data = await uni.showModal({ content: '请求错误是否重新请求?' })
				// 如果点击确认则重新发送请求
				if (data[1].confirm) request(resolve, reject);
			},
			complete: () => {
				uni.hideLoading()
			}
		});
	}
	
	return new Promise((resolve, reject) => {
		// uni.request({
		//     url: _url,
		//     data: _data,
		// 	method: _method,
		// 	header: _header,
		//     success: (res) => {
		// 		// if (res.statusCode && res.statusCode != 200) {
		// 		// 	reject()
		// 		// }
		// 		resolve(res.data.data)
		//     },
		// 	fail: (err) => {
		// 		uni.showModal({
		// 			content: '请求错误是否重新请求?'
		// 		})
		// 	},
		// 	complete: () => {
		// 		uni.hideLoading()
		// 	}
		// });
		request(resolve, reject);
	})
}

export default requestModel;

