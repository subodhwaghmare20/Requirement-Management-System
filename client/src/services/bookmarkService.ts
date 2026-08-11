import API from './api';
import { ApiResponse, Requirement } from '../types';

export interface BookmarkItem {
  _id: string;
  studentId: string;
  requirementId: Requirement;
  createdAt: string;
}

export const bookmarkService = {
  async addBookmark(requirementId: string): Promise<BookmarkItem> {
    const res = await API.post<ApiResponse<BookmarkItem>>(`/bookmarks/${requirementId}`);
    return res.data.data;
  },

  async removeBookmark(requirementId: string): Promise<void> {
    await API.delete(`/bookmarks/${requirementId}`);
  },

  async getBookmarks(): Promise<BookmarkItem[]> {
    const res = await API.get<ApiResponse<BookmarkItem[]>>('/bookmarks');
    return res.data.data;
  },
};
