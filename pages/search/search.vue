<template>
	<view>
		<view class="search-box">
			<mSearch :mode="2" button="inside" @search="doSearch(false)" @confirm="doSearch(false)" v-model="keyword"></mSearch>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key" @tap='showDetail(value)'>
				<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
					<view class="uni-media-list-logo">
						<image :src="value.image_url ? value.image_url : '../../static/logo.png'"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top uni-ellipsis">{{value.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">发表于：{{value.datetime}}</view>
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
	import mSearch from '@/components/search-revision.vue'
	import {
		friendlyDate
	} from '@/common/util.js'
	export default {
		data() {
			return {
				listData: [],
				keyword: ""
			}
		},
		components: {
			mSearch
		},
		onLoad(option) {
			this.keyword = option.keywords
			//console.log(this.keyword)
			this.getList()
		},
		//下拉刷新
		onPullDownRefresh() {
			page = 1
			reachbottom = true
			this.listData = []
			this.getList()
		},
		// 加载更多
		onReachBottom: function() {
			if (reachbottom) {
				this.getList();
			}
		},
		methods: {
			/**
			 * 加载文章列表
			 */
			getList: function() {
				uni.showLoading()
				api.get({
					url: 'portal/search',
					data: {
						keyword: this.keyword,
						page: page + ',6',
						order: '+id',
						field: 'id,post_title,thumbnail,published_time,comment_count',
					},
					success: data => {
						//console.log(data);
						var newsList = data.data;
						var arr = newsList.map((news) => {
							return {
								id: news.id,
								title: news.post_title,
								datetime: friendlyDate(new Date(news.published_time.replace(/\-/g, '/')).getTime()),
								image_url: news.thumbnail,
								source: "",
							};
						});
						page++;
						uni.hideLoading();
						uni.stopPullDownRefresh();
						if (newsList == '') {
							reachbottom = false
							uni.showToast({
								"title": "已经加载全部",
								icon: "none",
								duration: 500
							});
						} else {
							this.listData = this.listData.concat(arr);
						}
					}
				});
			},
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword
				this.keyword = key
				page = 1
				reachbottom = true
				this.listData = []
				this.getList()
			},
			//跳转详情页
			showDetail(detail) {
				uni.navigateTo({
					url: '/pages/article/article?query=' + encodeURIComponent(JSON.stringify(detail))
				});
			}
		}
	}
</script>

<style>
	.search-box {
		width: 95%;
		background-color: rgb(242, 242, 242);
		padding: 7.5px 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.uni-media-list-logo {
		width: 100upx;
		height: 100upx;
	}
</style>
