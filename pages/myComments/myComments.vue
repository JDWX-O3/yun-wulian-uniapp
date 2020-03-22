<template>
	<view class="index" v-bind:style="[{'min-height': secondHeight + 'px' }]">
		<view class="list-box">
			<view class="container_of_slide" v-for="(item,index) in list" :key="index">
				<view class="slide_list" @touchstart="touchStart($event,index)" @touchend="touchEnd($event,index)" @touchmove="touchMove($event,index)"
				 @tap="recover(index)" :style="{transform:'translate3d('+item.slide_x+'px, 0, 0)'}">
					<view class="now-message-info" hover-class="uni-list-cell-hover" :style="{width:Screen_width+'px'}">
						<view class="list-right">
							<view class="list-title">{{item.content}}</view>
						</view>
						<view class="list-right-1">
							{{item.create_time}}
						</view>
					</view>
					<view class="group-btn">
						<view class="removeM btn-div" @tap="removeM(index, item.id)">
							删除
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
				api.get({
					url: 'user/comments/my',
					data: {
						page: page + ',7'
					},
					success: data => {
						//console.log(data);
						if (data.code == 1) {
							var newsList = data.data.list;
							var arr = newsList.map((news) => {
								return {
									id: news.id,
									content: news.content,
									slide_x: 0,
									create_time: news.create_time,
								};
							});
							page++
							this.list = this.list.concat(arr);
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
			// 滑动开始
			touchStart(e, index) {
				//记录手指放上去的时间
				this.startTime = e.timeStamp;
				//记录滑块的初始位置
				this.start_slide_x = this.list[index].slide_x;
				// 按钮宽度
				uni.createSelectorQuery()
					.selectAll('.group-btn')
					.boundingClientRect()
					.exec(res => {
						if (res[0] != null) {
							this.btnWidth = res[0][index].width * -1;
						}
					});
				// 记录上一次开始时手指所处位置
				this.startX = e.touches[0].pageX;
				// 记录上一次手指位置
				this.lastX = this.startX;
				//初始化非当前滑动消息列的位置
				this.list.forEach((item, eq) => {
					if (eq !== index) {
						item.slide_x = 0;
					}
				});
			},
			// 滑动中
			touchMove(e, index) {
				const endX = e.touches[0].pageX;
				const distance = endX - this.lastX;
				// 预测滑块所处位置
				const duang = this.list[index].slide_x + distance;
				// 如果在可行区域内
				if (duang <= 0 && duang >= this.btnWidth) {
					this.list[index].slide_x = duang;
				}
				// 此处手指所处位置将成为下次手指移动时的上一次位置
				this.lastX = endX;
			},
			// 滑动结束
			touchEnd(e, index) {
				let distance = 10;
				const endTime = e.timeStamp;
				const x_end_distance = this.startX - this.lastX;
				if (Math.abs(endTime - this.startTime) > 200) {
					distance = this.btnWidth / -2;
				}
				// 判断手指最终位置与手指开始位置的位置差距
				if (x_end_distance > distance) {
					this.list[index].slide_x = this.btnWidth;
				} else if (x_end_distance < distance * -1) {
					this.list[index].slide_x = 0;
				} else {
					this.list[index].slide_x = this.start_slide_x;
				}
			},
			// 点击回复原状
			recover(index) {
				this.list[index].slide_x = 0;
			},
			// 删除
			removeM(index, id) {
				// DELETE请求，取消收藏
				api.delete({
					url: 'user/comments/' + id,
					success: data => {
						if (data.code == 1) {
							uni.showToast({
								title: data.msg,
								duration: 1500,
								icon: 'success'
							});
							if (reachbottom) {
								this.list = []
								page = 1
								this.getList()
							} else {
								this.list.splice(index, 1)
							}
						}
					}
				});
			}
		}
	};
</script>

<style>

</style>
