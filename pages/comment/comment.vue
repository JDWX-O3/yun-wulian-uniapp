<template>
	<view>
		<view class="uni-padding-wrap">
			<!-- 评论区 start
			<view class="uni-comment">
				<view class="uni-comment-list" v-for="(item,index) in list" :key="index">
					<view class="uni-comment-face">
						<image :src="item.user.avatar?item.user.avatar:'../../static/toux.jpg'" mode="widthFix"></image>
					</view>
					<view class="uni-comment-body">
						<view class="uni-comment-top">
							<text>{{item.sblb}}</text>
							<text class="time">{{item.sbsn}}</text>
						</view>
						<view class="uni-comment-content">{{item.whrq}}</view>
					</view>
				</view>
			</view>
			<!-- 评论区 end -->
			
			<uni-segmented-control :current="current_seg" :values="items" @clickItem="handleOptionClick" style-type="text" active-color="#4cd964"></uni-segmented-control>
			<view v-show="current === 0">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-ellipsis">{{item.sblb}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">序列号：{{item.sbsn}}</view>
							</view>
						</view>
					</view>
					<view class="listpage uni-ellipsis">				
						<uni-pagination title="标题文字" :show-icon="true" :total="total" :current="current" :pageSize="pageSize" @change="change"></uni-pagination>
						<!--<uni-pagination :current="current" :total="total" title="标题文字" :show-icon="true" @change="change" />-->
					</view>
					<view class="listpage uni-ellipsis">当前页：{{ current }}，数据总量：{{ total }}条，每页数据：{{ pageSize }}</view>
					</view>
				</view>
			</view>
			
			<view v-show="current === 1">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in alarm_list" :key="index" @tap='showDetail(item.id)'>
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-ellipsis">设备名称：{{item.device_name}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">信息：{{item.comment}}     时间：{{item.update_time}}</view>
							</view>
						</view>
					</view>
					<view class="listpage uni-ellipsis">				
						<uni-pagination title="标题文字" :show-icon="true" :total="total" :current="current" :pageSize="pageSize" @change="change"></uni-pagination>
						<!--<uni-pagination :current="current" :total="total" title="标题文字" :show-icon="true" @change="change" />-->
					</view>
					<view class="listpage uni-ellipsis">当前页：{{ current }}，数据总量：{{ total }}条，每页数据：{{ pageSize }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	var page = 1,
		api = require('@/common/api.js'),
		id,
		reachbottom = true;
	export default {
		components: {uniPagination,uniSegmentedControl},
		data() {
			return {
				items: ['操作','告警'],
				current_seg: 0,
				userinfo: "",
				list: [],
				operate_list: [{sblb:"设备启动", sbsn:"123456"}, {sblb:"222", sbsn:"bbb"}, {sblb:"333", sbsn:"ccc"} ],
				alarm_list: [],
				content: '',
				current: 1,
				total: 0,
				pageSize: 6
			};
		},
		onLoad() {		
			this.getAlarmLogsList();
			//console.log(option.id)
		},
		onReachBottom: function() {
			//if (reachbottom) {
				//this.init();
			//}
		},
		methods: {
			getAlarmLogsList(account) {
				api.post({
					url: 'alarm/logs/list',
					data: {
						user_account: account,
					},
					success: data => {
						console.log("[comments] api/alarm/logs/list", data);
						if (data.ret_code == 0) {
							this.loading = false;
							this.alarm_list=data.extra;
							console.log("[comments] own alarm list", this.alarm_list);			
						}
						if (data.ret_code != 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.ret_msg
							});
						}
					}
				})
			},
			change(e) {
				console.log(e)
				this.current = e.current;				
				var branch = this.userinfo.branch;
				/*
				api.get({
					url: 'device/lists/myrlists',
					data: {
						page: e.current + ',6',						
						branch:branch						
					},
					success: data => {
						//console.log(data)
						//var newsList = data.data.list;
						this.list = data.data.list;
						this.total = data.data.totalitems;
						//page++
					}
				})		
						*/
			},
			//跳转详情页
			showDetail(detail) {
				//console.log(detail)				
				uni.navigateTo({
					url: '/pages/detail/detail?query='+ detail
				});
			},
			handleOptionClick(index) {
				console.log("[my_home] handleOptionClick, index:", index);
				if (this.current !== index.currentIndex) {
					this.current = index.currentIndex;
				}
				//this.getDeviceList(this.project_list[this.current]);
			},			
		}
	}
</script>

<style>
	.uni-padding-wrap {
		padding-bottom: 58px;
	}

	.flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	.uni-media-list-logo {
		width: 100upx;
		height: 100upx;
	}
	.uni-media-list-text-bottom{
		line-height:20px;
	}
	.listpage{
		margin-top:5px;
		line-height:22px;
		font-size:10px;
		text-align:center;
	}
	.flex__item {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	.comment-box {
		height: 36px;
		margin-top: 6px;
		line-height: 36px;
		margin-bottom: 6px;
		font-size: 14px;
		text-align: left;
		padding: 0 10px;
	}

	.comment-submit-btn {
		width: 80px;
		text-align: center;
		height: 36px;
		margin-top: 6px;
		margin-bottom: 6px;
		line-height: 36px;
		font-size: 14px;
		background: #eee;
		margin-right: 10px;
	}

	.comment-submit-btn-active {
		background: #ccc;
		color: #000;
	}

	.article-footer-action-bar {
		position: fixed;
		bottom: 0;
		height: 48px;
		width: 100%;
		background: #fff;
		line-height: 48px;
		border-top: 1px solid #eee;
	}

	.time {
		float: right;
	}
</style>
