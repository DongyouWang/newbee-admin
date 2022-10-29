<!-- 抽取每个页面的公共部分（例如table表格和分页器pagination），构建一个复用公共的组件 -->
<template>
  <el-table v-loading="state.loading"
            element-loading-text="加载中..."
            :data="state.tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
  >
    <!-- 设置这个具名插槽，是因为每个页面的 Table 列表的表头是不一样的，这个需要在父组件按需传入 -->
    <slot name='column'></slot>
  </el-table>

  <!-- 分页组件在每个组件中都是一样的，直接编写在组件内部就可以了 -->
  <el-pagination background
                 layout="prev, pager, next"
                 :total="state.total"
                 :page-size="state.pageSize"
                 :current-page="state.currentPage"
                 @current-change="changePage"
  />
</template>

<script setup>
  import { onMounted, reactive } from 'vue'
  import { getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute() // 获取路由参数

  // 每次翻页的时候（例如点击分页器下一页），将滚动条滚动到顶部
  const app = getCurrentInstance()
  const { goTop } = app.appContext.config.globalProperties


  const props = defineProps({
    action: Function,
    // level: {
    //   type: Number, // 参数类型
    //   default: 1, //默认值
    //   required: false, //是否必传
    // },
    // parent_id: {
    //   type: Number,
    //   default: 0,
    //   required: false,
    // }
  })

  const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10, // 分页大小
    multipleSelection: [], // 多选框
  })

  // 初始化钩子函数
  onMounted(() => {
    getList()
  })

  // 每个页面的获取table列表方法
  const getList = () => {
    state.loading = true
    props.action({
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }).then(res => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
      state.loading = false
      goTop && goTop() // 数据获取成功后，回到顶部 
    })
  }
  
  // 选项
  const handleSelectionChange = (val) => {
    state.multipleSelection = val
  }

  // 分页方法
  const changePage = (val) => {
    state.currentPage = val
    getList()
  }
  defineExpose({ getList })
</script>