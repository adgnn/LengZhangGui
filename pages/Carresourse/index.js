// pages/Carresourse/index.js
var app = getApp(),
	inputContent = {};
Page({
	data: {
		CarPool: ['是', '否'],
		start_region: ['北京市', '北京市', '东城区'],
		end_region: ['北京市', '北京市', '东城区'],
		index: 0,
		index2: 0,
		index3: 0,
		checkedStatus: true,
		spare_tonne: '',
		transport_cost: '',
	},
	onLoad: function(options) {
		this.selectedRequest();
		var prevPage = app.getPrePage(); //获取上一页面数据
		this.setData({
			drive_status: prevPage.data.user_info.drive_status,
			user_info: prevPage.data.user_info,
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
	// 数据
	selectedRequest: function() {
		var selfThis = this,
			start_region = this.data.start_region,
			end_region = this.data.end_region;
		app.request('api/base_info', {}, function(data) {
			var carLength = data.car_length,
				carType = data.car_type;
			selfThis.setData({
				car_length: data.car_length,
				car_type: data.car_type,
				StartMemberApprove : data.StartMemberApprove ,
			});
			app.request('api/car_source_show', {
				user_id: app.u_resource,
			}, function(data) {
				if (data != 0) {
					var index = 0,
						index2 = 0;
					start_region[0] = data.start_province;
					start_region[1] = data.start_city;
					start_region[2] = data.start_area;
					end_region[0] = data.end_province;
					end_region[1] = data.end_city;
					end_region[2] = data.end_area;
					for (var i = 0; i < carLength.length; i++) {
						if (carLength[i].name == data.car_length) {
							index = i;
							break;
						}
					};
					for (var i = 0; i < carType.length; i++) {
						if (carType[i].name == data.car_type) {
							index2 = i;
							break;
						}
					};
					var index3 = data.is_spellcar == 1 ? 0 : 1;
					selfThis.setData({
						spare_tonne: data.spare_tonne,
						transport_cost: data.transport_cost,
						start_region: start_region,
						end_region: end_region,
						index: index,
						index2: index2,
						index3: index3,
					});
					inputContent.spare_tonne = data.spare_tonne;
					inputContent.transport_cost = data.transport_cost;
				}
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
		if (!app.validate(inputContent.spare_tonne, '请输入货物重量')) {
			return;
		};
		var numberR = /^[1-9]\d*$/;
		if (!numberR.test(inputContent.spare_tonne)) {
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
		var drive_status = this.data.drive_status;
		if (drive_status != 1) {
			app.showModal('驾照审核通过后才能提交');
			return false;
		}
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
		inputContent.is_spellcar = this.data.index3 == 0 ? 1 : 2;
		app.request('api/car_source_save', inputContent, function(data) {
			app.successToast(data);
			setTimeout(function() {
				app.back();
			}, 1000)
		})
	},
	// 数据
})