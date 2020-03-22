<template>
	<view class="content">
		<view class="forget-bg">
			<view class="forget-card">
				<view class="forget-input forget-margin-b">
					<input type="text" v-model="username" placeholder="请输入您的手机号/邮箱" />
				</view>
				<view class="forget-input forget-margin-b">
					<view class="verify-left">
						<input type="number" v-model="verification_code" placeholder="请输入验证码" />
					</view>
					<view class="verify-right">
						<button class="verify-btn" type="primary" @tap="getsmscode">{{count?count+'s':send}}</button>
					</view>
				</view>
				<view class="forget-input">
					<input type="number" :password="true" v-model="password" placeholder="请输入密码(6-16位)" />
				</view>
			</view>
		</view>
		<view class="forget-btn">
			<button class="landing" type="primary" @tap="submit">提交</button>
		</view>
	</view>
</template>

<script>
	var api = require('../../common/api.js')
	export default {
		data() {
			return {
				username: "",
				password: "",
				verification_code: "",
				send: "获取验证码",
				count: 0,
				timer: null
			};
		},
		methods: {
			goLogin: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			//注册
			submit: function() {
				if (this.account == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号或邮箱'
					});
					return;
				}
				if (this.verification_code == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				api.post({
					url: 'user/public/register',
					data: {
						username: this.username,
						password: this.password,
						verification_code: this.verification_code
					},
					success: data => {
						if (data.code == 1) {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 1000
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
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
			getsmscode: function() {
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号或邮箱'
					});
					return;
				};
				if (!this.timer) {
					api.post({
						url: 'user/verification_code/send',
						data: {
							username: this.username
						},
						success: data => {
							//console.log(data);
							if (data.code == 1) {
								this.count = 5;
								this.send = "重新获取"
								this.timer = setInterval(() => {
									if (this.count > 0 && this.count <= 5) {
										this.count--;
									} else {
										clearInterval(this.timer);
										this.timer = null;
									}
								}, 1000)
								uni.showToast({
									title: data.msg,
									icon: "none",
									duration: 3000
								});
							}
							if (data.code == 0) {
								uni.showToast({
									title: data.msg,
									icon: "none",
									duration: 3000
								});
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
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
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.forget-btn {
		padding: 10upx 20upx;
		margin-top: 380upx;
	}

	.forget-input input {
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
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
