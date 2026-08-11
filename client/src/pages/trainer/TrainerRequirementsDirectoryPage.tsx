import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Requirement } from '../../types';
import { requirementService } from '../../services/requirementService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { RequirementTable } from '../../components/requirements/RequirementTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Briefcase, Plus, Search, Filter } from 'lucide-react';

export const TrainerRequirementsDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await requirementService.getRequirements({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        createdBy: user?.role === 'TRAINER' ? user._id : undefined,
      });
      setRequirements(data.requirements);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch requirements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [statusFilter, searchQuery]);

  const handlePublish = async (req: Requirement) => {
    try {
      await requirementService.publishRequirement(req._id);
      showToast(`Requirement '${req.title}' published!`, 'success');
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

  const handleDelete = async (req: Requirement) => {
    if (!window.confirm(`Are you sure you want to delete '${req.title}'?`)) return;
    try {
      await requirementService.deleteRequirement(req._id);
      showToast(`Requirement '${req.title}' deleted`, 'success');
      fetchRequirements();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete requirement', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Trainer Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Job Requirements Directory
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Search, filter, edit, publish, and manage all your student placement postings.
          </p>
        </div>

        <Link
          to="/dashboard/trainer/requirements/create"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Post Requirement</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirements by title, company, or skills..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" label="Loading requirements..." />
        </div>
      ) : requirements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base text-slate-700">No job requirements found</p>
          <p className="text-xs">Try clearing search filters or create a new job posting.</p>
          <Link
            to="/dashboard/trainer/requirements/create"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Create New Requirement
          </Link>
        </div>
      ) : (
        <RequirementTable
          requirements={requirements}
          onPublish={handlePublish}
          onClose={handleClose}
          onEdit={(req) => navigate(`/dashboard/trainer/requirements/${req._id}/edit`)}
          onDelete={handleDelete}
          currentUserId={user?._id}
          userRole={user?.role}
        />
      )}
    </div>
  );
};
