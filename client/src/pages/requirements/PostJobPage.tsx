import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequirementForm } from '../../components/requirements/RequirementForm';
import { requirementService } from '../../services/requirementService';
import { useToast } from '../../context/ToastContext';
import { Briefcase } from 'lucide-react';

export const PostJobPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await requirementService.createRequirement(data);
      showToast(
        `Requirement '${data.title}' ${
          data.status === 'DRAFT' ? 'saved as draft' : 'published'
        } successfully!`,
        'success'
      );
      navigate('/my-postings');
    } catch (err: any) {
      showToast(err.message || 'Failed to create job requirement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block mb-1">
            Requirement Placement Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Post External Job Opportunity
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Publish verified external career opportunities from LinkedIn, Naukri, Indeed, or corporate portals.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <RequirementForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
};
