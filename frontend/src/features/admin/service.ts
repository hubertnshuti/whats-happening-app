import api from '@/lib/api';
import { PageResponse } from '@/types/api';

export interface StatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  publishedEvents: number;
  upcomingEvents: number;
  pendingReports: number;
}

export const adminService = {
  getStats: () => api.get<StatsResponse>('/admin/stats'),
  
  getUsers: (page = 0, size = 50) => 
    api.get<PageResponse<any>>('/admin/users', { params: { page, size } }),
    
  updateUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') => 
    api.patch<any>(`/admin/users/${id}/status`, { status }),
    
  getReports: (page = 0, size = 50) => 
    api.get<PageResponse<any>>('/admin/reports', { params: { page, size } }),
    
  reviewReport: (id: string, status: 'DISMISSED' | 'ACTION_TAKEN', note?: string) => 
    api.post<any>(`/admin/reports/${id}/action`, { status, note }),
};