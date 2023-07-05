import { usePromise, nextTick } from '../../../utils/utils.js'
Component({
  relations: {
    '../list/list': {
      type: 'parent'
    }
  },

  properties: {
    options: {
      type: Object,
      value: { render: null },
    },
  },

  data: {
    visible: false,
    style: 'visibility:hidden;width:1px;top:0;left:0;'
  },

  lifetimes: {
    created() {
      
    },
    attached() {
      const slotRenderPromise = this.getSlotRect()
      Object.defineProperty(this, 'slotRender', {
        enumerable: false,
        get: () => () => slotRenderPromise
      })
    },
    ready() {
      console.log('item ready...')
    }
  },

  methods: {
    layout(width, x, y) {
      // const { width = 0, height = 0 } = rect || {}
      // if (!width && !height) {
      //   return
      // }
      const style = `visibility:visible;width:${width}px;top:${y}px;left:${x}px;`
      this.setData({ style })
    },

    getSlotRect() {
      const { render } = this.properties.options || {}
      if (typeof render === 'function') {
        return Promise.resolve().then(render).then(this.getSlotRectBySelectorQuery.bind(this))
      }
      return this.getSlotRectByIntersectionObserver()
    },

    getSlotRectBySelectorQuery() {
      const [promise, resolve] = usePromise()
      this.createSelectorQuery()
          .select('.waterfall-item')
          .boundingClientRect(resolve)
          .exec()
      return promise
    },

    getSlotRectByIntersectionObserver() {
      const [promise, resolve] = usePromise()
      let observer = this.createIntersectionObserver({
        thresholds: [1]
      })
      observer.relativeToViewport()
      observer.observe('.waterfall-item', rect => {
        observer.disconnect()
        observer = null
        resolve(rect.boundingClientRect)
      })
      return promise
    }
  },
  
})
