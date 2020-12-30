# render fn

render fn return a VNode(a description of real dom element with JS)

eg: custom render fn without component
```javascript
const vm = new Vue({
  el: '#app',
  render: createElement => {
    return createElement('div', [
      createElement('h1', [
        createElement('a', { attr: { href: 'https://google.com' } }, null, 'link')
      ])
    ])
  }
})
```

call stack

Vue.prototype._render
    render.call(vm, $createElement)
        createElement(vm, 'a', ...)
            _createElement(vm, 'a', ...)
            VNode-A
        VNode-A
        createElement(vm, 'h1', [VNode-A])
            _createElement(vm, 'h1', undefined, [VNode-A])
            VNode-H1<children: [VNode-A]>
        VNode-H1<children: [VNode-A]>
        createElement(vm, 'div', [VNode-H1])
            _createElement(vm, 'div', [VNode-H1])
            VNode-DIV
        VNode-DIV<children: [VNode-H1: children: [VNode-A]]>
    VNode-DIV<children: [VNode-H1: children: [VNode-A]]>

eg: custom render fn with component
```javascript
// component BackBtn
const BackBtn = {
  template: '<button @click="clickHandler($event)">' +
  'click me back' +
  '</button>',
  methods: {
    clickHandler (e) {
      console.log('Button clicked!')
    }
  }
}
// vm instance
const vm = new Vue({
  el: '#app',
  components: {
    BackBtn
  }
  render: createElement => {
    return createElement('div', [
      createElement('h1', [
        createElement('a', { attr: { href: 'https://google.com' } }, null, 'link')
      ]),
      createElement(BackBtn)
    ])
  }
})
```

call stack

Vue.prototype._render
    render.call(vm, $createElement)
        createElement(vm, 'a', ...)
            _createElement(vm, 'a', ...)
            VNode-A
        VNode-A
        createElement(vm, 'h1', [VNode-A])
            _createElement(vm, 'h1', undefined, [VNode-A])
            VNode-H1<children: [VNode-A]>
        VNode-H1<children: [VNode-A]>
        createElement(vm, BackBtn)
            _createElement(vm, BackBtn)
                createComponent(BackBtn, undefined, vm, undefined)
                VNode-BACK-BTN
            VNode-BACK-BTN
        VNode-BACK-BTN
        createElement(vm, 'div', [VNode-H1])
            _createElement(vm, 'div', [VNode-H1])
            VNode-DIV
        VNode-DIV<children: [VNode-H1: { children: [VNode-A]}, VNode-BACK-BTN]>
    VNode-DIV<children: [VNode-H1: {children: [VNode-A]}, VNode-BACK-BTN]>

## generate VNode

```javascript
// HTML TAG
isHTMLTag new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context)

// Component && Ctor exist ***
string && component createComponent(Ctor, data, context, children, tag)

// Component ***
component createComponent(tag, data, context, children)

// EMPTY
createEmptyVNode()

// TEXT
createTextVNode()

// CLONE
cloneVNode()

```
