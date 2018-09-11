var app = getApp();
Page({
	data: {
		start_region: ['全部', '全部', '起点'],
		end_region: ['全部', '全部', '终点'],
		customItem: '全部',
		hide: false,
		list: [],
		carSize: [],
		carType: [],
		carTypeList: [],
		carClassify: '车辆选择',

		page : 1 , 			//当前页数--必须
		countPage : 1 ,  	//总页数--必须
		hasMore : true , 	//更多--必须
		showWait : false , 	//显示等待框
		pagesize : 10 ,		//每页显示条数
	},
	onLoad: function(options) {
		this.setData({
			page : 1 ,
		})
		this.requestData() ;
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
			selfThis.carRequest(0);
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		var selfThis = this;
		app.onThePull(this , function(){
			selfThis.carRequest(1);
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
	OnClick: function (e) {
		var hide = this.data.hide , carTypeBox = this.data.carTypeBox ,
			typeBox = this.data.typeBox , sizeBox = this.data.sizeBox ;
		hide = hide == true ? false : true ;
		this.setData({
			hide: hide ,
		});
		if(!hide){
			this.setData({
				carTypeList : carTypeBox ,
				carType : typeBox ,
				carSize : sizeBox ,
			});
		}
	},
	closeSelected : function(e){
		var hide = this.data.hide , carTypeBox = this.data.carTypeBox ,
			typeBox = this.data.typeBox , sizeBox = this.data.sizeBox ;
		if(hide){
			this.setData({
				hide : false ,
				carTypeList : carTypeBox ,
				carType : typeBox ,
				carSize : sizeBox ,
			})
		}
	} ,
	bindRegionChange: function (e) {
		this.setData({
			start_region: e.detail.value ,
			hide: false ,
		}) ;
		this.carRequest(0);
	},
	bindRegionChange2: function (e) {
		this.setData({
			end_region: e.detail.value ,
			hide: false ,
		}) ;
		this.carRequest(0);
	} ,
	// 选择类型
	selectedCarFill : function(e){
		var selfThis = this , index = app.getParam(e).index , carTypeList = this.data.carTypeList ;
		for(var i = 0 ; i < carTypeList.length ; i++){
			carTypeList[i].type = 0 ;
		}
		carTypeList[index].type = 1 ;
		this.setData({
			carTypeList : carTypeList ,
		})
	} ,
	// 选择车长
	selectedCarSize : function(e){
		var selfThis = this , index = app.getParam(e).index , carSize = this.data.carSize ;
		carSize[index].type = carSize[index].type == 0 ? 1 : 0 ;
		for(var i = 0 ; i < carSize.length ; i++){
			if(i != index){
				carSize[i].type = 0 ;
			}
		}
		this.setData({
			carSize : carSize ,
		})
	} ,
	// 选择类型
	selectedCarType : function(e){
		var selfThis = this , index = app.getParam(e).index , carType = this.data.carType ;
		carType[index].type = carType[index].type == 0 ? 1 : 0 ;
		for(var i = 0 ; i < carType.length ; i++){
			if(i != index){
				carType[i].type = 0 ;
			}
		}
		this.setData({
			carType : carType ,
		})
	} ,
	// 确定
	submit : function(){
		var carSize = this.data.carSize , carType = this.data.carType , carTypeList = this.data.carTypeList , carClassify = '';
		for (var i = 0 ; i < carSize.length ; i++) {
			if(carSize[i].type == 1){
				carClassify = carSize[i].name ;
			}
		}
		for (var i = 0 ; i < carType.length ; i++) {
			if(carType[i].type == 1){
				carClassify = carClassify+' '+carType[i].name ;
			}
		}
		if(!carClassify){
			carClassify = '车辆选择';
		}
		this.setData({
			carClassify : carClassify ,
			carTypeBox : carTypeList ,
			sizeBox : carSize ,
			typeBox : carType ,
		}) ;
		this.carRequest(0) ;
		this.OnClick() ;
	} ,
	// 数据
	requestData : function(){
		var selfThis = this , carSize = [] , carType = [] , carTypeList = [] ;
		
		app.request('api/base_info' , {} ,function(data){
			for(var i = 0 ; i < data.car_length.length ; i++){
				data.car_length[i].type = 0 ;
				carSize.push(data.car_length[i]) ;
			}
			for(var i = 0 ; i < data.car_type.length ; i++){
				data.car_type[i].type = 0 ;
				carType.push(data.car_type[i]) ;
			}
			for(var i = 0 ; i < data.is_spellcar.length ; i++){
				if( i == 0 ){
					data.is_spellcar[i].type = 1 ;
					carTypeList.push(data.is_spellcar[i]) ;
				}else if( i != data.is_spellcar.length-1){
					data.is_spellcar[i].type = 0 ;
					carTypeList.push(data.is_spellcar[i]) ;
				}
			}
			selfThis.setData({
				carSize : carSize ,
				sizeBox : carSize ,
				carType : carType ,
				typeBox : carType ,
				carTypeList : carTypeList ,
				carTypeBox : carTypeList ,
			}) ;
			selfThis.carRequest(0) ;
		})
	} ,
	// 分类数据
	carRequest : function(type){
		var start_region = this.data.start_region , end_region = this.data.end_region ;
		var page = this.data.page , pagesize = this.data.pagesize , selfThis = this ;
		var param = { page : page , pagesize : pagesize ,  } ;
		param.start_province = start_region[0] == '全部' ? '' : start_region[0] ;
		param.start_city = start_region[1] == '全部' ? '' : start_region[1] ;
		param.start_area = start_region[2] == '起点' ? '' : start_region[2] == '全部' ? '' : start_region[2] ;
		param.end_province = end_region[0] == '全部' ? '' : end_region[0] ;
		param.end_city = end_region[1] == '全部' ? '' : end_region[1] ;
		param.end_area = end_region[2] == '终点' ? '' : end_region[2] == '全部' ? '' : end_region[2] ;

		var carSize = this.data.carSize , carType = this.data.carType , carTypeList = this.data.carTypeList ;
		for(var i = 0 ; i < carSize.length ; i++){
			if(carSize[i].type == 1){
				param.car_length = carSize[i].name ;
				break ;
			}
		}
		for(var i = 0 ; i < carType.length ; i++){
			if(carType[i].type == 1){
				param.car_type = carType[i].name ;
				break ;
			}
		}
		for(var i = 0 ; i < carTypeList.length ; i++){
			if(carTypeList[i].type == 1){
				param.is_spellcar = carTypeList[i].id ;
				break ;
			}
		}
		app.request('api/cargo_source_list' , param , function(data){
			for(var i = 0 ; i < data.list.length ; i++){
				data.list[i].loadcar_time = app.timestampToTime(data.list[i].loadcar_time) ;
				data.list[i].star_level = app.starScore(data.list[i].star_level) ;
			}
			app.loadList(type , data , selfThis) ;
			selfThis.setData({
				cargo_image : data.cargo_image ,
			}) ;
		} , true) ;
	}
})