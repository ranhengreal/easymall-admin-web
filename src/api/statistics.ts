import request from '@/utils/request'

export interface DashboardStatistics {
    productCount: number      // 商品总数
    orderCount: number        // 订单总数
    userCount: number         // 用户总数
    totalSales: number        // 销售额
    pendingShipCount: number  // 待发货订单数
    pendingPayCount: number   // 待付款订单数
}

// 获取首页统计数据
export const getDashboardStatistics = () => {
    return request.get<any, DashboardStatistics>('/admin/statistics/dashboard')
}