<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <Sidebar />
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <Header />
      </el-header>
      
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.main {
  background-color: #f0f2f6;
  padding: 20px;
}
</style>
