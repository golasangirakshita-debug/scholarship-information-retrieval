import type { Scholarship, IrResult } from '@/types';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
  'them', 'my', 'your', 'his', 'its', 'our', 'their', 'as', 'if', 'then',
  'so', 'than', 'too', 'very', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over',
  'under', 'again', 'further', 'once', 'here', 'there', 'all', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
  'own', 'same', 'any', 'who', 'whom', 'which', 'what', 'whose',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function buildDocument(scholarship: Scholarship): string {
  const tags = scholarship.tags ? scholarship.tags.join(' ') : '';
  return [
    scholarship.name,
    scholarship.provider || '',
    scholarship.description,
    scholarship.level || '',
    scholarship.field || '',
    scholarship.state || '',
    scholarship.caste_category || '',
    tags,
  ].join(' ');
}

/** Maps each unique term to a list of document indices it appears in. */
function buildInvertedIndex(docs: string[][]): Map<string, Set<number>> {
  const index = new Map<string, Set<number>>();
  docs.forEach((tokens, docIdx) => {
    const seen = new Set(tokens);
    seen.forEach((term) => {
      if (!index.has(term)) index.set(term, new Set());
      index.get(term)!.add(docIdx);
    });
  });
  return index;
}

function termFrequency(tokens: string[], term: string): number {
  let count = 0;
  for (const t of tokens) if (t === term) count++;
  return count;
}

export interface IrIndex {
  scholarships: Scholarship[];
  docTokens: string[][];
  invertedIndex: Map<string, Set<number>>;
  idf: Map<string, number>;
}

export function buildIndex(scholarships: Scholarship[]): IrIndex {
  const docTokens = scholarships.map((s) => tokenize(buildDocument(s)));
  const N = scholarships.length;
  const invertedIndex = buildInvertedIndex(docTokens);

  const idf = new Map<string, number>();
  for (const [term, docs] of invertedIndex) {
    idf.set(term, Math.log((N + 1) / (docs.size + 1)) + 1);
  }

  return { scholarships, docTokens, invertedIndex, idf };
}

function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const [, val] of vecA) magA += val * val;
  for (const [, val] of vecB) magB += val * val;

  for (const [term, valA] of vecA) {
    const valB = vecB.get(term);
    if (valB !== undefined) dotProduct += valA * valB;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dotProduct / denom;
}

/**
 * Performs a TF-IDF Vector Space Model search.
 * Each document and the query are represented as TF-IDF weighted vectors,
 * ranked by cosine similarity to the query vector.
 */
export function search(index: IrIndex, query: string, limit = 30, minScore = 0.01): IrResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const { scholarships, docTokens, idf } = index;

  // Build the query TF-IDF vector.
  const queryVec = new Map<string, number>();
  const queryTfMap = new Map<string, number>();
  for (const term of queryTokens) {
    queryTfMap.set(term, (queryTfMap.get(term) || 0) + 1);
  }
  for (const [term, tf] of queryTfMap) {
    const termIdf = idf.get(term);
    if (termIdf !== undefined) {
      queryVec.set(term, tf * termIdf);
    }
  }

  if (queryVec.size === 0) return [];

  const results: IrResult[] = [];

  for (let i = 0; i < scholarships.length; i++) {
    const tokens = docTokens[i];

    // Build the document TF-IDF vector for terms that appear in the query.
    const docVec = new Map<string, number>();
    const matchedTerms: IrResult['matchedTerms'] = [];

    for (const [term, qTfIdf] of queryVec) {
      const docTf = termFrequency(tokens, term);
      if (docTf > 0) {
        const termIdf = idf.get(term)!;
        const docTfIdf = docTf * termIdf;
        docVec.set(term, docTfIdf);
        matchedTerms.push({
          term,
          queryTf: queryTfMap.get(term)!,
          docTf,
          idf: termIdf,
          contribution: qTfIdf * docTfIdf,
        });
      }
    }

    if (docVec.size === 0) continue;

    const score = cosineSimilarity(queryVec, docVec);
    if (score < minScore) continue;

    matchedTerms.sort((a, b) => b.contribution - a.contribution);

    results.push({
      scholarship: scholarships[i],
      score,
      matchedTerms,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
