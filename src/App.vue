<template>
  <div class="layout">
    <!-- 整体两栏布局 -->
    <el-container v-if="state.showMenu" class="container">
      <!-- 左栏导航菜单布局 -->
      <div class="left-wrap">
        <div class="menu">
          <div class="head">
          <div>
            <img src="//s.weituibao.com/1582958061265/mlogo.png" alt="logo">
            <span>后台管理</span>
          </div>
        </div>
        <div class="line" />
        <el-menu
          background-color="#222832"
          text-color="#fff"
          :default-openeds="state.defaultOpen"
          :default-active='state.currentPath'
          :router="true"
        >
          <el-sub-menu index="1">
            <template #title>
              <span><el-icon><DataAnalysis /></el-icon>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/"><el-icon><House /></el-icon>首页</el-menu-item>
              <el-menu-item index="/add"><el-icon><Plus /></el-icon>添加商品</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <span><el-icon><HomeFilled /></el-icon>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper"><el-icon><Picture /></el-icon>轮播图配置</el-menu-item>
              <el-menu-item index="/hot"><el-icon><StarFilled /></el-icon>热销商品配置</el-menu-item>
              <el-menu-item index="/new"><el-icon><Sell /></el-icon>新品上线配置</el-menu-item>
              <el-menu-item index="/recommend"><el-icon><ShoppingCart /></el-icon>为你推荐配置</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <span><el-icon><Operation /></el-icon>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/category"><el-icon><Menu /></el-icon>分类管理</el-menu-item>
              <el-menu-item index="/goods"><el-icon><Goods /></el-icon>商品管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-menu-item index="/order"><el-icon><List /></el-icon>订单管理</el-menu-item>
          <el-menu-item index="/member"><el-icon><User /></el-icon>会员管理</el-menu-item>

          <el-sub-menu index="4">
            <template #title>
              <span><el-icon><Setting /></el-icon>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/account"><el-icon><Lock /></el-icon>修改密码</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
        </div>
      </div>

      <!-- 右栏内容区布局 -->
      <div v-if="state.showMenu" class="right-content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </div>
    </el-container>

    <!-- 登录页面布局 -->
    <el-container v-if="!state.showMenu">
      <router-view />
    </el-container>


  </div>
</template>

<script setup>
  import { reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import Header from '@/components/Header.vue'
  import Footer from '@/components/Footer.vue'
  import { localGet, pathMap } from '@/utils'


  // 不需要菜单的路径数组
  const noMenu = ['/login']
  const router = useRouter()
  const state = reactive({
    showMenu: true, // 是否需要显示菜单
    defaultOpen: ['1','2', '3', '4'], // 默认打开的 el-sub-menu 索引（代码中默认赋值为全部打开）
    currentPath: '/', // 当前选中菜单项的高亮
  })
  // 监听路由变化
  router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
      // 如果路径是 /login 则正常执行
      next()
    } else {
      // 如果不是 /login，判断是否有 token
      if (!localGet('token')) {
        // 如果没有，则跳至登录页面
        next({ path: '/login' })
      } else {
        // 否则继续执行
        next()
      }
    }
    state.showMenu = !noMenu.includes(to.path)
    // 当前的路由路径
    state.currentPath = to.path
    // 添加网页标签title
    document.title = pathMap[to.name]
  })
</script>

<style scoped>
.layout {
  background-color: #ffffff;
}
.container {
  display: flex;
  align-items: flex-start;
  height: 100%
}
.left-wrap {
  height: 100%;
  width: 200px;
  overflow:hidden
}
.menu {
  width: 220px!important;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #222832;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0,0%,100%,.05);
  border-bottom: 1px solid rgba(0,0,0,.2);
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>


