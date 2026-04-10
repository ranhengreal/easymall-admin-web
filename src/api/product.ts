import request from '@/utils/request'

export interface Product {
    productId: string
    productName: string
    categoryId: string
    categoryName: string
    brandId: string
    brandName: string
    mainImage: string
    price: number
    stock: number
    sales: number
    sort: number
    status: number
    createTime: string
    updateTime: string
}

// 获取商品列表
export const getProductList = () => {
    return request.get<any, Product[]>('/admin/product')
}

// 新增商品
export const addProduct = (data: any) => {
    return request.post('/admin/product', data)
}

// 更新商品
export const updateProduct = (productId: string, data: any) => {
    return request.put(`/admin/product/${productId}`, data)
}

// 删除商品
export const deleteProduct = (productId: string) => {
    return request.delete(`/admin/product/${productId}`)
}

// 批量更新排序
export const batchUpdateProductSort = (sortList: { productId: string; sort: number }[]) => {
    return request.put('/admin/product/sort/batch', sortList)
}