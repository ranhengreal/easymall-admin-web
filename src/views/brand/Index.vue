<template>
  <div class="brand-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>品牌管理</span>
          <el-button type="primary" @click="handleAdd">新增品牌</el-button>
        </div>
      </template>

      <el-table :data="brandList" border v-loading="loading">
        <el-table-column prop="brandId" label="品牌ID" width="100" />
        <el-table-column prop="brandName" label="品牌名称" />
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
import { getBrandList, addBrand, updateBrand, deleteBrand, batchUpdateBrandSort } from '@/api/brand'
import type { Brand } from '@/api/brand'

const loading = ref(false)
const brandList = ref<Brand[]>([])

const loadData = async () => {
  loading.value = true
  try {
    brandList.value = await getBrandList()
  } finally {
    loading.value = false
  }
}

const updateSort = async (row: Brand, sort: number) => {
  await batchUpdateBrandSort([{ brandId: row.brandId, sort }])
  ElMessage.success('排序更新成功')
  await loadData()
}

const updateStatus = async (row: Brand, status: number) => {
  await updateBrand({ brandId: row.brandId, brandName: row.brandName, status })
  ElMessage.success('状态更新成功')
}

const handleAdd = () => {
  ElMessage.info('功能开发中')
}

const handleEdit = (row: Brand) => {
  ElMessage.info('功能开发中')
}

const handleDelete = async (row: Brand) => {
  await ElMessageBox.confirm(`确定删除品牌"${row.brandName}"吗？`, '提示', { type: 'warning' })
  await deleteBrand(row.brandId)
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