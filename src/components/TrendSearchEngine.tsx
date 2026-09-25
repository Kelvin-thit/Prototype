import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  Tag,
  ArrowRight,
  Flame,
  Check,
  RefreshCw,
  X,
  Compass,
  Building2,
} from 'lucide-react';

interface TrendSearchEngineProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  trends: any[];
  activeBrand: string;
  onBrandChange: (brand: string) => void;
  onAddNewScoutedTrend: (trend: any) => void;
  searchTarget: 'creators' | 'brands';
  onSearchTargetChange: (target: 'creators' | 'brands') => void;
  activeCreator?: any;
  isDark: boolean;
}

export const TrendSearchEngine: React.FC<TrendSearchEngineProps> = ({
  searchQuery,
  onSearchChange,
  trends,
  activeBrand,
  onBrandChange,
  onAddNewScoutedTrend,
  searchTarget,
  onSearchTargetChange,
  activeCreator,
  isDark,
}) => {
  const [isScouting, setIsScouting] = useState(false);
  const [scoutedTrend, setScoutedTrend] = useState<any | null>(null);
  const [scoutError, setScoutError] = useState<string | null>(null);

  // Popular keyword pills from live Google Search and YouTube trends
  const popularKeywords = searchTarget === 'brands' ? [
    'Running Gear',
    'Electrolytes',
    'Cookware Bento',
    'Sunday Planner',
    'Cold Plunge',
    'Matcha & Tea',
    'Recovery Massage',
    'Protein Baking',
    'Hydration Tumbler',
  ] : [
    'Run Club',
    'Gym Girl Lunch',
    'Sunday Reset',
    'Cold Plunge',
    'High Protein',
    'Electrolytes',
    'Marathon Prep',
    'Meal Prep Containers',
    'Recovery & Foam',
    'Clean Supplements',
  ];

  const popularBrands = [
    'Stride & Co.',
    'Vital Proteins',
    'LMNT Electrolytes',
    'Caraway Home',
    'Hyperice',
    'Notion',
    'Stanley 1913',
    'Ciele Athletics',
  ];

  const handleScoutNewKeyword = async () => {
    if (!searchQuery.trim()) return;

    setIsScouting(true);
    setScoutError(null);
    setScoutedTrend(null);

    try {
      const response = await fetch('/api/trend-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          brand: activeBrand,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.trend) {
        setScoutedTrend(data.trend);
        onAddNewScoutedTrend(data.trend);
      }
    } catch (err: any) {
      console.error('Failed to scout trend:', err);
      setScoutError('Unable to analyze live trend signals right now.');
    } finally {
      setIsScouting(false);
    }
  };

  const isBrandTarget = searchTarget === 'brands';

  return (
    <div
      className={`rounded-3xl border p-6 mb-8 transition-all ${
        isDark
          ? 'bg-[#2D1639] border-[#4A265D] text-white'
          : 'bg-white border-[#E8DFD3] text-[#2A1435]'
      } shadow-md`}
    >
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isBrandTarget
                ? 'bg-[#FF8B6A]/15 text-[#FF8B6A]'
                : 'bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#A69BFF]'
            }`}>
              <Compass className="w-3.5 h-3.5" />
              {isBrandTarget ? 'Creator View: Match Brands to Pitch' : 'Brand View: Match Creators to Hire'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            {isBrandTarget
              ? 'Find Brands Actively Looking for Creators'
              : 'Find Creators Whose Audiences Actually Buy'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isBrandTarget
              ? 'Search rising trends to discover sponsor brands with open campaigns and active budgets ready for creator pitches.'
              : 'Search rising cultural keywords and trends to discover vetted creators scored on true comment purchase intent.'}
          </p>
        </div>

        {/* Search Mode Toggle (Brand vs Creator) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 self-start md:self-auto text-xs">
          <button
            onClick={() => onSearchTargetChange('creators')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              !isBrandTarget
                ? 'bg-[#6D5DFC] text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            I'm a Brand → Find Creators
          </button>
          <button
            onClick={() => onSearchTargetChange('brands')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              isBrandTarget
                ? 'bg-[#FF8B6A] text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            I'm a Creator → Find Brands
          </button>
        </div>
      </div>

      {/* Primary Search Bar with Scout Action */}
      <div className="relative mb-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleScoutNewKeyword();
            }}
            placeholder={
              isBrandTarget
                ? "Search brands by product, trend, or niche (e.g. 'running shoes', 'hydration', 'cookware', 'matcha', 'Notion')..."
                : "Search creators by trend keyword or niche (e.g. 'marathon', 'high protein', 'cold plunge', 'meal prep')..."
            }
            className="w-full pl-12 pr-36 sm:pr-48 py-3.5 text-sm font-medium rounded-2xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/90 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#6D5DFC] shadow-inner"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-28 sm:right-40 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Scout with Gemini button */}
          <button
            onClick={handleScoutNewKeyword}
            disabled={isScouting || !searchQuery.trim()}
            className={`absolute right-2 sm:right-2.5 px-3 sm:px-4 py-2 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 ${
              isBrandTarget ? 'bg-[#FF8B6A] hover:bg-[#e87a5a]' : 'bg-[#6D5DFC] hover:bg-[#5848e5]'
            }`}
            title="Analyze live Google Search & YouTube trend metrics with Gemini"
          >
            {isScouting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFC94A]" />
                <span className="hidden sm:inline">Scouting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" />
                <span className="hidden sm:inline">Scout with Gemini</span>
                <span className="sm:hidden">Scout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trending Keyword Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-400 font-bold uppercase text-[10px] flex items-center gap-1 mr-1">
          <Flame className="w-3 h-3 text-[#FF8B6A]" />
          Trending Signals:
        </span>
        {popularKeywords.map((kw) => {
          const isSelected = searchQuery.toLowerCase() === kw.toLowerCase();
          return (
            <button
              key={kw}
              onClick={() => onSearchChange(isSelected ? '' : kw)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                isSelected
                  ? 'bg-[#6D5DFC] text-white shadow-xs font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {kw}
            </button>
          );
        })}
      </div>

      {/* Scout Error Message */}
      {scoutError && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs">
          {scoutError}
        </div>
      )}

      {/* Newly Scouted Trend Card Highlight */}
      {scoutedTrend && (
        <div className="mt-6 p-5 rounded-2xl bg-[#FFF1CC] dark:bg-[#3D2C10] border border-[#FFC94A] text-[#2A1435] dark:text-[#FFF7EF] animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFC94A] text-[#2A1435] text-[11px] font-black uppercase tracking-wider">
                Live Scouted Signal · ↑ {(scoutedTrend.growth_7d * 100).toFixed(0)}% 7d
              </span>
              <span className="text-xs font-semibold text-[#6B4A00] dark:text-[#FFC94A]">
                {scoutedTrend.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6B4A00] dark:text-[#FFC94A] font-bold">
              <span>Search Velocity: {scoutedTrend.search_interest}/100</span>
              <span>·</span>
              <span>YouTube Interest: {scoutedTrend.yt_interest}/100</span>
            </div>
          </div>

          <h3 className="text-xl font-extrabold font-heading mb-1 text-[#2A1435] dark:text-white">
            {scoutedTrend.name}
          </h3>
          <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 mb-3">
            {scoutedTrend.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
            {/* Evidence */}
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/20 border border-neutral-300/40">
              <span className="font-bold text-[#6B4A00] dark:text-[#FFC94A] block mb-1 uppercase text-[10px]">
                Search &amp; YouTube Evidence:
              </span>
              <ul className="space-y-1 text-[11px] text-neutral-700 dark:text-neutral-300">
                {scoutedTrend.evidence?.map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* Rising Queries */}
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/20 border border-neutral-300/40">
              <span className="font-bold text-[#6B4A00] dark:text-[#FFC94A] block mb-1 uppercase text-[10px]">
                Rising User Search Queries:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {scoutedTrend.top_queries?.map((query: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-800 dark:text-neutral-200"
                  >
                    "{query}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 text-xs flex items-center justify-between">
            <span className="text-[#4A3BD6] dark:text-[#A69BFF] font-medium">
              <strong>Brand Activation Angle:</strong> {scoutedTrend.brand_fit_angle}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0 ml-3 text-[11px]">
              ✓ Ready to Pitch Creators Below
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
