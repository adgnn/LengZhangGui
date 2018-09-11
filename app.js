App({
	onLaunch: function(options) {
		if(!this.readUserInfo()){
			// console.log(this.getItem('login'))
			this.auth();
		}
	},
	onShow: function(options) {},
	onHide: function() {},
	onError: function(msg) {
		console.log(msg)
	},
	errMsg : '' , 
	u_resource : '' ,
	// baseUrl : 'http://192.168.88.5/cold/admin/' , 
	baseUrl : 'https://lzgwuliu.swimlions.com/admin/' , 
	data : {
		session_key : ''
	} , 
	// 跳转方法
	location: function(url) {
		url = this.parseUrl(url);
		wx.redirectTo({
			url: url
		});
	},
	// 跳转方法
	navigateTo: function(url) {
		url = this.parseUrl(url);
		wx.navigateTo({
			url: url
		});
	},
	// 跳转方法
	switchTab: function(url) {
		url = this.parseUrl(url);
		wx.switchTab({
			url: url,
			fail: function(e) {
				console.log(e);
			},
			success: function(e) {
				// console.log(e);
			},
			complete: function() {
				// console.log('ok');
			}
		});
	},
	// 返回
	back: function(delta) {
		if (!delta) {
			delta = 1;
		}
		wx.navigateBack({
			delta: delta
		})
	},
	// 获取跳转地址的参数
	getParam: function(event) {
		return event.currentTarget.dataset;
	},
	// 解析URL
	parseUrl: function(url) {
		switch (typeof url) {
			case 'string':
				url = url;
				break;
			case 'object':
				url = this.getParam(url).url;
				break;
		}
		return url;
	},
	// 成功弹窗
	successToast: function(msg) {
		wx.showToast({
			title: msg,
			icon: 'success',
			duration: 2000
		})
	},
	// 失败弹窗
	faildToast: function(msg) {
		// wx.showToast({
		//  title: msg,
		//  duration: 2000
		// })
		this.showModal(msg);
	},
	// 显示模态框
	showModal: function(msg) {
		wx.showModal({
			content: msg,
			showCancel: false
		});
	},
	// 操作框
	actionSheet: function(item, callback, error) {
		wx.showActionSheet({
			itemList: item,
			success: function(res) {
				callback(res.tapIndex);
			},
			fail: function(res) {
				if (error) {
					error(res.errMsg);
				}
			}
		})
	},
	// 请求
	request: function(url, param, callback, refresh, loading) {
		// var baseUrl = 'http://shaokeapi.swimlions.com/index.php/Home/';
		// 开启加载中
		if (undefined == loading || loading == true) {
			wx.showLoading({
				title: '加载中...'
			});
		}
		var selfThis = this;
		wx.request({
			url: selfThis.baseUrl + url, //仅为示例，并非真实的接口地址
			data: param,
			method: 'POST',
			success: function(res) {
				if (refresh) {
					wx.stopPullDownRefresh();
				}
				// 关闭加载中
				wx.hideLoading();
				var data = res.data;
				if (!data.status) {
					if (undefined === data.msg) {
						selfThis.faildToast('捕获未知错误');
						return;
					}
					if (data.msg == 'not_vip') {
						// 非VIP
						// 弹出VIP框框
						var pages = getCurrentPages();
						var currentPages = pages[pages.length - 1];
						currentPages.setData({
							vipShow: true,
						})
						return;
					}
					var split = data.msg != '' && typeof(data.msg) == 'string' ? data.msg.split(':') : '';
					if (split && split.length > 1) {
						selfThis.dynamicModal(data.msg);
						return;
					}
					selfThis.faildToast(data.msg);
					return;
				}
				if (undefined === data.msg) {
					callback(data.data);
				} else {
					callback(data.msg);
				}
			},
			fail: function() {
				if (refresh) {
					wx.stopPullDownRefresh();
				}
				// 关闭加载中
				wx.hideLoading();
			}
		})
	},
	// 上拉刷新的下拉加载基础内容
	loadList: function(type, data, scope) {
		// 自动计算页面显示无数据
		this.autoCalcPage(data, scope);
		// 下拉刷新
		if (type == 0) {
			scope.setData({
				list: data.list
			});
			return;
		}
		// 上拉加载
		if (data.list) {
			// 连接数据
			scope.setData({
				list: scope.data.list.concat(data.list)
			});
		}
	},
	// 上拉刷新的下拉加载基础内容2
	loadListT: function(type, data, lists, scope) {
		// 自动计算页面显示无数据
		this.autoCalcPage(data, scope);
		// 下拉刷新
		if (type == 0) {
			scope.setData({
				list: lists
			});
			return;
		}
		// 上拉加载
		if (lists) {
			// 连接数据
			scope.setData({
				list: scope.data.list.concat(lists)
			});
		}
	},
	/**
	 * 下拉
	 * @param  {[type]}   scope    作用域 传递参数为this
	 * @param  {Function} callback 调用该函数时回掉函数
	 * @return {[type]}            [description]
	 */
	dropDown: function(scope, callback) {
		scope.setData({
			page: 1,
			hasMore: true,
		});
		callback();
		console.log('下拉了');
	},
	/**
	 * 上拉
	 * @param  {[type]}   scope    作用域 传递参数为this
	 * @param  {Function} callback 调用该函数时回掉函数
	 * @return {[type]}            [description]
	 */
	onThePull: function(scope, callback) {
		if (scope.data.page >= scope.data.countPage) {
			scope.setData({
				hasMore: false
			});
			return;
		}
		scope.data.page++;
		callback();
		console.log('上拉了');
	},
	// 自动计算页面显示无数据
	autoCalcPage: function(data, scope) {
		var tmpData = {};
		tmpData.countPage = data.countPage;
		tmpData.page = data.page;
		scope.setData(tmpData);
		if (tmpData.countPage == scope.data.countPage) {
			scope.setData({
				hasMore: false
			});
		}
	},
	// 存储数据
	setItem : function(name , value){
		return wx.setStorageSync(name , value);
	} , 
	// 读取数据
	getItem : function(name){
		return wx.getStorageSync(name);
	} , 
	// 删除数据
	removeItem : function(name){
		return wx.removeStorageSync(name);
	} , 
	// 添加用户信息
	appendUserInfo : function(value){
		return this.setItem('login' , value);
	} , 
	// 获取分类ID
	getCategoryId : function(){
		var category = this.getItem('category_id');
		if(!category){
			this.faildToast('无效的分类');
			var selfThis = this;
			setTimeout(function(){
				selfThis.switchTab('/pages/index/index');
			} , 1000);
		}
		return category;
	} , 
	// 读取用户信息
	readUserInfo : function(){
		var login = this.getItem('login');
		if(login){
			this.u_resource = login;
		}
	} , 
	// 基础验证
	validate : function(item , tips){
		if(item === '' || item === null || item === undefined){
			this.showModal(tips);
			return false;
		}
		return true;
	} , 
	// 是否登录
	isLogin : function(){
		if(!this.u_resource){
			if(this.errMsg){
				this.showModal(this.errMsg);
			}
			return false;
		}else{
			return true;
		}
	} , 
	// 授权
	auth: function() {
		var selfThis = this,
			login = this.u_resource;
		// 检查是否登陆
		wx.checkSession({
			success: function(res) {
				//session 未过期，并且在本生命周期一直有效
				if (!login) {
					selfThis.login();
				}
			},
			// 过期
			fail: function() {
				selfThis.login();
			}
		})
	},
	// 登陆
	login: function() {
		var selfThis = this;
		//登录态过期
		wx.login({
			success: function(res) {
				if (res.code) {
					var param = {
						code: res.code
					};
					selfThis.request('api/get_openid', param, function(data) {
						
						var id = data.openid , key = data.session_key;
						selfThis.data.session_key = data.session_key;
						selfThis.setItem('key', data.session_key);
						selfThis.setItem('openid', data.openid);
						var pages = getCurrentPages();
						// var thispage = pages[0];
						
						if(pages[0]){
							var thispage = pages[0];
							thispage.setData({
								showWait: true,
							})
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			},
			fail: function(e) {
				selfThis.errMsg = e.errMsg;
				selfThis.showModal(e.errMsg);
			}
		});
	},
	// 授权成功获取用户信息并登陆
	// authGetUserInfoSuccess: function(id , key , phone) {
	// 	var selfThis = this;
	// 	wx.getUserInfo({
	// 		success: function(res) {
	// 			var userInfo = res.userInfo ,
	// 				param = { user_image : userInfo.avatarUrl , nickname : userInfo.nickName , sex : userInfo.gender , openid : id , user_phone : phone ,} ;
	// 			selfThis.request('api/openid_login', param, function(data) {;
	// 				selfThis.u_resource = data.user_id;
	// 				if (!data.user_id) {
	// 					var pages = getCurrentPages();
	// 					var thispage = pages[0];
	// 					thispage.setData({
	// 						showWait: false,
	// 					})
	// 					var pages = getCurrentPages();
	// 					selfThis.setItem('get_mobile' , false);
	// 					selfThis.removeItem('openid');
	// 					selfThis.setItem('userinfo_nickname' , userInfo.nickName);
	// 					selfThis.setItem('userinfo_avatar' , userInfo.avatarUrl);
	// 					selfThis.setItem('userinfo_sex' , userInfo.gender);
	// 					selfThis.appendUserInfo(data);
	// 					selfThis.u_resource = data;
	// 				} else {
	// 					var pages = getCurrentPages();
	// 					var thispage = pages[0];
	// 					selfThis.appendUserInfo(data.user_id);
	// 					// thispage.requestData(0);
	// 				}
	// 				selfThis.appendUserInfo(data.user_id);
	// 			})
	// 		},
	// 		fail: function(e) {
	// 			if (e.errMsg == 'getUserInfo:fail auth deny') {
	// 				wx.openSetting({
	// 					success: function(data) {
	// 						if (data) {
	// 							if (data.authSetting["scope.userInfo"] == true) {
	// 								selfThis.authGetUserInfoSuccess(id);
	// 							}
	// 						}
	// 					}
	// 				});
	// 			}
	// 			console.log('获取用户信息失败');
	// 			// console.log(e);
	// 		}
	// 	})
	// },
	// 授权成功获取用户信息并登陆
	authGetUserInfoSuccess: function(userInfo , callback ) {
		var openid = this.getItem('openid') , selfThis = this , key = this.getItem('key') ;

		var nickName = userInfo.nickName ;
		var avatarUrl = userInfo.avatarUrl ;
		var user_phone = this.getItem('phone_number') ;
		selfThis.setItem('get_mobile' , false);
		// selfThis.removeItem('openid');
		selfThis.setItem('userinfo_nickname' , userInfo.nickName);
		selfThis.setItem('userinfo_avatar' , userInfo.avatarUrl);
		var param = { user_image : userInfo.avatarUrl , nickname : userInfo.nickName , sex : userInfo.gender , openid : openid , user_phone : user_phone ,} ;

		selfThis.request('api/openid_login',param,function(data){

			if(!user_phone || !key){
				var pages = getCurrentPages();
				var thispage = pages[0];
				thispage.setData({
					showWait : true ,
					showAuth : false , 
				})
				selfThis.setItem('openid' , openid);
				selfThis.setItem('userinfo_nickname' , userInfo.nickName);
				selfThis.setItem('userinfo_avatar' , userInfo.avatarUrl);
				selfThis.setItem('userinfo_sex' , userInfo.gender);
				selfThis.setItem('get_mobile' , true);
			}else{
				var pages = getCurrentPages();
				var thispage = pages[0];
				thispage.setData({showAuth : false , showWait : false});
				selfThis.u_resource = data.user_id;
				// 验证  刷新
				// selfThis.appendUserInfo('keyName' , data);
				callback(data);
			}
			selfThis.appendUserInfo(data.user_id);
		})
	},
	// 获取用户信息
	getUserInfo : function(e,callback){
		var selfThis = this;
		if(e.detail.errMsg == 'getUserInfo:fail auth deny'){
			wx.openSetting({
				success : function(data){
					if(data){
						if (data.authSetting["scope.userInfo"] == true) {
							wx.getUserInfo({
								success : function(e){
									selfThis.authGetUserInfoSuccess(e.userInfo , callback);
								}
							})
						}
					}
				}
			});
		}else{
			this.authGetUserInfoSuccess(e.detail.userInfo , callback);
		}
	} , 
	// 获取手机号
	getPhoneNumber: function(e, callback) {
		var key = this.data.session_key, selfThis = this;
		if (!key) {
			key = this.getItem('key');
		}
		if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
			console.log('拒绝授权');
			// var pages = getCurrentPages();
			// var thispage = pages[0];
			// thispage.setData({
			// 	showWait: true,
			// })
		} else {
			var param = {
				iv: e.detail.iv,
				encryptedData: e.detail.encryptedData,
				sessionKey: key,
			};
			this.request('api/get_usre_phone', param, function(data) {
				var pages = getCurrentPages();
				var thispage = pages[0];
				
				selfThis.setItem('openid' , selfThis.getItem('openid'));
				// selfThis.setItem('userinfo_nickname' , userInfo.nickName);
				// selfThis.setItem('userinfo_avatar' , userInfo.avatarUrl);
				// selfThis.setItem('userinfo_sex' , userInfo.gender);
				selfThis.setItem('get_mobile' , true);
				selfThis.setItem('phone_number' , data.user_phone);
				// selfThis.appendUserInfo(data);
				// selfThis.u_resource = data;
				thispage.setData({
					showWait : false ,
					showAuth : true , 
				})
				callback(data);
			})
		}
	},
	// 获取上一个页面对象
	getPrePage: function() {
		var pages = getCurrentPages();
		var prePage = pages[pages.length - 2]; //上一个页面
		return prePage;
	},
	// 控制文本框
	controlTextarea: function(e, scope) {
		// decLength  为输入时递减
		// length     为输入时递增
		// maxlength    为可输入的最大长度
		var content = e.detail.value;
		var decLength = scope.data.decLength,
			length = content.length,
			maxlength = scope.data.maxlength;
		if (length > maxlength) {
			return;
		}
		scope.setData({
			decLength: maxlength - length,
			length: length,
		});
	},
	// 时间戳转化
	timestampToTime: function(timestamp) {
		var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '.';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
		var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		// h = date.getHours() + ':';
		// m = date.getMinutes() + ':';
		// s = date.getSeconds();
		return Y + M + D;
	},
	// star评分处理
	starScore: function(score) {
		var starNumber = '',
			starScore = '',
			starArr = {};
		var starR = /\./g;
		if (starR.test(score)) {
			starNumber = Math.floor(score);
			starScore = score;
		} else {
			starNumber = score;
			starScore = score + '.0';
		}
		starArr.starNumber = Number(starNumber);
		starArr.starScore = starScore;
		return starArr;
	},
	// 上传图片
	uploadFile : function(path , url , param , callback){
		var param = param , selfThis = this;;
		if(undefined === param.u_resource){
			param.u_resource = this.u_resource;
		}
		wx.showLoading({
			title : '上传中...'
		});
		// 上传图片
		wx.uploadFile({
			url: selfThis.baseUrl + url , //仅为示例，非真实的接口地址
			filePath: path,
			header: {
				'content-type':'multipart/form-data'
			}, // 设置请求的 header
			name: 'file' , 
			formData : param , 
			success: function(res){
				wx.hideLoading();
				var data = JSON.parse(res.data);
				if(!data.status){
					selfThis.showModal(data.msg);
					return;
				}
				if(undefined === data.msg){
					callback(data.data);
				}else{
					callback(data.msg);
				}
			}
		})
	} , 
	// 选择图片
	useImage : function(url , param , callback , isUpload){
		var selfThis = this;
		// 选择图片
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var tempFilePaths = res.tempFilePaths[0];
				// 获取图片信息
				wx.getImageInfo({
					src: tempFilePaths ,
					success: function (res) {
						var width = res.width , height = res.height , maxwidth = 400 , maxheight = 400;
						// if(width / height != 1){
						// 	selfThis.showModal('请选择正方形的图片');
						// 	return;
						// }
						// if(width < maxwidth){
						// 	selfThis.showModal('请选择' + maxwidth + ' x' + maxheight + '的图片');
						// 	return;
						// }
						// if(height < maxheight){
						// 	selfThis.showModal('请上传' + maxwidth + ' x' + maxheight + '的图片');
						// 	return;
						// }
						if(isUpload === true){
							selfThis.uploadFile(tempFilePaths , url , param , callback);
							return;
						}
						callback(tempFilePaths , res);
					}
				})
			}
		})
	} , 
	// 标题
	setTitle : function(title){
		wx.setNavigationBarTitle({title : title});
	} , 
})