// pages/resourse/index.js
var app = getApp(),
	inputContent = {};
Page({
	data: {
		CarPool: ['是', '否'],
		start_region: ['北京市', '北京市', '东城区'],
		end_region: ['北京市', '北京市', '东城区'],
		decLength: 200,
		maxlength: 200,
		length: 0,
		index: 0,
		index2: 0,
		index3: 0,
		checkedStatus: true,
		date: '2016-09-01',
		time: '12:00',

		hidden : false ,
	},
	onLoad: function(options) {
		this.selectedRequest();
		var d = new Date() , month = '' , day = '' , hours = '' , minutes = '' ;
		if(d.getMonth() + 1<10){
			month = '0' + (d.getMonth() + 1) ;
		}else{
			month = d.getMonth() + 1 ;
		}
		if(d.getDate() <10){
			day = '0' + d.getDate() ;
		}else{
			day = d.getDate() ;
		}
		if(d.getHours() <10){
			hours = '0' + d.getHours() ;
		}else{
			hours = d.getHours() ;
		}
		if(d.getMinutes() <10){
			minutes = '0' + d.getMinutes() ;
		}else{
			minutes = d.getMinutes() ;
		}
		var date = d.getFullYear() + '-' + month + '-' + day;
		var time = hours + ':' + minutes;
		this.setData({
			date: date,
			time: time,
		}) ;
		this.completeTextArea();
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
	navigateTo: function(e) {
		app.navigateTo(e)
	},
	location: function(e) {
		app.location(e)
	},
	// 更新表单
	inputContent: function(e) {
		var input = app.getParam(e).id,
			tmpValue = {
				[input]: e.detail.value
			};
		Object.assign(inputContent, tmpValue);
	},
	// 起始位置
	bindRegionChange: function(e) {
		this.setData({
			start_region: e.detail.value
		})
	},
	// 结束位置
	bindRegionChange2: function(e) {
		this.setData({
			end_region: e.detail.value
		})
	},
	// 车长
	bindCarLength: function(e) {
		this.setData({
			index: e.detail.value
		})
	},
	// 车辆类型
	bindCarType: function(e) {
		this.setData({
			index2: e.detail.value
		})
	},
	// 是否整车
	bindCarPool: function(e) {
		this.setData({
			index3: e.detail.value
		})
	},
	// 时间
	bindTimeChange: function(e) {
		this.setData({
			time: e.detail.value
		})
	},
	// 日期
	bindDateChange: function(e) {
		this.setData({
			date: e.detail.value
		})
	},
	// 文本域控制
	inputChange: function(e) {
		app.controlTextarea(e, this);
		this.inputContent(e);
	},
	// 数据
	selectedRequest: function() {
		var selfThis = this;
		app.request('api/base_info', {}, function(data) {
			selfThis.setData({
				car_length: data.car_length,
				car_type: data.car_type,
			})
		})
	},
	// 复选框选中状态
	checkboxChange: function(e) {
		var checks = app.getParam(e).checks,
			checkedStatus = this.data.checkedStatus;
		checkedStatus = checkedStatus == true ? false : true;
		this.setData({
			checkedStatus: checkedStatus,
		});
	},
	// 确认发布
	submit: function() {
		var selfThis = this,
			start_region = this.data.start_region,
			end_region = this.data.end_region,
			car_length = this.data.car_length[this.data.index],
			car_type = this.data.car_type[this.data.index2];
		if (!app.validate(inputContent.cargo_name, '请输入货物名称')) {
			return;
		};
		if (!app.validate(inputContent.cargo_weight, '请输入货物重量')) {
			return;
		};
		var numberR = /^[1-9]\d*$/;
		if (!numberR.test(inputContent.cargo_weight)) {
			app.showModal('请输入正确的货物重量');
			return false;
		}
		if (!app.validate(inputContent.transport_cost, '请输入运费')) {
			return;
		};
		if (!numberR.test(inputContent.transport_cost)) {
			app.showModal('请输入正确的运费');
			return false;
		}
		// if (!app.validate(inputContent.remark, '请输入备注内容')) {
		//   return;
		// };
		var checkedStatus = this.data.checkedStatus;
		if (!checkedStatus) {
			app.showModal('请同意平台管理规范后提交');
			return false;
		}
		inputContent.user_id = app.u_resource;
		inputContent.start_province = start_region[0];
		inputContent.start_city = start_region[1];
		inputContent.start_area = start_region[2];
		inputContent.end_province = end_region[0];
		inputContent.end_city = end_region[1];
		inputContent.end_area = end_region[2];
		inputContent.car_length = car_length.name;
		inputContent.car_type = car_type.name;
		inputContent.is_spellcar = this.data.index3 == 0 ? 2 : 1;
		inputContent.loadcar_time = this.data.date + ' ' + this.data.time;
		app.request('api/cargo_source_add', inputContent, function(data) {
			app.successToast(data);
			setTimeout(function() {
				app.back();
			}, 1000)
		})
	},
	onPageScroll : function(e){
		this.completeTextArea();
		
	} , 
	// 处理文本域
	completeTextArea : function(){
		var selfThis = this;
		wx.getSystemInfo({
			success: function(res) {
				var height = res.windowHeight;
				// 603 iphone6   504 iphone5
				var query = wx.createSelectorQuery()
				query.select('#recruitWrap').boundingClientRect()
				query.selectViewport().scrollOffset()
				var hidden = false;
				// 屏幕比较长
				if(height >= 603){
					selfThis.setData({hidden : hidden});
					// 屏幕比较小
				}else if(height <= 504){
					hidden = true;
					query.exec((res) => {
						if(res[1].scrollTop >= 100){
							hidden = false;
						}
						selfThis.setData({hidden : hidden});
					})
				}
			}
		})
	} , 
})