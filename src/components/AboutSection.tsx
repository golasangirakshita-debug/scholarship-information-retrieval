import { X, Search, FileText, Calculator, BarChart3, TrendingUp } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function AboutSection({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">About the IR Model</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-700">
          {/* Problem */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Problem Statement</h3>
            <p className="text-sm leading-relaxed">
              India has hundreds of scholarships across central ministries, state governments, and
              universities — each with different eligibility criteria, caste categories, states, and
              education levels. Students struggle to find the ones they actually qualify for. This
              system retrieves and ranks scholarships by relevance to a student's natural-language query,
              using an Information Retrieval engine built on the Vector Space Model.
            </p>
          </section>

          {/* Approach */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Proposed IR Approach</h3>
            <p className="text-sm leading-relaxed mb-4">
              This system uses the <strong>Vector Space Model</strong> with <strong>TF-IDF weighting</strong>{' '}
              and <strong>cosine similarity</strong> — a classic and well-established Information Retrieval
              technique. Each scholarship is treated as a "document" and the user's search query is treated
              as a very short document. Both are converted into weighted term vectors, and the system ranks
              scholarships by how closely their vector aligns with the query vector.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <StepCard
                icon={<FileText size={18} />}
                step="1"
                title="Preprocessing"
                desc="Each scholarship's name, provider, description, level, state, caste category, and tags are combined into one text field. The text is lowercased, punctuation is stripped, and a stop-word list removes common words like 'the', 'is', 'and'."
              />
              <StepCard
                icon={<Calculator size={18} />}
                step="2"
                title="TF-IDF Weighting"
                desc="Term Frequency (TF) counts how often a word appears in a document. Inverse Document Frequency (IDF) downweights words that appear in many scholarships. TF × IDF gives each term a weight reflecting its importance."
              />
              <StepCard
                icon={<Search size={18} />}
                step="3"
                title="Query Vector"
                desc="The user's search query is tokenized the same way and turned into a TF-IDF vector. Only terms present in both the query and the corpus contribute to the score."
              />
              <StepCard
                icon={<TrendingUp size={18} />}
                step="4"
                title="Cosine Similarity"
                desc="The similarity between the query vector and each document vector is computed using cosine similarity — the cosine of the angle between the two vectors. A score of 1.0 means a perfect match; 0 means no overlap."
              />
            </div>
          </section>

          {/* Formula */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Key Formulas</h3>
            <div className="space-y-3">
              <Formula
                label="Term Frequency"
                formula="TF(t, d) = count of term t in document d"
              />
              <Formula
                label="Inverse Document Frequency"
                formula="IDF(t) = log( (N + 1) / (df(t) + 1) ) + 1"
                note="N = total documents, df(t) = documents containing term t"
              />
              <Formula
                label="TF-IDF Weight"
                formula="w(t, d) = TF(t, d) × IDF(t)"
              />
              <Formula
                label="Cosine Similarity"
                formula="sim(q, d) = (q · d) / (‖q‖ × ‖d‖)"
                note="q·d is the dot product of query and document vectors; ‖q‖ and ‖d‖ are their magnitudes"
              />
            </div>
          </section>

          {/* Dataset */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Dataset / Document Collection</h3>
            <p className="text-sm leading-relaxed">
              The system indexes 30 Indian scholarships stored in a Supabase (PostgreSQL) database.
              The collection covers central government schemes (Ministry of Social Justice, Tribal Affairs,
              Minority Affairs, UGC), National Scholarship Portal schemes, and state-level scholarships
              from Maharashtra, Karnataka, Tamil Nadu, Uttar Pradesh, Bihar, Rajasthan, West Bengal,
              Andhra Pradesh, Telangana, and Gujarat. Each document includes name, provider, full
              description, education level, caste category, state, award amount, deadline, and keyword
              tags — giving the IR engine rich textual content for matching.
            </p>
          </section>

          {/* Analysis */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Analysis of Results</h3>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>The Vector Space Model ranks scholarships by <strong>semantic overlap</strong> with the query, not just exact keyword matches — a query like "SC students Maharashtra" will rank state-specific SC scholarships highly even if those exact words aren't adjacent in the text.</li>
              <li><strong>IDF weighting</strong> ensures that common terms like "scholarship" or "students" (which appear in nearly every document) contribute little, while distinctive terms like "Maharashtra", "OBC", or "post-matric" carry much more weight.</li>
              <li>The <strong>cosine similarity</strong> score normalizes for document length, so longer descriptions don't automatically rank higher than concise ones.</li>
              <li>The detail view shows a <strong>per-term contribution breakdown</strong>, making the ranking transparent and explainable — you can see exactly which words drove each result's score.</li>
              <li>Filters for education level, state, and caste category complement the IR ranking by narrowing the document set before scoring, combining precise eligibility filtering with fuzzy relevance ranking.</li>
              <li>Example: querying "phd fellowship for ST research" surfaces the Rajiv Gandhi National Fellowship for ST Students first, because "phd", "fellowship", "ST", and "research" all appear with high TF-IDF weight in that document.</li>
            </ul>
          </section>

          {/* Search Queries / Test Cases */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Search Queries / Test Cases</h3>
            <div className="space-y-2">
              {[
                { query: 'scholarship for SC students in Maharashtra', expect: 'Maharashtra SC scholarships rank highest' },
                { query: 'post matric scholarship for OBC', expect: 'Post Matric OBC scholarships from central and state schemes' },
                { query: 'phd fellowship for ST research', expect: 'Rajiv Gandhi National Fellowship for ST ranks first' },
                { query: 'scholarship for minority students engineering', expect: 'Merit Cum Means and Maulana Azad Fellowships surface' },
                { query: 'EWS scholarship undergraduate', expect: 'Central Sector and EWS scholarships for UG students' },
                { query: 'pre matric scholarship for school students', expect: 'Pre Matric SC, ST, and Minority school-level scholarships' },
              ].map((tc) => (
                <div key={tc.query} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="font-mono text-xs text-blue-600 font-medium">{tc.query}</p>
                  <p className="text-xs text-slate-500 mt-1">{tc.expect}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Technology Used</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase (PostgreSQL)', 'TF-IDF Vector Space Model', 'Cosine Similarity'].map((tech) => (
                <span key={tech} className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
            <BarChart3 size={14} />
            This educational project demonstrates core Information Retrieval concepts: document indexing, term weighting, and vector-space ranking — applied to Indian scholarships.
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ icon, step, title, desc }: { icon: React.ReactNode; step: string; title: string; desc: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400">STEP {step}</span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Formula({ label, formula, note }: { label: string; formula: string; note?: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      <p className="font-mono text-sm text-slate-800">{formula}</p>
      {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
    </div>
  );
}
