import { X, GraduationCap, MapPin, Calendar, IndianRupee, Building2, ExternalLink, Star, Hash, Users } from 'lucide-react';
import type { IrResult } from '@/types';
import { useEffect } from 'react';

interface Props {
  result: IrResult;
  rank?: number;
  onClose: () => void;
  isBrowse?: boolean;
}

export function ScholarshipDetail({ result, rank, onClose, isBrowse }: Props) {
  const { scholarship: s, score, matchedTerms } = result;
  const scorePct = Math.round(score * 100);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
          {/* Rank badge */}
          {rank !== undefined && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              {rank}
            </div>
          )}
          <div className={rank !== undefined ? '' : 'w-full'}>
            <h2 className="text-xl font-bold leading-snug">{s.name}</h2>
              {s.provider && <p className="flex items-center gap-1.5 text-white/80 text-sm mt-1"><Building2 size={13} /> {s.provider}</p>}
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Score banner */}
          {!isBrowse && (
          <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#dbeafe" strokeWidth="6" />
                  <circle
                    cx="32" cy="32" r="28" fill="none" stroke="#3b82f6" strokeWidth="6"
                    strokeDasharray={`${(scorePct / 100) * 176} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {scorePct}%
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Relevance Score</p>
                <p className="text-xs text-slate-500">Cosine similarity in TF-IDF vector space</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-slate-400">Raw score</p>
              <p className="text-sm font-mono font-semibold text-slate-700">{score.toFixed(4)}</p>
            </div>
          </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed text-sm">{s.description}</p>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            {s.level && <MetaItem icon={<GraduationCap size={16} />} label="Education Level" value={s.level} />}
            {s.caste_category && <MetaItem icon={<Users size={16} />} label="Category" value={s.caste_category} />}
            {s.state && <MetaItem icon={<MapPin size={16} />} label="State" value={s.state} />}
            {s.field && <MetaItem icon={<Star size={16} />} label="Field" value={s.field} />}
            {s.amount && <MetaItem icon={<IndianRupee size={16} />} label="Amount" value={s.amount} />}
            {s.deadline && <MetaItem icon={<Calendar size={16} />} label="Deadline" value={s.deadline} />}
          </div>

          {/* Tags */}
          {s.tags && s.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    <Hash size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* IR Score breakdown */}
          {!isBrowse && matchedTerms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                IR Term Contribution Breakdown
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Each term's contribution to the cosine similarity score, showing how query terms matched this document.
              </p>
              <div className="space-y-2">
                {matchedTerms.map((m) => {
                  const maxContribution = matchedTerms[0].contribution || 1;
                  const barWidth = (m.contribution / maxContribution) * 100;
                  return (
                    <div key={m.term} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-24 text-xs font-mono font-medium text-blue-600 truncate">
                        {m.term}
                      </span>
                      <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-md transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="flex-shrink-0 w-24 text-right text-xs text-slate-500 font-mono">
                        {m.contribution.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span>Query TF × IDF = <span className="font-mono">{matchedTerms[0]?.queryTf}×{matchedTerms[0]?.idf.toFixed(2)}</span></span>
                <span>Doc TF × IDF = <span className="font-mono">{matchedTerms[0]?.docTf}×{matchedTerms[0]?.idf.toFixed(2)}</span></span>
              </div>
            </div>
          )}

          {/* Link */}
          {s.url && (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink size={15} />
              Visit official scholarship page
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
        {icon} {label}
      </p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
