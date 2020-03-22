<template>
	<!--<view class="content" :style="{backgroundImage:`url(${'http://yun.jdwanxiang.com/h5/static/wushui.png'})`,backgroundSize: 'cover'}">-->

	<view>
		<!--
		<view class="image-content">
		    <image style="width: 200px; height: 200px; background-color: #eeeeee;" :mode="center" :src="src" ></image>
		</view>
		<bw-swiper :swiperList="swiperList" style="width:100%"></bw-swiper>
		-->
		<view class="text_gzh">
			 <text style="font-size:48upx;color: #4790EF;">\n欢迎体验金大万翔物联网平台</text>
			 <text style="font-size:32upx;color: #4790EF;">\n\n环保领域的工业4.0</text>
		</view>
		<view class="image_gzh">
		    <image :mode="center" :src="src" ></image>
		</view>
		<!--
		<view >
			 <text style="text-align: center;">金大万翔物联网管理平台是为客户提供物联网管控的平台, 用户名和密码请您联系销服人员获取</text>
		</view>
		<view class="image-content">
		    <image style="image_gzh" :mode="center" :src="gzhsrc" ></image>
		</view>
		-->
				
		<!--
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
			<swiper-item>
				<view class="swiper-item uni-bg-red">'http://yun.jdwanxiang.com/h5/static/jdwx/jdwx.png'</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item uni-bg-green">"swiperList[0].img"</view>
			</swiper-item>
			<swiper-item>
            <view class="swiper-item">
                    <image style="image_item" :mode="scaleToFill" :src="src"></image>
                </view>
			</swiper-item>
		</swiper>
		-->
		       
		

		<view class="other_login">
			<button class="landing" type="primary" @click="forlogin">我要体验</button>
		</view>
	</view>
</template>

<script>
	var api = require('@/common/api.js')
	import bwSwiper from '@/wxcomponents/bw-swiper/bw-swiper.vue'
	export default {
    components: {bwSwiper},
		data() {
			return {
				loading: false,
				src: 'http://yun.jdwanxiang.com/h5/static/wulianwang.png',
				gzhsrc: '../../static/gongzhonghao.png',
				swiperList:[
					{
						img: 'http://yun.jdwanxiang.com/h5/static/jdwx/jdwx.png',
						text:'金大万翔',
					},
					{
						img: 'http://yun.jdwanxiang.com/h5/static/jdwx/jigui.png',
						text:'机柜室产品',			
					},
					{
						img: 'http://yun.jdwanxiang.com/h5/static/jdwx/jzx2.png',
						text:'集装箱式产品',			
					},
				]				
			}
		},
		onLoad() {
			
			uni.clearStorageSync()
			uni.setStorageSync('cookie', "programmer=test")
			uni.setStorageSync('token', "czj")
			uni.setStorageSync('current_project_name', "");
			uni.setStorageSync('current_dev_cn_name', "");
			uni.setStorageSync('current_devunit_name', "");
			uni.setStorageSync('cookie', "");
			uni.setStorageSync('relogin', "");
			
		},
		
		onShow() {
			uni.hideLoading();
			
		},
		methods: {
			
			forlogin() { 
				console.log("[forlogin]....");
				
				//#ifdef MP-WEIXIN
				uni.showLoading({
					title: '登录中...'
				});
				
				this.wxlogin();
				//#endif
			
				//#ifdef H5
				uni.navigateTo({
					url: '../login/login?username=usertest&password=123456&source=advert'
				});
				//#endif
			
				console.log("[forlogin]....");
			},
			
			//登录
			wxlogin() {
				let _this = this;

			   // 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						console.log("[advert] get weixin code", code);
						
						api.post({
							url: 'wechat/jscode2session',
							data: {
			                    js_code: code,
			                    nick_name: "jscode2session"
							},
							success: (data, header) => {
								console.log("[advert] recv jscode2session", data);
								if (data.ret_code == 0) {
									if (header.hasOwnProperty('set-cookie')){
										//console.log("set-cookie:", rlt.header['set-cookie']);
										let n=header['set-cookie'].indexOf(";");
										let sessionid = header['set-cookie'].substring(0, n);
										console.log('[advert] recv sessionid:', sessionid);
									
										//保存cookie， wxRequest 发送时读取Cookie，填写到http 头中
										// jscode2session 后台处理中填写账号，用户类型
										// 必须使用sessionid，session保存在后台，SID是key
										// 必须有cookie
										uni.setStorageSync("cookie", sessionid);
									}
									
									/*					
									uni.navigateTo({
										url: '../login/login'
									});	
									*/
									uni.navigateTo({
										url: '../login/login?username=usertest&password=123456&source=advert'
									});
								}
								if (data.ret_code != 0) {
									uni.showToast({
										duration: 1500,
										icon: 'none',
										title: data.ret_msg
									});
								}
								
								//				
								uni.hideLoading();
							}
						})
						
						
					},
				});
			},
		}
	}
</script>

<style>


	.button-sp-area {
		height: 30upx;
		margin: 0 auto;
		width: 50%;
	}
	
	/* 其他登录方式 */
	.other_login{
		width: 80%;
		margin: 0 auto;
		justify-content: center;
		align-items: center;
		margin-top: 20%;
		text-align: center;
	}
	/* 底部 */
	.footer{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 64upx;
		color: rgba(0,0,0,0.7);
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}
	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left, #86B5F4, #4790EF);
	}

	.text_gzh {
		justify-content: center;
		align-items: center;
		height: 180px;
		margin: 0,auto;
		text-align: center;
	}
	
	.image_gzh {
	    display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
