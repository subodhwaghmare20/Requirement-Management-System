import React, { useEffect, useState } from 'react';
import { Company } from '../../types';
import { companyService } from '../../services/companyService';
import { Building2, ChevronDown } from 'lucide-react';

interface CompanySelectorProps {
  value?: string;
  onSelect: (company: Company | { name: string; _id?: string }) => void;
  disabled?: boolean;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  value,
  onSelect,
  disabled = false,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companyService.getCompanies({ limit: 100 });
        setCompanies(res.companies);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === 'CUSTOM_NEW') {
      setIsCustom(true);
      onSelect({ name: customName });
    } else {
      setIsCustom(false);
      const found = companies.find((c) => c._id === selectedId);
      if (found) {
        onSelect(found);
      }
    }
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomName(val);
    onSelect({ name: val });
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm">
        Loading active companies...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <select
          value={isCustom ? 'CUSTOM_NEW' : value || ''}
          onChange={handleSelectChange}
          disabled={disabled}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm font-medium transition-all appearance-none"
        >
          <option value="">-- Select Hiring Company --</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name} ({company.industry || 'Tech'})
            </option>
          ))}
          <option value="CUSTOM_NEW">➕ Other Company (Enter custom name)</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {isCustom && (
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
          <label className="block text-xs font-semibold text-blue-900 mb-1">
            Enter Company Name
          </label>
          <input
            type="text"
            value={customName}
            onChange={handleCustomNameChange}
            placeholder="e.g. Google, Microsoft, Infosys"
            className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-slate-900 text-sm font-medium focus:outline-hidden"
          />
        </div>
      )}
    </div>
  );
};
