var app = getApp();
Component({
  options: {
    multipleSlots : true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    } ,
    // 定义选项卡的数量
    tab_list: {
      type: Array,
      value:[1,2] ,
    } ,
    tab_item : {
      type: String,
      value: '1',
    } ,
  },
  data: {
    // 这里是一些组件内部数据
    //tab_item : 1 , 
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { } , 
    onTap: function(e){
      var type = e.currentTarget.dataset.type;
      this.setData({tab_item : type});
      this.triggerEvent('myTab', e)
    } ,
  }
})
