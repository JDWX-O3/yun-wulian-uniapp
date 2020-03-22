<template>
	<view class="padding">
		<view class="list">
			<view class="li" hover-class="hover">
				<view class="icon">
					<image src="../../static/sj.png"></image>
				</view>
				<view class="text" v-if="userinfo.mobile">已绑定手机号-{{userinfo.mobile}}</view>
				<view class="text" v-if="!userinfo.mobile" @tap="setMobile">绑定手机</view>
				<image class="to" src="../../static/to.png"></image>
			</view>
			<view class="li" hover-class="hover">
				<view class="icon">
					<image src="../../static/sj.png"></image>
				</view>
				<view class="text" v-if="userinfo.user_email">已邮箱绑定-{{userinfo.user_email}}</view>
				<view class="text" v-if="!userinfo.user_email" @tap="setEmail">绑定邮箱</view>
				<image class="to" src="../../static/to.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: '',
			}
		},
		methods: {
			setMobile() {
				uni.navigateTo({
					url: '../save/setMobile',
				});
			},
			setEmail() {
				uni.navigateTo({
					url: '../save/setEmail',
				});
			},
		},
		onLoad() {
			this.userinfo = uni.getStorageSync('user');
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f1f1f1
	}

	.hover {
		background-color: #eee
	}

	.list {
		width: 100%;
		border-bottom: solid 13px #f1f1f1;
		background: #fff;

		.li {
			width: 92%;
			height: 50px;
			padding: 0 4%;
			border-bottom: solid 1px #e7e7e7;
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 25px;
				height: 25px;

				image {
					width: 25px;
					height: 25px
				}
			}

			.text {
				padding-left: 10px;
				width: 100%;
				color: #666
			}

			.to {
				flex-shrink: 0;
				width: 20px;
				height: 20px
			}
		}
	}
</style>
