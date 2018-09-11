// pages/Personal/index.js
var app = getApp() ;
Page({
	data: {
		banner_list: [],
		indicatorDots: true,
		autoplay: false,
		interval: 3000,
		duration: 300 ,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.reuqestData() ;
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		
	},
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
	onPullDownRefresh: function() {
		var selfThis = this;
		app.dropDown(this , function(){
			selfThis.reuqestData();
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {} ,
	// 跳转
	navigateTo : function(e) {
		app.navigateTo(e)
	},
	// 拨打电话
	makePhone: function() {
		var phone = this.data.customer_number;
		if (!phone) {
			app.showModal('未设置电话！');
			return;
		}
		wx.makePhoneCall({
			phoneNumber: phone, //仅为示例，并非真实的电话号码
			success: function(res) {
				console.log(res);
			},
			fail: function() {
				app.showModal('拨打失败，号码已复制粘贴板！');
				wx.setClipboardData({
					data: phone,
				});
			}
		})
	},
	reuqestData : function(){
		var selfThis = this , param = { user_id : app.u_resource } ;
		app.request('api/member_center' , param , function(data){
			selfThis.setData({
				banner_list : data.banner_list ,
				user_info : data.user_info ,
				customer_number : data.customer_number ,
			})
		}) ;
		app.request('api/base_info' , {} , function(data){
			selfThis.setData({
				start_score_record : data.start_score_record ,
				StartMemberApprove : data.StartMemberApprove ,
			})
		})
	} ,
})