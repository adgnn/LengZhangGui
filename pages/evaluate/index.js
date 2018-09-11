// pages/about/index.js
var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		starNumber : 1 ,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.requestData(options.by_comment_user_id , options.order_id) ;
		this.setData({
			by_comment_user_id : options.by_comment_user_id ,
			order_id : options.order_id ,
		})
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
	onShareAppMessage: function() {} ,
	// 评价点击
	starNumber: function(e) {
		var index = app.getParam(e).index,
			starNumber = this.data.starNumber;
		this.setData({
			starNumber: index + 1,
		})
	},
	// 数据
	requestData : function(by_comment_user_id , order_id){
		var selfThis = this , param = { user_id : by_comment_user_id , order_id : order_id , } ; 
		app.request('api/get_userlist' , param , function(data){
			data.order_time = app.timestampToTime(data.order_time) ;
			selfThis.setData({
				item : data ,
			})
		})
	} ,
	// 提交评价
	evaluate : function(){
		var by_comment_user_id = this.data.by_comment_user_id , order_id = this.data.order_id , starNumber = this.data.starNumber ;
		var selfThis = this , param = { order_id : order_id , by_comment_user_id : by_comment_user_id , comment_user_id : app.u_resource , star_level : starNumber } ;
		app.request('api/comment_add' , param , function(data){
			app.successToast(data) ;
			setTimeout(function(){
				app.switchTab('/pages/Personal/index') ;
			} , 1000)
		})
	} ,
})