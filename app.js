// app.js
import { promisify } from './utils/utils.js'
App({
  onLaunch() {
    console.log('app onLaunch...')
    // this.login().then(res => {
    //   console.log('login res: ', res)
    // }).catch(e => {
    //   console.log('login e: ', e)
    // })
  },

  getCode() {
    return promisify(wx.login)().then(res => {
      console.log('res: ', res)
      const { code } = res || {}
      return code || ''
    })
  },

  async login() {
    const code = await this.getCode()
    return promisify(wx.request)({
      url: `http://localhost:3000/wxmp/login/${code}`
    })
  }
})


