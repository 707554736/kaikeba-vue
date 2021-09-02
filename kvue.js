// 实现数据响应式

const { get } = require("node:http");
const { isMainThread } = require("node:worker_threads");

/** 
 * 拦截
 * @param {Object} obj 
 * @param {拦截的值} key 
 * @param {改变的值} val 
 */
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    /** 此处利用了闭包 */
    get() {
      /** 此处递归查看 */
      observe(val)
      console.log('get', key, val);
      return val
    },
    set(newVal) {
      console.log('set', key, newVal);
      if (newVal !== val) {
        observe(newVal)
        val = newVal
      }
    }
  })
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  // newObj: {
  //   a: '1'
  // }
}
/** 
 *  对obj中的key进行遍历
 *  给每个类型都提供响应式的observe 
 */
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }
  new Observer(obj)
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

function update(params) {

}
// 根据传入的value类型做相应的响应式处理
class Observer {
  constructor(value) {
    this.value = value
    if (Array.isArray(value)) {
      // todo

    } else {
      this.walk(value)
    }
  }

  // 对象响应式
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
}

/**
 * Kvue
 * 1. 对data选项做响应式处理
 * 2. 编译模板
 */
class KVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    // data响应式处理
    observe(this.$data)

    // 代理，后面用户对于this上所有属性的访问相当于访问this.$data
    proxy(this)

    // compile
  }
}

// 接收一个实例 
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(newVal) {
        vm.$data[key] = newVal
      }
    })
  })
}

// 解析模板语法
// 1. 处理插值表达式 2. 处理指令和时间 3. 以上两者的初始化和更新
class Compile {
  /** el为对应的节点 vm为对应的实例 */
  constructor(el, vm) {
    this.$vm = vm
    /** 此处最好加上边界条件处理 */
    this.$el = document.querySelector(el)
    if (this.$el) {
      this.compile(this.$el)
    }
  }
  // 遍历el子节点 对类型进行判断并且做相应的处理
  compile(el) {
    const childNodes = el.childNodes
    childNodes.forEach((node) => {
      // 此处是一棵树 所以需要递归
      if (node.nodeType === 1) {
        // 元素
        console.log('元素', node.nodeName);
      } else if (this.isInter(node)) {
        // 文本处理
        console.log('插值', node.textContent);
        this.compileText(node)
      }
      // 此处递归
      if (node.childNodes) {
        this.compile(node)
      }
    })

    // 是否为插值表达式
    isInter(node) {
      return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // 编译文本
    compileText(){

    }
  }
}
