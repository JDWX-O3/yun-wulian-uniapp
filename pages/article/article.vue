<template>
	<view>
		<view class="banner">
			<image class="banner-img" :src="banner.image_url"></image>
			<view class="banner-title">{{banner.title}}</view>
		</view>
		<view class="article-meta">
			<text class="article-author" v-if="banner.source">{{banner.source}}</text>
			<text class="article-time">{{banner.datetime}}</text>
			<text class="article-see">浏览量:{{hits_count}}</text>
		</view>
		<view v-if="!ismark" class="article-content">
			<text class="article-excerpt">{{excerpt}}</text>
			<view v-html="content"></view>
		</view>
		<view v-if="ismark" class="article-content2">
			<text class="article-excerpt2">{{excerpt}}</text>
			<view v-for="(item,index) in content" :key="index" :style="item.style">
				<p v-show="item.tagType == 'p'">{{item.value}}</p>
				<image :src="item.value" mode="widthFix" v-show="item.tagType == 'image'" style="width: 100%;"></image>
			</view>
		</view>
		<!-- 底部选项 -->
		<view class="flex article-footer-action-bar share-btn" style="">
			<view class="flex__item text-center" hover-class="action-bar-item-active" bindtap="onLikeTap" @tap="doFavorite">
				<button>
					<uni-icon type="star" size="28"></uni-icon>
					<view class="text-text">
						{{favorites_count}}
					</view>
				</button>
			</view>
			<view class="flex__item text-center" hover-class="action-bar-item-active" @tap="doLike">
				<button>
					<uni-icon type="checkmarkempty" size="38"></uni-icon>
					<view class="text-text">
						{{like_count}}
					</view>
				</button>
			</view>
			<view class="flex__item text-center" hover-class="action-bar-item-active" @tap="comment">
				<button>
					<uni-icon type="chatbubble" size="30"></uni-icon>
					<view class="text-text">
						{{comment_count}}
					</view>
				</button>
			</view>
			<!--  #ifdef  MP-WEIXIN	 -->
			<view class="flex__item text-center" hover-class="action-bar-item-active">
				<button open-type="share">
					<uni-icon type="redo" size="30"></uni-icon>
				</button>
			</view>
			<!--  #endif -->
		</view>
	</view>
</template>
<script>
	var FAIL_CONTENT = '<p>获取信息失败</p>',
		api = require('@/common/api.js')
	import uniIcon from "@/components/uni-icon.vue"
	export default {
		data() {
			return {
				banner: {},
				content: '',
				excerpt: '',
				comment_count: 0,
				like_count: 0,
				favorites_count: 0,
				hits_count: 0,
				ismark: false
			}
		},
		components: {
			uniIcon
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: '/pages/article/article?query=' + encodeURIComponent(JSON.stringify(detail))
			}
		},
		onLoad(event) {
			if (!event.id) {
				try {
					this.banner = JSON.parse(decodeURIComponent(event.query));
					//console.log(this.banner);
				} catch (error) {
					this.banner = JSON.parse(event.query);
				}
				this.excerpt = this.banner.desc;
				this.getDetail();
				uni.setNavigationBarTitle({
					title: this.banner.title
				});
			} else {
				api.get({
					url: '/portal/articles/' + event.id,
					success: (result) => {
						//console.log(result);
						if (result.code == 1) {
							var res = result.data
							//console.log(result.data);
							this.banner.id = res.id;
							this.banner.title = res.post_title;
							this.banner.datetime = res.published_time;
							this.banner.image_url = res.thumbnail;
							this.content = res.post_content;
							this.excerpt = res.post_excerpt;
							this.comment_count = res.comment_count;
							this.like_count = res.post_like;
							this.favorites_count = res.post_favorites;
							this.hits_count = res.post_hits;
						} else {
							this.content = FAIL_CONTENT;
						}
					}
				});
			}
		},
		methods: {
			getDetail() {
				api.get({
					url: '/portal/articles/' + this.banner.id,
					success: (result) => {
						if (result.code == 1) {
							var res = result.data;
							if (res.post_format == 2) {
								this.ismark = true;
								this.content = JSON.parse(res.post_content)
							} else {
								this.content = res.post_content
							}
							this.excerpt = res.post_excerpt;
							this.comment_count = res.comment_count;
							this.like_count = res.post_like;
							this.favorites_count = res.post_favorites;
							this.hits_count = res.post_hits;
						} else {
							this.content = FAIL_CONTENT;
						}
					}
				});
			},
			//文章收藏
			doFavorite() {
				var that = this
				api.get({
					url: 'user/favorites/hasFavorite',
					data: {
						object_id: that.banner.id,
						table_name: 'portal_post'
					},
					success: data => {
						if (data.code == 1) {
							api.post({
								url: 'portal/articles/cancelFavorite',
								data: {
									id: that.banner.id
								},
								success: res => {
									if (res.code == 1) {
										that.favorites_count--
										uni.showToast({
											title: res.msg,
											duration: 1500,
											icon: 'success'
										});
									}
									//console.log(data);
								}
							});
						}
						if (data.code == 0) {
							api.post({
								url: 'portal/articles/doFavorite',
								data: {
									id: that.banner.id
								},
								success: res => {
									if (res.code == 1) {
										that.favorites_count++
										uni.showToast({
											title: res.msg,
											duration: 1500,
											icon: 'success'
										});
									}
									//console.log(data);
								}
							})
						}
						//console.log(data);
					}
				});
			},
			//点赞
			doLike() {
				var that = this
				api.post({
					url: 'portal/articles/doLike',
					data: {
						id: that.banner.id
					},
					success: data => {
						if (data.code == 1) {
							that.like_count++
							uni.showToast({
								title: data.msg,
								duration: 1500,
								icon: 'success'
							})
						}
						if (data.code == 0) {
							uni.showToast({
								title: data.msg,
								duration: 1500,
								icon: 'none'
							})
						}
						//console.log(data);
					}
				});
			},
			comment() {
				uni.navigateTo({
					url: '/pages/comment/comment?id=' + this.banner.id
				})
			},
		}
	}
</script>
<style>
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
		height: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.article-meta {
		padding: 20upx 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-excerpt {
		padding: 20upx 0upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26upx;
		line-height: 50upx;
		margin: 0 20upx;
	}

	.article-author,
	.article-time,
	.article-see {
		margin-right: 20upx;
		font-size: 30upx;
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		padding-bottom: 60px;
	}

	.article-excerpt2 {
		padding-left: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-content2 {
		overflow: hidden;
		font-size: 30upx;
		padding-bottom: 60px;
		padding: 20upx;
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


	.action-bar-item-active {
		background: #f9f9f9;
	}


	.share-btn button {
		background: transparent;
	}

	.share-btn button:after {
		border: none;
	}

	.flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.flex__item {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	.text-center {
		text-align: center;
	}

	.text-text {
		font-size: 12px;
		display: inline-block;
		vertical-align: top;
	}

	.uni-icon uni-icon-eye {
		line-height: 4 !important;
	}
</style>
