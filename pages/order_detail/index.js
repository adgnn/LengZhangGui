// pages/about/index.js
var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		start_cargomoeny : 0 ,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var prevPage = app.getPrePage() ;
		var list = prevPage.data.list , item = {} , car_status_arr = prevPage.data.car_status_arr ,
			cargo_status_arr = prevPage.data.cargo_status_arr , statusValue = {}; 
		for(var i = 0 ; i < list.length ; i++){
			if(options.id == list[i].id){
				if(list[i].order_status == 5 && list[i].is_car && list[i].car_comment == 2){
					list[i].order_status = 6 ;
					list[i].order_status_name = list[i].order_car_status_name ;
					item = list[i] ; 
				}else if(list[i].order_status == 5 && list[i].is_cargo && list[i].cargo_comment == 2){
					list[i].order_status = 6 ;
					list[i].order_status_name = list[i].order_cargo_status_name ;
					item = list[i] ; 
				}else{
					item = list[i] ; 
				}
				break ;
			}
		}
		if(item.is_car){
			for(var i = 0 ; i < car_status_arr.length ; i ++){
				if(car_status_arr[i].id == item.order_status){
					statusValue = car_status_arr[i] ;
				}
			}
		}else{
			for(var i = 0 ; i < cargo_status_arr.length ; i ++){
				if(cargo_status_arr[i].id == item.order_status){
					statusValue = cargo_status_arr[i] ;
				}
			}
		}
		if(item.order_status == 2 && !item.is_car){
			statusValue.name = statusValue.name.split('/') ;
		}
		
		this.setData({
			car_status_arr : car_status_arr ,
			cargo_status_arr : cargo_status_arr ,
			item : item ,
			statusValue : statusValue ,
			orderId : options.id ,
		})
		// this.requestData() ;
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
	// 去分类页面
	toCategory : function(e){
		var active = app.getParam(e).active , item = this.data.item , orderStatus = '' ;
		if(parseInt(item.order_status) == 5){
			// 跳转评论页面
			var by_comment_user_id = item.is_car ? item.cargo_user_id : item.car_user_id ;
			app.navigateTo('/pages/evaluate/index?by_comment_user_id=' + by_comment_user_id + '&order_id='+item.id);
		}else if(item.is_car){
			orderStatus = item.order_status == 1 ? 2 : item.order_status == 2 || item.order_status == 4 ? 7 : '' ;
			this.changeStatus(orderStatus) ;
		}else{
			// 提交数据
			orderStatus = item.order_status == 3 ? 5 : '' ;
			if(active == 1 && item.order_status == 2){
				orderStatus = 3 ;
			}else if(active == 2 && item.order_status == 2){
				orderStatus = 4 ;
			}
			this.changeStatus(orderStatus) ;
		}
	} , 
	// 改变状态
	changeStatus : function(orderStatus){
		var selfThis = this , orderId = this.data.orderId , prevPage = app.getPrePage() ;
		var param = { user_id : app.u_resource , order_id : orderId , order_status : orderStatus , } ; 
		app.request('api/save_order_status' , param , function(data){
			app.successToast(data) ;
			prevPage.requestData(0,0) ;
			setTimeout(function(){
				app.back() ;
			} , 1000)
		})
	} ,
	// 数据
	// requestData : function(){
	// 	var selfThis = this ;
	// 	app.request('api/base_info' , {} , function(data){
	// 		selfThis.setData({
	// 			start_cargomoeny : data.start_cargo_moeny ,
	// 		})
	// 	})
	// } ,
})