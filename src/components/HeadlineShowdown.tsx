import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, CheckCircle2, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

interface HeadlineShowdownProps {
  isDark: boolean;
  onSelectCreatorForBrief: (creatorId: string) => void;
}

export const HeadlineShowdown: React.FC<HeadlineShowdownProps> = ({
  isDark,
  onSelectCreatorForBrief,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'roi'>('overview');

  return (
    <div
      className={`rounded-3xl border p-6 md:p-8 mb-8 transition-all ${
        isDark
          ? 'bg-[#31183E] border-[#4B285E] text-white'
          : 'bg-white border-[#E8DFD3] text-[#2A1435]'
      } shadow-lg`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8B6A]/15 text-[#FF8B6A] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8B6A]"></span>
            Headline Demo Moment
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            The Truth in the Comments: Large vs Mid-Size
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Why discovery tools that rank creators solely by follower reach mislead brands. CreatorXchange scores <em>Audience Trust</em> from how real viewers react to sponsored moments.
          </p>
        </div>

        {/* View toggle tabs */}
        <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Head-to-Head
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'comments'
                ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Comment Evidence
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roi'
                ? 'bg-white dark:bg-[#2A1435] text-[#2A1435] dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Actual ROI Math
          </button>
        </div>
      </div>

      {/* Head to head comparative card layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator 1: The Large Creator (Reach Trap) */}
        <div
          className={`rounded-2xl border p-6 relative overflow-hidden transition-all ${
            isDark
              ? 'bg-[#261230] border-red-900/30'
              : 'bg-[#FFF9F9] border-red-200'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces"
                alt="Marcus Vance"
                className="w-14 h-14 rounded-full object-cover border-2 border-red-300 shadow-sm"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                  Large Tier (1M+)
                </span>
                <h3 className="text-lg font-bold font-heading mt-1">Marcus Vance</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Apex Fitness Hub · 2.4M Subscribers</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-red-500 font-heading">31/100</div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Trust Score</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/70 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 mb-4 text-center">
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Rate Card</div>
              <div className="text-sm font-bold text-neutral-800 dark:text-neutral-100">$20,000</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Ad Style</div>
              <div className="text-sm font-bold text-red-500">Hard-Pivot</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Skip Rate</div>
              <div className="text-sm font-bold text-red-500">78% Annoyance</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Audience Intent Breakdown</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex">
              <div style={{ width: '3%' }} className="bg-emerald-500" title="Purchase: 3%" />
              <div style={{ width: '8%' }} className="bg-sky-400" title="Question: 8%" />
              <div style={{ width: '11%' }} className="bg-amber-400" title="Endorsement: 11%" />
              <div style={{ width: '78%' }} className="bg-red-500" title="Annoyance / Skip: 78%" />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span className="text-emerald-600 font-medium">3% Purchase</span>
              <span className="text-sky-600 font-medium">8% Inquiries</span>
              <span className="text-red-500 font-bold">78% Skip / Annoyance</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-xs mb-4">
            <div className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-300 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Top Upvoted Sponsor Comment:
            </div>
            <p className="italic text-neutral-700 dark:text-neutral-300">
              &ldquo;Sponsor timestamp at 3:15 guys, skip straight to 4:45 to get past the pitch.&rdquo;
            </p>
            <div className="text-[10px] text-neutral-400 mt-1">512 likes · 4 days ago</div>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Verdict:</strong> High reach vanity metrics with extreme ad fatigue. 90-second script read leads to mass time-skipping and negative brand sentiment.
          </div>
        </div>

        {/* Creator 2: The Mid-Size Winner (Trust Machine) */}
        <div
          className={`rounded-2xl border p-6 relative overflow-hidden transition-all ring-2 ring-[#6D5DFC]/40 ${
            isDark
              ? 'bg-[#291738] border-[#6D5DFC]/40'
              : 'bg-[#F9F7FF] border-[#6D5DFC]/30'
          }`}
        >
          <div className="absolute top-0 right-0 bg-[#6D5DFC] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            High Performer Match
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"
                alt="Taylor K."
                className="w-14 h-14 rounded-full object-cover border-2 border-[#6D5DFC] shadow-sm"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D5DFC] bg-[#F1EDFF] dark:bg-[#6D5DFC]/20 px-2 py-0.5 rounded-full">
                  Mid-Size Tier (100K-500K)
                </span>
                <h3 className="text-lg font-bold font-heading mt-1">Taylor K.</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Taylor Runs · 210K Subscribers</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-[#6D5DFC] font-heading">82/100</div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Trust Score</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/70 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 mb-4 text-center">
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Rate Card</div>
              <div className="text-sm font-bold text-neutral-800 dark:text-neutral-100">$3,200</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Ad Style</div>
              <div className="text-sm font-bold text-emerald-600">Story-Woven</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Authentic %</div>
              <div className="text-sm font-bold text-emerald-600">91% Positive</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Audience Intent Breakdown</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden flex">
              <div style={{ width: '14%' }} className="bg-emerald-500" title="Purchase: 14%" />
              <div style={{ width: '34%' }} className="bg-sky-400" title="Question: 34%" />
              <div style={{ width: '22%' }} className="bg-amber-400" title="Endorsement: 22%" />
              <div style={{ width: '30%' }} className="bg-neutral-400" title="Annoyance: 30%" />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span className="text-emerald-600 font-bold">14% Direct Buy</span>
              <span className="text-sky-600 font-bold">34% Fit Questions</span>
              <span className="text-neutral-500">30% Misc</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs mb-4">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Top Upvoted Sponsor Comment:
            </div>
            <p className="italic text-neutral-700 dark:text-neutral-300">
              &ldquo;Already ordered using your discount code! The hydration vest fits without bouncing at all.&rdquo;
            </p>
            <div className="text-[10px] text-neutral-400 mt-1">64 likes · 2 days ago</div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <strong>Verdict:</strong> 4.8x higher total purchase conversions at 1/6th the budget.
            </div>
            <button
              onClick={() => onSelectCreatorForBrief('c01')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D5DFC] hover:bg-[#5848e5] text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFC94A]" />
              Match & Create Brief
            </button>
          </div>
        </div>
      </div>

      {/* ROI Math Breakdown Tab */}
      {activeTab === 'roi' && (
        <div className="mt-6 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-xs space-y-3">
          <h4 className="font-bold text-sm font-heading flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Direct Campaign Performance Simulation (Based on 100-Comment Audit)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 text-neutral-400 font-semibold">
                  <th className="py-2">Metric</th>
                  <th className="py-2">Marcus Vance (2.4M Subs)</th>
                  <th className="py-2 text-[#6D5DFC]">Taylor K. (210K Subs)</th>
                  <th className="py-2 text-emerald-600">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/50">
                <tr>
                  <td className="py-2 font-medium">Sponsorship Cost</td>
                  <td className="py-2">$20,000</td>
                  <td className="py-2 text-[#6D5DFC] font-bold">$3,200</td>
                  <td className="py-2 text-emerald-600">Save 84% budget</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Est. Video Views</td>
                  <td className="py-2">420,000</td>
                  <td className="py-2 text-[#6D5DFC]">78,000</td>
                  <td className="py-2 text-neutral-500">5.3x higher raw views</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Ad Watch Through (No Skip)</td>
                  <td className="py-2">22% (92,400)</td>
                  <td className="py-2 text-[#6D5DFC] font-bold">81% (63,180)</td>
                  <td className="py-2 text-emerald-600">Real ad views nearly equal</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Audience Trust Score</td>
                  <td className="py-2 text-red-500 font-bold">31 / 100</td>
                  <td className="py-2 text-[#6D5DFC] font-bold">82 / 100</td>
                  <td className="py-2 text-emerald-600">+164% higher trust</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Attributed Sales Orders</td>
                  <td className="py-2">126 units</td>
                  <td className="py-2 text-[#6D5DFC] font-bold">612 units</td>
                  <td className="py-2 text-emerald-600 font-bold">4.8x more actual sales</td>
                </tr>
                <tr className="bg-emerald-50 dark:bg-emerald-950/30">
                  <td className="py-2 font-bold">Cost Per Customer Acquired</td>
                  <td className="py-2 text-red-600 font-bold">$158.73 / order</td>
                  <td className="py-2 text-emerald-600 font-bold">$5.22 / order</td>
                  <td className="py-2 text-emerald-600 font-bold">30x better efficiency!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
