<template>
	<view>
		<view class="image_gzh">
			 <text style="font-size:40upx">{{device_name}}</text>
		</view>
		<image mode="aspectFit" :src="topo_src" style="width: 100%;"  />
		<!--
		<view>
			<text class="swiper-item">{{run_status_string}}</text>
		</view>
		-->
		<view class="button-sp-area">
			<button class="mini-btn-right" type="primary" @click="devstart" :disabled="button_start_disable" size="mini">启动</button>
			<button class="mini-btn-left" type="warn" @click="devstop" :disabled="button_stop_disable" size="mini">停止</button>

			<!-- <button type="primary" @click="share">分享</button> -->
		</view>
		
		<ul class="box">
				<li class="text">原水泵启停状态：{{show_value[0]}}</li>
				<li class="text">混合泵启停状态：{{show_value[1]}}</li>
				<li class="text">1#制氧机启停状态：{{show_value[2]}}</li>
				<li class="text">2#制氧机启停状态：{{show_value[3]}}</li>
				<li class="text">运行电流值：{{show_value[4]}}</li>
				<li class="text">进水流量值：{{show_value[5]}}</li>
				<li class="text">出水压力值：{{show_value[6]}}</li>
		</ul>
	</view>
</template>

<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				updateTimer:"",
				button_start_disable: false,
				button_stop_disable: false,
				run_status_string: "停止",
				gateway_sn:"",
				devunit_name:"",
				device_name:"",
				devunit_id:10000,
				send_fail_count:0,
				real_data_list: [],
				show_value:[0,0,0,0,0,0,0,0,0,0,0],
				topo_src:"../../../static/wushui.png",
				topo_src_start:"../../../static/wushui-start.png",
				topo_src_stop:"../../../static/wushui-stop.png",
				topo_src_down:"../../../static/wushui-down.png"
				
				
			}
		},
		onLoad(option) {
		
			console.log("[topo] onLoad...., option:", option);
			this.gateway_sn = option['gateway_sn'];
			this.devunit_name = option['devunit_name'];
			this.devunit_id = option['devunit_id'];
			this.device_name = option['device_name'];
			
			//console.log("[topo], gateway_sn", this.gateway_sn);
			//console.log("[topo], devunit_name", this.devunit_name);
			//console.log("[topo], devunit_id", this.devunit_id);
			
			
			//this.real_data_list = uni.getStorageSync('cur_real_list');
			//console.log("[topo], real_data_list", this.real_data_list);
			
			//
			this.getDeviceRealData(this.devunit_name);
		},
		onShow() {
			console.log("[topo], onShow....", this.devunit_name);
			this.timerGetRealData();
		},
		onHide() {
			console.log("[topo], onHide....");
			if(this.updateTimer != ''){
				clearInterval(this.updateTimer);
				console.log('[topo] clear timer,' + this.updateTimer);
				this.updateTimer = '';
			}
		},
		onUnload () {
			console.log("[topo], onUnload....");
			if(this.updateTimer != ''){
				clearInterval(this.updateTimer);
				console.log('[topo] clear timer,' + this.updateTimer);
				this.updateTimer = '';
			}
		},
		/** tab点击 */
		onTabItemTap(item) {
			console.log("[topo], onTabItemTap....", item)
		},
		methods: {		
			timerGetRealData() {
				let self = this;
				//如果timer存在就直接返回, 这里数据每分钟更新一次
				if (self.updateTimer != ''){
					console.log('[topo] timer exist, return');
					return;
				}
				
				 self.updateTimer = setInterval(function(){
					console.log('[topo] timer process realdata, id:', self.updateTimer);
					self.getDeviceRealData(self.devunit_name);
				},60000);
				console.log("[topo], start timer", self.updateTimer);
			},
			getDeviceRealData(devunit_name) { 
				api.post({
					url: 'gateway/real/data',
					data: {
						filter: {
						  devunit_name: devunit_name
						}
					},
					success: data => {
						console.log("[topo] gateway/real/data", data);
						this.send_fail_count=0;
						if (data.ret_code == 0) {
							this.loading = false;
							this.real_data_list = data.extra;
							this.devunit_id = this.real_data_list['devunit_id'];
							
							//刷新页面的各个组态数据
							this.update_page_topo();
						}
						if (data.ret_code != 0) {
							this.loading = false;
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: data.ret_msg
							});
							
							this.button_stop_disable=true;
							this.button_start_disable=true;
							this.run_status_string = "未更新";
							this.topo_src = this.topo_src_down;
						}
					},
					
					fail: function(res) {
						this.send_fail_count++;
						if (this.send_fail_count > 1){
							this.button_stop_disable=true;
							this.button_start_disable=true;
							this.run_status_string = "未更新";
							this.topo_src = this.topo_src_down;
						}
					},
				})
			},
			update_page_topo(){
				var varList = this.real_data_list['data'];
				console.log('[topo] update_page_topo');
				for (let i =0; i<varList.length;i++){
					//console.log('[topo] id:', i, ", varList:", varList[i]);
					if (varList[i].varName == '原水泵启停'){
						if(varList[i].varValue == '1'){
							this.show_value[0] = "运行"
						}
						else{
							this.show_value[0] = "停止"									
						}
					}
					
					if (varList[i].varName == '混合泵启停'){
						if(varList[i].varValue == '1'){
							this.show_value[1] = "运行"
						}
						else{
							this.show_value[1] = "停止"									
						}
					}
					
					if (varList[i].varName == '制氧-臭氧启停1'){
						if(varList[i].varValue == '1'){
							this.show_value[2] = "运行"
						}
						else{
							this.show_value[2] = "停止"									
						}
					}
					
					if (varList[i].varName == '制氧-臭氧启停2'){
						if(varList[i].varValue == '1'){
							this.show_value[3] = "运行"
						}
						else{
							this.show_value[3] = "停止"									
						}
					}
					
					if (varList[i].varName == '运行电流值'){
						this.show_value[4] = varList[i].varValue + ' A';
					}
					if (varList[i].varName == '进水流量值'){
						this.show_value[5] = varList[i].varValue + ' M3/h';
					}
					if (varList[i].varName == '出水压力值'){
						this.show_value[6] = varList[i].varValue + ' Mpa';
					}
					
					
					//刷新启动状态
					if (varList[i].varName == "一键启动状态"){
						if(varList[i].varValue == '1'){
							this.button_stop_disable=false;
							this.button_start_disable=true;
							this.run_status_string = "运行";
							this.topo_src = this.topo_src_start;
						}
						else{
							this.button_stop_disable=true;
							this.button_start_disable=false;
							this.run_status_string = "停止";
							this.topo_src = this.topo_src_stop;
						}
					}
				}
			},
			remote_wirte_value(var_id, var_name, value){
				let self = this;
				
				console.log("[topo], gateway_sn", this.gateway_sn);
				console.log("[topo], devunit_name", this.devunit_name);
				console.log("[topo], devunit_id", this.devunit_id);
				
				console.log("[topo], var_id", var_id);
				console.log("[topo], var_name", var_name);
				console.log("[topo], value", value);
				
				self.loading = true;
				api.post({
					url: 'cmd/exec/remote/set',
					data: {
						'gw_sn':this.gateway_sn,
						'devunit_name':this.devunit_name,
						'dev_id':this.devunit_id,
						'var_id':var_id,
						'var_name':var_name,
						'var_value':value
					},
					success: (data, header) => {
						console.log("[topo] remote set...", data);
						if (data.ret_code == 0) {
							this.loading = false;
							console.log("[topo] set ok", data);
							if (var_name == '远程启动'){
								this.button_stop_disable=false;
								this.button_start_disable=true;
								this.run_status_string = "运行";
								this.topo_src = this.topo_src_start;
							}
							if (var_name == '远程停止'){
								this.button_stop_disable=true;
								this.button_start_disable=false;
								this.run_status_string = "停止";
								this.topo_src = this.topo_src_stop;
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
			devstart(devunit_name) { 
				//this.button_stop_disable=false;
				//this.button_start_disable=true;
				//this.run_status_string = "运行";
				
				var varList = this.real_data_list['data'];
				if (varList.length <= 0){
					uni.showToast({
						duration: 1500,
						icon: 'none',
						title: "组态数据错误"
					});
					return;
				}
				
				var var_id = 65535;
				var var_name = '';
				for (let i =0; i<varList.length;i++){
					if (varList[i].varName == '远程启动'){
						var_id = varList[i].varId;
						var_name = varList[i].varName;
						break;
					}
				}
				
				this.remote_wirte_value(var_id, var_name, "1");
			},
			
			devstop(devunit_name) { 
				//this.button_stop_disable=true;
				//this.button_start_disable=false;
				//this.run_status_string = "停止";
			
			

				var varList = this.real_data_list['data'];
				if (varList.length <= 0){
					uni.showToast({
						duration: 1500,
						icon: 'none',
						title: "组态数据错误"
					});
					return;
				}
				
				var var_id = 65535;
				var var_name = '';
				for (let i =0; i<varList.length;i++){
					if (varList[i].varName == '远程停止'){
						var_id = varList[i].varId;
						var_name = varList[i].varName;
						break;
					}
				}

				this.remote_wirte_value(var_id, var_name, "1");
			}
		}
	}
</script>

<style>

	* {
	margin: 0;
	padding: 0;
	}
	.button-sp-area {
		margin: 0 auto;
		width: 60%;
	}

	.mini-btn-right {
		margin-right: 10upx;
	}
	
	.mini-btn-left {
		margin-left: auto;
		float:right
	}
	.label-2-text {
		text-align: center;
		width: 100%;
	}
	.swiper-item {
		height: 30upx;
		width: 40%;
		text-align:center;
		display:flex;
	}
	
	.grid-item {
		display: block;
		height: 40upx;
		width: 40%;
		text-align:center;
		display:flex;
	}
	
	.right{
	    position:absolute; /*右栏定位过去*/
	    top:0px;
	    right:0px;
	    background-color:#fcc;
	    width:100px;
	    height:100px;
	    /*opacity:0.5; /*半透明*/
	}
	.mid{
	    position:absolute;/*定位到右栏左边正好相邻的地方*/
	    top:0px;
	    right:100px;
	    background:cornflowerblue;
	    width:100px;
	    height:100px;
	}
	.left{
	    background-color:yellow;
	    height: 100px;
	    /*不设置宽，默认占整行*/
	    margin-right:200px;
	    /*设置右边框，使其刚好让出中栏和右栏的位置*/
	}
	ul,li{
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.box{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:space-between;
	}
	.box li{
		width: calc(50% - 5px);
		height: 30px;
		background:mistyrose;
		margin: 5px 0;
	}	
	.image_gzh {
        display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
		margin: 0,auto;
		text-align: center;
	}
</style>
