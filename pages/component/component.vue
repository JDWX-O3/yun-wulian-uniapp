<template>
	<view class="content">
		<!-- 
			* 下拉刷新和加载更多组件使用示例
			* 下拉刷新组件仅支持h5和小程序端，app端受限制目前没想到好的实现。
		-->
		<!--
			* 下拉刷新组件
			* @property {Number} top 距离顶部的距离
			* @event {Function} onPulldownReresh 刷新时调用的方法
			* @event {Function} setEnableScroll 设置组件内scroll-view是否允许滚动
		-->
		<mix-pulldown-refresh 
			ref="mixPulldownRefresh" 
			:top="0" 
			@refresh="onPulldownReresh"
		>
			
			<view class="scroll-wrapper">

				<view class="list-item" v-for="item in list" :key="item">
					列表项 -- {{item}}
				</view>
				
				<!--
					* 上滑加载更多组件
					* @property {Number} status = [0|1|2] 0加载前，1加载中，2没有更多了
				-->
				<mix-load-more :status="loadMoreStatus"></mix-load-more>
					
			</view>
			
		</mix-pulldown-refresh>
	</view>
</template>

<script>
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore
		},
		data() {
			return {
				list: [],
				loadMoreStatus: 0,
			}
		},
		onLoad() {
			this.loadData('add');
		},
		
		onReachBottom(){
			//上滑加载
			this.loadData('add');
		},
		methods: {
			loadData(type){
				if(type === 'add'){
					this.loadMoreStatus = 1;
				}
				setTimeout(()=>{
					if(type === 'refresh'){
						this.list = [];
					}
					
					let length = this.list.length;
					for(let i=length; i< length + 10; i++){
						this.list.push(i);
					}
					
					if(type === 'add'){
						this.loadMoreStatus = 0;
					}
					if(type === 'refresh'){
						this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
					}
				}, 1000)
				
			},
			
			
			//下拉刷新
			onPulldownReresh(){
				this.loadData('refresh');
			},
		}
	}
</script>

<style>
	page, .content{
		background-color: #f8f8f8;
	}

	.list-item{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150upx;
		font-weight: bold;
		font-size: 36upx;
		color: #555;
		background: #fff;
		border-bottom: 1px solid #eee;
	}
</style>
