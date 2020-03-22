<template>
	<view>
		<!-- 一般用法 -->
		<cmd-cell-item @click="handleSelectClick" :title="current_dev_cn_name" addon="切换" arrow></cmd-cell-item>
		<view v-for="(item, index) in real_data_list" :key="index">
			<cmd-cell-item @click="handleVarItemClick(index)" :title="item.varName" :addon="item.varValue" arrow></cmd-cell-item>
		</view>
		
		<uni-drawer :visible="showRight" mode="right" @close="closeDrawer('right')">
			<view class="image_gzh">
				 <text style="font-size:36upx"> 设备列表</text>
			</view>
			<!-- 一般用法 -->
			<uni-list>
				<view v-for="(item, index) in device_list" :key="index">
					<uni-list-item @click="handleDeviceClick(index)"  :title="item.dev_cn_name"></uni-list-item>
				</view>
			</uni-list>
			<view class="close">
				<view class="word-btn" hover-class="word-btn--hover" :hover-stay-time="70" @click="closeDrawer">
					<text>取消</text>
				</view>
			</view>
		</uni-drawer>
		
	</view>
</template>

<script>
	var api = require('@/common/api.js')
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
	export default {
		components: {cmdCellItem,uniDrawer},
		data() {
			return {
				updateTimer:"",
				real_data_list: [],
				showRight: true,
				loading: false,
				project_list: [],
				device_list: [],
				current_dev_cn_name:'',
				current_devunit_name:'',
				current_project_name:'',
				
			}
		},
		
		onLoad() {
			console.log("[my_data] , onLoad....");
			
			this.current_devunit_name = uni.getStorageSync('current_devunit_name');
			///判断是否有当前的项目，否则显示默认
			if (this.current_devunit_name == '' || this.current_devunit_name == null){
				console.log("[my_data]  load first project");
				uni.showToast({
					duration: 1500,
					icon: 'none',
					title: "获取数据失败"
				});
			}
			else{
				console.log("[my_data] , current_devunit_name", this.current_devunit_name);
				this.getDeviceRealData(this.current_devunit_name);
			}
		},
		onShow() {
			console.log("[my_data] , onShow....");
			this.closeDrawer();
			
			var  old_name = this.current_devunit_name;
			//获取当前设备及项目名, 设备名称
			this.current_project_name = uni.getStorageSync('current_project_name');
			this.current_dev_cn_name = uni.getStorageSync('current_dev_cn_name');
			//获取当前设备及项目名, 设备名称
			this.current_devunit_name = uni.getStorageSync('current_devunit_name');
			
			//if(old_name != this.current_devunit_name){
				console.log("[my_data] , current_devunit_name", this.current_devunit_name);
				this.getDeviceRealData(this.current_devunit_name);
				this.getDeviceList(this.current_project_name);
			//}
			
			
			this.timerGetRealData();
		},
		onHide() {
			console.log("[my_data] , onHide....");
			if(this.updateTimer != ''){
				clearInterval(this.updateTimer);
				console.log('[my_data] clear timer,' + this.updateTimer);
				this.updateTimer = '';
			}
		},
		onUnload () {
			console.log("[my_data], onUnload....");
			if(this.updateTimer != ''){
				clearInterval(this.updateTimer);
				console.log('[my_data] clear timer,' + this.updateTimer);
				this.updateTimer = '';
			}
		},
		methods: {			
			timerGetRealData() {
				let self = this;
				//如果timer存在就直接返回, 这里数据每分钟更新一次
				if (self.updateTimer != ''){
					console.log('[my_data] timer exist, return');
					return;
				}
				
				 self.updateTimer = setInterval(function(){
					 self.getDeviceRealData(self.current_devunit_name);
				},60000);
				console.log("[my_data], start timer", self.updateTimer);
			},
			
			
			getDeviceRealData(devunit_name) { 
				api.post({
					url: 'gateway/data/list',
					data: {
						filter: {
						  devunit_name: devunit_name
						}
					},
					success: data => {
						console.log("[my_data] gateway/data/list", data);
						if (data.ret_code == 0) {
							this.loading = false;
							this.real_data_list=data.extra;
							
							//将当前数据存储
							//uni.setStorageSync('cur_real_data', this.device_list);
							//console.log(data);
							
						}
						if (data.ret_code != 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.ret_msg
							});
							this.real_data_list = [];
						}
					}
				})
			},
			
			getDeviceList(project_name) {
				console.log("[my_data] getDeviceList, project_name:", project_name);
				api.post({
					url: 'devunit/manage/list',
					data: {
						filter: {project_name: project_name},
					},
					success: data => {
						console.log("[my_data] getDeviceList", data);
						if (data.ret_code == 0) {
							this.loading = false;
							this.device_list=data.extra;
							
							//保存当前设备的名称
							console.log("[my_data] device_list", this.device_list);
							
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
			handleVarItemClick(index) {
				//获取数据
				console.log('[my_data], varName:', this.real_data_list[index].varName);
				//this.getDeviceRealData(this.current_devunit_name); //记录当前设备名称
			},
			
			handleDeviceClick(device_list_id) {
				//console.log('[device_data], event.currentTarget.id:', event.currentTarget.id);
				console.log('[my_data], select device, device_list_id:', device_list_id);
				
				if (this.current_devunit_name != this.device_list[device_list_id].devunit_nam){
					
					//更新默认设备
					this.current_devunit_name = this.device_list[device_list_id].devunit_name;
					//切换项目后，默认项目名称在函数内部更新
					this.getDeviceRealData(this.current_devunit_name);
				}
				
	
				//更新默认设备
				this.current_devunit_name = this.device_list[device_list_id].devunit_name;
				this.current_dev_cn_name = this.device_list[device_list_id].dev_cn_name;
				uni.setStorageSync('current_dev_cn_name', this.current_dev_cn_name);
				uni.setStorageSync('current_devunit_name', this.current_devunit_name);
				
				this.closeDrawer();
			},
			handleSelectClick() {
				///判断是否有当前的项目，否则显示默认
				if (this.device_list.length==0){
					console.log("[my_data]  load first project devicelist");
					this.getDeviceList(this.current_project_name);
				}
				
				this.showRight = true;
			},
			
			closeDrawer() {
				//console.log("hide");
				this.showRight = false
			},
		}
	}
</script>

<style>
	.word-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #4790EF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}
	.image_gzh {
        display: flex;
		justify-content: center;
		align-items: center;
		height: 100px;
		margin: 0,auto;
		text-align: center;
	}
</style>
