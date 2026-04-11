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
        <el-table-column prop="sort" label="排序" width="150">
          <template #default="{ row, $index }">
            <div class="sort-buttons">
              <el-button
                  size="small"
                  :disabled="$index === 0"
                  @click="moveUp(row, $index)"
                  :icon="ArrowUp"
              />
              <el-button
                  size="small"
                  :disabled="$index === getSiblingsCount(row) - 1"
                  @click="moveDown(row, $index)"
                  :icon="ArrowDown"
              />
              <span class="sort-value">{{ row.sort }}</span>
            </div>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" destroy-on-close>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName" required>
          <el-input v-model="formData.categoryName" placeholder="请输入分类名称" clearable />
          <div class="form-tip">分类名称将显示在商品分类选择中</div>
        </el-form-item>
        <el-form-item label="父分类" prop="pCategoryId">
          <el-tree-select
              v-model="formData.pCategoryId"
              :data="categoryTree"
              :props="{ label: 'categoryName', value: 'categoryId', children: 'children' }"
              placeholder="请选择父分类（不选则为顶级分类）"
              check-strictly
              clearable
          />
          <div class="form-tip">选择父分类后，当前分类将成为子分类</div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
          <div class="form-tip">数字越小，显示越靠前</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { getCategoryTree, addCategory, updateCategory, deleteCategory, batchUpdateSort } from '@/api/category'
import type { Category } from '@/api/category'

const loading = ref(false)
const submitLoading = ref(false)
const categoryTree = ref<Category[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref()
const isEdit = ref(false)

const formData = ref({
  categoryId: '',
  categoryName: '',
  pCategoryId: '',
  sort: 0
})

const rules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 获取同级兄弟节点的数量
const getSiblingsCount = (row: Category) => {
  // 查找父节点下的所有子节点
  const findParent = (list: Category[], target: Category): Category[] | null => {
    for (const item of list) {
      if (item.categoryId === target.categoryId) {
        return list
      }
      if (item.children && item.children.length) {
        const result = findParent(item.children, target)
        if (result) return result
      }
    }
    return null
  }

  const parentList = findParent(categoryTree.value, row)
  return parentList ? parentList.length : 0
}

// 获取同级兄弟节点列表
const getSiblings = (row: Category): Category[] => {
  const findSiblings = (list: Category[], target: Category): Category[] | null => {
    for (const item of list) {
      if (item.categoryId === target.categoryId) {
        return list
      }
      if (item.children && item.children.length) {
        const result = findSiblings(item.children, target)
        if (result) return result
      }
    }
    return null
  }

  return findSiblings(categoryTree.value, row) || []
}

// 上移
const moveUp = async (row: Category, index: number) => {
  const siblings = getSiblings(row)
  if (index === 0) return

  // 交换排序值
  const prevRow = siblings[index - 1]
  const tempSort = row.sort
  row.sort = prevRow.sort
  prevRow.sort = tempSort

  // 批量更新
  const sortList = siblings.map((item, idx) => ({
    categoryId: item.categoryId,
    sort: idx + 1
  }))

  try {
    await batchUpdateSort(sortList)
    ElMessage.success('排序更新成功')
    await loadData()
  } catch (error) {
    ElMessage.error('排序更新失败')
    await loadData()
  }
}

// 下移
const moveDown = async (row: Category, index: number) => {
  const siblings = getSiblings(row)
  if (index === siblings.length - 1) return

  // 交换排序值
  const nextRow = siblings[index + 1]
  const tempSort = row.sort
  row.sort = nextRow.sort
  nextRow.sort = tempSort

  // 批量更新
  const sortList = siblings.map((item, idx) => ({
    categoryId: item.categoryId,
    sort: idx + 1
  }))

  try {
    await batchUpdateSort(sortList)
    ElMessage.success('排序更新成功')
    await loadData()
  } catch (error) {
    ElMessage.error('排序更新失败')
    await loadData()
  }
}

const loadData = async () => {
  loading.value = true
  try {
    categoryTree.value = await getCategoryTree()
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增分类'
  formData.value = { categoryId: '', categoryName: '', pCategoryId: '', sort: 0 }
  dialogVisible.value = true
}

const handleEdit = (row: Category) => {
  isEdit.value = true
  dialogTitle.value = '编辑分类'
  formData.value = {
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    pCategoryId: row.pCategoryId === '0' ? '' : row.pCategoryId,
    sort: row.sort
  }
  dialogVisible.value = true
}

const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`确定删除分类"${row.categoryName}"吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    await deleteCategory(row.categoryId)
    ElMessage.success('删除成功')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const submitForm = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateCategory({
        categoryId: formData.value.categoryId,
        categoryName: formData.value.categoryName,
        pCategoryId: formData.value.pCategoryId || '0',
        sort: formData.value.sort
      })
      ElMessage.success('更新成功')
    } else {
      await addCategory({
        categoryName: formData.value.categoryName,
        pCategoryId: formData.value.pCategoryId || '0',
        sort: formData.value.sort
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('提交失败', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
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

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.sort-buttons {
  display: flex;
  gap: 5px;
  align-items: center;
}

.sort-value {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
</style>