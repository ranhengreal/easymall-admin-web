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

    <!-- 订单详情对话框 -->
    <el-dialog :title="`订单详情 - ${detailData.orderSn}`" v-model="detailVisible" width="700px">
      <div class="order-detail">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="订单编号">{{ detailData.orderSn }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(detailData.orderStatus)">
              {{ getStatusText(detailData.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付状态">
            {{ detailData.payStatus === 1 ? '已支付' : '未支付' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ detailData.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">¥{{ detailData.payAmount }}</el-descriptions-item>
        </el-descriptions>

        <!-- 收货信息 -->
        <el-descriptions title="收货信息" :column="1" border style="margin-top: 20px">
          <el-descriptions-item label="收货人">{{ detailData.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detailData.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ detailData.receiverAddress }}</el-descriptions-item>
        </el-descriptions>

        <!-- 商品列表 -->
        <el-descriptions title="商品信息" border style="margin-top: 20px">
          <el-table :data="detailData.items" border>
            <el-table-column prop="productId" label="商品ID" width="100" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="totalAmount" label="小计" width="100">
              <template #default="{ row }">¥{{ row.totalAmount }}</template>
            </el-table-column>
          </el-table>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, getOrderDetail, updateOrderStatus, deleteOrder } from '@/api/order'
import type { Order, OrderDetail } from '@/api/order'

const route = useRoute()
const loading = ref(false)
const orderList = ref<Order[]>([])
const detailVisible = ref(false)
const detailData = ref<OrderDetail>({
  orderId: '',
  orderSn: '',
  userId: '',
  userName: '',
  totalAmount: 0,
  payAmount: 0,
  orderStatus: 0,
  payStatus: 0,
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  createTime: '',
  items: []
})

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
    // 如果有状态筛选参数
    const status = route.query.status
    if (status) {
      orderList.value = orderList.value.filter(item => item.orderStatus === Number(status))
    }
  } finally {
    loading.value = false
  }
}

const handleShip = async (row: Order) => {
  await updateOrderStatus(row.orderId, 2)
  ElMessage.success('发货成功')
  await loadData()
}

const handleDetail = async (row: Order) => {
  detailData.value = await getOrderDetail(row.orderId)
  detailVisible.value = true
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

.order-detail {
  max-height: 500px;
  overflow-y: auto;
}
</style>