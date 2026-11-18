import { GraduationCap, MapPin, Calendar, IndianRupee, Building2, Users, ChevronRight, FileText, Grid3x3 } from 'lucide-react';
import type { Scholarship } from '@/types';

interface Props {
  scholarships: Scholarship[];
  mode: 'all' | 'states' | 'categories';
  onSelectScholarship: (s: Scholarship) => void;
  onSelectState: (state: string) => void;
  onSelectCategory: (category: string) => void;
  onBack: () => void;
  filteredCount: number;
}

export function BrowseView({ scholarships, mode, onSelectScholarship, onSelectState, onSelectCategory, onBack, filteredCount }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors"
        >
          <ChevronRight size={18} className="rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'all' && 'All Scholarships'}
            {mode === 'states' && 'Browse by State'}
            {mode === 'categories' && 'Browse by Category'}
          </h2>
          <p className="text-sm text-slate-500">
            {mode === 'all' && `${filteredCount} scholarships available across India`}
            {mode === 'states' && 'Select a state to view its scholarships'}
            {mode === 'categories' && 'Select a category to view its scholarships'}
          </p>
        </div>
      </div>

      {mode === 'all' && (
        <div className="space-y-3">
          {scholarships.map((s) => (
            <BrowseCard key={s.id} scholarship={s} onClick={() => onSelectScholarship(s)} />
          ))}
        </div>
      )}

      {mode === 'states' && (
        <StateGrid scholarships={scholarships} onSelect={onSelectState} />
      )}

      {mode === 'categories' && (
        <CategoryGrid scholarships={scholarships} onSelect={onSelectCategory} />
      )}
    </div>
  );
}

function BrowseCard({ scholarship: s, onClick }: { scholarship: Scholarship; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
            {s.name}
          </h3>
          {s.provider && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Building2 size={12} className="flex-shrink-0" />
              {s.provider}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {s.level && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                <GraduationCap size={10} />
                {s.level}
              </span>
            )}
            {s.caste_category && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                <Users size={10} />
                {s.caste_category}
              </span>
            )}
            {s.state && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                <MapPin size={10} />
                {s.state}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform mt-1" />
      </div>
    </button>
  );
}

function StateGrid({ scholarships, onSelect }: { scholarships: Scholarship[]; onSelect: (state: string) => void }) {
  const stateMap = new Map<string, number>();
  scholarships.forEach((s) => {
    if (s.state) stateMap.set(s.state, (stateMap.get(s.state) || 0) + 1);
  });
  const states = Array.from(stateMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {states.map(([state, count]) => (
        <button
          key={state}
          onClick={() => onSelect(state)}
          className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
            <MapPin size={18} />
          </div>
          <p className="font-semibold text-slate-900 text-sm leading-snug">{state}</p>
          <p className="text-xs text-slate-400 mt-0.5">{count} scholarship{count !== 1 ? 's' : ''}</p>
        </button>
      ))}
    </div>
  );
}

function CategoryGrid({ scholarships, onSelect }: { scholarships: Scholarship[]; onSelect: (category: string) => void }) {
  const catMap = new Map<string, number>();
  scholarships.forEach((s) => {
    if (s.caste_category) catMap.set(s.caste_category, (catMap.get(s.caste_category) || 0) + 1);
  });
  const categories = Array.from(catMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map(([category, count]) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
            <Users size={18} />
          </div>
          <p className="font-semibold text-slate-900 text-sm leading-snug">{category}</p>
          <p className="text-xs text-slate-400 mt-0.5">{count} scholarship{count !== 1 ? 's' : ''}</p>
        </button>
      ))}
    </div>
  );
}
