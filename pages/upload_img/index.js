// pages/about/index.js
var app = getApp() , inputContent = {};
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		identify_img : '' ,
		identify_img_t : '' ,
		car_img : '' ,
		car_img_t : '' ,
		real_id : '' ,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.distinguish(options.id)
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
	// 区分身份证和驾驶证
	distinguish : function(id){
		var title = '' ;
		if(id == 1){
			title = '实名认证'
		}else{
			title = '驾照认证'
		}
		app.setTitle(title);
		
		var prevPage = app.getPrePage() ; //获取上一页面数据
		var user_info = prevPage.data.user_info ;
		this.setData({
			id : id ,
			card_status : user_info.card_status ,
			drive_status : user_info.drive_status ,
		}) ;
		if((id == 1 && user_info.card_status != 3) || (id == 2 && user_info.drive_status != 3)){
			this.requestData();
		}
	} ,

	 // 选择图片
	uploadId : function(e){
		// var selfThis = this, item = ['相册'],  type = app.getParam(e).type ;
		// app.actionSheet(item, function(index) {
		// 	// 选择图片
		// 	wx.chooseImage({ //手机上传照片 
		// 		success: function(res) {
		// 			if(type == 1){
		// 				var identify_img = res.tempFilePaths[0] ;//小程序产生的临时路径
		// 				inputContent.identify_img = identify_img ;
		// 				selfThis.setData({
		// 					identify_img : identify_img ,
		// 				})
		// 				console.log(identify_img)
		// 			}else if(type == 2){
		// 				var identify_img_t = res.tempFilePaths[0] ;//小程序产生的临时路径
		// 				inputContent.identify_img_t = identify_img_t ;
		// 				selfThis.setData({
		// 					identify_img_t : identify_img_t ,
		// 				})
		// 			}
		// 		}
		// 	});
		// });
		var selfThis = this, item = ['相册'] ,
			type = app.getParam(e).type , 
			id = this.data.id ;

		app.actionSheet(item, function(index) {
			// 选择图片
			app.useImage('api/upload_image', {} , function(data) {
				if(type == 1){
					var identify_img_id = data.cover_id ;//小程序产生的临时id
					var identify_img = data.path ;//小程序产生的临时路径
					if(id == 1){
						inputContent.card_front = identify_img_id ;
						selfThis.setData({
							identify_img : identify_img ,
						})
					}else if(id == 2){
						inputContent.drive_front = identify_img_id ;
						selfThis.setData({
							car_img : identify_img ,
						})
					}
				}else if(type == 2){
					var identify_img_t_id = data.cover_id ;//小程序产生的临时id
					var identify_img_t = data.path ;//小程序产生的临时路径
					if(id == 1){
						inputContent.card_back = identify_img_t_id ;
						selfThis.setData({
							identify_img_t : identify_img_t ,
						})
					}else if(id == 2){
						inputContent.drive_back = identify_img_t_id ;
						selfThis.setData({
							car_img_t : identify_img_t ,
						})
					}	
				}
			}, true);
		});
	} ,
	// 关闭图片
	closeImg : function(e){
		var selfThis = this ;
		var type = app.getParam(e).type , id = this.data.id;
		if(type == 1){
			if(id ==1){
				this.setData({
					identify_img : '' ,
				})
			}else{
				this.setData({
					car_img : '' ,
				})
			}
		}else if(type == 2){
			if(id ==1){
				this.setData({
					identify_img_t : '' ,
				})
			}else{
				this.setData({
					car_img_t : '' ,
				})
			}	
		}
	} ,
	// 上传认证
	upImg : function(){
		var selfThis = this , identify_img = this.data.identify_img , identify_img_t = this.data.identify_img_t ,
			id = this.data.id , car_img = this.data.car_img , car_img_t = this.data.car_img_t ;
		inputContent.user_id = app.u_resource , inputContent.id = this.data.real_id ;
		
		if(identify_img == '' && id == 1){
			app.showModal('请上传身份证正面') ;
			return false;
		}else if(identify_img_t == '' && id == 1){
			app.showModal('请上传身份证反面') ;
			return false;
		}
		if(car_img == '' && id == 2){
			app.showModal('请上传驾驶证正页') ;
			return false;
		}else if(car_img_t == '' && id == 2){
			app.showModal('请上传驾驶证副页') ;
			return false;
		}
		var prevPage = app.getPrePage() ; //获取上一页面数据
		app.request('api/real_name_save' , inputContent , function(data){
			app.successToast('上传成功') ;
			prevPage.reuqestData() ;
			setTimeout(function(){
				app.switchTab('/pages/Personal/index') ;
			},1000)
		})
	} ,
	// 触发选项卡事件
	_myTab: function(e) {
		var id = e.detail.currentTarget.dataset.type; //动态获取组件中的选项卡的type值
		//     tips = this.data.tips;
		// if(types == 1){
		//   tips = '我是被激活的A数据' ;
		// } else if (types == 2){
		//   tips = '我是被激活的B数据';
		// } else if (types == 3){
		//   tips = "I am 被激活的C数据";
		// }
		this.distinguish(id) ;
		this.setData({
			id: id,
		})
	},
	// 数据
	requestData : function(){
		var id = this.data.id ;
		var selfThis = this , param = { user_id : app.u_resource , };
		app.request('api/real_name_list' , param , function(data){
			selfThis.setData({
				card_front : data.card_front ,
				card_back : data.card_back ,
				drive_front : data.drive_front ,
				drive_back : data.drive_back ,
				real_id : data.id ,
			}) ;
			if(data.card_check_status == 2 && id == 1){
				app.showModal(data.check_remark) ;
				selfThis.setData({
					identify_img : '' ,
					identify_img_t : '' ,
				});
			}else if(id == 1 && data.card_check_status == 1){
				if(!app.getItem('idProv')){
					app.setItem('idProv',true) ;
					app.showModal("身份证认证成功") ;
				}
			}
			if(data.drive_check_status == 2 && id == 2){
				app.showModal(data.check_remark) ;
				selfThis.setData({
					car_img : '' ,
					car_img_t : '' ,
				});
			}else if(id == 2 && data.drive_check_status == 1){
				if(!app.getItem('carProv')){
					app.setItem('carProv',true) ;
					app.showModal("驾驶证认证成功") ;
				}
			}
		})
	} ,
})