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

export interface OrderItem {
    itemId: string
    productId: string
    productName: string
    productImage: string
    price: number
    quantity: number
    totalAmount: number
}

export interface OrderDetail extends Order {
    items: OrderItem[]
}

// 获取订单列表
export const getOrderList = () => {
    return request.get<any, Order[]>('/admin/order')
}

// 获取订单详情
export const getOrderDetail = (orderId: string) => {
    return request.get<any, OrderDetail>(`/admin/order/${orderId}`)
}

// 更新订单状态
export const updateOrderStatus = (orderId: string, orderStatus: number, cancelReason?: string) => {
    return request.put(`/admin/order/${orderId}`, { orderStatus, cancelReason })
}

// 删除订单
export const deleteOrder = (orderId: string) => {
    return request.delete(`/admin/order/${orderId}`)
}