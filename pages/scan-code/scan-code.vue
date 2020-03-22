<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">			
			<view class="uni-btn-v">
				<button type="primary" @click="scan">扫一扫</button>
			</view>
			<!--<view class="uni-title">扫码结果：</view>
			<view class="uni-list" v-if="result">
				<view class="uni-cell">
					<view class="scan-result">
						{{result}}
					</view>
				</view>
			</view>-->
			<view class="box">
				<view class="title" style="margin-top:50rpx">设备信息</view>
				<t-table>
					<t-tr>
						<t-th>编号</t-th>
						<t-th>类别</t-th>
						<t-th>品牌</t-th>
						<t-th>型号</t-th>
					</t-tr>
					<t-tr>
						<t-td>{{devinfo.id}}</t-td>
						<t-td>{{devinfo.sblb}}</t-td>
						<t-td>{{devinfo.sbpp}}</t-td>
						<t-td>{{devinfo.sbxh}}</t-td>
					</t-tr>
					<t-tr>
						<t-th>序列号</t-th>
						<t-th>使用单位</t-th>
						<t-th>设备状态</t-th>
						<t-th>维护日期</t-th>
					</t-tr>
					<t-tr>
						<t-td>{{devinfo.sbsn}}</t-td>
						<t-td>{{devinfo.sydw}}</t-td>
						<t-td>{{devinfo.sbzt}}</t-td>
						<t-td>{{devinfo.whrq}}</t-td>
					</t-tr>
				</t-table>
        	</view>
		</view>
	</view>
</template>
<script>
	import permision from "@/common/permission.js";
	import tTable from '@/components/t-table/t-table.vue';
    import tTh from '@/components/t-table/t-th.vue';
    import tTr from '@/components/t-table/t-tr.vue';
    import tTd from '@/components/t-table/t-td.vue';
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				title: 'scanCode',
				result: '',
				devinfo:''
			}
		},
		components: {
            tTable,
            tTh,
            tTr,
            tTd
        },
		methods: {
			async scan() {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
				    return;
				}
				// #endif
				uni.scanCode({
					success: (res) => {
						this.result = res.result;
						api.post({
							url: 'device/Lists/devinfo',
							data: {
								sbsn: res.result							
							},
							success: data => {								
								if (data.code == 1) {
									this.loading = false;
									this.devinfo = data.data;
									uni.showToast({
										duration: 500,
										title: data.msg
									});								
								}
								if (data.code == 0) {
									this.loading = false;
									uni.showToast({
										duration: 1500,
										icon: 'none',
										title: data.msg
									});
								}
							}
						})
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要使用您的相机，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				});
			}
			// #ifdef APP-PLUS
			,
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			}
			// #endif
		}
	}
</script>

<style>
	.scan-result {
		min-height: 50upx;
		line-height: 50upx;
	}
</style>
