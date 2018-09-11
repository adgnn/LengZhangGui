var app = getApp() ;
Page({
	data: {
		list: [],
		orderArr: [],
		orderIndex: 0,

		master : 2 ,		//车主或者货主
		orderStatus : 2 ,	//订单状态

		page : 1 , 			//当前页数--必须
		countPage : 1 ,  	//总页数--必须
		hasMore : true , 	//更多--必须
		showWait : false , 	//显示等待框
		pagesize : 10 ,		//每页显示条数
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.requestData(0,0) ;
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		
		// this.setData({
		// 	orderIndex: 0,
		// 	page : 1 ,
		// }) ;
		
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
		var selfThis = this , orderArr = this.data.orderArr , orderIndex = this.data.orderIndex ;
		var id = orderArr[orderIndex].id ;
		// this.setData({
		// 	page : 1 ,
		// }) ;
		app.dropDown(this , function(){
			selfThis.requestData(0,id);
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		// var selfThis = this , orderArr = this.data.orderArr , orderIndex = this.data.orderIndex ;
		// var id = orderArr[orderIndex].id ;
		// app.onThePull(this , function(){
		// 	selfThis.requestData(1 , id);
		// });
	},
	/*S
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {},
	// 跳转
	navigateTo: function(e) {
		app.navigateTo(e)
	},
	// 订单类型
	orderType: function(e) {
		var orderArr = this.data.orderArr , index = e.detail.value ;
		this.setData({
			orderIndex: index,
			page : 1 ,
		}) ;
		this.requestData(0 , orderArr[index].id ) ;
	},
	// 数据
	requestData : function(type,orde_status){
		var page = this.data.page , pagesize = this.data.pagesize ;
		var selfThis = this , param = { user_id : app.u_resource , order_status : orde_status , page : page , pagesize : pagesize ,} ;
		app.request('api/order_list' , param , function(data){
			for(var i = 0 ; i < data.list.length ; i++){
				data.list[i].start_address = data.list[i].start_address.split('/') ;
				data.list[i].end_address = data.list[i].end_address.split('/') ;
				data.list[i].create_time_format = data.list[i].create_time_format.split(' ') ;
				data.list[i].loadcar_time_format = data.list[i].loadcar_time_format.split(' ') ;
				
			}
			var listArr = [], listArrT = [];
			for(var i = 0 ; i < data.list.length ; i++){
				// if(data.list[i].orde_status == 5 && data.list[i].is_car && data.list[i].car_comment == 2){
				// 	data.list[i].order_status = 6 ;
				// }else if(data.list[i].orde_status == 5 && data.list[i].is_cargo && data.list[i].cargo_comment == 2){
				// 	data.list[i].order_status = 6 ;
				// }
				if(orde_status == 5 && data.list[i].is_car && data.list[i].car_comment == 2){
					listArr.push(i) ;
				}else if(orde_status == 5 && data.list[i].is_cargo && data.list[i].cargo_comment == 2){
					listArr.push(i);
				} else if (orde_status == 5 && data.list[i].order_status == 6){
					listArr.push(i);
				}
				if(orde_status == 6 && data.list[i].order_status == 5 && data.list[i].is_car && data.list[i].car_comment == 1){
					listArr.push(i);
				}else if(orde_status == 6 && data.list[i].order_status == 5 && data.list[i].is_cargo && data.list[i].cargo_comment == 1){
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
			data.order_status_arr.unshift({ id : 0 , name : '全部'})
			app.loadList(type , data , selfThis) ;
			selfThis.setData({
				orderArr : data.order_status_arr ,
				car_status_arr : data.car_status_arr ,
				cargo_status_arr : data.cargo_status_arr ,
			})
		},true)
	} ,
})