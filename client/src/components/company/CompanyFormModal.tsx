import React, { useEffect, useState } from 'react';
import { Company } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { X, Plus, Trash2 } from 'lucide-react';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Company | null;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [locations, setLocations] = useState<string[]>(['']);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setIndustry(initialData.industry || '');
      setWebsite(initialData.website || '');
      setLinkedinUrl(initialData.linkedinUrl || '');
      setDescription(initialData.description || '');
      setLocations(initialData.locations && initialData.locations.length > 0 ? initialData.locations : ['']);
      setLogoUrl(initialData.logoUrl || '');
    } else {
      setName('');
      setIndustry('');
      setWebsite('');
      setLinkedinUrl('');
      setDescription('');
      setLocations(['']);
      setLogoUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleLocationChange = (index: number, val: string) => {
    const next = [...locations];
    next[index] = val;
    setLocations(next);
  };

  const handleAddLocation = () => {
    setLocations([...locations, '']);
  };

  const handleRemoveLocation = (index: number) => {
    if (locations.length <= 1) return;
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredLocs = locations.map((l) => l.trim()).filter((l) => l !== '');

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        industry: industry.trim(),
        website: website.trim(),
        linkedinUrl: linkedinUrl.trim(),
        description: description.trim(),
        locations: filteredLocs.length > 0 ? filteredLocs : ['Bangalore'],
        logoUrl: logoUrl.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
              Corporate Management
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {initialData ? 'Edit Company Profile' : 'Register New Company'}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Industry / Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Information Technology"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company Logo URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://logo.com/logo.png"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/acme"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Locations *
            </label>
            <div className="space-y-2">
              {locations.map((loc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={loc}
                    onChange={(e) => handleLocationChange(idx, e.target.value)}
                    placeholder="e.g. Bangalore, Hyderabad, Remote"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
                  />
                  {locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLocation}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Location</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description / Overview
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief company background..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" label="" />
              ) : (
                <span>{initialData ? 'Save Changes' : 'Register Company'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
