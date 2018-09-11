var app = getApp() ;
Page({
	data: {
		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var prevPage = app.getPrePage(); //上一个页面
		var list = prevPage.data.list , id = options.id , item = '' ;
		for(var i = 0 ; i < list.length ; i++){
			if(id == list[i].id){
				item = list[i] ;
				break ;
			}
		}
		this.setData({
			id : id ,
			item : item ,
			cargo_image : prevPage.data.cargo_image ,
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
	onShareAppMessage: function() {},
	// 跳转
	location: function(e) {
		app.location(e)
	},
	// 支付
	payment : function(){
		var user_id = this.data.item.user_id , prevPage = app.getPrePage() ;
		var selfThis = this , param = { cargo_source_id : this.data.id , car_user_id : app.u_resource , } ;
		app.request('api/create_order' , param , function(data){
			if(data == '付款成功'){
				app.successToast(data) ;
				prevPage.requestData() ;
				setTimeout(function(){
					app.location('/pages/contact_head/index?user_id='+user_id) ;
				},1000)
			}else{
				app.showModal(data);
			}
		})
	} ,
})