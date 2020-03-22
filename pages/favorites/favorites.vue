<template>
	<view class="index" v-bind:style="[{'min-height': secondHeight + 'px' }]">
		<view class="list-box">
			<view class="container_of_slide" v-for="(item,index) in list" :key="index">
				<view class="slide_list" @touchstart="touchStart($event,index)" @touchend="touchEnd($event,index)" @touchmove="touchMove($event,index)"
				 @tap="recover(index)" :style="{transform:'translate3d('+item.slide_x+'px, 0, 0)'}">
					<view class="now-message-info" hover-class="uni-list-cell-hover" :style="{width:Screen_width+'px'}">						
						<view class="list-right">
							<view class="list-title">{{item.sbsn}}</view>
							<view class="list-detail">{{item.reason}}</view>
						</view>
						<view class="list-right-1">
							{{item.create_time}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var api = require('@/common/api.js'),
		page = 1,
		reachbottom = true
	export default {
		computed: {
			Screen_width() {
				return uni.getSystemInfoSync().windowWidth;
			}
		},
		data() {
			return {
				start_slide_x: 0,
				btnWidth: 0,
				startX: 0,
				LastX: 0,
				startTime: 0,
				screenName: '',
				list: [],
				btuBottom: '0',
				secondHeight: ''
			};
		},
		onReachBottom: function() {
			if (reachbottom) {
				this.getList()
			}
		},
		onLoad() {			
			uni.getStorageSync('user')
		},	
		onShow() {
			const res = uni.getSystemInfoSync()
			// 计算主体部分高度,单位为px
			this.secondHeight = res.windowHeight
			if (reachbottom) {
				this.getList()
			}
		},
		onUnload() {
			page = 1
			reachbottom = true
		},
		methods: {
			getList() {
				//console.log(page)
				api.get({
					url: 'device/Lists/myrepaire',
					data: {
						page: page + ',6',
						order: '+id',
					},
					success: data => {
						//console.log(data)
						if (data.code == 1) {
							var newsList = data.data;
							console.log(newsList)
							var arr = newsList.map((news) => {
								return {									
									id: news.id,
									sblb: news.sblb,
									sbsn: news.sbsn,
									create_time: news.create_time,									
									reason: news.reason,
									slide_x: 0
								};
							});
							page++
							this.list = this.list.concat(arr);
							//console.log(this.list)
						}
						if (data.code == 0) {
							reachbottom = false
							uni.showToast({
								"title": "没有更多啦",
								icon: "none",
								duration: 500
							});
						}
					}
				});
			},
			cancelEvent() {
				this.visible = false
			},
			getDetail(detail) {
				uni.navigateTo({
					url: '/pages/article/article?query=' + encodeURIComponent(JSON.stringify(detail))
				});
			}
		}
	};
</script>

<style>

</style>
