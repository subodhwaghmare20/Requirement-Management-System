import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Requirement, Category } from '../../types';
import { requirementService } from '../../services/requirementService';
import { categoryService } from '../../services/categoryService';
import { RequirementCard } from '../../components/requirements/RequirementCard';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown
} from 'lucide-react';

export const JobListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedJobType, setSelectedJobType] = useState<string>('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [minSalary, setMinSalary] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'deadline' | 'salary_high' | 'salary_low'>('newest');

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requirementService.getRequirements({
        search: debouncedSearch || undefined,
        categoryId: selectedCategory || undefined,
        sourcePlatform: selectedPlatform || undefined,
        jobType: selectedJobType || undefined,
        workMode: selectedWorkMode || undefined,
        experience: selectedExperience || undefined,
        minSalary: minSalary !== '' ? Number(minSalary) : undefined,
        sort: sortBy,
        page,
        limit: 10,
      });
      setRequirements(data.requirements);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch job opportunities', 'error');
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    selectedCategory,
    selectedPlatform,
    selectedJobType,
    selectedWorkMode,
    selectedExperience,
    minSalary,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSelectedPlatform('');
    setSelectedJobType('');
    setSelectedWorkMode('');
    setSelectedExperience('');
    setMinSalary('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Opportunities</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified job drives aggregated from top career platforms.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 shrink-0">
          {total} {total === 1 ? 'Opportunity' : 'Opportunities'} Found
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="card-surface p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company, skills, or location..."
            className="w-full pl-10 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </Button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">Deadline Approaching</option>
              <option value="salary_high">Salary (High to Low)</option>
              <option value="salary_low">Salary (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Job Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-4">
          <div className="card-surface p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-900 text-sm">Refine Results</span>
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Platform Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Source Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Platforms</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Indeed">Indeed</option>
                <option value="Foundit">Foundit</option>
                <option value="Company Website">Company Website</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Work Mode Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Work Mode</label>
              <select
                value={selectedWorkMode}
                onChange={(e) => {
                  setSelectedWorkMode(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Work Modes</option>
                <option value="WORK_FROM_OFFICE">Work From Office</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Domain Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </aside>

        {/* Job Cards Feed */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card-surface p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : requirements.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Job Opportunities Found"
              description="Try adjusting your search query or clearing active filters."
              actionLabel="Reset Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {requirements.map((req) => (
                <RequirementCard
                  key={req._id}
                  requirement={req}
                  onView={() => navigate(`/jobs/${req._id}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="card-surface p-3 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <span className="text-xs text-slate-600 font-medium">
                Page {page} of {pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
