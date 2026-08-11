import API from './api';
import { ApiResponse, Category } from '../types';

export const categoryService = {
  async getCategories(includeInactive: boolean = false): Promise<Category[]> {
    const res = await API.get<ApiResponse<Category[]>>('/categories', {
      params: { includeInactive },
    });
    return res.data.data;
  },

  async createCategory(payload: { name: string; description?: string }): Promise<Category> {
    const res = await API.post<ApiResponse<Category>>('/categories', payload);
    return res.data.data;
  },

  async updateCategory(id: string, payload: { name?: string; description?: string }): Promise<Category> {
    const res = await API.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return res.data.data;
  },

  async toggleCategoryActive(id: string): Promise<Category> {
    const res = await API.patch<ApiResponse<Category>>(`/categories/${id}/toggle-active`);
    return res.data.data;
  },
};
