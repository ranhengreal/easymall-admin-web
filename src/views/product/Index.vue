<template>
  <div class="product-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="handleAdd">新增商品</el-button>
        </div>
      </template>

      <el-table :data="productList" border v-loading="loading">
        <el-table-column prop="productId" label="商品ID" width="100" />
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" @change="(val) => updateSort(row, val)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="(val) => updateStatus(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
import { getProductList, updateProduct, deleteProduct, batchUpdateProductSort } from '@/api/product'
import type { Product } from '@/api/product'

const loading = ref(false)
const productList = ref<Product[]>([])

const loadData = async () => {
  loading.value = true
  try {
    productList.value = await getProductList()
  } finally {
    loading.value = false
  }
}

const updateSort = async (row: Product, sort: number) => {
  await batchUpdateProductSort([{ productId: row.productId, sort }])
  ElMessage.success('排序更新成功')
  await loadData()
}

const updateStatus = async (row: Product, status: number) => {
  await updateProduct(row.productId, { status })
  ElMessage.success(status === 1 ? '商品已上架' : '商品已下架')
}

const handleAdd = () => {
  ElMessage.info('功能开发中')
}

const handleEdit = (row: Product) => {
  ElMessage.info('功能开发中')
}

const handleDelete = async (row: Product) => {
  await ElMessageBox.confirm(`确定删除商品"${row.productName}"吗？`, '提示', { type: 'warning' })
  await deleteProduct(row.productId)
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