<template>
  <div class="header-right">
    <el-dropdown @command="handleCommand">
      <span class="user-info">
        <el-avatar :size="32" :src="avatar" />
        <span class="username">{{ username }}</span>
        <el-icon><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const username = ref('管理员')
const avatar = ref('')

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await logout()
    } finally {
      userStore.clearToken()
      ElMessage.success('退出成功')
      router.push('/login')
    }
  }
}
</script>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
}
</style>
