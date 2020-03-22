<template>
	<view class="content">
		<view class="forget-bg">
			<view class="forget-card">
				<view class="forget-input forget-margin-b">
					<input type="text" v-model="account" placeholder="请输入邮箱号" />
				</view>
				<view class="forget-input forget-margin-b">
					<view class="verify-left">
						<input type="number" v-model="verification_code" placeholder="验证码" />
					</view>
					<view class="verify-right">
						<button v-show="show"  class="verify-btn" type="primary" @tap="onGetVerificationCode">获取验证码</button>
						<button v-show="!show" class="verify-btn" type="primary" >{{count}} s</button>
					</view>
				</view>
			</view>
		</view>
		<view class="forget-btn">
			<button class="landing" type="primary" @tap="setEmailSubmit">绑 定</button>
		</view>
	</view>
</template>

<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				account: '',
				verification_code: '',
				show: true,
				count: '',
				timer: null
			}
		},
		methods: {
			setEmailSubmit() {
				let check = this.isEmail(this.account);
				let that = this;
				if (check == false) {
					uni.showToast({
						icon: 'none',
						title: '邮箱格式错误'
					});
					return;
				}
				if (this.verification_code.length == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				//访问绑定邮箱接口
				api.post({
					url: 'user/profile/bindingEmail',
					data: {
						email: this.account,
						verification_code: this.verification_code,
					},
					success: (data) => {
						if (data.code == 1) {
							uni.showToast({
								title: data.msg,
								icon: 'success',
								duration: 1000
							});
							//返回并更新用户数据
							uni.setStorageSync('upload', 1);
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								});
							}, 1000);
						}
						if (data.code == 0) {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 2000
							});
						}
					}
				});
			},
			//发送验证码
			onGetVerificationCode() {
				let check = this.isEmail(this.account);
				//console.log(check);
				if (check == false) {
					uni.showToast({
						icon: 'none',
						title: '邮箱格式错误'
					});
					return;
				}
				api.post({
					url: 'user/verification_code/send',
					data: {
						username: this.account
					},
					success: (data) => {
						//console.log(data);
						if (data.code == 1) {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 3000
							});
							const TIME_COUNT = 60; //倒计时时间
							if (!this.timer) {
								this.count = TIME_COUNT;
								this.show = false;
								this.timer = setInterval(() => {
									if (this.count > 0 && this.count <= TIME_COUNT) {
										this.count--;
									} else {
										this.show = true;
										clearInterval(this.timer);
										this.timer = null;
									}
								}, 1000)
							}
						}
						if (data.code == 0) {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 3000
							});
						}
					}
				});
			},
			/**
			 * 判断是否是邮箱的正确格式
			 * @param str 对应的需要验证的邮箱地址
			 * @returns {boolean} 返回真或假
			 */
			isEmail(str) {
				let emailRegx = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
				return emailRegx.test(str);
			}
		},
		onLoad() {

		}
	}
</script>

<style>
	page {
		background-color: #f1f1f1;
	}

	.verify-left {
		width: calc(100% - 260upx);
	}

	.verify-right {
		padding-left: 20upx;
	}

	.verify-btn {
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		width: 240upx;
		border-radius: 8upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.verify-left,
	.verify-right {
		float: left;
	}

	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 10upx;
		font-size: 32upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.forget-btn {
		padding: 10upx 20upx;
		margin-top: 300upx;
	}

	.forget-input input {
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 1upx;
	}

	.forget-margin-b {
		margin-bottom: 25upx;
	}

	.forget-input {
		padding: 10upx 20upx;
		overflow: auto;
	}

	.forget-card {
		background: #fff;
		border-radius: 12upx;
		padding: 60upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 120upx;
	}

	.forget-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#86B5F4, #4790EF);
	}
</style>
