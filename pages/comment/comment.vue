<template>
	<view>
		<view class="uni-padding-wrap">
			<uni-segmented-control :current="current_seg" :values="items" @clickItem="handleOptionClick" style-type="text" active-color="#4cd964"></uni-segmented-control>
			<view v-show="current === 0">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in run_list" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-ellipsis">信息：{{item.comment}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">设备：{{item.dev_cn_name}}     时间：{{item.update_time}}</view>
							</view>
						</view>
					</view>
					
				</view>
			</view>
		
			<view v-show="current === 1">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in alarm_list" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-ellipsis">信息：{{item.comment}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">设备：{{item.dev_cn_name}}     时间：{{item.update_time}}</view>
							</view>
						</view>
					</view>
					
				</view>
			</view>
				
				
			<view v-show="current === 2">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in op_list" :key="index">
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-ellipsis">信息：{{item.comment}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">设备：{{item.dev_cn_name}}     时间：{{item.update_time}}</view>
							</view>
						</view>
					</view>
					
				</view>
			</view>
			
			<view class="listpage uni-ellipsis">当前页：{{ current }}，数据总量：{{ total }}条</view>
			
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
	var page = 1,
		api = require('@/common/api.js'),
		id,
		reachbottom = true;
	export default {
		components: {uniSegmentedControl,cmdCellItem},
		data() {
			return {
				items: ['运行','告警','操作'],
				current_seg: 0,
				userinfo: "",
				current_dev_cn_name:'',
				current_devunit_name:'',
				current_project_name:'',
				
				alarm_list: [],
				run_list: [],
				op_list: [],
				
				current: 0,
				total: 0,
				pageSize: 6
			};
		},
		onLoad() {		
			
			//获取当前设备及项目名, 设备名称
			this.current_project_name = uni.getStorageSync('current_project_name');
			this.current_dev_cn_name = uni.getStorageSync('current_dev_cn_name');
			//获取当前设备及项目名, 设备名称
			this.current_devunit_name = uni.getStorageSync('current_devunit_name');
			
			this.getAlarmLogsList();
			this.getRunLogsList();
			this.getOpLogsList();
			//console.log(option.id)
		},
		onReachBottom: function() {
			//if (reachbottom) {
				//this.init();
			//}
		},
		methods: {
			getRunLogsList(account) {
				api.post({
					url: 'run/project/logs/list',
					data: {
						filter: {project_name: this.current_project_name}
					},
					success: data => {
						console.log("[comments] api/run/project/logs/list", data);
						if (data.ret_code == 0) {
							this.loading = false;
							this.run_list=data.extra;
							console.log("[comments] own run list", this.alarm_list);			
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
			getAlarmLogsList(account) {
				api.post({
					url: 'alarm/project/logs/list',
					data: {
						filter: {project_name: this.current_project_name}
					},
					success: data => {
						console.log("[comments] api/alarm/project/logs/list", data);
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
			getOpLogsList(account) {
				api.post({
					url: 'operate/project/logs/list',
					data: {
						filter: {project_name: this.current_project_name}
					},
					success: data => {
						console.log("[comments] api/operate/project/logs/list", data);
						if (data.ret_code == 0) {
							this.loading = false;
							this.op_list=data.extra;
							console.log("[comments] own operate list", this.alarm_list);			
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
