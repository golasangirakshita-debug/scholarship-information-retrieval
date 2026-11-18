import { GraduationCap, MapPin, Calendar, IndianRupee, Building2, Star, ChevronRight, Users } from 'lucide-react';
import type { IrResult } from '@/types';

interface Props {
  result: IrResult;
  rank: number;
  onClick: () => void;
}

export function ScholarshipCard({ result, rank, onClick }: Props) {
  const { scholarship: s, score, matchedTerms } = result;

  const scorePct = Math.round(score * 100);

  const matchedTags = matchedTerms.slice(0, 4).map((m) => m.term);

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
              {s.name}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Star size={12} fill="currentColor" />
              {scorePct}%
            </div>
          </div>

          {s.provider && (
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <Building2 size={13} className="flex-shrink-0" />
              {s.provider}
            </p>
          )}

          <p className="text-sm text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {s.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {s.level && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                <GraduationCap size={11} />
                {s.level}
              </span>
            )}
            {s.caste_category && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                <Users size={11} />
                {s.caste_category}
              </span>
            )}
            {s.state && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                <MapPin size={11} />
                {s.state}
              </span>
            )}
            {s.amount && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                <IndianRupee size={11} />
                {s.amount}
              </span>
            )}
            {s.deadline && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full">
                <Calendar size={11} />
                {s.deadline}
              </span>
            )}
          </div>

          {matchedTags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Matched:</span>
              {matchedTags.map((tag) => (
                <span key={tag} className="text-xs font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
              <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform ml-auto" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
