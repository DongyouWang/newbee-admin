<template>
  <el-card class="swiper-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>
    </template>

     <!-- Table组件 -->
     <Table :action="getGoods" ref="table">
      <!-- 通用 Vue3 具名插槽来 设置表头-->
      <template #column>
        <el-table-column
          prop="goodsId"
          label="商品编号"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="goodsIntro"
          label="商品简介"
        >
        </el-table-column>
        <el-table-column
          label="商品主图"
          width="150"
        >
          <template #default="scope">
            <img style="width: 100px; height: 100px;" :key="scope.row.goodsId" :src="$filters.prefix(scope.row.goodsCoverImg)" alt="商品主图">
          </template>
        </el-table-column>
        <el-table-column
          prop="stockNum"
          label="商品库存"
          width="90"
        >
        </el-table-column>

        <el-table-column
          prop="originalPrice"
          label="商品原价"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="sellingPrice"
          label="商品售价"
          width="90"
        >
        </el-table-column>
        <el-table-column
          label="上架状态"
          width="90"
        >
          <template #default="scope">
            <span style="color: green;" v-if="scope.row.goodsSellStatus == 0">销售中</span>
            <span style="color: red;" v-else>已下架</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.goodsId)"><el-tag>修改</el-tag></a>
            <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.goodsSellStatus == 0" @click="handleStatus(scope.row.goodsId, 1)"><el-tag type="warning">下架</el-tag></a>
            <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.goodsId, 0)"><el-tag type="success">上架</el-tag></a>
          </template>
        </el-table-column>
      </template>
     </Table>
  </el-card>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { getGoods, goodsShelvesOnOff } from '@/api/goods'
  import Table from '@/components/Table.vue'

  const table = ref(null) // 绑定 Table  的 ref 属性

  const router = useRouter() // 获取路由实例，内涵路由相关的各种方法。

  // 初始化钩子函数
  // onMounted(() => {
  //   getGoodList()
  // })

  // 获取商品列表
  const getGoodList = () => {
    table.value.getList()
  }

  // 添加商品，跳转到 /add 路径下
  const handleAdd = () => {
    router.push({ path: '/add' })
  }

  // 编辑商品，带 id 跳转 /add 路径
  const handleEdit = (id) => {
    router.push({ path: '/add', query: { id } })
  }

  // 上下架方法
  const handleStatus = (id, status) => {
    goodsShelvesOnOff({ids: id ? [id] : [], status: status}).then(() => {
      ElMessage.success('修改成功')
      getGoodList()
    })
  }
</script>