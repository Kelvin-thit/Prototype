import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Filter,
  DollarSign,
  Building2,
  Copy,
  Check,
  Flame,
  UserCheck,
  Tag,
  Zap,
} from 'lucide-react';

interface OpportunitiesGridProps {
  trends: any[];
  creators: any[];
  brands: any[];
  isDark: boolean;
  onOpenBriefFor: (trendId: string, creatorId: string, brand?: any, initiator?: 'brand' | 'creator') => void;
  onInspectCreator: (creator: any) => void;
  searchQuery?: string;
  activeBrand?: string;
  onClearSearch?: () => void;
  searchTarget: 'creators' | 'brands';
  onSearchTargetChange: (target: 'creators' | 'brands') => void;
}

export const OpportunitiesGrid: React.FC<OpportunitiesGridProps> = ({
  trends,
  creators,
  brands = [],
  isDark,
  onOpenBriefFor,
  onInspectCreator,
  searchQuery = '',
  activeBrand = 'Stride & Co.',
  onClearSearch,
  searchTarget,
  onSearchTargetChange,
}) => {
  const [selectedTrendFilter, setSelectedTrendFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'mid-size' | 'large'>('all');
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [brandCategoryFilter, setBrandCategoryFilter] = useState<string>('all');
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Matched trending topics for the search query
  const matchedTrends = trends.filter((t) => {
    if (!normalizedQuery) return true;
    return (
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.category.toLowerCase().includes(normalizedQuery) ||
      t.summary.toLowerCase().includes(normalizedQuery) ||
      t.top_queries?.some((q: string) => q.toLowerCase().includes(normalizedQuery))
    );
  });

  // Filtered Creators (Brand perspective)
  const filteredCreators = creators.filter((c) => {
    if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
    if (c.scores?.reception < minTrustScore) return false;

    // Filter by trend dropdown
    if (selectedTrendFilter !== 'all') {
      const trend = trends.find((t) => t.id === selectedTrendFilter);
      if (trend && !c.category.toLowerCase().includes(trend.category.split('&')[0].trim().toLowerCase())) {
        // Keep lenient to allow related creators
      }
    }

    if (normalizedQuery) {
      const matchName = c.name.toLowerCase().includes(normalizedQuery);
      const matchChannel = c.channel_name.toLowerCase().includes(normalizedQuery);
      const matchCategory = c.category.toLowerCase().includes(normalizedQuery);
      const matchSponsor = c.sponsors?.some((s: any) =>
        (s.sponsor_brand || s.brand || '').toLowerCase().includes(normalizedQuery) ||
        (s.title || '').toLowerCase().includes(normalizedQuery)
      );
      const matchComment = c.evidence_comments?.some((ec: any) =>
        (ec.text || '').toLowerCase().includes(normalizedQuery)
      );
      const matchAdInsight = c.ad_analysis?.insight?.toLowerCase().includes(normalizedQuery);

      const matchTrend = trends.some((t) =>
        (t.name.toLowerCase().includes(normalizedQuery) ||
          t.summary.toLowerCase().includes(normalizedQuery) ||
          t.top_queries?.some((q: string) => q.toLowerCase().includes(normalizedQuery))) &&
        c.category.toLowerCase().includes(t.category.split('&')[0].trim().toLowerCase())
      );

      if (!matchName && !matchChannel && !matchCategory && !matchSponsor && !matchComment && !matchAdInsight && !matchTrend) {
        return false;
      }
    }

    return true;
  });

  // Filtered Brands (Creator perspective)
  const filteredBrands = brands.filter((b) => {
    if (brandCategoryFilter !== 'all' && b.category !== brandCategoryFilter) return false;

    // Filter by trend dropdown
    if (selectedTrendFilter !== 'all' && b.target_trends && !b.target_trends.includes(selectedTrendFilter)) {
      return false;
    }

    if (normalizedQuery) {
      const matchName = b.name.toLowerCase().includes(normalizedQuery);
      const matchCat = b.category.toLowerCase().includes(normalizedQuery);
      const matchProd = b.product.toLowerCase().includes(normalizedQuery);
      const matchCamp = b.campaign_name.toLowerCase().includes(normalizedQuery);
      const matchLook = b.looking_for.toLowerCase().includes(normalizedQuery);
      const matchTip = b.pitch_tip?.toLowerCase().includes(normalizedQuery);
      const matchTrends = b.target_trends?.some((tId: string) => {
        const tr = trends.find((t) => t.id === tId);
        return tr && (tr.name.toLowerCase().includes(normalizedQuery) || tr.category.toLowerCase().includes(normalizedQuery));
      });

      if (!matchName && !matchCat && !matchProd && !matchCamp && !matchLook && !matchTip && !matchTrends) {
        return false;
      }
    }

    return true;
  });

  const handleCopyPitch = (pitchText: string, id: string) => {
    navigator.clipboard.writeText(pitchText);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  const isBrandTarget = searchTarget === 'brands';

  return (
    <div className="space-y-8">
      {/* 5-Step Bilateral Matching System Banner */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-[#31183E] border-[#48255B] text-white'
            : 'bg-white border-[#E8DFD3] text-[#2A1435]'
        } shadow-xs`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6D5DFC] dark:text-[#A69BFF]">
            The 5-Step Bilateral Matching System
          </div>
          <span className="text-[11px] text-neutral-400">
            Either side pitches · Every brief scored on verified audience trust
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FFF1CC] dark:bg-[#3D2C10] border border-[#FFC94A]/40 text-[#2A1435] dark:text-[#FFF7EF]">
            <div className="text-[10px] font-black text-[#B8860B] dark:text-[#FFC94A] mb-1">01 · ALERT</div>
            <div className="font-bold">Opportunity Alert</div>
            <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
              Live Trend × Brand × Creator
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] font-black text-[#6D5DFC] dark:text-[#A69BFF] mb-1">02 · PITCH</div>
            <div className="font-bold">Either Side Pitch</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Brand or creator initiates
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F1EDFF] dark:bg-[#281D47] border border-[#6D5DFC]/30 text-[#4A3BD6] dark:text-[#A69BFF]">
            <div className="text-[10px] font-black mb-1">03 · BRIEF</div>
            <div className="font-bold">Double Opt-In + Brief</div>
            <div className="text-[11px] opacity-80 mt-1">
              Gemini shared brief via API
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#6D5DFC] text-white">
            <div className="text-[10px] font-black text-[#FFC94A] mb-1">04 · ACTIVATE</div>
            <div className="font-bold">Activate</div>
            <div className="text-[11px] text-white/80 mt-1">
              Contract &amp; launch in 48h
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] font-black text-neutral-400 mb-1">05 · SCORE</div>
            <div className="font-bold">Performance Data</div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Audience Trust Score feeds engine
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Sided Mode Switcher: "Brand View (Hire Creators)" vs "Creator View (Pitch Brands)" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#31183E] border border-neutral-200 dark:border-neutral-700/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800/90 flex items-center">
            <button
              onClick={() => onSearchTargetChange('creators')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                !isBrandTarget
                  ? 'bg-[#6D5DFC] text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>For Brands · Find Creators to Hire</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${!isBrandTarget ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}>
                {filteredCreators.length}
              </span>
            </button>

            <button
              onClick={() => onSearchTargetChange('brands')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isBrandTarget
                  ? 'bg-[#FF8B6A] text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For Creators · Find Brands to Pitch</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isBrandTarget ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}>
                {filteredBrands.length}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters depending on searchTarget */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400 font-bold uppercase text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          {/* Trend filter applicable to both */}
          <select
            value={selectedTrendFilter}
            onChange={(e) => setSelectedTrendFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
          >
            <option value="all">All Trends ({trends.length})</option>
            {trends.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {!isBrandTarget ? (
            <>
              {/* Creator-specific filters */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
              >
                <option value="all">All Tiers ({creators.length})</option>
                <option value="mid-size">Mid-Size 100K-500K ({creators.filter(c => c.tier === 'mid-size').length})</option>
                <option value="large">Large 1M+ ({creators.filter(c => c.tier === 'large').length})</option>
              </select>

              <select
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(parseInt(e.target.value, 10))}
                className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
              >
                <option value={0}>Any Trust Score</option>
                <option value={75}>Trust &gt; 75 (High Performer)</option>
                <option value={85}>Trust &gt; 85 (Elite Authentic)</option>
              </select>
            </>
          ) : (
            <>
              {/* Brand-specific category filter */}
              <select
                value={brandCategoryFilter}
                onChange={(e) => setBrandCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 font-medium"
              >
                <option value="all">All Brand Categories ({brands.length})</option>
                {Array.from(new Set(brands.map((b) => b.category))).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Trending Signals Highlight Ribbon Matching Search Query */}
      {matchedTrends.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              What&apos;s Trending Matching {searchQuery ? `"${searchQuery}"` : 'Active Signals'}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Live Google Trends + YouTube velocity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedTrends.slice(0, 3).map((tr) => (
              <div
                key={tr.id}
                className="p-3 rounded-xl bg-white/80 dark:bg-black/20 border border-amber-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {tr.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-extrabold text-[10px] shrink-0">
                      ↑ {(tr.growth_7d * 100).toFixed(0)}% 7d
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {tr.summary}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-medium pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                  <span>Search Velocity: {tr.search_interest}/100</span>
                  <span>YT Interest: {tr.yt_interest}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Search Result Feedback */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F1EDFF] dark:bg-[#2A1E4A] border border-[#6D5DFC]/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#6D5DFC] dark:text-[#A69BFF]">
              Active Search:
            </span>
            <span>
              {isBrandTarget ? (
                <>
                  Found <strong>{filteredBrands.length}</strong> sponsor brands ready for creator pitches matching &ldquo;<span className="text-[#FF8B6A] font-bold">{searchQuery}</span>&rdquo;
                </>
              ) : (
                <>
                  Found <strong>{filteredCreators.length}</strong> creators matching &ldquo;<span className="text-[#6D5DFC] font-bold">{searchQuery}</span>&rdquo; for brand <strong>{activeBrand}</strong>
                </>
              )}
            </span>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATOR VIEW: BRANDS TO REACH OUT TO (When isBrandTarget is true) */}
      {/* ========================================================================= */}
      {isBrandTarget && (
        <div className="space-y-6">
          {filteredBrands.length === 0 ? (
            <div className="text-center p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-[#FF8B6A]">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg font-heading">
                No sponsor brands found matching &ldquo;{searchQuery}&rdquo;
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Try searching for <em>running</em>, <em>hydration</em>, <em>cookware</em>, <em>cold plunge</em>, <em>productivity</em>, or <em>matcha</em> to discover open sponsor budgets.
              </p>
              {onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="px-4 py-2 rounded-xl bg-[#FF8B6A] text-white text-xs font-bold shadow-xs"
                >
                  Reset Brand Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBrands.map((brand) => {
                // Find primary matching trend
                const primaryTrendId = brand.target_trends?.[0] || 'run-club';
                const matchedTrend = trends.find((t) => t.id === primaryTrendId) || trends[0];
                const isCopied = copiedPitchId === brand.id;

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
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1CC] text-[#6B4A00] font-bold text-[11px]">
                          <TrendingUp className="w-3 h-3 text-[#B8860B]" />
                          {matchedTrend.name} · ↑ {(matchedTrend.growth_7d * 100).toFixed(0)}% 7d
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Actively Budgeting
                        </span>
                      </div>

                      {/* Brand Info */}
                      <div className="flex items-start gap-3.5 mb-4">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-[#FF8B6A]/30 shadow-xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg font-heading truncate">
                              {brand.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-[#FF8B6A]/15 text-[#FF8B6A] text-[10px] font-bold shrink-0">
                              {brand.deal_preference === 'paid_now' ? 'Paid Upfront' : 'Test First'}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            {brand.category}
                          </div>
                          <div className="text-xs font-semibold text-[#6D5DFC] dark:text-[#A69BFF] mt-0.5">
                            Campaign: {brand.campaign_name}
                          </div>
                        </div>
                      </div>

                      {/* Campaign Key Details */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 mb-3 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                            Budget Range
                          </span>
                          <span className="font-extrabold text-sm text-[#FF8B6A] font-heading">
                            {brand.budget_range}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                            Ideal Creator Fit
                          </span>
                          <span className="font-bold text-xs text-neutral-700 dark:text-neutral-300">
                            {brand.ideal_tier}
                          </span>
                        </div>
                      </div>

                      {/* What They're Looking For */}
                      <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200/40 dark:border-neutral-700/40 mb-3 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                          What Brand is Seeking:
                        </span>
                        <p className="text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                          {brand.looking_for}
                        </p>
                      </div>

                      {/* Pitch Tip */}
                      <div className="p-3 rounded-2xl bg-[#6D5DFC]/10 border border-[#6D5DFC]/20 mb-4 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A3BD6] dark:text-[#A69BFF] block mb-0.5">
                          💡 Your Pitch Angle:
                        </span>
                        <p className="text-[#2A1435] dark:text-neutral-200 text-[11px] font-medium leading-relaxed">
                          {brand.pitch_tip}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar for Creator to Pitch */}
                    <div className="space-y-2 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenBriefFor(primaryTrendId, 'c01', brand, 'creator')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF8B6A] hover:bg-[#e87a5a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                          title="Generate a custom AI pitch brief for this brand"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" />
                          <span>Pitch Brand Now (Generate Brief)</span>
                        </button>

                        <button
                          onClick={() => handleCopyPitch(brand.sample_pitch, brand.id)}
                          className="px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
                          title="Copy tailored pitch message to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BRAND VIEW: CREATORS TO HIRE (When isBrandTarget is false) */}
      {/* ========================================================================= */}
      {!isBrandTarget && (
        <div className="space-y-6">
          {filteredCreators.length === 0 ? (
            <div className="text-center p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg font-heading">
                No direct creator matches found for &ldquo;{searchQuery}&rdquo;
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Try broader keywords like <em>marathon</em>, <em>prep</em>, <em>recovery</em>, <em>lunch</em>, or click &ldquo;Scout with Gemini&rdquo; in the search bar above to create a live trend opportunity.
              </p>
              {onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="px-4 py-2 rounded-xl bg-[#6D5DFC] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Reset Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator, idx) => {
                const matchedTrend = trends[idx % trends.length];
                const isMidSize = creator.tier === 'mid-size';
                const isCreatorOptedIn = creator.opted_in;
                const matchPercent = Math.min(99, Math.round(creator.scores.fit * 1.15));

                return (
                  <div
                    key={creator.id}
                    className={`rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-lg ${
                      isDark
                        ? 'bg-[#31183E] border-[#48255B] text-white'
                        : 'bg-white border-[#E8DFD3] text-[#2A1435]'
                    }`}
                  >
                    <div>
                      {/* Trend Tag & Velocity */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1CC] text-[#6B4A00] font-bold text-[11px]">
                          <TrendingUp className="w-3 h-3 text-[#B8860B]" />
                          {matchedTrend.name} · ↑ {(matchedTrend.growth_7d * 100).toFixed(0)}%
                        </span>

                        <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                          Search + YouTube
                        </span>
                      </div>

                      {/* Creator Avatar & Identity */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="relative">
                          <img
                            src={creator.thumbnail}
                            alt={creator.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-[#6D5DFC]/20 shadow-xs"
                          />
                          {isCreatorOptedIn && (
                            <span
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white"
                              title="Creator opted-in and ready to pitch"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-base font-heading truncate">
                              {creator.name}
                            </h4>
                            <span className="text-[11px] text-neutral-400">({creator.channel_name})</span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span>{creator.subscribers.toLocaleString()} subs</span>
                            <span>·</span>
                            <span className="capitalize">{creator.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Match & Trust Score Indicators */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/50 mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Trend Fit</span>
                          <span className="text-sm font-extrabold text-[#6D5DFC] dark:text-[#A69BFF] font-heading">
                            Match {matchPercent}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Audience Trust</span>
                          <span
                            className={`text-sm font-extrabold font-heading ${
                              creator.scores.reception >= 80
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : creator.scores.reception >= 70
                                ? 'text-[#B8860B] dark:text-[#FFC94A]'
                                : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {creator.scores.reception}/100
                            <span className="text-[10px] font-normal text-neutral-400 ml-1">
                              ({creator.scores.authentic_pct}% auth)
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Purchase Intent Breakdown Bar */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 uppercase font-bold text-[10px]">
                            Comment Intent Mix:
                          </span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            {((creator.intent_mix.purchase) * 100).toFixed(0)}% Buy Intent
                          </span>
                        </div>

                        {/* Bar */}
                        <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex">
                          <div
                            style={{ width: `${creator.intent_mix.purchase * 100}%` }}
                            className="bg-emerald-500 h-full"
                            title={`Purchase: ${(creator.intent_mix.purchase * 100).toFixed(0)}%`}
                          />
                          <div
                            style={{ width: `${creator.intent_mix.question * 100}%` }}
                            className="bg-blue-400 h-full"
                            title={`Product Questions: ${(creator.intent_mix.question * 100).toFixed(0)}%`}
                          />
                          <div
                            style={{ width: `${creator.intent_mix.endorsement * 100}%` }}
                            className="bg-purple-400 h-full"
                            title={`Peer Endorsements: ${(creator.intent_mix.endorsement * 100).toFixed(0)}%`}
                          />
                          <div
                            style={{ width: `${creator.intent_mix.annoyance * 100}%` }}
                            className="bg-rose-400 h-full"
                            title={`Ad Annoyance / Skip: ${(creator.intent_mix.annoyance * 100).toFixed(0)}%`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">● Buy / Ask</span>
                          <span className="text-rose-500 font-medium">● Skip {((creator.intent_mix.annoyance) * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      {/* Hand-Labeled Evidence Comment */}
                      {creator.evidence_comments?.[0] && (
                        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/40 mb-4 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Audience Comment Evidence:
                          </span>
                          <p className="italic text-neutral-600 dark:text-neutral-300 text-[11px] line-clamp-2">
                            &ldquo;{creator.evidence_comments[0].text}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-700/50 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span>Lead Time: <strong>{creator.scores.lead_time_days} days</strong></span>
                        <span>{creator.sponsored_videos_analyzed} sponsored videos audited</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenBriefFor(matchedTrend.id, creator.id, undefined, 'brand')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#6D5DFC] hover:bg-[#5848e5] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                          title="Generate a campaign brief with this creator"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" />
                          <span>Send Brief &amp; Offer</span>
                        </button>

                        <button
                          onClick={() => onInspectCreator(creator)}
                          className="px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          title="Audit sponsored videos & comment breakdown"
                        >
                          Audit Videos
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
