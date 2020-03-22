import Vue from 'vue'
import App from './App'

Vue.prototype.islogin = function() {
	var isLogin = uni.getStorageSync('login');
	if (!isLogin) {
		uni.navigateTo({
			url: '../login/login'
		});
		return false
	}else{
		return true
	}
}

Vue.config.productionTip = false

App.mpType = 'app'

var app = new Vue({
	...App
})
app.$mount()
