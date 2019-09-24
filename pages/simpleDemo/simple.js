import mqtt from '../../utils/mqtt.js';

//连接的服务器域名，注意格式！！！
const host = 'wxs://www.zhigege.club/mqtt';
Page({
  data: {
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId: 'Zhigege',
      clean: false,
      password: 'public',
      username: 'admin',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  },

  onClick_connect: function () {

    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);

    this.data.client.on('connect', function (connack) {
      wx.showToast({
        title: '连接成功'
      })
    })


    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      wx.showModal({
        content:  " Result :" + payload + "！",
        showCancel: false,
      });
    })


    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)

    })

    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })


    //服务器连接异常的回调
    that.data.client.on("offline", function (errr) {
      console.log(" 服务器offline的回调")

    })


  },

  onClick_SubOne: function () {
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe('/zhigege/pub', function (err, granted) {
        if (!err) {
          wx.showToast({
            title: '订阅主题成功'
          })
        } else {
          wx.showToast({
            title: '订阅主题失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    } 
    else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onClick_SubMany: function () {

    if (this.data.client && this.data.client.connected) {
      //仅订阅多个主题
      this.data.client.subscribe({
        'Topic1': {
          qos: 0
        },
        'Topic2': {
          qos: 1
        }
      }, function (err, granted) {
        if (!err) {
          wx.showToast({
            title: '订阅多主题成功'
          })
        } else {
          wx.showToast({
            title: '订阅多主题失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //推送消息
  onClick_PubMsg: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish('/zhigege/sub', '1');
      wx.showToast({
        title: '发布成功'
      })
    } 
    else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //取消单个订阅
  onClick_unSubOne: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe('Topic0');
    } 
    else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //取消多个订阅
  onClick_unSubMany: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe(['Topic1', 'Topic2']);
    } 
    
    else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '智能家居总控界面'
    })
  }
})