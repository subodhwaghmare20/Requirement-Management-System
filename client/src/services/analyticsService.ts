import API from './api';
import { ApiResponse } from '../types';

export interface AnalyticsMetrics {
  totalRequirements: number;
  activeRequirements: number;
  expiredRequirements: number;
  requirementsThisMonth: number;
  totalStudents: number;
  portalApplications: number;
  externalApplyClicks: number;
  totalJobViews: number;
}

export interface ChartItem {
  name?: string;
  month?: string;
  count: number;
}

export interface AnalyticsCharts {
  byTechnology: { name: string; count: number }[];
  byLocation: { name: string; count: number }[];
  bySourcePlatform: { name: string; count: number }[];
  requirementsByMonth: { month: string; count: number }[];
  applicationsByMonth: { month: string; count: number }[];
  applyClicksByMonth: { month: string; count: number }[];
}

export interface JobPerformanceItem {
  _id: string;
  title: string;
  companyName: string;
  sourcePlatform: string;
  viewsCount: number;
  portalApplicationsCount: number;
  clicksCount: number;
}

export interface AnalyticsResponseData {
  metrics: AnalyticsMetrics;
  charts: AnalyticsCharts;
  jobPerformance: JobPerformanceItem[];
}

export const analyticsService = {
  async getAnalytics(params?: any): Promise<AnalyticsResponseData> {
    const res = await API.get<ApiResponse<AnalyticsResponseData>>('/analytics', { params });
    return res.data.data;
  },
};
