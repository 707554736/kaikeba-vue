// 实现数据响应式
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
      console.log('get', key);
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
  // 遍历obj的所有key，进行响应式处理
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

observe(obj)
obj.foo
obj.foo = 'foooo'

// 如果上面创建obj的时候没给newObj newObj的set和get就不会被观测到
obj.newObj = { a: '1' }
obj.newObj

set(obj, 'dong', 'dong')
obj.dong

/**
 * 数组不能使用defineProperty的方法不行 需要全新的策略监听
 * 因为数组的基本操作方法不会被监听到
 * 在实际的解决方案中，会直接拿到数组的对应方法进行更改
*/


