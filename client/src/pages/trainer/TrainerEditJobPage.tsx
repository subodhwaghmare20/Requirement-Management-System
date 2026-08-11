import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Requirement } from '../../types';
import { RequirementForm } from '../../components/requirements/RequirementForm';
import { requirementService } from '../../services/requirementService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { AlertCircle } from 'lucide-react';

export const TrainerEditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    requirementService
      .getRequirementById(id)
      .then(setRequirement)
      .catch((err) => showToast(err.message || 'Failed to load requirement', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await requirementService.updateRequirement(id, formData);
      showToast(`Requirement '${formData.title}' updated successfully`, 'success');
      navigate('/dashboard/trainer/requirements');
    } catch (err: any) {
      showToast(err.message || 'Failed to update requirement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading requirement for edit..." />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Job Requirement Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
          Edit Requirement
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Update Job Requirement: {requirement.title}
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <RequirementForm
          initialData={requirement}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/dashboard/trainer/requirements')}
        />
      </div>
    </div>
  );
};
