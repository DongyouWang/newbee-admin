<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" :icon="Plus" @click="handleAdd">增加</el-button>
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText='确定'
          cancelButtonText='取消'
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small" :icon="Delete">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>

    <!-- 使用Table组件展示列表和分页器 -->
    <!-- <Table ref="table" :action="getCategory"> -->
      <!-- 通用 Vue3 具名插槽来 设置表头-->
      <!-- <template #column>
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="分类名称"
        >
        </el-table-column>
        <el-table-column
          prop="categoryRank"
          label="排序值"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="220"
        >
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)"><el-tag>修改</el-tag></a>
            <a style="cursor: pointer; margin-right: 10px; color: rgba(30,144,255,.7); " @click="handleNext(scope.row)">下级分类</a>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDeleteOne(scope.row.categoryId)"
            >
              <template #reference>
                <a style="cursor: pointer"><el-tag type="danger">删除</el-tag></a>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template> -->
    <!-- </Table> -->

    <el-table
      :load="state.loading"
      ref="multipleTable"
      :data="state.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="分类名称"
      >
      </el-table-column>
      <el-table-column
        prop="categoryRank"
        label="排序值"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)"><el-tag>修改</el-tag></a>
          <a style="cursor: pointer; margin-right: 10px; color: rgba(30,144,255,.7); " @click="handleNext(scope.row)">下级分类</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.categoryId)"
          >
            <template #reference>
              <a style="cursor: pointer"><el-tag type="danger">删除</el-tag></a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   layout="prev, pager, next"
                   :total="state.total"
                   :page-size="state.pageSize"
                   :current-page="state.currentPage"
                   @current-change="changePage"
    />
  </el-card>
  <!-- 父组件是可以通过 ref 方法，拿到弹窗组件的所有 return 的方法 -->
  <DialogAddCategory ref='addCate' :reload="getCategoryList" :type="state.type" />
</template>

<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import Table from '@/components/Table.vue'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { getCategory, deleteCategories, deleteCategoryOne } from '@/api/category'
  import DialogAddCategory from '@/components/DialogAddCategory.vue'

  const router = useRouter() // 声明路由实例
  const route = useRoute() // 获取路由参数

  const unwatch = router.afterEach((to) => {
    // 每次路由变化的时候，都会触发监听时间，重新获取列表数据
    if (['category', 'level2', 'level3'].includes(to.name)) {
      getCategoryList()
    }
  })
  onUnmounted(() => {
    unwatch()
  })

  const table = ref(null)
  const addCate = ref(null)
  const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10, // 分页大小
    multipleSelection: [], // 多选框
    type: 'add', // 操作类型
    level: 1, // 分类等级(默认是1级分类)
    parent_id: 0, // 父级分类 id(默认id 为0)
  })
  onMounted(() => {
    getCategoryList()
  })

  // 三级分类跳转
  const handleNext = (item) => {
    const levelNumber = item.categoryLevel + 1
    if (levelNumber == 4) {
      ElMessage.error('没有下一级')
      return
    }
    router.push({
      name: `level${levelNumber}`,
      query: {
        level: levelNumber,
        parent_id: item.categoryId
      }
    })
  }

  // 添加分类
  const handleAdd = () => {
    state.type = 'add' // 传入弹窗组件用于弹窗 title 判断
    addCate.value.open()
  }

  // 修改分类
  const handleEdit = (id) => {
    state.type = 'edit' // 传入弹窗组件用于弹窗 title 判断
    addCate.value.open(id)
  }

  // 批量删除
  const handleDelete = () => {
    if (!table.value.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    deleteCategories({ ids: table.value.multipleSelection.map(i => i.categoryId) }).then(() => {
      ElMessage.success('删除成功')
      getCategoryList()
    })
  }

  // 单个删除
  const handleDeleteOne = (id) => {
    deleteCategoryOne({ ids: [id] }).then(() => {
      ElMessage.success('删除成功')
      getCategoryList()
    })
  }

  // 获取分类列表
  const getCategoryList = () => {
    const { level = 1, parent_id = 0 } = route.query
    state.loading = true
    getCategory({
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      categoryLevel: level,
      parentId: parent_id
    }).then(res => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
      state.loading = false
      state.level = level
      state.parentId = parent_id
    })
  }
  // 分页器跳转
  const changePage = (val) => {
    state.currentPage = val
    getCategoryList()
  }
  
  // 选项
  const handleSelectionChange = (val) => {
    state.multipleSelection = val
  }
</script>