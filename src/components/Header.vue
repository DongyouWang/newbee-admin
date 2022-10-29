<template>
  <div class="header">
    <div class="left">
      <span v-if="state.hasBack" class="back">
        <el-icon @click="back"><ArrowLeftBold /></el-icon>
      </span>
      <span style="font-size: 20px">{{ state.name }}</span>
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        :width="320"
        trigger="click"
        popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <el-button type="default" :icon="UserFilled" style="border: none;">
              <span style="font-weight:bolder;">{{ state.userInfo && state.userInfo.nickName || '' }}</span>
              &emsp;
              <el-icon><Tools /></el-icon></el-button>
          </div>
        </template>
        <div class="nickname">
          <p>登录名：{{ state.userInfo && state.userInfo.loginUserName || '' }}</p>
          <p>昵称：{{ state.userInfo && state.userInfo.nickName || '' }}</p>
          <el-button size="small" type="primary" class="logout" @click="logout">退出</el-button>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { getUserInfo, userLogout } from '@/api/user'
  import { localRemove, pathMap } from '@/utils'
  import { UserFilled } from '@element-plus/icons-vue'
  const router = useRouter()
  const state = reactive({
    name: 'dashboard',
    userInfo: null, // 用户信息变量
    hasBack: false, // 是否展示返回icon
  })
  // 初始化执行方法
  onMounted(() => {
    const pathname = window.location.hash.split('/')[1] || ''
    if (!['login'].includes(pathname)) {
      // 获取用户信息
      getUserInfo().then(res => {
        state.userInfo = res
      })
    }
  })

  router.afterEach((to) => {
    const { id } = to.query
    state.name = pathMap[to.name]
    // level2 和 level3 需要展示返回icon
    state.hasBack = ['level2', 'level3','orderDetail'].includes(to.name)
  })
  // 返回方法
  const back = () => {
    router.back()
  }

  // 退出登录
  const logout = () => {
    userLogout().then(() => {
      // 退出之后，将本地保存的 token  清理掉
      localRemove('token')
      // 回到登录页
      router.push({ path: '/login' })
    })
  }

  router.afterEach((to) => {
    const { id } = to.query
    state.name = pathMap[to.name]
  })
</script>

<style scoped>
  .header {
    height: 50px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
</style>

<style>
  .popper-user-box {
    background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat!important;
    background-size: cover!important;
    border-radius: 0!important;
    z-index: 99;
  }
  .back {
    border: 1px solid #e9e9e9;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
  }
  .back:hover {
    color: #1baeae;
    border: 1px solid #1baeae;
  }
</style>