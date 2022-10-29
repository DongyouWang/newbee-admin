<template>
  <el-card class="guest-container">
    <!-- 头部操作栏 -->
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" :icon="Unlock" @click="handleSolve">解除禁用</el-button>
        <el-button type="danger" size="small" :icon="Lock" @click="handleForbid">禁用账户</el-button>
      </div>
    </template>

    <!-- 会员列表区域 -->
    <Table :action="getAccountList" ref="table">
      <!-- Vue3 具名插槽用法 -->
      <template #column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="introduceSign"
          label="自我介绍"
        >
        </el-table-column>
        <el-table-column
          label="身份状态"
          width="100"
        >
          <template #default="scope">
            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
              {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否注销"
          width="100"
        >
          <template #default="scope">
            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
              {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="200"
        >
        </el-table-column>
      </template>
    </Table>
  </el-card>
</template>

<script setup>
  import { Unlock, Lock } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import Table from '@/components/Table.vue'
  import { ElMessage } from 'element-plus'
  import { putRemoveForbid, putForbid, getAccountList } from '@/api/member'

  const table = ref(null) // 绑定 Table  的 ref 属性
  // 解禁账号
  const handleSolve = () => {
    // 可以通过 table 获取到组件内部的 multipleSelection 值
    if (!table.value.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    putRemoveForbid({
      ids: table.value.multipleSelection.map(item => item.userId)
    }).then(() => {
      ElMessage.success('解除成功')
      // 通过 table 获取组件内部的 getList 方法
      table.value.getList()
    })

  }
  // 禁用账号
  const handleForbid = () => {
    // 可以通过 table 获取到组件内部的 multipleSelection 值
    if (!table.value.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    putForbid({
      ids: table.value.multipleSelection.map(item => item.userId)
    }).then(() => {
      ElMessage.success('禁用成功')
      // 通过 table 获取组件内部的 getList 方法
      table.value.getList()
    })
  }
</script>