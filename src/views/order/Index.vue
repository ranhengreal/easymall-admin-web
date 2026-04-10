<template>
  <div class="order-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
        </div>
      </template>

      <el-table :data="orderList" border v-loading="loading">
        <el-table-column prop="orderId" label="订单ID" width="180" />
        <el-table-column prop="orderSn" label="订单号" width="200" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="totalAmount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.orderStatus)">
              {{ getStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.orderStatus === 1" type="success" link @click="handleShip(row)">发货</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, updateOrderStatus, deleteOrder } from '@/api/order'
import type { Order } from '@/api/order'

const loading = ref(false)
const orderList = ref<Order[]>([])

const getStatusText = (status: number) => {
  const map: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消', 5: '售后中' }
  return map[status] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = { 0: 'warning', 1: 'primary', 2: 'info', 3: 'success', 4: 'danger', 5: 'danger' }
  return map[status] || 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    orderList.value = await getOrderList()
  } finally {
    loading.value = false
  }
}

const handleShip = async (row: Order) => {
  await updateOrderStatus(row.orderId, 2)  // 待发货 → 待收货
  ElMessage.success('发货成功')
  await loadData()
}

const handleDetail = (row: Order) => {
  ElMessage.info('功能开发中')
}

const handleDelete = async (row: Order) => {
  if (row.orderStatus !== 3 && row.orderStatus !== 4) {
    ElMessage.warning('只有已完成或已取消的订单才能删除')
    return
  }
  await ElMessageBox.confirm(`确定删除订单"${row.orderSn}"吗？`, '提示', { type: 'warning' })
  await deleteOrder(row.orderId)
  ElMessage.success('删除成功')
  await loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>