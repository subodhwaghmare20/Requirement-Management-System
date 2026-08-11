import React, { useEffect, useState, useCallback } from 'react';
import { Category } from '../../types';
import { analyticsService, AnalyticsResponseData } from '../../services/analyticsService';
import { categoryService } from '../../services/categoryService';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  FileCheck,
  MousePointerClick,
  Eye,
  Filter,
  Globe,
  MapPin,
  Calendar,
  X
} from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { showToast } = useToast();

  const [data, setData] = useState<AnalyticsResponseData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Analytics Filters State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [sourcePlatform, setSourcePlatform] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getAnalytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        categoryId: categoryId || undefined,
        sourcePlatform: sourcePlatform || undefined,
        location: location || undefined,
      });
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Failed to load analytics dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, categoryId, sourcePlatform, location]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
    setSourcePlatform('');
    setLocation('');
  };

  const getMaxVal = (arr: { count: number }[]) => {
    if (!arr || arr.length === 0) return 1;
    const max = Math.max(...arr.map((item) => item.count));
    return max === 0 ? 1 : max;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Institute Placement Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Portal Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time candidate engagement, job drive performance, tech stack distribution, and apply click metrics.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs shrink-0 flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-blue-300" />
          <span>Live Metrics Engine</span>
        </div>
      </div>

      {/* Analytics Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Analytics Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Platform */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Source Platform
            </label>
            <select
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium"
            >
              <option value="">All Sources</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Naukri">Naukri</option>
              <option value="Indeed">Indeed</option>
              <option value="Foundit">Foundit</option>
              <option value="Company Website">Company Website</option>
              <option value="Glassdoor">Glassdoor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, Remote"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium"
            />
          </div>
        </div>

        {(startDate || endDate || categoryId || sourcePlatform || location) && (
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            <span>Filters active</span>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Computing portal analytics..." />
        </div>
      ) : (
        <>
          {/* 8 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Requirements */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Total Requirements
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.totalRequirements || 0}
                </span>
              </div>
            </div>

            {/* Active Requirements */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Active Requirements
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.activeRequirements || 0}
                </span>
              </div>
            </div>

            {/* Expired Requirements */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Expired Requirements
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.expiredRequirements || 0}
                </span>
              </div>
            </div>

            {/* Requirements This Month */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Requirements This Month
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.requirementsThisMonth || 0}
                </span>
              </div>
            </div>

            {/* Total Students */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Total Students
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.totalStudents || 0}
                </span>
              </div>
            </div>

            {/* Portal Applications */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Portal Applications
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.portalApplications || 0}
                </span>
              </div>
            </div>

            {/* External Apply Clicks */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  External Apply Clicks
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.externalApplyClicks || 0}
                </span>
              </div>
            </div>

            {/* Total Job Views */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Total Job Views
                </span>
                <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {data?.metrics.totalJobViews || 0}
                </span>
              </div>
            </div>
          </div>

          {/* 6 Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Requirements by Technology */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Requirements by Technology</span>
              </h3>
              <div className="space-y-3">
                {data?.charts.byTechnology.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No technology data available</p>
                ) : (
                  data?.charts.byTechnology.map((item) => {
                    const max = getMaxVal(data.charts.byTechnology);
                    const pct = Math.round((item.count / max) * 100);
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800">{item.name}</span>
                          <span className="text-blue-600">{item.count} jobs</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Requirements by Location */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Requirements by Location</span>
              </h3>
              <div className="space-y-3">
                {data?.charts.byLocation.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No location data available</p>
                ) : (
                  data?.charts.byLocation.map((item) => {
                    const max = getMaxVal(data.charts.byLocation);
                    const pct = Math.round((item.count / max) * 100);
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.name}
                          </span>
                          <span className="text-indigo-600">{item.count} jobs</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 3. Requirements by Source Platform */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Requirements by Source Platform</span>
              </h3>
              <div className="space-y-3">
                {data?.charts.bySourcePlatform.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No platform data available</p>
                ) : (
                  data?.charts.bySourcePlatform.map((item) => {
                    const max = getMaxVal(data.charts.bySourcePlatform);
                    const pct = Math.round((item.count / max) * 100);
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {item.name}
                          </span>
                          <span className="text-purple-600">{item.count} jobs</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 4. Requirements Trend by Month */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Requirements Trend by Month</span>
              </h3>
              <div className="flex items-end gap-3 h-40 pt-4 px-2">
                {data?.charts.requirementsByMonth.map((item) => {
                  const max = getMaxVal(data.charts.requirementsByMonth);
                  const pct = Math.max(8, Math.round((item.count / max) * 100));
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700">{item.count}</span>
                      <div
                        className="w-full bg-emerald-500 rounded-t-xl transition-all duration-500"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Applications Trend by Month */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Portal Applications Trend by Month</span>
              </h3>
              <div className="flex items-end gap-3 h-40 pt-4 px-2">
                {data?.charts.applicationsByMonth.map((item) => {
                  const max = getMaxVal(data.charts.applicationsByMonth);
                  const pct = Math.max(8, Math.round((item.count / max) * 100));
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700">{item.count}</span>
                      <div
                        className="w-full bg-teal-500 rounded-t-xl transition-all duration-500"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. External Apply Clicks Trend by Month */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>External Apply Clicks Trend by Month</span>
              </h3>
              <div className="flex items-end gap-3 h-40 pt-4 px-2">
                {data?.charts.applyClicksByMonth.map((item) => {
                  const max = getMaxVal(data.charts.applyClicksByMonth);
                  const pct = Math.max(8, Math.round((item.count / max) * 100));
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700">{item.count}</span>
                      <div
                        className="w-full bg-cyan-500 rounded-t-xl transition-all duration-500"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Job Performance Breakdown Table */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-extrabold text-slate-900">Job Opportunity Performance</h2>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">Opportunity & Company</th>
                      <th className="py-4 px-6">Source Platform</th>
                      <th className="py-4 px-6 text-center">Job Views</th>
                      <th className="py-4 px-6 text-center">Portal Applications</th>
                      <th className="py-4 px-6 text-center">External Apply Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {data?.jobPerformance.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500 font-semibold">{item.companyName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="blue" size="sm">
                            {item.sourcePlatform}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-700">
                          {item.viewsCount}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-teal-600">
                          {item.portalApplicationsCount}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-cyan-600">
                          {item.clicksCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
