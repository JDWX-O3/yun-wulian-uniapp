<template>
	<view class="center">
		<view class="center_top" v-bind:style="{backgroundImage:'url(' + userinfo.avatar + ')'}"></view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view v-if="!userinfo.avatar" class="profily_header" v-bind:style="{backgroundImage:'url(' + avatar + ')'}"></view>
					<view v-else class="profily_header" v-bind:style="{backgroundImage:'url(' + userinfo.avatar + ')'}"></view>
					<text>{{userinfo.user_nickname ? userinfo.user_nickname : "未设置昵称"}}</text>										
					<image src="../../static/sz.png" @click="setting"></image>
				</view>
			</view>
			<view class="baiban"></view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus" :key="item.key" @tap="toPage(item)">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<view class="center_menu" v-if="userinfo == '' ">
				<view class="menu_item" @tap="bindLogin">
					<image src="../../static/dl.png" mode="aspectFill"></image>
					<text>登录</text>
				</view>
			</view>
			<view class="center_menu" v-else>
				<view class="menu_item" @tap="logout">
					<image src="../../static/zx.png" mode="aspectFill"></image>
					<text>注销登录</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				userinfo: "",
				avatar: "../../static/toux.jpg",
				menus: [{
						name: '我的报修',
						icon: '../../static/wdsc.png',
						key: 1,
						path: '../favorites/favorites'
					},					
					{
						name: '我的申请',
						icon: '../../static/fbwz.png',
						key: 3,
						path: '../myArticle/myArticle'
					},					
					{
						name: '关于我们',
						icon: '../../static/aqzx.png',
						key: 5,
						path: '../about/about'
					}
				]
			};
		},
		onLoad() {
			if (this.islogin()) {
				this.userinfo = uni.getStorageSync('user');
				console.log(this.userinfo)
			} else {
				//console.log("未登录");
			}
		},
		onShow() {
			var isupload = uni.getStorageSync('upload')
			if (isupload == 1) {
				/*
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
				*/
			}
		},
		methods: {
			//用户点击列表项
			toPage(item) {
				if (this.islogin()) {
					uni.navigateTo({
						url: item.path
					});
				}
			},
			setting() {
				if (this.islogin()) {
					uni.navigateTo({
						url: '/pages/infomation/infomation'
					});
				}
			},
			//登陆
			bindLogin() {
				uni.setStorageSync('relogin', "true");//记录是否第一次授权  false:表示不是第一次授权
				uni.navigateTo({
					url: '/pages/login/login?source=relogin'
					//url: '/pages/login/login'
				});
			},
			//注销
			logout() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定要退出登录？',
					success: function(res) {
						if (res.confirm) {
							api.post({
								url: 'user/public/logout',
								method: 'POST',
								success: (data) => {
									uni.clearStorageSync()
									that.userinfo = ''
									//强制页面重载，跳转到登录页
									uni.reLaunch({
										url: '../login/login'
									});
								}
							});
						} else if (res.cancel) {
							//console.log('用户点击取消')
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.profily,
	.profily_header {
		border-radius: 8px;
		height: 28%;
		background: url('../../static/toux.jpg') no-repeat 0% 50%;
		background-size: cover;
	}

	.center {
		height: 100%;

		&_top {
			height: 18%;
			background: url('../../static/toux.jpg') no-repeat 0% 50%;
			background-size: cover;

		}

		&_box_bg {
			background: #F9F9F9;
			position: relative;

			.profily {
				position: absolute;
				width: 90%;
				// border:1px solid #F7F7F7;
				margin: 0 auto;
				top: -100upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;

		.profily_header {
			height: 120upx;
			width: 120upx;
			background-size: 100%;
		}

		text {
			margin-left: 20px;
			font-size: 30upx;
		}

		image {
			position: absolute;
			height: 40upx;
			width: 40upx;
			right: 0px;
			top: 0px;
		}
	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;

		.status {
			width: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;

			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;

			}
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 100upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background: url('../../static/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}
</style>
