import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileCode,
  Search,
  Check,
  Copy,
  Zap,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface BenchmarkResearchViewProps {
  benchmarkData: any;
  comments100: any[];
  trendsData: any[];
  creatorsData: any[];
  isDark: boolean;
}

export const BenchmarkResearchView: React.FC<BenchmarkResearchViewProps> = ({
  benchmarkData,
  comments100,
  trendsData,
  creatorsData,
  isDark,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'agreement' | 'timed_baseline' | 'data_contracts'>('agreement');
  const [searchComment, setSearchComment] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string>('all');
  const [agreedOnlyFilter, setAgreedOnlyFilter] = useState<'all' | 'agreed' | 'disagreed'>('all');
  const [copiedContract, setCopiedContract] = useState<string | null>(null);

  const filteredComments = comments100.filter((c) => {
    if (searchComment && !c.text.toLowerCase().includes(searchComment.toLowerCase())) return false;
    if (selectedLabelFilter !== 'all' && c.human_label !== selectedLabelFilter) return false;
    if (agreedOnlyFilter === 'agreed' && !c.agreed) return false;
    if (agreedOnlyFilter === 'disagreed' && c.agreed) return false;
    return true;
  });

  const copyJson = (data: any, key: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedContract(key);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 w-fit">
        <button
          onClick={() => setActiveSubTab('agreement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'agreement'
              ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          100 Comment Agreement Test (92%)
        </button>
        <button
          onClick={() => setActiveSubTab('timed_baseline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'timed_baseline'
              ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Timed Manual Baseline (4h 12m vs 45s)
        </button>
        <button
          onClick={() => setActiveSubTab('data_contracts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'data_contracts'
              ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Data Formats &amp; Schema (/data/schema.md)
        </button>
      </div>

      {/* 1. Comment Agreement Test */}
      {activeSubTab === 'agreement' && (
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? 'bg-[#31183E] border-[#48255B] text-white' : 'bg-white border-[#E8DFD3] text-[#2A1435]'
          } shadow-sm space-y-6`}
        >
          <div>
            <h3 className="text-xl font-bold font-heading">
              Gemini vs Human Agreement Test (100 Hand-Labeled Comments)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Research benchmark testing whether Gemini can accurately differentiate true purchasing intent and product inquiries from annoyance and time-skips in sponsored comment sections.
            </p>
          </div>

          {/* Aggregate Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F1EDFF] dark:bg-[#261B40] text-center border border-[#6D5DFC]/30">
              <div className="text-3xl font-black text-[#6D5DFC] font-heading">92.0%</div>
              <div className="text-[11px] font-bold text-neutral-500 uppercase mt-0.5">Agreement Rate</div>
              <div className="text-[10px] text-neutral-400">92 of 100 matched</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center border border-emerald-300/40">
              <div className="text-3xl font-black text-emerald-600 font-heading">94.7%</div>
              <div className="text-[11px] font-bold text-neutral-500 uppercase mt-0.5">Purchase Precision</div>
              <div className="text-[10px] text-neutral-400">High intent detection</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-center border border-sky-300/40">
              <div className="text-3xl font-black text-sky-600 font-heading">0.89</div>
              <div className="text-[11px] font-bold text-neutral-500 uppercase mt-0.5">Cohen's Kappa</div>
              <div className="text-[10px] text-neutral-400">Near-perfect reliability</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-center border border-purple-300/40">
              <div className="text-3xl font-black text-purple-600 font-heading">96.4%</div>
              <div className="text-[11px] font-bold text-neutral-500 uppercase mt-0.5">Annoyance Recall</div>
              <div className="text-[10px] text-neutral-400">Flags time-skips easily</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search 100 comments..."
                  value={searchComment}
                  onChange={(e) => setSearchComment(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-[#6D5DFC]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLabelFilter}
                onChange={(e) => setSelectedLabelFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
              >
                <option value="all">All Intent Types</option>
                <option value="purchase">Purchase (Direct Orders)</option>
                <option value="question">Question (Fit & Ingredients)</option>
                <option value="annoyance">Annoyance (Time-Skips)</option>
                <option value="endorsement">Endorsement (Trust)</option>
                <option value="general">General</option>
              </select>

              <select
                value={agreedOnlyFilter}
                onChange={(e) => setAgreedOnlyFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
              >
                <option value="all">All Results (100)</option>
                <option value="agreed">Agreed Only (92)</option>
                <option value="disagreed">Discrepancies Only (8)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-700/60 rounded-2xl max-h-[480px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 font-semibold z-10">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Comment Content</th>
                  <th className="py-2.5 px-3">Human Label</th>
                  <th className="py-2.5 px-3">Gemini Prediction</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/50">
                {filteredComments.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 ${
                      !c.agreed ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-neutral-400 font-mono text-[11px]">{c.id}</td>
                    <td className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200 max-w-md font-sans">
                      &ldquo;{c.text}&rdquo;
                    </td>
                    <td className="py-2.5 px-3 font-semibold uppercase text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full ${
                        c.human_label === 'purchase' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60' :
                        c.human_label === 'question' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60' :
                        c.human_label === 'annoyance' ? 'bg-red-100 text-red-800 dark:bg-red-950/60' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-800'
                      }`}>
                        {c.human_label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold uppercase text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full ${
                        c.gemini_label === 'purchase' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60' :
                        c.gemini_label === 'question' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60' :
                        c.gemini_label === 'annoyance' ? 'bg-red-100 text-red-800 dark:bg-red-950/60' :
                        'bg-neutral-100 text-neutral-700 dark:bg-neutral-800'
                      }`}>
                        {c.gemini_label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {c.agreed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]" title="Boundary discrepancy">
                          <XCircle className="w-3.5 h-3.5" /> Diff
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400 capitalize text-[11px]">
                      {c.creator_tier}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Timed Manual Baseline */}
      {activeSubTab === 'timed_baseline' && (
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? 'bg-[#31183E] border-[#48255B] text-white' : 'bg-white border-[#E8DFD3] text-[#2A1435]'
          } shadow-sm space-y-6`}
        >
          <div>
            <h3 className="text-xl font-bold font-heading">
              Timed Manual Baseline: 9 Steps (4h 12m) vs CreatorXchange (45s)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Research study measuring the time required for one partnership manager to shortlist 10 creators and draft one campaign brief by hand versus using the CreatorXchange bilateral engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Process Box */}
            <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-950 px-2.5 py-1 rounded-full">
                  Manual Baseline (Agency Standard)
                </span>
                <div className="text-xl font-black text-red-600 font-heading">
                  4h 12m active
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {benchmarkData.timed_baseline?.manual?.steps?.map((step: any) => (
                  <div key={step.step} className="p-2.5 rounded-xl bg-white/70 dark:bg-neutral-900/40 border border-red-200/50">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-red-700 dark:text-red-300">
                        Step {step.step}: {step.name}
                      </span>
                      <span className="text-neutral-500 text-[11px] font-mono">{step.duration}</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-red-200 text-xs text-red-700 dark:text-red-300 font-semibold">
                Result: Cultural trend passes before brand signs creator. Average lead time 28-34 days.
              </div>
            </div>

            {/* CreatorXchange Process Box */}
            <div className="p-5 rounded-2xl bg-[#F1EDFF] dark:bg-[#251D44] border border-[#6D5DFC]/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D5DFC] bg-white dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                  CreatorXchange Bilateral Flow
                </span>
                <div className="text-xl font-black text-[#6D5DFC] font-heading">
                  45 Seconds!
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {benchmarkData.timed_baseline?.creatorxchange?.steps?.map((step: any) => (
                  <div key={step.step} className="p-2.5 rounded-xl bg-white/80 dark:bg-neutral-900/50 border border-[#6D5DFC]/20">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#6D5DFC] dark:text-[#A69BFF]">
                        Step {step.step}: {step.name}
                      </span>
                      <span className="text-emerald-600 text-[11px] font-mono">{step.duration}</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-[11px] mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#6D5DFC]/30 text-xs text-[#6D5DFC] dark:text-[#A69BFF] font-semibold">
                Result: Both sides opt in and sign brief within 48 hours while the trend velocity is climbing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Data Contracts & Schema Viewer */}
      {activeSubTab === 'data_contracts' && (
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? 'bg-[#31183E] border-[#48255B] text-white' : 'bg-white border-[#E8DFD3] text-[#2A1435]'
          } shadow-sm space-y-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-heading">
                Tech A &amp; Tech B Data Contracts
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                The agreed schema saved at <code className="text-[#6D5DFC]">/data/schema.md</code>. Tech A produces JSON, Tech B reads it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trends JSON Inspector */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#6D5DFC]">trends.json ({trendsData.length} records)</span>
                <button
                  onClick={() => copyJson(trendsData, 'trends')}
                  className="px-2 py-1 rounded bg-white dark:bg-neutral-800 text-[11px] font-semibold border border-neutral-200 dark:border-neutral-700 flex items-center gap-1"
                >
                  {copiedContract === 'trends' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy JSON
                </button>
              </div>
              <pre className="text-[11px] font-mono p-3 rounded-xl bg-neutral-900 text-neutral-200 overflow-x-auto max-h-60">
                {JSON.stringify(trendsData, null, 2)}
              </pre>
            </div>

            {/* Creators JSON Inspector */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#FF8B6A]">creators.json ({creatorsData.length} records)</span>
                <button
                  onClick={() => copyJson(creatorsData, 'creators')}
                  className="px-2 py-1 rounded bg-white dark:bg-neutral-800 text-[11px] font-semibold border border-neutral-200 dark:border-neutral-700 flex items-center gap-1"
                >
                  {copiedContract === 'creators' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy JSON
                </button>
              </div>
              <pre className="text-[11px] font-mono p-3 rounded-xl bg-neutral-900 text-neutral-200 overflow-x-auto max-h-60">
                {JSON.stringify(creatorsData.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
