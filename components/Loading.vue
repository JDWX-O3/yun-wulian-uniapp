<template name="Loading">
	<view class="loading ellipsis" v-if="show">
		<view class="loading-icon" v-if="loadingType === 1"></view>
		<text>{{loadingText[loadingType]}}</text>
	</view>
</template>
<script>
	export default {
		name: "Loading",
		props: {
			loadingType: {
				type: Number,
				default: 0
			},
			loadingText: {
				type: Array,
				default: function() {
					return ["上拉加载更多", "加载中...", "已经加载全部数据"];
				}
			},
			show: {
				type: Boolean,
				default: true
			}
		}
	}
</script>
<style>
	@keyframes rotate360 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading {
		display: flex;
		width: 100%;
		justify-content: center;
		padding: 16upx 0;
		padding-bottom: 36upx;
		line-height: 40upx;
		color: #888;
	}

	.loading text {
		margin-left: 12upx;
	}

	.loading-icon {
		width: 40upx;
		height: 40upx;
		justify-content: center;
		line-height: 40upx;
		font-size: 30upx;
		text-align: center;
		animation: rotate360 1200ms infinite linear;
	}

	.loading-icon:before {
		content: "0";
		color: #888;
	}
</style>
