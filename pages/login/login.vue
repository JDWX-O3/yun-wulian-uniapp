<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input type="number" v-model="username" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input type="number" :password="true" v-model="password" placeholder="请输入密码(6-16位)" />
				</view>
				<view class="login-function">
					<view class="login-forget" @tap="forget">忘记密码</view>
					<view class="login-register" @tap="reg">快速注册></view>
				</view>
			</view>
		</view>
		<view class="login-btn">
			<button class="landing" :loading="loading" type="primary" @tap="login">{{ loading ? "登录中...":"登 录"}}</button>
		</view>

		<view class="desc">
			<text>***使用说明***</text>
			<text>\n测试账号：123456</text>
			<text>\n测试密码：123456</text>
			<text>\n用户正式账号请联系公司服务人员获取。</text>
			<text>\n销售经理：许经理 13535666674</text>
		</view>
	</view>
</template>

<script>	
    //import crypto from 'crypto'
	var api = require('@/common/api.js')
	var crypto = require('crypto');
	export default {
		onLoad(option) {
			console.log("[login] onLoad...., option:", option);
			//this.username = option['username'];
			//this.password = option['password'];
		},
		data() {
			return {
				loading: false,
				username: "",
				password: "",
				
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse')||true,//默认为true
				jump_source:'',
			};
		},
		methods: {
			qqlogin() {
				uni.navigateTo({
					url: '../qqlogin/qqlogin',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
            getmd5(password){
                var md5Hash = crypto.createHash("md5");
                var md5Value = md5Hash.update(password).digest('hex');
                return md5Value;
            },

			//微信小程序有专门的登录流程，见参考
			//https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
			h5login() {
				console.log("[login] h5 start login...", this.username);
				
				this.loading = true;
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号或邮箱'
					});
					this.loading = false;
					return;
				}
				if (this.password == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
					this.loading = false;
					return;
				}
				api.post({
					url: 'admin/login',
					data: {
						user_account: this.username,
						user_password: this.getmd5(this.password),
						device_type: api.DeviceType
					},
					success: (data, header) => {
						console.log("[login]h5 login ok,", data);
						if (data.ret_code == 0) {
							this.loading = false;
							//console.log(data);
							uni.showToast({
								duration: 500,
								icon: 'success',
								title: data.ret_msg
							});
							uni.setStorageSync('login', 1)
							uni.setStorageSync('token', "czj")
							uni.setStorageSync('user_account', this.username)
							
							console.log("[login] h5 relauch myhome, cookie:", uni.getStorageSync('cookie'));
							//console.log("[login] user_account:", uni.getStorageSync('user_account'));
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../my_home/my_home'
								//url: '../grid/grid'
							});
						}
						if (data.ret_code != 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.ret_msg
							});
						}
					}
				})
			},
			///*
			//登录
			wxlogin() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
			 
			   // 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						console.log("[login] get weixin code", code);
						
						api.post({
							url: 'wechat/jscode2session',
							data: {
		                        js_code: code,
		                        nick_name: "jscode2session"
							},
							success: (data, header) => {
								console.log("[login] recv jscode2session ok", data);
								if (data.ret_code == 0) {
									_this.loading = false;
									if (header.hasOwnProperty('set-cookie')){
										//console.log("set-cookie:", rlt.header['set-cookie']);
										let n=header['set-cookie'].indexOf(";");
										let sessionid = header['set-cookie'].substring(0, n);
										console.log('[login] set cookie, sessionid:', sessionid);
									
										//保存cookie， wxRequest 发送时读取Cookie，填写到http 头中
										// jscode2session 后台处理中填写账号，用户类型
										// 必须使用sessionid，session保存在后台，SID是key
										uni.setStorageSync("cookie", sessionid);
									}
									_this.h5login();						
								}
								if (data.ret_code != 0) {
									this.loading = false;
									uni.showToast({
										duration: 1500,
										icon: 'none',
										title: data.ret_msg
									});
								}
							}
						})
						
						
					},
				});
			},
			//*/
			
			login() {
				
				var relogin = uni.getStorageSync('relogin');
				//#ifdef MP
				//没有获取到sid，需要走微信登录流程
				
				console.log('[login] click login...', relogin);
				if (relogin == 'true'){
					uni.setStorageSync('relogin', "");   //清掉
					//充我的页面重新登录的流程
					this.wxlogin();
				}
				
				//#endif
				
				if (relogin != 'true'){
					//从首页登录的流程
					this.h5login();
				}
				//this.h5login();
			},
			//微信小程序有专门的登录流程，见参考
			//https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						try {
							uni.setStorageSync('isCanUse', false);//记录是否第一次授权  false:表示不是第一次授权
							_this.updateUserInfo();
						} catch (e) {}
					},
					fail(res) {}
				});
			},
			//向后台更新信息
			updateUserInfo() {
				let _this = this;
				uni.request({
					url:'url' ,//服务器端地址
					data: {
						appKey: this.$store.state.appKey,
						customerId: _this.customerId,
						nickName: _this.nickName,
						headUrl: _this.avatarUrl
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.state == "success") {
							uni.reLaunch({//信息更新成功后跳转到小程序首页
								url: '/pages/index/index'
							});
						}
					}
				   
				});
			},
			reg() {
				uni.navigateTo({
					url: '../register/register'
				});
			},
			forget() {
				uni.navigateTo({
					url: '../forget/forget'
				});
			},
			//小程序登录
			onGotUserInfo() {
				uni.login({
					success: loginRes => {
						if (loginRes.code) {
							uni.getUserInfo({
								withCredentials: true,
								success: res => {
									//console.log(res)
									api.post({
										url: 'wxapp/public/login',
										data: {
											code: loginRes.code,
											encrypted_data: res.encryptedData,
											iv: res.iv,
											raw_data: res.rawData,
											signature: res.signature
										},
										success: data => {
											console.log(data)
											if (data.code == 1) {
												uni.showToast({
													title: '登录成功!',
													icon: 'success',
													duration: 500
												});
												//强制页面重载，跳转到首页
												uni.reLaunch({
													url: '../index/index'
												});
												try {
													uni.setStorageSync('login', 1)
													uni.setStorageSync('token', data.data.token)
													uni.setStorageSync('user', data.data.user)
												} catch (e) {}
												setTimeout(function() {
													uni.navigateBack()
												}, 500)
											}
										}
									});
								},
								fail: (res) => {
									if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
										uni.showModal({
											title: '用户授权失败',
											showCancel: false,
											content: '请删除此小程序重新授权!',
											success: function(res) {
												if (res.confirm) {
													console.log('用户点击确定')
												}
											}
										})
									}

								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.logbt {
		background: none;
		border: none !important;
		position: fixed;
		display: inline;
		margin-left: -76upx
	}

	.logbt:after {
		border: none !important;
	}

	image {
		width: 100upx;
		height: 100upx;
	}

	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.login-btn {
		padding: 10upx 20upx;
		margin-top: 350upx;
	}

	.login-function {
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}

	.login-forget {
		float: left;
		font-size: 26upx;
		color: #999;
	}

	.login-register {
		color: #666;
		float: right;
		font-size: 26upx;

	}

	.login-input input {
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}

	.login-margin-b {
		margin-bottom: 25upx;
	}

	.login-input {
		padding: 10upx 20upx;
	}

	.login-head {
		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
	}

	.login-card {
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 120upx;
	}

	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#86B5F4, #4790EF);
	}
	.desc {
		margin-top: 60upx;
		display: block;
		margin: 36upx
	}

</style>
