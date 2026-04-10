<template>
  <div class="logo">
    <h2>EasyMall</h2>
  </div>
  
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-menu-item>
    
    <el-menu-item index="/category">
      <el-icon><Folder /></el-icon>
      <span>分类管理</span>
    </el-menu-item>
    
    <el-menu-item index="/brand">
      <el-icon><ShoppingCart /></el-icon>
      <span>品牌管理</span>
    </el-menu-item>
    
    <el-menu-item index="/product">
      <el-icon><Goods /></el-icon>
      <span>商品管理</span>
    </el-menu-item>
    
    <el-menu-item index="/order">
      <el-icon><Document /></el-icon>
      <span>订单管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Folder, ShoppingCart, Goods, Document } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #263445;
}

.logo h2 {
  font-size: 20px;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
}
</style>
