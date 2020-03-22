<template>
	<view>	
			<view class="login-card">
				<view class="login-head">扫码报修</view>
				<view class="uni-btn-v">
					<button type="primary" @click="scan">扫一扫</button>
				</view>
				<view class="login-input login-margin-b">{{result}}
					设备序列号：<input type="text" v-model="dessid" placeholder="扫码识别" />
				</view>
				<view class="login-input">
					故障现象：<input type="text"  v-model="deshow" placeholder="描述故障现象" />
				</view>				
			</view>		
		<view class="login-btn">
			<button class="landing" :loading="loading" type="primary" @click="repair">{{ loading ? "提交中...":"提 交"}}</button>
		</view>
	</view>
</template>
<script>
	var api = require('@/common/api.js'),	
	export default {
		data() {
			return {		
				title: 'scanCode',
				result: '',
				loading: false,
				dessid: "",
				deshow: "",
			}
		},		
		onLoad() {
			
		},		
	
		methods: {		
			
			async scan() {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
				    return;
				}
				// #endif
				uni.scanCode({
					success: (res) => {
						this.result = res.result
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要使用您的相机，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				});
			},			// #ifdef APP-PLUS
			
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},// #endif
			async repair(){
				this.loading = true;
				if (this.dessid == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入序列号（扫码自动显示）'
					});
					this.loading = false;
					return;
				}
				if (this.deshow == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入故障现象'
					});
					this.loading = false;
					return;
				}
				api.post({
					url: 'device/Index/index',
					data: {
						dessid: this.dessid,
						deshow: this.deshow,
						device_type: api.DeviceType
					},
					success: data => {
						console.log(data);
						if (data.code == 1) {
							this.loading = false;
							console.log(data);
							uni.showToast({
								duration: 500,
								title: data.msg
							});
							//强制页面重载，跳转到首页
							uni.reLaunch({
								url: '../index/index'
							});							
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
						}
						if (data.code == 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.msg
							});
						}
					}
				})
			},
		}
	}
</script>

<style>

	.scan-result {
		min-height: 50upx;
		line-height: 50upx;
	}
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
</style>
