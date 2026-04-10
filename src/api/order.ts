import request from '@/utils/request'

export interface Order {
    orderId: string
    orderSn: string
    userId: string
    userName: string
    totalAmount: number
    payAmount: number
    orderStatus: number
    payStatus: number
    receiverName: string
    receiverPhone: string
    receiverAddress: string
    createTime: string
}

// 获取订单列表
export const getOrderList = () => {
    return request.get<any, Order[]>('/admin/order')
}

// 更新订单状态
export const updateOrderStatus = (orderId: string, orderStatus: number, cancelReason?: string) => {
    return request.put(`/admin/order/${orderId}`, { orderStatus, cancelReason })
}

// 删除订单
export const deleteOrder = (orderId: string) => {
    return request.delete(`/admin/order/${orderId}`)
}