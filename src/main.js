import { createApp } from 'vue'
import {
  ElButton,
  ElContainer,
  ElAside,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElPopover,
  ElTag,
  ElCard,
  ElTable,
  ElTableColumn,
  ElUpload,
  ElDialog,
  ElPagination,
  ElCascader,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElOption
} from 'element-plus'
import App from './App.vue'
import router from '@/router'
import '@/styles/common/normalize.css'
import '@/styles/common/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App) // 生成 Vue 实例 app

app.use(router) // 引用路由实例
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElButton)
  .use(ElContainer)
  .use(ElAside)
  .use(ElMenu)
  .use(ElSubMenu)
  .use(ElMenuItemGroup)
  .use(ElMenuItem)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElInput)
  .use(ElCheckbox)
  .use(ElPopover)
  .use(ElTag)
  .use(ElCard)
  .use(ElTable)
  .use(ElUpload)
  .use(ElDialog)
  .use(ElPagination)
  .use(ElCascader)
  .use(ElTableColumn)
  .use(ElRadioGroup)
  .use(ElRadio)
  .use(ElSelect)
  .use(ElOption)

app.mount('#app') // 挂载到 #app

// 全局方法：
// 1、$filters：用于对返回的图片绝对路径添加 host 地址，防止加载图片失败
app.config.globalProperties.$filters = {
  // 根据借口返回数据显示对应订单状态
  orderMap(status) {
    return orderStatus[status] || '未知状态'
  },
  prefix(url) {
    if (url && url.startsWith('http')) {
      // 当 url 以 http 开头时候，我们返回原路径
      return url
    } else {
      // 否则，我们给路径添加 host，如下
      url = `http://backend-api-02.newbee.ltd${url}`
      return url
    }
  }
}

// 2、goTop：每次翻页的时候（例如点击分页器下一页），将滚动条滚动到顶部
// 我们在布局的时候，将右边栏main的高度固定，超出部分采用滚动条的形式,其高度为：
// height = 屏幕的高度 - （头部的高度 + 底部的高度），并且给了 overflow 设置滚动
// 解决思路：在每次点击翻页的时候，拿到 main 的 DOM 节点，设置它的 scrollTop 值为 0，让其滚动条滚回顶部
// 定义方法 goTop：
app.config.globalProperties.goTop = function () {
  const main = document.querySelector('.main')
  main.scrollTop = 0
}

// 全局变量：
// 订单状态
const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}

