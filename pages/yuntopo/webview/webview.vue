<template>
    <view>
        <web-view :webview-styles="webviewStyles" src="http://yun.jdwanxiang.com/h5"></web-view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
