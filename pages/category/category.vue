<template>
	<view>		
	</view>
</template>
<script>	
	export default {
		data() {
			return {				
			}
		},
		onLoad: function() {
			const token=uni.getStorageSync('token')			
			if(token){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}else{
				uni.redirectTo({
					url:'/pages/login/login'
				})
			}
		}
	}
</script>
<style>	
</style>
