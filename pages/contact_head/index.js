// pages/contact_head/index.js
var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.requestData(options.user_id);
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
	// 拨打电话
	makePhone: function() {
		var phone = this.data.item.user_phone;
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
	// 数据
	requestData: function(user_id) {
		var selfThis = this,
			param = {
				user_id: user_id,
			};
		app.request('api/get_userlist', param, function(data) {
			selfThis.setData({
				item: data,
			})
		})
	}
})