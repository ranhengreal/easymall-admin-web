<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon">
            <el-icon><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title">商品总数</div>
            <div class="stat-value">{{ statistics.productCount }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title">订单总数</div>
            <div class="stat-value">{{ statistics.orderCount }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title">用户总数</div>
            <div class="stat-value">{{ statistics.userCount }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title">总销售额</div>
            <div class="stat-value">¥{{ formatMoney(statistics.totalSales) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待处理事项 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="task-card">
          <template #header>
            <span>待处理事项</span>
          </template>
          <div class="task-list">
            <div class="task-item" @click="goToOrderList(1)">
              <span>待发货订单</span>
              <el-badge :value="statistics.pendingShipCount" class="task-badge" />
            </div>
            <div class="task-item" @click="goToOrderList(0)">
              <span>待付款订单</span>
              <el-badge :value="statistics.pendingPayCount" class="task-badge" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="welcome-card">
          <template #header>
            <span>欢迎使用</span>
          </template>
          <div class="welcome-content">
            <h3>EasyMall 管理后台</h3>
            <p>欢迎回来！今天也要加油哦！</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Goods, Document, User, Money } from '@element-plus/icons-vue'
import { getDashboardStatistics, type DashboardStatistics } from '@/api/statistics'

const router = useRouter()

const statistics = ref<DashboardStatistics>({
  productCount: 0,
  orderCount: 0,
  userCount: 0,
  totalSales: 0,
  pendingShipCount: 0,
  pendingPayCount: 0
})

// 格式化金额
const formatMoney = (value: number) => {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 跳转到订单列表并筛选状态
const goToOrderList = (status: number) => {
  router.push({ path: '/order', query: { status: status.toString() } })
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    statistics.value = await getDashboardStatistics()
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon .el-icon {
  font-size: 28px;
  color: #409eff;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.task-card :deep(.el-card__body) {
  padding: 0;
}

.task-list {
  padding: 10px 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.task-item:hover {
  background-color: #f5f5f5;
}

.task-item:last-child {
  border-bottom: none;
}

.task-badge {
  margin-right: 10px;
}

.welcome-content {
  text-align: center;
  padding: 20px;
}

.welcome-content h3 {
  margin-bottom: 10px;
  color: #409eff;
}

.welcome-content p {
  color: #666;
}
</style>