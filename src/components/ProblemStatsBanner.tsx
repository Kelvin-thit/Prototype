import React from 'react';
import { TrendingUp, Users, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface ProblemStatsBannerProps {
  isDark: boolean;
  onExploreDemo: () => void;
  onOpenBrief: () => void;
}

export const ProblemStatsBanner: React.FC<ProblemStatsBannerProps> = ({
  isDark,
  onExploreDemo,
  onOpenBrief,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Hero Motto Header from Brand Book */}
      <div
        className={`rounded-3xl p-8 md:p-12 mb-6 border transition-all ${
          isDark
            ? 'bg-[#2A1435] border-[#3F224E] text-[#FFF7EF]'
            : 'bg-[#2A1435] border-[#2A1435] text-[#FFF7EF]'
        } shadow-xl relative overflow-hidden`}
      >
        {/* Background Overlap Circles Motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:flex items-center justify-end pr-8">
          <div className="w-64 h-64 rounded-full bg-[#6D5DFC] -mr-20"></div>
          <div className="w-64 h-64 rounded-full bg-[#FF8B6A] -ml-20 mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC94A] text-[#2A1435] text-xs font-bold tracking-wide uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2A1435] animate-pulse"></span>
            Our Motto
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight mb-4">
            Match the moment.
          </h1>

          <p className="text-xl sm:text-2xl text-[#FFF7EF]/85 font-normal mb-6">
            Where trends, brands and creators meet.
          </p>

          <p className="text-sm sm:text-base text-[#FFF7EF]/75 leading-relaxed mb-8 max-w-2xl">
            Brands usually hear about a trend after it peaks. <strong className="text-[#FFC94A]">CreatorXchange</strong> uses Gemini to read live Search and YouTube signals, match brands with creators whose audiences actually trust them, and let either side pitch.
            <span className="block mt-2 font-semibold text-[#FF8B6A]">From cultural moment to live campaign in days, not weeks.</span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenBrief}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#6D5DFC] hover:bg-[#5848e5] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#FFC94A]" />
              Generate Gemini Brief
            </button>
            <button
              onClick={onExploreDemo}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/20 active:scale-95"
            >
              View Big vs Small Creator Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Problem-Slide Statistics from Google's brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: 1.5x Spend Growth */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#351B42] border-[#4A275E] text-white'
              : 'bg-white border-[#E7DFD5] text-[#2A1435]'
          } shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D5DFC] bg-[#F1EDFF] px-2.5 py-1 rounded-full">
              Problem #1
            </span>
            <div className="w-8 h-8 rounded-full bg-[#6D5DFC]/10 flex items-center justify-center text-[#6D5DFC]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-heading text-[#6D5DFC] mb-1">
            1.5x
          </div>
          <div className="text-base font-bold mb-1">Spend Growth YoY</div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Brands are spending 50% more on creator partnerships, yet reach is becoming less predictable and CPMs continue inflating without direct conversion proof.
          </p>
        </div>

        {/* Stat 2: Only 15% High Performers */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#351B42] border-[#4A275E] text-white'
              : 'bg-white border-[#E7DFD5] text-[#2A1435]'
          } shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8B6A] bg-[#FFE9E2] px-2.5 py-1 rounded-full">
              Problem #2
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FF8B6A]/10 flex items-center justify-center text-[#FF8B6A]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-heading text-[#FF8B6A] mb-1">
            15%
          </div>
          <div className="text-base font-bold mb-1">True High Performers</div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Only 15% of creator partnerships drive 80%+ of actual sales. 85% of spend is diluted across big channels whose audiences actively skip through ad reads.
          </p>
        </div>

        {/* Stat 3: Too Slow to React to Trends */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#351B42] border-[#4A275E] text-white'
              : 'bg-white border-[#E7DFD5] text-[#2A1435]'
          } shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] bg-[#FFF1CC] px-2.5 py-1 rounded-full">
              Problem #3
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFC94A]/20 flex items-center justify-center text-[#B8860B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-heading text-[#B8860B] mb-1">
            28 Days
          </div>
          <div className="text-base font-bold mb-1">Too Slow to React</div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Standard agency outreach takes 4 weeks through 9 manual steps. By the time a brief is approved, the cultural search moment has already peaked.
          </p>
        </div>
      </div>
    </div>
  );
};
