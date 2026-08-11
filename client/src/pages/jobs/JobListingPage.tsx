import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Requirement, Category } from '../../types';
import { requirementService } from '../../services/requirementService';
import { categoryService } from '../../services/categoryService';
import { RequirementCard } from '../../components/requirements/RequirementCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Briefcase,
  Globe,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
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

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load Categories once
  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Load Job Requirements from API with server-side pagination & filters
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
        limit: 9,
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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified External Drive Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore External Job Opportunities
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Browse verified openings from LinkedIn, Naukri, Indeed, Foundit, and corporate career pages curated for institute students.
          </p>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6 hidden lg:block">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                <SlidersHorizontal className="w-4.5 h-4.5 text-blue-600" />
                <span>Filters & Refine</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Source Platform Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Source Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              >
                <option value="">All Source Platforms</option>
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
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Work Mode
              </label>
              <select
                value={selectedWorkMode}
                onChange={(e) => {
                  setSelectedWorkMode(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              >
                <option value="">All Work Modes</option>
                <option value="WORK_FROM_OFFICE">Work From Office</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Job Type
              </label>
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              >
                <option value="">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
                <option value="PART_TIME">Part Time</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
              </select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Domain Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
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

            {/* Minimum Salary Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Min Expected Salary (₹)
              </label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value !== '' ? Number(e.target.value) : '');
                  setPage(1);
                }}
                placeholder="e.g. 400000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              />
            </div>
          </div>
        </aside>

        {/* Main Feed Area */}
        <div className="flex-1 space-y-6">
          {/* Top Controls: Search Bar & Sort Header */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            {/* Debounced Search Bar */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs by title, company, skills (e.g. React, Python), or location..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all"
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

            {/* Controls: Mobile Filter Toggle + Sorting */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="relative flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setPage(1);
                  }}
                  className="px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-bold transition-all"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="deadline">Sort: Deadline Approaching</option>
                  <option value="salary_high">Sort: Salary (High to Low)</option>
                  <option value="salary_low">Sort: Salary (Low to High)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Job Count Summary */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
            <span>
              Showing {requirements.length} of {total} verified external job opportunities
            </span>
            {debouncedSearch && <span>Search: "{debouncedSearch}"</span>}
          </div>

          {/* Job Feed Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : requirements.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Job Opportunities Found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting active filters.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map((req) => (
                <div key={req._id} onClick={() => navigate(`/jobs/${req._id}`)} className="cursor-pointer">
                  <RequirementCard requirement={req} />
                </div>
              ))}
            </div>
          )}

          {/* Server-Side Pagination Bar */}
          {pages > 1 && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 flex items-center justify-between gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 text-xs flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 text-xs flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
