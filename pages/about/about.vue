<template>
	<view class="about">
		<view class="content">
			<view class="qrcode">
				<image src="../../static/gongzhonghao.png" @longtap="save"></image>
				<text class="tip">扫码加入金大万翔微信公众号</text>
			</view>
			<view class="desc">
				<text class="code">金大万翔物联网管理平台</text>
				是一个使用 <text class="code">uni-app</text> 开发的微信小程序、APP等多端支持的物联网平台程序。
			</view>
			<view class="source">
				<view class="title">该管理系统后台是：Nodejs</view>
				<view class="source-list">
					<view class="source-cell">						
						<text>基于Nodejs开发</text>
					</view>
					<view class="source-cell">
						<text space="nbsp">移动端功能不断完善后，后续将继续基于electron开发跨平台的PC客户端</text>						
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<button type="primary" @click="share">分享</button>
			<!-- #endif -->
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="version">
			当前版本：{{version}}
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import uLink from "@/components/uLink.vue"

	export default {
		components: {
			uLink
		},
		data() {
			return {
				providerList: [],
				version: ''
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.version = plus.runtime.version;
			uni.getProvider({
				service: 'share',
				success: (result) => {
					const data = [];
					for (let i = 0; i < result.provider.length; i++) {
						switch (result.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								});
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								});
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								});
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (error) => {
					console.log('获取分享通道失败' + JSON.stringify(error));
				}
			});
			// #endif
		},
		methods: {
			// #ifdef APP-PLUS
			save() {
				uni.showActionSheet({
					itemList: ['保存图片到相册'],
					success: () => {
						plus.gallery.save('https://www.lbrcb.net/qrzxc.jpg', function() {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							});
						}, function() {
							uni.showToast({
								title: '保存失败，请重试！',
								icon: 'none'
							});
						});
					}
				});
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					});
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name;
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						let provider = this.providerList[res.tapIndex].id;
						uni.share({
							provider: provider,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : "WXSceneSession",
							type: (provider === "qq") ? 1 : 0,
							title: '欢迎使用电子设备管理小助手',
							summary: '电子设备管理小助手是使用uni-app开发的多端应用',
							imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/nav_menu/8.jpg',
							href: "https://m3w.cn/uniapp",
							success: (res) => {
								console.log("success:" + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			}
			// #endif
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
	}

	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	image {
		width: 360upx;
		height: 360upx;
	}

	.about {
		flex-direction: column;
		flex: 1;
	}

	.content {
		flex: 1;
		padding: 30upx;
		flex-direction: column;
		justify-content: center;
	}

	.qrcode {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.qrcode .tip {
		margin-top: 20upx;
	}

	.desc {
		margin-top: 30upx;
		display: block;
	}

	.code {
		color: #e96900;
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
		margin-top: 40upx;
	}

	.version {
		height: 80upx;
		line-height: 80upx;
		justify-content: center;
		color: #ccc;
	}

	.source {
		margin-top: 30upx;
		flex-direction: column;
	}

	.source-list {
		flex-direction: column;
	}

	.link {
		color: #007AFF;
	}
</style>
