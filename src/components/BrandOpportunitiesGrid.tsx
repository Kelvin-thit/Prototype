import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Send,
  CheckCircle2,
  Compass,
  ArrowRight,
  Filter,
  MessageSquare,
  Layers,
} from 'lucide-react';

interface BrandOpportunitiesGridProps {
  brands: any[];
  trends: any[];
  activeCreator: any;
  searchQuery: string;
  onClearSearch: () => void;
  onPitchBrand: (brand: any) => void;
  isDark: boolean;
}

export const BrandOpportunitiesGrid: React.FC<BrandOpportunitiesGridProps> = ({
  brands,
  trends,
  activeCreator,
  searchQuery,
  onClearSearch,
  onPitchBrand,
  isDark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBrands = brands.filter((brand) => {
    if (selectedCategory !== 'all' && brand.category !== selectedCategory) return false;

    if (normalizedQuery) {
      const matchName = brand.name.toLowerCase().includes(normalizedQuery);
      const matchCategory = brand.category.toLowerCase().includes(normalizedQuery);
      const matchProduct = brand.product.toLowerCase().includes(normalizedQuery);
      const matchCampaign = brand.campaign_name.toLowerCase().includes(normalizedQuery);
      const matchLookingFor = brand.looking_for.toLowerCase().includes(normalizedQuery);
      const matchTrends = brand.target_trends?.some((t: string) => t.toLowerCase().includes(normalizedQuery));

      // Also check if query matches any trend related to this brand
      const matchTrendDetails = trends.some((t) =>
        (t.name.toLowerCase().includes(normalizedQuery) || t.summary.toLowerCase().includes(normalizedQuery)) &&
        brand.target_trends?.includes(t.id)
      );

      if (!matchName && !matchCategory && !matchProduct && !matchCampaign && !matchLookingFor && !matchTrends && !matchTrendDetails) {
        return false;
      }
    }

    return true;
  });

  const categories = Array.from(new Set(brands.map((b) => b.category)));

  return (
    <div className="space-y-6">
      {/* Creator Pitch Banner: "Both Sides, Equal Footing" */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-[#31183E] border-[#48255B] text-white'
            : 'bg-white border-[#E8DFD3] text-[#2A1435]'
        } shadow-sm`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8B6A]/15 text-[#FF8B6A] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8B6A]"></span>
              Creator Pitch Mode · Equal Footing
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Brands Actively Seeking Creators
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Don't wait for cold agency emails. Pitch brands directly while search velocity is rising. Every pitch is backed by your verified <strong>Audience Trust Score</strong>.
            </p>
          </div>

          {activeCreator && (
            <div className="p-3 rounded-2xl bg-[#FFF1CC] dark:bg-[#3D2C10] border border-[#FFC94A]/40 text-xs flex items-center gap-3 shrink-0">
              <img
                src={activeCreator.thumbnail}
                alt={activeCreator.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#6D5DFC]/30"
              />
              <div>
                <span className="text-[10px] text-[#6B4A00] dark:text-[#FFC94A] font-bold uppercase block">Pitching As:</span>
                <span className="font-bold text-[#2A1435] dark:text-white">{activeCreator.name}</span>
                <span className="text-[11px] text-neutral-500 block">Trust: {activeCreator.scores?.reception || 82}/100</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-bold uppercase text-[10px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 font-medium"
          >
            <option value="all">All Categories ({brands.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 text-xs">
            <span>Showing brands matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
            <button
              onClick={onClearSearch}
              className="text-[#6D5DFC] font-bold underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg font-heading">
            No brands found matching &ldquo;{searchQuery}&rdquo;
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Try searching for categories like <em>Running</em>, <em>Hydration</em>, <em>Cookware</em>, <em>Supplements</em>, or reset your search.
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl bg-[#6D5DFC] text-white text-xs font-bold shadow-sm"
          >
            Reset Search
          </button>
        </div>
      )}

      {/* Brand Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          // Find matching trend data
          const matchedTrend = trends.find((t) => brand.target_trends?.includes(t.id)) || trends[0];

          return (
            <div
              key={brand.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                isDark
                  ? 'bg-[#31183E] border-[#48255B] text-white'
                  : 'bg-white border-[#E8DFD3] text-[#2A1435]'
              }`}
            >
              <div>
                {/* Header: Trend Tag & Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1CC] text-[#6B4A00] font-bold text-[11px]">
                    <TrendingUp className="w-3 h-3 text-[#B8860B]" />
                    {matchedTrend?.name || 'Rising Trend'} · ↑ {((matchedTrend?.growth_7d || 2.4) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Actively Seeking
                  </span>
                </div>

                {/* Brand Identity & Product */}
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-neutral-200 dark:border-neutral-700 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base font-heading truncate">
                      {brand.name}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {brand.category}
                    </p>
                    <div className="text-[11px] font-semibold text-[#6D5DFC] mt-0.5">
                      {brand.campaign_name}
                    </div>
                  </div>
                </div>

                {/* Budget & Ideal Tier Bar */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Budget Range</span>
                    <span className="text-sm font-extrabold text-emerald-600 font-heading">
                      {brand.budget_range}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Ideal Tier</span>
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      {brand.ideal_tier}
                    </span>
                  </div>
                </div>

                {/* What Brand is Looking For */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    What They Want in Creators:
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[11px] bg-neutral-50/70 dark:bg-neutral-800/40 p-2.5 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
                    {brand.looking_for}
                  </p>
                </div>

                {/* Creator Pitch Tip */}
                <div className="p-2.5 rounded-xl bg-[#F1EDFF] dark:bg-[#251D44] border border-[#6D5DFC]/20 text-[11px] mb-4">
                  <span className="font-bold text-[#4A3BD6] dark:text-[#A69BFF] block text-[10px] uppercase">
                    Suggested Pitch Angle:
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300 italic">
                    &ldquo;{brand.pitch_tip}&rdquo;
                  </span>
                </div>
              </div>

              {/* Bottom Actions: Pitch Brand Button */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-neutral-400 font-medium">
                  Min Trust: <strong>{brand.min_trust_score}/100</strong>
                </span>

                <button
                  onClick={() => onPitchBrand(brand)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF8B6A] hover:bg-[#e87a5a] text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Pitch {brand.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
