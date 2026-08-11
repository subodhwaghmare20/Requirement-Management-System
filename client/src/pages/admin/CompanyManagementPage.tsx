import React, { useEffect, useState, useCallback } from 'react';
import { Company } from '../../types';
import { companyService } from '../../services/companyService';
import { CompanyFormModal } from '../../components/company/CompanyFormModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  Edit2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';

export const CompanyManagementPage: React.FC = () => {
  const { showToast } = useToast();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies({
        search: debouncedSearch || undefined,
        page,
        limit: 10,
      });
      setCompanies(data.companies);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch companies', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCreateOpen = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (company: Company) => {
    try {
      const updated = await companyService.toggleCompanyActive(company._id);
      setCompanies((prev) =>
        prev.map((c) => (c._id === company._id ? { ...c, isActive: updated.isActive } : c))
      );
      showToast(
        `Company '${company.name}' ${updated.isActive ? 'activated' : 'deactivated'}`,
        'info'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle company status', 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany._id, formData);
        showToast(`Company '${formData.name}' updated successfully`, 'success');
      } else {
        await companyService.createCompany(formData);
        showToast(`Company '${formData.name}' created successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      showToast(err.message || 'Failed to save company', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Corporate Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Company Management
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Register hiring organizations, update corporate details, and toggle activation status.
          </p>
        </div>

        <button
          onClick={handleCreateOpen}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Company</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, industry, or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Companies Data Table */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading company registry..." />
        </div>
      ) : companies.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base text-slate-700">No companies registered</p>
          <p className="text-xs">Add a new company profile to get started.</p>
          <button
            onClick={handleCreateOpen}
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Create Company
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Industry</th>
                  <th className="py-4 px-6">Locations</th>
                  <th className="py-4 px-6">Website</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {c.logoUrl ? (
                          <img
                            src={c.logoUrl}
                            alt={c.name}
                            className="w-9 h-9 rounded-xl object-contain border border-slate-100 p-0.5 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-400 font-medium">
                            Added {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-700 font-bold">
                      {c.industry || 'General Industry'}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.locations.slice(0, 2).map((loc) => (
                          <span
                            key={loc}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold inline-flex items-center gap-1"
                          >
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {loc}
                          </span>
                        ))}
                        {c.locations.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{c.locations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {c.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Deactivated</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Company Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                            c.isActive !== false
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {c.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Form Modal */}
      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCompany}
      />
    </div>
  );
};
