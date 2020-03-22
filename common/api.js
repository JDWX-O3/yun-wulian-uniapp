//判断登陆设备
//#ifdef H5
var device_type = 'web'
//#endif

//#ifdef APP-PLUS
var device_type = 'mobile'
//#endif

//#ifdef MP
var device_type = 'wxapp'
//#endif

var app = getApp();
//必须的是https的协议才行，使用http调试是可以的，但关闭调试开关后，将无法登录
//var host = "https://yun.jdwanxiang.com";//替换为自己的域名,小程序需要https
//var host = "https://dsjiaqi.cn";//替换为自己的域名,小程序需要https
var host = "http://localhost";//替换为自己的域名,小程序需要https

module.exports = {	
	HOST: host,
	API_ROOT: host + '/api/',
	DeviceType: device_type,
	post(options) {
		options.method = 'POST';
		this.request(options);
	},
	delete(options) {
		options.method = 'DELETE';
		this.request(options);
	},
	get(options) {
		options.method = 'GET';
		this.request(options);
	},
	put(options) {
		options.method = 'PUT';
		this.request(options);
	},
	request(options) {
		var apiRoot = this.API_ROOT;
		var token = '';
		try {
			token = uni.getStorageSync('token')
		} catch (e) {
			// Do something when catch error
		}

		var cookie = '';
		try {
			cookie = uni.getStorageSync('cookie')
		} catch (e) {
			// Do something when catch error
		}
		//console.log("[api][request] method:", options.method)
		console.log("[api][request] ", options.method, options.url)
		console.log("[api][request] data:", options.data)
		//console.log("[api][request] cookie:", cookie)
		uni.request({
			url: apiRoot + options.url,
			data: options.data,
			method: options.method ? options.method : 'POST',
			header: {
				'Content-Type': 'application/json',
				'XX-Token': token,
				'XX-Device-Type': device_type,
				'Cookie': cookie,
			},
			success: (res) => {
				var data = res.data;
				//console.log("[api][request] return data:", data)
				//console.log("[api][request] return statusCode:", res.statusCode)
				//console.log("[api][request] return header:", res.header)
				if (data.ret_code == 20011) {
					uni.showModal({
						title: '提示',
						content: '登录已过期，请重新登录',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					});
				} else {
					options.success(data, res.header);
				}
			},
			fail: function(res) {
				if (options.fail) {
					options.fail(res)
				}
			},
			complete: options.complete ? options.complete : null
		});
	},
	uploadFile(options) {

		options.url = this.API_ROOT + options.url;

		let token = this.getToken();

		let that = this;

		let oldSuccess = options.success;
		options.success = function(res) {
			//console.log(res.data);
			let data = JSON.parse(res.data);
			if (data.code == 0 && data.data && data.data.code && data.data.code == 10001) {
				// uni.navigateTo({
				//     url: '/pages/login/login'
				// });
				that.login();
			} else {
				oldSuccess(data);
			}
		}

		options.header = {
			'XX-Token': token,
			'XX-Device-Type': device_type
		};
		uni.uploadFile(options);

	},
	getToken() {
		var token = '';
		try {
			token = uni.getStorageSync('token')
		} catch (e) {
			// Do something when catch error
		}

		return token;
	}
};
