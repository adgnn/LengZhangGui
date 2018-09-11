// pages/about/index.js
var app = getApp() , inputContent = {} ;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.requestData() ;
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
	// 更新表单
	inputContent: function(e) {
		var input = app.getParam(e).id,
			tmpValue = {
				[input]: e.detail.value
			};
		Object.assign(inputContent, tmpValue);
	},
	// 数据
	requestData : function(){
		var selfThis = this , param = { user_id : app.u_resource ,} ;
		app.request('api/get_userlist' , param , function(data){
			selfThis.setData({
				user_info : data ,
			})
			inputContent.nickname = data.nickname ;
		})
	} ,
	// 修改
	save : function(){
		var selfThis = this , prevPage = app.getPrePage() ;
		inputContent.user_id = app.u_resource ;
		app.request('api/save_nickname' , inputContent , function(data){
			app.successToast(data) ;
			prevPage.reuqestData() ;
			setTimeout(function(){
				app.back() ;
			} , 1000)
		})
	}
})