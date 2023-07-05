//Component Object
import { rpx2px, toPixel, usePromise } from '../../../utils/utils.js'
Component({
  relations: {
    '../item/item': {
      type: 'child'
    }
  },
  properties: {
    /**
     * 瀑布流模式:
     * - waterfall 常规等宽瀑布流模式，最小高度顺序
     * - list 按列表顺序从上往下，从左往右
     */
    mode: {
      type: String,
      value: 'waterfall'
    },
    columns: {
      type: Number,
      value: 2
    },
    gap: {
      type: String,
      optionalTypes: [Number],
      value: '30rpx'
    },
    autoLayout: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      value: '',
    },
  },
  data: {
    height: 0
  },
  observers: {
    data() {
      if (!this.properties.autoLayout) {
        return
      }
    }
  },
  lifetimes: {
    created() {
      const [promise, resolve] = usePromise()
      Object.defineProperty(this, 'render', {
        enumerable: false,
        get: () => () => promise
      })
      Object.defineProperty(this, 'renderResolver', {
        enumerable: false,
        get: () => resolve
      })
    },
    attached() {},
    ready() {
      console.log('list ready')
      this.getListRect().then(this.renderResolver)
      this.render().then(rect => {
        console.log('render rect: ', rect)
        this.layout()
      })
    }
  },
  methods: {
    getListRect() {
      const [promise, resolve] = usePromise()
      this.createSelectorQuery()
          .select('.waterfall-list')
          .boundingClientRect(resolve)
          .exec()
      return promise
    },
    getGap() {
      const gap = this.properties.gap
      if (typeof gap === 'number') {
        const val = Number.isNaN(gap) ? 0 : gap
        return { row: gap, column: gap }
      }
      if (typeof gap === 'string') {
        const list = gap.trim().split(/\s+/).filter(item => item.trim().length)
        const rowGap = list[0]
        const colGap = list.length > 1 ? list[1] : rowGap
        const row = toPixel(rowGap, 0)
        const column = toPixel(colGap, 0)
        return { row, column }
      }
      return { row: 0, column: 0 }
    },
    getColumns() {
      const defaultColumns = 2
      const columns = parseInt(this.properties.columns, 10)
      return Number.isNaN(columns) || columns <= 0 ? defaultColumns : columns
    },
    async getColumnWidth() {
      const rect = await this.render()
      console.log('getColumnWidth rect: ', rect)
      const { width: listWidth = 0 } = rect || {}
      if (!listWidth) {
        return 0
      }
      const gap = this.getGap()
      console.log('gap: ', gap)
      const columns = this.getColumns()
      const gapWidth = columns > 1 ? (columns - 1) * gap.column : 0
      const columnWidth = columns > 1 ? (listWidth - gapWidth) / columns : listWidth
      return Math.floor(columnWidth)
    },
    getRectWidth(rects) {
      for (let i = 0; i < rects.length; i++) {
        const { width = 0} = rects[i]
        if (width) {
          return width
        }
      }
      return 0
    },
    getChildrenNodes() {
      return this.getRelationNodes('../item/item')
    },
    getChildrenRects() {
      const children = this.getRelationNodes('../item/item')
      const promises = children.map(item => item.slotRender().catch(() => null))
      return Promise.all(promises)
    },
    async layout() {
      try {
        const items = this.getChildrenNodes()
        console.log('items: ', items)
        const promises = items.map(item => item.slotRender().catch(() => null))
        console.log('promises: ', promises)
        const columnWidth = await this.getColumnWidth()
        const rects = await Promise.all(promises)
        const { offset, height } = await this.getWaterfallModeOffset(items, rects, columnWidth)
        offset.forEach((item, i) => {
          items[i].layout(columnWidth, item.x, item.y)
        })
        console.log('rects: ', rects)
        console.log('offset: ', offset)
        this.setData({ height })
      } catch (error) {
        console.error(error)
      }
    },
    async getWaterfallModeOffset(items, rects, columnWidth) {
      if (!Array.isArray(items)) {
        return []
      }
      const size = items.length
      const gap = this.getGap()
      const columns = this.getColumns()
      const rows = Math.ceil(size / columns)
      // const columnWidth = await this.getColumnWidth()
      const offset = []
      const heights = []
      for (let i = 0; i < size; i++) {
        const { height } = rects[i]
        const row = Math.floor(i / columns)
        const column = row < 1 ? i : heights.indexOf(Math.min.apply(null, heights))
        const ph = row < 1 ? 0 : heights[column]
        const x = Math.floor(column * columnWidth + gap.column * column)
        const y = ph
        const h = ph + height + gap.row
        heights[column] = h
        offset[i] = { x, y }
        console.groupEnd()
      }
      return { offset, height: Math.max.apply(null, heights) - gap.row }
    },
    getListModeOffset(items) {

    }
  },
})
