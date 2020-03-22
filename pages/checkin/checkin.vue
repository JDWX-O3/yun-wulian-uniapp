<template>
	<view class="vbox">
		<view class="top_back_img" ></view>
		<view class="top">
			<view class="circle">
				<view class="profily_header" v-bind:style="{backgroundImage:'url(' + userinfo.avatar + ')'}"></view>
			</view>
			<view class="top-texts">
				<text class="name">{{userinfo.user_nickname ? userinfo.user_nickname : "未设置昵称"}}</text>
				<image class="set-top-hr" src="../../static/dulin-setting/set-top-hr.png" mode=""></image>
				<text class="depart">所属机构：{{userinfo.branch}}</text>
				<!--<view>
					<text>绑定手机：</text>
					<text>18888888888</text>
				</view>-->
			</view>			
		</view>

		<!-- 中间部分 -->
		<view class="middle">
			<view class="middle-left">				
				<text>已盘点：</text>
				<text class="middle-num">{{reporttotal.totalnormaldevs}}</text>
			</view>
			<view class="middle-line"></view>
			<view class="middle-right">				
				<text>待盘点：</text>
				<text class="middle-num">{{reporttotal.totalrepairedevs}}</text>
			</view>
		</view>

		<!-- 下半部分 -->
		<view style="margin-top:50px;">
			<uni-icon type="scan" size="60" @click="scan" color="#4790EF"></uni-icon>
		</view>		
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon.vue"
	import permision from "@/common/permission.js"
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				userinfo: "",
				reporttotal:"",
				result: '',
				avatar: "../../static/toux.jpg"							
			};
		},
		components: {uniIcon},				
		onLoad() {			
			if (this.islogin()) {
				this.userinfo = uni.getStorageSync('user');
				console.log(this.userinfo)
			} else {
				//console.log("未登录");
			}
			this.mydev();  //用到了userinfo信息，所以这个方法应该写在前面获取缓存信息之后。
		},
		onShow() {
			var isupload = uni.getStorageSync('upload')
			if (isupload == 1) {
				api.get({
					url: 'user/profile/userInfo',
					success: data => {
						if (data.code == 1) {
							uni.setStorageSync('user', data.data)
							uni.setStorageSync('upload', 0)
							this.userinfo = data.data
						}
						//console.log(data);
					}
				});
			}
		},
		methods: {
			/**
			 * 加载统计信息
			 */
			mydev: function() {
				var branch = this.userinfo.branch;
				api.post({
					url: 'device/Report/checkin',
					data: {
						branch:branch
					},
					success: data => {						
						this.reporttotal = data.data;
						//console.log(reporttotal.totaldevs);			
					}
				});
			},
			async scan() {				
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
				    return;
				}
				// #endif
				uni.scanCode({
					success: (res) => {
						this.result = res.result;
						var branch = this.userinfo.branch;
						api.post({
							url: 'device/Report/scancheck',
							data: {
								sbsn: res.result,
								branch:branch							
							},
							success: data => {								
								if (data.code == 1) {
									this.loading = false;									
									uni.showToast({
										duration: 1500,
										title: data.msg
									});	
									uni.switchTab({
										url: '/pages/index/index'
									});															
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
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要使用您的相机，请在设置界面打开相关权限',
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
			}
			// #ifdef APP-PLUS
			,
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
			}
			// #endif	
		}
	}
</script>

<style scoped>
		.index {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: white;
		border-top: 1px solid #cccccc;
	}

	.vbox {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.top_back_img {
		z-index: -1;
		position: absolute;
		top: 0upx;
		width: 100%;
		height: 420upx;
		background: linear-gradient(#86B5F4, #4790EF);

	}

	.top {
		display: flex;
		width: 100%;
		height: 420upx;
		align-items: center;
	}

	.circle {
		margin-left: 100upx;
		width: 120upx;
		height: 120upx;
		border: 10upx solid #a4f4f6;
		border-radius: 150upx;
		overflow: hidden;
	}

	.head {
		width: 120upx;
		height: 120upx;
		border-radius: 150upx;
	}	
	.profily_header {
		border-radius: 8px;
		height: 100%;
		background-size: 100%;
	}
	.top-texts {
		display: flex;
		flex-direction: column;
		margin-left: 15upx;
		color: white;
	}

	.name {
		font-size: 36upx;
		font-weight: 500;
	}

	.set-top-hr {
		width: 210upx;
		height: 6upx;
	}

	.top-changeInfo {
		margin-top: 250upx;
		width: 120upx;
		height: 28upx;
		line-height: 28upx;
		background-color: #FFFFFF;
		border-radius: 15upx;
		padding: 10upx;
		color: #33dce8;
	}

	.middle {
		display: flex;
		align-items: center;
		position: relative;
		top: -50upx;
		width: 80%;
		height: 100upx;
		background-color: white;
		border-radius: 15upx;
	}

	.middle-line {
		width: 2upx;
		height: 80upx;
		background-color: #eeeeee;
	}

	.middle-left {
		flex-grow: 1;
		color: #666666;
		display: flex;
		align-items: center;
		text-align: center;
		padding-left:50rpx;
	}

	.middle-right {
		flex-grow: 1;
		color: #666666;
		display: flex;
		align-items: center;
		text-align: center;
		padding-left:50rpx;
	}

	.middle-icon {
		width: 40upx;
		height: 40upx;
		margin-left: 20upx;
	}

	.middle-num {
		color: #4790EF;
		font-size:24px;
		-webkit-font-smoothing: antialiased;
	}

	.cell {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ccc;
		height: 90upx;
		align-items: center;
		justify-content: space-between;
	}

	.cell:active {
		background-color: #333;
		color: white;
		box-shadow: 1upx 1upx 35upx #ccc;
	}

	.cell-left {
		display: flex;
		align-items: center;
		margin-left: 65upx;
	}

	.cell-text {
		margin-left: 25upx;
	}

	.cell-right {
		margin-right: 45upx;
		height: 28upx;
	}

	.cell_icon {
		width: 40upx;
		height: 40upx;
		height: 40upx;
	}

	.right-arrow {
		color: #aaa;
		width: 15upx;
		height: 28upx;
	}
</style>
