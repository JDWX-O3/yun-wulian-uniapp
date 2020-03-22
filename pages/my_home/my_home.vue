<template>
    <view>
		<!--
        <uni-segmented-control :current="current" :values="items" @clickItem="handleOptionClick" style-type="text" active-color="#4cd964"></uni-segmented-control>
        -->		
		<cmd-cell-item @click="handleSelectClick" :title="current_project_name" addon="切换" arrow></cmd-cell-item>

		<view class="content">
            <view v-show="current === 0">
                <!-- 一般用法 -->
                <uni-grid @change="handleGridClick" :column="2">
					<!--
                    <uni-grid-item :index="0">
						<image src="../../static/zy-grid/grid-02.svg" class="swiper-item" />
                        <text class="text">咸宁市1#消毒设备</text>
                    </uni-grid-item>
                    <uni-grid-item v-for="(item, id) in device_list" :index="id">
						<image src="../../static/zy-grid/grid-02.svg" class="grid-item" />
                        <text class="text">"item.dev_cn_name"</text>
                    </uni-grid-item>
					 -->
					<view v-for="(item, index) in device_list" :key="index">
						<uni-grid-item :index="index">
							<image src="../../static/zy-grid/grid-02.svg" class="grid-item" />
							<text class="text">{{item.dev_cn_name}}</text>
							<text class="text">{{item.gateway_sn}}</text>
						</uni-grid-item>
					</view>
                </uni-grid>
            </view>
			<!--
            <view v-show="current === 1">
				<uni-list>
					<view v-for="(item, index) in project_list" :key="index">
						<uni-list-item @click="handleProjectClick(index)" :title="item" :show-arrow="false"></uni-list-item>
					</view>
				</uni-list>
            </view>
			-->
        </view>
		<uni-drawer :visible="showRight" mode="right" @close="closeDrawer('right')">
			<view class="image_gzh">
				 <text style="font-size:36upx"> 项目列表</text>
			</view>
			<!-- 一般用法 -->
			<uni-list>
				<view v-for="(item, index) in project_list" :key="index">
					<uni-list-item @click="handleProjectClick(index)"  :title="item"></uni-list-item>
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
import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
import uniList from "@/components/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components: {cmdCellItem,uniDrawer,uniGrid,uniGridItem,uniList,uniListItem},
    data() {
        return {
			loading:'false',
            items: ['设备','项目'],
            current: 0,
			showRight: true,
			user_account:'',
			project_list: [],
			device_list: [],
			current_dev_cn_name:'',
			current_devunit_name:'',
			current_project_name:'',
			onload_flag:false,
			onshow_flag:false,
			
        }
    },
	
	onLoad() {
		this.onload_flag = true;
		this.user_account = uni.getStorageSync('user_account');
		console.log("[my_home] onLoad...., user_account:", this.user_account);
		
		uni.setStorageSync('current_project_name', "");
		uni.setStorageSync('current_dev_cn_name', "");
		uni.setStorageSync('current_devunit_name', "");
			

		//获取用户的所有项目
		this.getProjectList(this.user_account);
		

		///判断是否有当前的项目，否则显示默认
		// 要同步执行，获取project list后执行
		/*
		this.current_project_name = uni.getStorageSync('current_project_name');
		if (this.current_project_name == '' || this.current_project_name == null){
			console.log("[my_home]  load first project");
			//默认加载第一个项目，在设备列表里显示第一个项目的设备
			if(this.project_list.length>0){
				this.getDeviceList(this.project_list[0]);
				uni.setStorageSync('current_project_name', this.project_list[0]);
			}
			else{
				uni.setStorageSync('current_project_name', "");
			}
		}
		else{
			this.getDeviceList(this.current_project_name);
		}
		//*/
	},
	onShow() {
			console.log("[my_home] , onShow....");
			this.onshow_flag = true;
			
			//更新当前设备
			this.closeDrawer();
			
			//获取当前设备及项目名, 设备名称
			var temp = uni.getStorageSync('current_dev_cn_name');
			if (this.current_dev_cn_name != temp){
				this.current_dev_cn_name = temp;
			}
			
			//获取当前设备及项目名, 设备名称
			temp = uni.getStorageSync('current_devunit_name');
			if (this.current_devunit_name != temp){
				this.current_devunit_name = temp;
			}
			
			temp = uni.getStorageSync('current_project_name');
			if (this.current_project_name != temp){
				this.current_project_name = temp;
			}
			
			///判断是否有当前的项目，否则显示默认
			// 要同步执行，获取project list后执行
			///*
			if (this.onload_flag == true){
				//onshow要比onload中调用getProjectList的速度快
				//这里不需要获取devicelist
				console.log("[my_home], it is onLoading, return");
				return;
			}
			
			//
			if (this.current_project_name == '' || this.current_project_name == null){
				console.log("[my_home],  load first project");
				//默认加载第一个项目，在设备列表里显示第一个项目的设备
				if(this.project_list.length>0){
					this.getDeviceList(this.project_list[0]);
					uni.setStorageSync('current_project_name', this.project_list[0]);
				}
				else{
					uni.setStorageSync('current_project_name', "");
					this.device_list = [];
				}
			}
			else{
				this.getDeviceList(this.current_project_name);
			}

	},
    methods: {
		getProjectList(account) {
			api.post({
				url: 'admin/get/own/project',
				data: {
					user_account: account,
				},
				success: data => {
					console.log("[my_home] admin/get/own/project", data);
					if (data.ret_code == 0) {
						this.loading = false;
						this.project_list=data.extra;
						console.log("[my_home] own project_list", this.project_list);	
						
						if (this.onload_flag == true){
							//默认加载第一个项目，在设备列表里显示第一个项目的设备
							this.onLoad_flag = false;
							console.log("[my_home] load first project");
							
							//默认加载第一个项目，在设备列表里显示第一个项目的设备
							if(this.project_list.length>0){
								this.current_project_name = this.project_list[0];
								uni.setStorageSync('current_project_name', this.current_project_name);
								this.getDeviceList(this.current_project_name);
							}
							else{
								uni.setStorageSync('current_project_name', "");
							}
						}
						
									
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
		getDeviceList(project_name) {
			console.log("[my_home] getDeviceList, project_name:", project_name);
			api.post({
				url: 'devunit/manage/list',
				data: {
					filter: {project_name: project_name},
				},
				success: data => {
					console.log("[my_home] getDeviceList success", data);
					if (data.ret_code == 0) {
						this.loading = false;
						this.device_list=data.extra;
						
						//保存当前设备的名称
						uni.setStorageSync('current_project', project_name);
						if (this.device_list.length >0){
							uni.setStorageSync('current_dev_cn_name', this.device_list[0].dev_cn_name);
							uni.setStorageSync('current_devunit_name', this.device_list[0].devunit_name);
						}
						else{
							uni.setStorageSync('current_dev_cn_name', "")
							uni.setStorageSync('current_devunit_name', "")
						}
						console.log("[my_home] device_list", this.device_list);
						
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
        handleOptionClick(index) {
			console.log("[my_home] handleOptionClick, index:", index);
            if (this.current !== index.currentIndex) {
                this.current = index.currentIndex;
            }
			//this.getDeviceList(this.project_list[this.current]);
        },
		handleProjectClick(project_list_id) {
			//console.log('[device_data], event.currentTarget.id:', event.currentTarget.id);
			console.log('[my_home], handleProjectClick:', project_list_id);
			this.current = 0;
			
			//切换项目后，默认项目名称在函数内部更新
			//更新默认设备
			this.current_project_name = this.project_list[project_list_id];
			this.getDeviceList(this.project_list[project_list_id]);
			uni.setStorageSync('current_project_name', this.current_project_name);
			
		
			this.closeDrawer();	
			
		},
		handleGridClick(event) {
			
			console.log('[my_home], handleGridClick:', event);
			var device_list_id = event.detail.index;

			if (0 == this.device_list.length){
				uni.showToast({
					duration: 1500,
					icon: 'none',
					title: "该项目绑定设备"
				});
				return;
			}
			if (device_list_id >= this.device_list.length){
			    device_list_id = 0;
			}
			
			//更新默认设备
			uni.setStorageSync('current_dev_cn_name', this.device_list[device_list_id].dev_cn_name);
			uni.setStorageSync('current_devunit_name', this.device_list[device_list_id].devunit_name);
			
			uni.navigateTo({
			url: '../yuntopo/xianning_ctrl/xianning_ctrl?id='+device_list_id
			+'&devunit_name='+this.device_list[device_list_id].devunit_name
			+'&devunit_id='+this.device_list[device_list_id].devunit_id
			+'&gateway_sn='+this.device_list[device_list_id].gateway_sn
			+'&dev_cn_name='+this.device_list[device_list_id].dev_cn_name
			});
	
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
	.grid-item {
		display: block;
		height: 160upx;
		width: 40%;
		text-align:center;
		display:flex;
	}
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
