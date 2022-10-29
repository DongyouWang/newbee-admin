<template>
  <el-card class="order-container">
    <!-- 头部区域 -->
    <template #header>
      <div class="header">
        <!-- 搜索订单 -->
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="输入订单号，按下回车进行搜索…"
          v-model="state.orderNo"
          @change="handleOption"
          size="small"
          clearable
        />
        <!-- 筛选订单 -->
        <el-select @change="handleOption" 
                   v-model="state.orderStatus" 
                   size="small" 
                   style="width: 200px; margin-right: 10px"
        >
          <el-option v-for="item in state.options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
          />
        </el-select>
        <!-- 订单操作 -->
        <el-button type="primary" size="small" :icon="SuccessFilled" @click="handleConfig()">配货完成</el-button>
        <el-button type="primary" size="small" :icon="Promotion" @click="handleSend()">已出库</el-button>
        <el-button type="danger" size="small" :icon="CircleCloseFilled" @click="handleClose()">关闭订单</el-button>
      </div>
    </template>

    <!-- 订单列表区域 -->
    <el-table
      :load="state.loading"
      :data="state.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="订单总价"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        width="100"
      >
        <template #default="scope">
          <span>{{ $filters.orderMap(scope.row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payType"
        label="支付方式"
        width="100"
      >
        <template #default='scope'>
          <span v-if="scope.row.payType == 1">微信</span>
          <span v-else-if="scope.row.payType == 2">支付宝</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template #default="scope">
          <router-link :to="{ path: '/orderDetail', query: { id: scope.row.orderId }}"><el-tag style="margin-right: 8px;">订单详情</el-tag></router-link>
          <el-popconfirm v-if="!(scope.row.orderStatus == 4 || scope.row.orderStatus < 0)"
                         title="确定关闭订单吗？"
                         @confirm="handleClose(scope.row.orderId)"
                         confirm-button-text="确定"
                         cancel-button-text="取消"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px"><el-tag type="danger">关闭订单</el-tag></a>
            </template>
          </el-popconfirm>
          <el-tag v-if="scope.row.orderStatus < 0" type="info">订单已关闭</el-tag>
          <el-tag v-if="scope.row.orderStatus == 4" type="success">订单已完成</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器区域 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Promotion, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
  import { getOrders, putDistributeGoods, putDeliveryGoods, putCloseOrder } from '@/api/order'

  const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    multipleSelection: [], // 选中项
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10, // 分页大小
    orderNo: '', // 订单号
    orderStatus: '', // 订单状态
    // 订单状态筛选项默认值
    options: [{
      value: '',
      label: '全部'
    }, {
      value: 0,
      label: '待支付'
    }, {
      value: 1,
      label: '已支付'
    }, {
      value: 2,
      label: '配货完成'
    }, {
      value: 3,
      label: '出库成功'
    }, {
      value: 4,
      label: '交易成功'
    }, {
      value: -1,
      label: '手动关闭'
    }, {
      value: -2,
      label: '超时关闭'
    }, {
      value: -3,
      label: '商家关闭'
    }]
  })
  // 初始化获取订单列表
  onMounted(() => {
    getOrderList()
  })
  // 获取列表方法
  const getOrderList = () => {
    state.loading = true
    getOrders({
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      orderNo: state.orderNo,
      orderStatus: state.orderStatus
    }).then(res => {
      state.tableData = res.list
      state.total = res.totalCount
      state.currentPage = res.currPage
      state.loading = false
    })
  }

  // 触发过滤项方法
  const handleOption = () => {
    getOrderList()
  }
  // checkbox 选择项
  const handleSelectionChange = (val) => {
    state.multipleSelection = val
  }
  // 翻页方法
  const changePage = (val) => {
    state.currentPage = val
    getOrderList()
  }
  // 配货方法
  const handleConfig = (id) => {
    let params
    // 当个配置
    if (id) {
      params = [id]
    } else {
      if (!state.multipleSelection.length) {
        console.log('state.multipleSelection', state.multipleSelection.length)
        ElMessage.error('请选择项')
        return
      }
      // 多选配置
      params = state.multipleSelection.map(i => i.orderId)
    }

    putDistributeGoods({
      ids: params
    }).then(() => {
      ElMessage.success('配货成功')
      getOrderList()
    })
  }

  // 出库方法
  const handleSend = (id) => {
    let params
    if (id) {
      params = [id]
    } else {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }
      params = state.multipleSelection.map(i => i.orderId)
    }
    putDeliveryGoods({
      ids: params
    }).then(() => {
      ElMessage.success('出库成功')
      getOrderList()
    })
  }
  // 关闭订单方法
  const handleClose = (id) => {
    let params
    if (id) {
      params = [id]
    } else {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }
      params = state.multipleSelection.map(i => i.orderId)
    }
    putCloseOrder({
      ids: params
    }).then(() => {
      ElMessage.success('关闭成功')
      getOrderList()
    })
  }
</script>