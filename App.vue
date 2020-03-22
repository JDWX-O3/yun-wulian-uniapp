<script>
	export default {

	}
</script>

<style>
	/*每个页面公共css */
	@import "/common/uni.css";

	.index {
		background: #F8F8F8;
	}

	.container_of_slide {
		width: 100%;
		overflow: hidden;
	}

	.slide_list {
		transition: all 100ms;
		transition-timing-function: ease-out;
		min-width: 200%;
		height: 160upx;
	}

	.now-message-info {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		font-size: 16px;
		clear: both;
		height: 160upx;
		padding: 0 30upx;
		margin-bottom: 20upx;
		background: #FFFFFF;
	}

	.now-message-info,
	.group-btn {
		float: left;
	}

	.group-btn {
		display: flex;
		flex-direction: row;
		height: 160upx;
		min-width: 100upx;
		align-items: center;

	}

	.group-btn .btn-div {
		height: 160upx;
		color: #fff;
		text-align: center;
		padding: 0 50upx;
		font-size: 34upx;
		line-height: 160upx;
	}

	.group-btn .top {
		background-color: #c4c7cd;
	}

	.group-btn .removeM {
		background-color: #ff3b32;
	}


	.icon-circle {
		width: 100upx;
		height: 100upx;
	}

	.list-right {
		float: left;
		margin-left: 25upx;
		margin-right: 30upx;
	}

	.list-right-1 {
		float: right;
		color: #A9A9A9;
	}

	.list-title {
		width: 350upx;
		line-height: 1.5;
		overflow: hidden;
		margin-bottom: 10upx;
		color: #333;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.list-detail {
		width: 350upx;
		font-size: 14px;
		color: #a9a9a9;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.button-box {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 998;
		background: #F8F8F8;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}
</style>
