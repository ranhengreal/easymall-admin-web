<template>
  <div class="category-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">新增分类</el-button>
        </div>
      </template>
      
      <el-table
        :data="categoryTree"
        row-key="categoryId"
        border
        :tree-props="{ children: 'children' }"
        v-loading="loading"
      >
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column prop="categoryName" label="分类名称" />
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.sort" :min="0" size="small" @change="(val) => updateSort(row, val)" />
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
    
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="formData.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryTree, addCategory, updateCategory, deleteCategory, batchUpdateSort } from '@/api/category'
import type { Category } from '@/api/category'

const loading = ref(false)
const categoryTree = ref<Category[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref()
const isEdit = ref(false)

const formData = ref({
  categoryId: '',
  categoryName: '',
  sort: 0
})

const rules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    categoryTree.value = await getCategoryTree()
  } finally {
    loading.value = false
  }
}

const updateSort = async (row: Category, sort: number) => {
  await batchUpdateSort([{ categoryId: row.categoryId, sort }])
  ElMessage.success('排序更新成功')
  await loadData()
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增分类'
  formData.value = { categoryId: '', categoryName: '', sort: 0 }
  dialogVisible.value = true
}

const handleEdit = (row: Category) => {
  isEdit.value = true
  dialogTitle.value = '编辑分类'
  formData.value = {
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    sort: row.sort
  }
  dialogVisible.value = true
}

const handleDelete = async (row: Category) => {
  await ElMessageBox.confirm(`确定删除分类"${row.categoryName}"吗？`, '提示', { type: 'warning' })
  await deleteCategory(row.categoryId)
  ElMessage.success('删除成功')
  await loadData()
}

const submitForm = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    await updateCategory(formData.value)
    ElMessage.success('更新成功')
  } else {
    await addCategory({ categoryName: formData.value.categoryName, sort: formData.value.sort })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  await loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.category-container {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
