

export const getStringTag = value => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * @type {<T>() => [Promise<T>, (value: T | Promise<T>) => void, (reason?: any) => void]}
 * @returns 
 */
export const usePromise = () => {
  let resolver;
  let rejector;
  const promise = new Promise((s, j) => {
    resolver = s;
    rejector = j;
  });
  return [promise, resolver, rejector];
}


export const promisify = (fn) => {
  return function(options, ...args) {
    const [promise, success, fail] = usePromise()
    const conf = Object.assign({}, options || {}, { success, fail })
    fn.apply(wx, [conf, ...args])
    return promise
  }
}


export const nextTick = () => {
  const [promise, resolve] = usePromise()
  typeof wx.nextTick === 'function' ? wx.nextTick(resolve) : Promise.resolve().then(resolve)
  return promise
}


export const rpx2px = (rpxVal, fn) => {
  const { windowWidth } = wx.getSystemInfoSync()
  const handler = typeof fn === 'function' ? fn : Math.floor
  return handler(rpxVal * windowWidth / 750)
}

export const toPixel = (input, defaultValue = 0, fn = Math.floor) => {
  const value = parseFloat(input)
  if (Number.isNaN(value)) {
    return defaultValue
  }
  if (/^-?\d+(\.\d+)?rpx$/i.test(input)) {
    const val = rpx2px(value, fn)
    return Number.isNaN(val) ? defaultValue : val
  }
  return value
}
