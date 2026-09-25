import React, { useState, useEffect } from 'react';
import { OverlapLogo } from './components/OverlapLogo.tsx';
import { ProblemStatsBanner } from './components/ProblemStatsBanner.tsx';
import { HeadlineShowdown } from './components/HeadlineShowdown.tsx';
import { OpportunitiesGrid } from './components/OpportunitiesGrid.tsx';
import { BriefStudioModal } from './components/BriefStudioModal.tsx';
import { CreatorAuditModal } from './components/CreatorAuditModal.tsx';
import { BenchmarkResearchView } from './components/BenchmarkResearchView.tsx';
import { TrendSearchEngine } from './components/TrendSearchEngine.tsx';

// Static Data Imports
import initialTrends from './data/trends.json';
import initialCreators from './data/creators.json';
import initialBrands from './data/brands.json';
import benchmarkData from './data/benchmark.json';
import comments100 from './data/comments100.json';

import {
  Sparkles,
  Sun,
  Moon,
  Layers,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  BarChart2,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function App() {
  const [trends, setTrends] = useState<any[]>(initialTrends);
  const [creators, setCreators] = useState<any[]>(initialCreators);
  const [brands, setBrands] = useState<any[]>(initialBrands);

  // Application State
  const [activeTab, setActiveTab] = useState<'opportunities' | 'showdown' | 'brief' | 'benchmark'>('opportunities');
  const [colorTheme, setColorTheme] = useState<'berry' | 'lagoon' | 'citrus'>('berry');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [perspective, setPerspective] = useState<'brand' | 'creator' | 'platform'>('brand');

  // Search & Brand State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBrand, setActiveBrand] = useState<string>('Stride & Co.');
  const [searchTarget, setSearchTarget] = useState<'creators' | 'brands'>('creators');

  // Modals
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [briefTargetTrendId, setBriefTargetTrendId] = useState<string>('run-club');
  const [briefTargetCreatorId, setBriefTargetCreatorId] = useState<string>('c01');
  const [briefTargetBrand, setBriefTargetBrand] = useState<any | null>(null);
  const [briefInitiator, setBriefInitiator] = useState<'brand' | 'creator'>('brand');

  const [auditedCreator, setAuditedCreator] = useState<any | null>(null);

  const handleAddNewScoutedTrend = (newTrend: any) => {
    setTrends((prev) => {
      if (prev.some((t) => t.id === newTrend.id)) return prev;
      return [newTrend, ...prev];
    });
    setBriefTargetTrendId(newTrend.id);
  };

  // Sync with API if server is up
  useEffect(() => {
    fetch('/api/trends')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setTrends(data);
      })
      .catch(() => {});

    fetch('/api/creators')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setCreators(data);
      })
      .catch(() => {});

    fetch('/api/brands')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setBrands(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenBrief = (
    trendId?: string,
    creatorId?: string,
    brand?: any,
    initiator?: 'brand' | 'creator'
  ) => {
    if (trendId) setBriefTargetTrendId(trendId);
    if (creatorId) setBriefTargetCreatorId(creatorId);
    if (brand) {
      setBriefTargetBrand(brand);
      setActiveBrand(brand.name);
    } else {
      setBriefTargetBrand(null);
    }
    if (initiator) {
      setBriefInitiator(initiator);
    } else {
      setBriefInitiator(perspective === 'creator' ? 'creator' : 'brand');
    }
    setIsBriefModalOpen(true);
  };

  const handlePerspectiveChange = (newPerspective: 'brand' | 'creator' | 'platform') => {
    setPerspective(newPerspective);
    if (newPerspective === 'brand') {
      setSearchTarget('creators');
    } else if (newPerspective === 'creator') {
      setSearchTarget('brands');
    }
  };

  const handleSearchTargetChange = (newTarget: 'creators' | 'brands') => {
    setSearchTarget(newTarget);
    setPerspective(newTarget === 'brands' ? 'creator' : 'brand');
  };

  const handleInspectCreator = (creator: any) => {
    setAuditedCreator(creator);
  };

  // Background and theme classes
  const themeClasses = isDarkMode
    ? 'bg-[#1D0C26] text-[#FFF7EF]'
    : 'bg-[#FFF7EF] text-[#2A1435]';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses}`}>
      {/* Top Brand Navigation Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDarkMode
            ? 'bg-[#1D0C26]/90 border-[#3F224E]'
            : 'bg-[#FFF7EF]/90 border-[#EADECE]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Motto */}
          <div className="flex items-center gap-3 sm:gap-6">
            <OverlapLogo size="md" isDark={isDarkMode} theme={colorTheme} />
            <div className="hidden lg:block h-6 w-px bg-neutral-300 dark:bg-neutral-700"></div>
            <span className="hidden lg:block text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Match the moment.
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Live Matches
            </button>
            <button
              onClick={() => setActiveTab('showdown')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'showdown'
                  ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Big vs Small Demo
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Research &amp; Benchmarks
            </button>
          </nav>

          {/* Controls: Color Variant, Mode, and Generate Brief */}
          <div className="flex items-center gap-2.5">
            {/* Theme Palette Switcher */}
            <div
              className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60"
              title="Brand Color Variations from Style Guide"
            >
              <button
                onClick={() => setColorTheme('berry')}
                className={`w-5 h-5 rounded-full bg-[#6D5DFC] transition-all ring-offset-1 ${
                  colorTheme === 'berry' ? 'ring-2 ring-[#2A1435] dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title="Berry (Original)"
              />
              <button
                onClick={() => setColorTheme('lagoon')}
                className={`w-5 h-5 rounded-full bg-[#00A389] transition-all ring-offset-1 ${
                  colorTheme === 'lagoon' ? 'ring-2 ring-[#2A1435] dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title="Lagoon (Variation B)"
              />
              <button
                onClick={() => setColorTheme('citrus')}
                className={`w-5 h-5 rounded-full bg-[#FF5C38] transition-all ring-offset-1 ${
                  colorTheme === 'citrus' ? 'ring-2 ring-[#2A1435] dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title="Citrus (Variation C)"
              />
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#FFC94A]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Main Action: Generate Brief */}
            <button
              onClick={() => handleOpenBrief()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6D5DFC] hover:bg-[#5848e5] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" />
              <span className="hidden sm:inline">Brief Studio</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 px-2 py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'opportunities' ? 'bg-[#6D5DFC] text-white font-bold' : 'text-neutral-500'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('showdown')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'showdown' ? 'bg-[#6D5DFC] text-white font-bold' : 'text-neutral-500'}`}
          >
            Big vs Small
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'benchmark' ? 'bg-[#6D5DFC] text-white font-bold' : 'text-neutral-500'}`}
          >
            Benchmarks
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner with Problem Statistics & Motto */}
        <ProblemStatsBanner
          isDark={isDarkMode}
          onExploreDemo={() => setActiveTab('showdown')}
          onOpenBrief={() => handleOpenBrief()}
        />

        {/* Perspective Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-400 uppercase text-[10px]">Two-Sided Perspective:</span>
            <div className="inline-flex p-1 bg-white/70 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
              <button
                onClick={() => handlePerspectiveChange('brand')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  perspective === 'brand' ? 'bg-[#6D5DFC] text-white shadow-xs' : 'text-neutral-500'
                }`}
              >
                Brand (Stride &amp; Co.)
              </button>
              <button
                onClick={() => handlePerspectiveChange('creator')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  perspective === 'creator' ? 'bg-[#FF8B6A] text-white shadow-xs' : 'text-neutral-500'
                }`}
              >
                Creator (Taylor K.)
              </button>
              <button
                onClick={() => handlePerspectiveChange('platform')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  perspective === 'platform' ? 'bg-[#2A1435] dark:bg-white text-white dark:text-[#2A1435] shadow-xs' : 'text-neutral-500'
                }`}
              >
                Research &amp; Data Pipeline
              </button>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {perspective === 'brand' && `Showing: How ${activeBrand} discovers ready-to-pitch creators based on audience purchase intent.`}
            {perspective === 'creator' && 'Showing: How creators search rising trends to find sponsor brands and pitch them directly.'}
            {perspective === 'platform' && 'Showing: Tech A data feeds (trends.json, creators.json & brands.json) powering Tech B.'}
          </div>
        </div>

        {/* Live Search & Keyword Trend Matching Engine */}
        <TrendSearchEngine
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'opportunities') setActiveTab('opportunities');
          }}
          trends={trends}
          activeBrand={activeBrand}
          onBrandChange={(b) => setActiveBrand(b)}
          onAddNewScoutedTrend={handleAddNewScoutedTrend}
          searchTarget={searchTarget}
          onSearchTargetChange={handleSearchTargetChange}
          isDark={isDarkMode}
        />

        {/* Dynamic Views */}
        {activeTab === 'opportunities' && (
          <OpportunitiesGrid
            trends={trends}
            creators={creators}
            brands={brands}
            isDark={isDarkMode}
            searchQuery={searchQuery}
            activeBrand={activeBrand}
            onClearSearch={() => setSearchQuery('')}
            searchTarget={searchTarget}
            onSearchTargetChange={handleSearchTargetChange}
            onOpenBriefFor={(trendId, creatorId, brand, initiator) =>
              handleOpenBrief(trendId, creatorId, brand, initiator)
            }
            onInspectCreator={handleInspectCreator}
          />
        )}

        {activeTab === 'showdown' && (
          <HeadlineShowdown
            isDark={isDarkMode}
            onSelectCreatorForBrief={(creatorId) => handleOpenBrief(undefined, creatorId)}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkResearchView
            benchmarkData={benchmarkData}
            comments100={comments100}
            trendsData={trends}
            creatorsData={creators}
            isDark={isDarkMode}
          />
        )}

        {/* Footer Brand Constitution & Voice Guide */}
        <footer className="mt-16 pt-12 pb-8 border-t border-neutral-300 dark:border-neutral-800 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <OverlapLogo size="sm" isDark={isDarkMode} theme={colorTheme} />
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-[11px]">
                Built for YouTube Creator Partnerships. Cuts a nine-step manual outreach process to five, turning cultural search moments into trusted partnerships.
              </p>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-3">
                Values We Stand For
              </div>
              <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
                <li>• <strong>Timely by design:</strong> Act while a trend is rising.</li>
                <li>• <strong>Two-sided, always:</strong> Either side can pitch.</li>
                <li>• <strong>Trust over reach:</strong> We measure who buys, not who scrolls.</li>
                <li>• <strong>Show the why:</strong> Grounded in real comment data.</li>
              </ul>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-3">
                Words We Use (Style Guide)
              </div>
              <div className="space-y-1 text-neutral-600 dark:text-neutral-300 text-[11px]">
                <div>We say <strong className="text-[#6D5DFC]">creator</strong> (not influencer)</div>
                <div>We say <strong className="text-[#6D5DFC]">the trend is rising</strong> (not going viral)</div>
                <div>We say <strong className="text-[#6D5DFC]">audience trust</strong> (not reach)</div>
                <div>We say <strong className="text-[#6D5DFC]">pitch, opt in</strong> (not cold outreach)</div>
                <div>We say <strong className="text-[#6D5DFC]">Gemini finds the match</strong> (not AI magic)</div>
              </div>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-3">
                Tech A &amp; Tech B Connection
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-[11px] mb-2">
                Tech A produces JSON files, Tech B website reads them, and neither waits for the other.
              </p>
              <div className="font-mono text-[10px] text-[#6D5DFC]">
                POST /api/brief (Live Gemini Flash)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800/60 text-neutral-400 text-[11px]">
            <div>CreatorXchange · Look 1 of 3 (Friendly, Rounded, Warm) · Overlap Identity System</div>
            <div>Powered by Gemini 3.8 Flash &amp; Google Search Signals</div>
          </div>
        </footer>
      </main>

      {/* Brief Studio Modal */}
      <BriefStudioModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        trends={trends}
        creators={creators}
        initialTrendId={briefTargetTrendId}
        initialCreatorId={briefTargetCreatorId}
        initialBrandName={activeBrand}
        initialBrand={briefTargetBrand}
        initiator={briefInitiator}
        isDark={isDarkMode}
      />

      {/* Creator Sponsored Video & Comment Audit Modal */}
      <CreatorAuditModal
        creator={auditedCreator}
        isOpen={!!auditedCreator}
        onClose={() => setAuditedCreator(null)}
        onOpenBrief={(creatorId) => {
          setBriefTargetCreatorId(creatorId);
          setIsBriefModalOpen(true);
        }}
        isDark={isDarkMode}
      />
    </div>
  );
}
