<template>
  <!--  el-card 作为外层包裹 -->
  <el-card class="swiper-container">
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

    <!-- Table组件 -->
    <Table :action="getCarousels" ref="table">
      <!-- 通用 Vue3 具名插槽来 设置表头-->
      <template #column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="轮播图" width="200">
          <template #default="scope">
            <img style="width: 150px;height: 150px" :src="scope.row.carouselUrl" alt="轮播图">
          </template>
        </el-table-column>
        <el-table-column label="跳转链接">
          <template #default="scope">
            <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="carouselRank" label="排序值" width="120"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"></el-table-column>
      </template>
    </Table>


    <!-- <el-table :load="state.loading"
              ref="multipleTable"
              :data="state.tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="轮播图"
        width="200">
        <template #default="scope">
          <img style="width: 150px;height: 150px" :src="scope.row.carouselUrl" alt="轮播图">
        </template>
      </el-table-column>
      <el-table-column
        label="跳转链接"
        >
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="carouselRank"
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
    </el-table> -->
  </el-card>
  <DialogAddSwiper ref='addSwiper' :reload="getCarouselList" :type="state.type" />
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { getCarousels, deleteCarousels } from '@/api/home'
  import Table from '@/components/Table.vue'
  import DialogAddSwiper from '@/components/DialogAddSwiper.vue'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  const table = ref(null) // 绑定 Table  的 ref 属性
  const addSwiper = ref(null)
  const state = reactive({
    type: 'add', // 操作类型
  })

  // 批量删除
  const handleDelete = () => {
    if (!table.value.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    deleteCarousels({ids: table.value.multipleSelection.map(i => i.carouselId)}).then(() => {
      ElMessage.success('删除成功')
      table.value.getList()
    })
  }

   // 获取轮播图列表
   const getCarouselList = () => {
    table.value.getList()
   }

   // 添加轮播图
  const handleAdd = () => {
    state.type = 'add'
    addSwiper.value.open()
  }

  // 修改轮播图
  const handleEdit = (id) => {
    state.type = 'edit'
    addSwiper.value.open(id)
  }
</script>

<style scoped>

</style>