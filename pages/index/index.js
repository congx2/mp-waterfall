// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    list: []
  },

  onLoad() {
    const n = 32
    const list = []
    for (let i = 0; i < n; i++) {
      list.push({
        height: this.random(150, 380),
        color: this.randomColor()
      })
    }
    this.setData({ list })
  },

  random(min, max) {
    min = Math.floor(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  randomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0");
  }

})
