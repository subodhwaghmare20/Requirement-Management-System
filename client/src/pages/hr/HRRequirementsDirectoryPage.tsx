import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Requirement, Category } from '../../types';
import { requirementService } from '../../services/requirementService';
import { categoryService } from '../../services/categoryService';
import { RequirementStatusBadge } from '../../components/requirements/RequirementStatusBadge';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Globe,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const HRRequirementsDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const fetchRequirements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requirementService.getRequirements({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        sourcePlatform: sourceFilter || undefined,
        categoryId: categoryFilter || undefined,
        page,
        limit: 10,
      });
      setRequirements(data.requirements);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch requirements directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, sourceFilter, categoryFilter, page]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const handlePublish = async (req: Requirement) => {
    try {
      await requirementService.publishRequirement(req._id);
      showToast(`Requirement '${req.title}' published successfully!`, 'success');
      fetchRequirements();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish requirement', 'error');
    }
  };

  const handleClose = async (req: Requirement) => {
    try {
      await requirementService.closeRequirement(req._id);
      showToast(`Requirement '${req.title}' closed`, 'info');
      fetchRequirements();
    } catch (err: any) {
      showToast(err.message || 'Failed to close requirement', 'error');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('');
    setSourceFilter('');
    setCategoryFilter('');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            HR Requirement Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            All Requirements Directory
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Master repository of all institute job postings with status controls, source filtering, and page controls.
          </p>
        </div>

        <Link
          to="/post-job"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Post Requirement</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, company, location, skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
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
        </div>

        {(statusFilter || sourceFilter || categoryFilter || debouncedSearch) && (
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing filtered results ({total} total)</span>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Requirement Data Table */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading requirement directory..." />
        </div>
      ) : requirements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base text-slate-700">No requirements found</p>
          <p className="text-xs">Try clearing filters or post a new job requirement.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {requirements.map((req) => {
                  const companyObj = typeof req.companyId === 'object' ? req.companyId : null;
                  const categoryObj = typeof req.categoryId === 'object' ? req.categoryId : null;
                  const creatorObj = typeof req.createdBy === 'object' ? req.createdBy : null;
                  const companyName = req.companyName || companyObj?.name || 'Company';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{companyName}</td>
                      <td className="py-4 px-6 font-extrabold text-blue-600">{req.title}</td>
                      <td className="py-4 px-6 text-xs text-slate-600">{categoryObj?.name || 'General'}</td>
                      <td className="py-4 px-6">
                        <Badge variant="blue" size="sm" icon={<Globe className="w-3 h-3" />}>
                          {req.sourcePlatform}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{req.location}</td>
                      <td className="py-4 px-6">
                        <RequirementStatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {creatorObj?.name || 'System Admin'}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/jobs/${req._id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/trainer/requirements/${req._id}/edit`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {req.status === 'DRAFT' && (
                            <button
                              onClick={() => handlePublish(req)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
                            >
                              Publish
                            </button>
                          )}
                          {req.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleClose(req)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 text-xs flex items-center gap-1 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-bold text-slate-600">
                Page {page} of {pages}
              </div>

              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 text-xs flex items-center gap-1 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
