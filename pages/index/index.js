// pages/index/index.js
var app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showWait : false , 	//显示等待框
		showAuth : false ,
		onOff : true ,
	},
	switchTab: function(e) {
		app.switchTab(e);
		app.setItem('agree', true) ;
		app.setItem('idProv', false) ;
		app.setItem('carProv', false) ;
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if(app.getItem('agree')){
			this.setData({onOff : false })
		}
		if(app.getItem('agree')){
			app.switchTab('/pages/findCar/index') ;
			app.setItem('showAd' , true) ;
		}
		this.requestData() ;
		app.setItem('showAd' , true) ;
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 获取手机号
	getPhoneNumber: function(e) {
		var selfThis = this;
		app.getPhoneNumber(e, function(data) {
			selfThis.setData({
				showWait : false ,
				showAuth : true ,
			})
		});
	},
	// 获取用户信息
	getUserInfo: function(e) {
		var selfThis = this;
		app.getUserInfo(e, function(data) {
			selfThis.setData({
				showAuth : false ,
			})
			wx.reLaunch({
				url: '/pages/index/index'
			})
		});
	},
	// 数据
	requestData : function(){
		var selfThis = this ;
		app.request('api/base_info' , {} , function(data){
			WxParse.wxParse('contentlist', 'html', data.agree_terms , selfThis, 0);
		})
	} ,
})