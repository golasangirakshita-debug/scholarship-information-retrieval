export interface Scholarship {
  id: string;
  name: string;
  provider: string | null;
  description: string;
  amount: string | null;
  level: string | null;
  field: string | null;
  country: string | null;
  state: string | null;
  caste_category: string | null;
  deadline: string | null;
  tags: string[] | null;
  url: string | null;
  created_at: string;
}

export interface IrResult {
  scholarship: Scholarship;
  score: number;
  matchedTerms: { term: string; queryTf: number; docTf: number; idf: number; contribution: number }[];
}
