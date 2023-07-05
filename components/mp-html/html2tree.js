

const parse = html => {
  if (typeof html !== 'string') {
    throw new TypeError(`Expected string, but got ${typeof html}.`)
  }
  const NODE_TYPES = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,

  }
  const stack = []
  const nodes = []
  const node = {
    nodeType: -1,
    tagName: '',
    attrs: '',
    children: []
  }
  let tagStart = false
  let openTag = false
  let closeTag = false
  let i = 0
  while (i < html.length) {
    const current = html[i]
    const next = html[i + 1]
    console.log('current cahrCode: ', html.charCodeAt(i))
    console.log('next cahrCode: ', )
    if (current === '<') {
      if (html.charCodeAt(i + 1) < 32) {
        throw new Error('Invalid HTML')
      }
      openTag = true
      tagStart = next !== '/'
      stack.push(node)
      if (tagStart) {
        const end = html.indexOf(' ', i + 1)
        console.log('end: '.end)
        if (end < i + 1) {
          throw new Error(`Invalid HTML`)
        }
        node.tagName = html.slice(i + 1, end).toLowerCase()
        i = end + 1
        return node
      }
    }
    i++
  }
}

const html = `

  <div
  class="tesla"
  >
    你好啊
  </div>

`
const s = parse(html)
console.log(s)
