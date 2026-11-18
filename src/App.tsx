import { useState, useMemo, useEffect } from 'react';
import { Search, Info, X, MapPin, Sparkles, Filter, BookOpen, SlidersHorizontal, Users, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { buildIndex, search, type IrIndex } from '@/lib/ir-engine';
import type { Scholarship, IrResult } from '@/types';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { ScholarshipDetail } from '@/components/ScholarshipDetail';
import { AboutSection } from '@/components/AboutSection';
import { BrowseView } from '@/components/BrowseView';

const SAMPLE_QUERIES = [
  'scholarship for SC students in Maharashtra',
  'post matric scholarship for OBC',
  'phd fellowship for ST research',
  'scholarship for minority students engineering',
  'EWS scholarship undergraduate',
  'pre matric scholarship for school students',
];

type BrowseMode = 'all' | 'states' | 'categories' | null;

export default function App() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<IrResult | null>(null);
  const [selectedRank, setSelectedRank] = useState<number | undefined>(undefined);
  const [isBrowseDetail, setIsBrowseDetail] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filterLevel, setFilterLevel] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [browseMode, setBrowseMode] = useState<BrowseMode>(null);
  const [browseScholarships, setBrowseScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from('scholarships').select('*');
      if (error) {
        setError(error.message);
      } else if (data) {
        setScholarships(data as Scholarship[]);
      }
      setLoading(false);
    })();
  }, []);

  const index: IrIndex | null = useMemo(() => {
    if (scholarships.length === 0) return null;
    return buildIndex(scholarships);
  }, [scholarships]);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      if (filterLevel && s.level !== filterLevel) return false;
      if (filterState && s.state !== filterState) return false;
      if (filterCategory && s.caste_category !== filterCategory) return false;
      return true;
    });
  }, [scholarships, filterLevel, filterState, filterCategory]);

  const results: IrResult[] = useMemo(() => {
    if (!index || activeQuery.trim().length === 0) return [];
    const filteredIndex = buildIndex(filteredScholarships);
    return search(filteredIndex, activeQuery);
  }, [index, activeQuery, filteredScholarships]);

  const uniqueValues = useMemo(() => {
    const levels = new Set<string>();
    const states = new Set<string>();
    const categories = new Set<string>();
    scholarships.forEach((s) => {
      if (s.level) levels.add(s.level);
      if (s.state) states.add(s.state);
      if (s.caste_category) categories.add(s.caste_category);
    });
    return {
      levels: Array.from(levels).sort(),
      states: Array.from(states).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [scholarships]);

  const handleSearch = () => {
    setBrowseMode(null);
    setActiveQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const openSearchDetail = (result: IrResult, rank: number) => {
    setSelectedResult(result);
    setSelectedRank(rank);
    setIsBrowseDetail(false);
  };

  const openBrowseDetail = (s: Scholarship) => {
    setSelectedResult({ scholarship: s, score: 0, matchedTerms: [] });
    setSelectedRank(undefined);
    setIsBrowseDetail(true);
  };

  const openBrowseMode = (mode: BrowseMode) => {
    setBrowseMode(mode);
    setActiveQuery('');
    setQuery('');
    setBrowseScholarships(scholarships);
  };

  const browseByState = (state: string) => {
    setBrowseScholarships(scholarships.filter((s) => s.state === state));
    setBrowseMode('all');
  };

  const browseByCategory = (category: string) => {
    setBrowseScholarships(scholarships.filter((s) => s.caste_category === category));
    setBrowseMode('all');
  };

  const exitBrowse = () => {
    setBrowseMode(null);
    setBrowseScholarships([]);
  };

  const clearFilters = () => {
    setFilterLevel('');
    setFilterState('');
    setFilterCategory('');
  };

  const hasFilters = filterLevel || filterState || filterCategory;
  const showResults = activeQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
              <BookOpen size={18} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">ScholarSeek</h1>
              <p className="text-xs text-slate-400 leading-tight">Find Scholarships Across India</p>
            </div>
          </div>
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            <Info size={16} />
            <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </header>

      {/* Hero / Search */}
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={13} />
            Scholarships for Every Indian State & Category
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Find the Right Scholarship
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              for Your State & Category
            </span>
          </h2>
          <p className="text-slate-500 mt-4 text-base leading-relaxed">
            Search {scholarships.length} scholarships across India. Filter by your state, caste category, and
            education level to find the support you are eligible for.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={20} className="ml-2 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. scholarship for SC students in Maharashtra"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-sm"
            />
            {query && (
              <button onClick={() => { setQuery(''); setActiveQuery(''); }} className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters || hasFilters ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-100'}`}
              title="Filters"
            >
              <SlidersHorizontal size={18} />
            </button>
            <button
              onClick={handleSearch}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Search
            </button>
          </div>

          {/* Sample queries */}
          {!showResults && !browseMode && (
            <div className="mt-4">
              <p className="text-xs text-slate-400 text-center mb-2">Try one of these example searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setQuery(q); setBrowseMode(null); setActiveQuery(q); }}
                    className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Filter size={15} /> Filters
                </span>
                {hasFilters ? (
                  <button onClick={clearFilters} className="text-xs text-blue-600 font-medium hover:underline">
                    Clear all
                  </button>
                ) : null}
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <FilterSelect label="Education Level" value={filterLevel} options={uniqueValues.levels} onChange={setFilterLevel} />
                <FilterSelect label="State" value={filterState} options={uniqueValues.states} onChange={setFilterState} />
                <FilterSelect label="Category" value={filterCategory} options={uniqueValues.categories} onChange={setFilterCategory} />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Use filters to narrow down by state, category, or education level before searching.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results / Stats / Browse */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading scholarships...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <X size={24} />
            </div>
            <p className="text-slate-700 font-medium mb-1">Couldn't load scholarships</p>
            <p className="text-sm text-slate-400">{error}</p>
          </div>
        )}

        {/* Browse mode */}
        {!loading && !error && browseMode && (
          <BrowseView
            scholarships={browseScholarships}
            mode={browseMode}
            onSelectScholarship={openBrowseDetail}
            onSelectState={browseByState}
            onSelectCategory={browseByCategory}
            onBack={exitBrowse}
            filteredCount={browseScholarships.length}
          />
        )}

        {/* Search results */}
        {!loading && !error && !browseMode && showResults && (
          <>
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{results.length}</span> result{results.length !== 1 ? 's' : ''} for
                <span className="font-mono text-blue-600 ml-1">"{activeQuery}"</span>
              </p>
              {hasFilters && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Filter size={12} />
                  {[filterLevel, filterState, filterCategory].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <Search size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No scholarships matched your search.</p>
                <p className="text-sm text-slate-400 mt-1">Try different keywords or remove some filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <ScholarshipCard
                    key={result.scholarship.id}
                    result={result}
                    rank={idx + 1}
                    onClick={() => openSearchDetail(result, idx + 1)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Default landing — clickable stat cards */}
        {!loading && !error && !browseMode && !showResults && (
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button onClick={() => openBrowseMode('all')} className="group text-left">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarships.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Scholarships available</p>
                <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  View all <ChevronRight size={12} />
                </span>
              </div>
            </button>
            <button onClick={() => openBrowseMode('states')} className="group text-left">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{uniqueValues.states.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Indian states covered</p>
                <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse states <ChevronRight size={12} />
                </span>
              </div>
            </button>
            <button onClick={() => openBrowseMode('categories')} className="group text-left">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{uniqueValues.categories.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Categories supported</p>
                <span className="inline-flex items-center gap-1 text-xs text-indigo-500 font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse categories <ChevronRight size={12} />
                </span>
              </div>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <MapPin size={12} />
            Scholarship search for Indian students across all states and categories
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedResult && (
        <ScholarshipDetail
          result={selectedResult}
          rank={selectedRank}
          onClose={() => setSelectedResult(null)}
          isBrowse={isBrowseDetail}
        />
      )}
      {showAbout && <AboutSection onClose={() => setShowAbout(false)} />}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-400 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
