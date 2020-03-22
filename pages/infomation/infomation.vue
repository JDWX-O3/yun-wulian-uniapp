<template>
	<view>
		<view class="face">
			<image :src="userinfo.avatar ? userinfo.avatar : '../../static/toux.jpg'" @tap="avatar"></image>
			<view @tap="avatar">上传头像</view>
		</view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-title">昵称</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" name="nickname" :value="userinfo.user_nickname" placeholder="请填写您的昵称" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">出生日期</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								当前选择
							</view>
							<view class="uni-list-cell-db">
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" name="date">
									<view class="uni-input">{{date == 0 ? '1990-01-01' : date}}</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">性别</view>
					<radio-group class="uni-flex" name="sex">
						<label v-if="userinfo.sex == 1">
							<radio value="0" />男
						</label>
						<label v-if="userinfo.sex == 0">
							<radio value="0" checked />男
						</label>
						<label v-if="userinfo.sex == 1">
							<radio value="1" checked />女
						</label>
						<label v-if="userinfo.sex == 0">
							<radio value="1" />女
						</label>
					</radio-group>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">提交</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	var api = require('@/common/api.js')
	export default {
		data() {
			return {
				userinfo: "",
				date: '',
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad() {
			this.userinfo = uni.getStorageSync('user')
			this.date = this.userinfo.birthday
		},
		methods: {
			avatar() {
				var that = this
				//上传头像
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //从相册选择
					success: function(res) {
						api.uploadFile({
							url: 'user/upload/one',
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								//console.log(uploadFileRes)
								if (uploadFileRes.code == 0) {
									uni.showToast({
										title: uploadFileRes.msg,
										mask: false,
										duration: 1500
									});
								} else {
									api.post({
										url: 'user/profile/userInfo',
										data: {
											avatar: uploadFileRes.data.url
										},
										success: (data) => {
											console.log(data)
											if (data.code == 1) {
												uni.setStorageSync('upload', 1);
												that.userinfo.avatar = res.tempFilePaths[0]
												uni.showToast({
													title: '修改头像成功',
													icon: "success",
													duration: 2000
												})
											}
											if (data.code == 0) {
												uni.showToast({
													title: '修改头像失败',
													icon: "none",
													duration: 2000
												})
											}
										}
									})
								}
							}
						})
					}
				})
			},
			formSubmit: function(e) {
				var value = e.detail.value
				var info = this.userinfo
				if (value.nickname == "") {
					uni.showToast({
						title: '昵称不能为空',
						duration: 1500,
						icon: "none"
					});
					return
				}
				if (value.nickname == info.user_nickname && value.date == info.birthday && value.sex == info.sex) {
					uni.showToast({
						title: '信息无变化',
						duration: 1500,
						icon: "none"
					});
					return
				}
				api.post({
					url: 'user/profile/userInfo',
					data: {
						user_nickname: value.nickname,
						birthday: this.date,
						sex: value.sex
					},
					success: (data) => {
						//console.log(data)
						if (data.code == 1) {
							uni.setStorageSync('upload', 1);
							uni.showToast({
								title: data.msg,
								icon: "success",
								duration: 500
							})
							setTimeout((e => {
								uni.navigateBack();
							}), 500);
						}
						if (data.code == 0) {
							uni.showToast({
								title: data.msg,
								icon: "none",
								duration: 1000
							})
						}
					}
				})
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				var date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style>
	page {
		background-color: #f1f1f1
	}

	.face {
		text-align: center;
		padding-top: 60upx;
	}

	.face image {
		width: 150upx;
		height: 150upx;
		border-radius: 100%
	}
</style>
