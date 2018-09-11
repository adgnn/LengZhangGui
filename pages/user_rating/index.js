// pages/user_rating/index.js
var app = getApp();
Page({
	data: {
		list: [],
		page: 1, //当前页数--必须
		countPage: 1, //总页数--必须
		hasMore: true, //更多--必须
		showWait: false, //显示等待框
		pagesize: 10, //每页显示条数
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			page : 1 ,
		})
		this.requestData(0);
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
		 selfThis.requestData(0);
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		var selfThis = this;
		app.onThePull(this, function() {
			selfThis.requestData(1);
		});
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 跳转
	navigateTo: function(e) {
		app.navigateTo(e)
	},
	// 数据
	requestData: function(type) {
		var pagesize = this.data.pagesize,
			page = this.data.page;
		var selfThis = this,
			param = {
				order_status: 5,
				user_id: app.u_resource,
				page: page,
				pagesize: pagesize,
			};
		var listArr = [], listArrT = [];
		app.request('api/order_list', param, function(data) {
			for (var i = 0; i < data.list.length; i++) {
				data.list[i].start_address = data.list[i].start_address.split('/');
				data.list[i].end_address = data.list[i].end_address.split('/');
				data.list[i].create_time_format = data.list[i].create_time_format.split(' ');
			}
			for (var i = 0; i < data.list.length; i++) {
				if(data.list[i].is_car && data.list[i].car_comment == 2){
					listArr.push(i) ;
				}else if(data.list[i].is_cargo && data.list[i].cargo_comment == 2){
					listArr.push(i);
				} else if (data.list[i].order_status == 6){
					listArr.push(i);
				}
			}
			if (listArr.length !=0){
				for (var i = 0; i < listArr.length ; i++){
					data.list.splice(listArr[i], 1 , '');
				}
			}
			for (var i = 0; i < data.list.length; i++){
				if (data.list[i] != ''){
					listArrT.push(data.list[i]);
				}
			}
			data.list = listArrT ;
			app.loadList(type, data, selfThis);
		}, true)
	},
})