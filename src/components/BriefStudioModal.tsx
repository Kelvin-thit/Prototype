import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Copy,
  Check,
  Calendar,
  Clock,
  ShieldAlert,
  Flame,
  FileText,
  DollarSign,
  TrendingUp,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface BriefStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  trends: any[];
  creators: any[];
  initialTrendId?: string;
  initialCreatorId?: string;
  initialBrandName?: string;
  initialBrand?: any;
  initiator?: 'brand' | 'creator';
  isDark: boolean;
}

export const BriefStudioModal: React.FC<BriefStudioModalProps> = ({
  isOpen,
  onClose,
  trends,
  creators,
  initialTrendId,
  initialCreatorId,
  initialBrandName = 'Stride & Co.',
  initialBrand,
  initiator = 'brand',
  isDark,
}) => {
  const [selectedTrendId, setSelectedTrendId] = useState(initialTrendId || trends[0]?.id || 'run-club');
  const [selectedCreatorId, setSelectedCreatorId] = useState(initialCreatorId || creators[0]?.id || 'c01');

  const resolvedBrandName = initialBrand?.name || initialBrandName || 'Stride & Co.';
  const resolvedProductName = initialBrand?.product || (resolvedBrandName === 'Stride & Co.' ? 'AeroFoam Long-Run Recovery Shoe & Hydration Pack' : `${resolvedBrandName} Core Product Pack`);
  const resolvedGoal = initialBrand?.looking_for || 'Activate engaged audience during rising trend moment with authentic creator trial';
  const resolvedBudget = initialBrand?.budget_range || '$3,000 - $5,500';

  const [campaign, setCampaign] = useState({
    brand_name: resolvedBrandName,
    product_name: resolvedProductName,
    core_goal: resolvedGoal,
    budget_range: resolvedBudget,
    target_audience: 'Active urban adults and wellness lifestyle enthusiasts',
  });

  useEffect(() => {
    if (initialBrand) {
      setCampaign(prev => ({
        ...prev,
        brand_name: initialBrand.name,
        product_name: initialBrand.product || prev.product_name,
        core_goal: initialBrand.looking_for || prev.core_goal,
        budget_range: initialBrand.budget_range || prev.budget_range,
      }));
    } else if (initialBrandName) {
      setCampaign(prev => ({
        ...prev,
        brand_name: initialBrandName,
        product_name: initialBrandName === 'Stride & Co.' ? 'AeroFoam Long-Run Recovery Shoe & Hydration Pack' : `${initialBrandName} Core Product Pack`,
      }));
    }
  }, [initialBrand, initialBrandName]);

  const [isLoading, setIsLoading] = useState(false);
  const [briefResult, setBriefResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [optInAccepted, setOptInAccepted] = useState(false);

  useEffect(() => {
    if (initialTrendId) setSelectedTrendId(initialTrendId);
    if (initialCreatorId) setSelectedCreatorId(initialCreatorId);
  }, [initialTrendId, initialCreatorId]);

  if (!isOpen) return null;

  const currentTrend = trends.find((t) => t.id === selectedTrendId) || trends[0];
  const currentCreator = creators.find((c) => c.id === selectedCreatorId) || creators[0];

  const handleGenerateBrief = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setOptInAccepted(false);

    try {
      const response = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          trend_id: selectedTrendId,
          creator_id: selectedCreatorId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setBriefResult(data);
    } catch (err: any) {
      console.error('Error generating brief:', err);
      setErrorMsg('Could not contact brief generation service. Using local pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dealTypeBadge = (dealType: string) => {
    switch (dealType) {
      case 'paid_now':
        return {
          label: 'PAID UPFRONT (High Trust)',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
          desc: 'High Trust Score & direct purchase comments justifies immediate upfront deal.',
        };
      case 'test_first':
        return {
          label: 'TEST FIRST (Gifting + Milestone)',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
          desc: 'Initial trial shipment followed by performance milestone payout.',
        };
      case 'small_test_bonus':
      default:
        return {
          label: 'SMALL TEST + CONVERSION BONUS',
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300',
          desc: 'Modest baseline fee supplemented with discount code redemption bonuses.',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-auto max-h-[92vh] flex flex-col ${
          isDark
            ? 'bg-[#2A1435] border-[#4A275E] text-[#FFF7EF]'
            : 'bg-white border-[#E8DFD3] text-[#2A1435]'
        }`}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6D5DFC]/15 flex items-center justify-center text-[#6D5DFC]">
              <Sparkles className="w-5 h-5 text-[#6D5DFC]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading">
                {initiator === 'creator'
                  ? `Creator Pitch Studio · Pitching ${campaign.brand_name}`
                  : `Gemini Brief Studio · Sponsoring with ${campaign.brand_name}`}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {initiator === 'creator'
                  ? `Generate a structured, data-backed pitch directly to brand partnerships for `
                  : `Generate a mutual, audience-verified campaign brief for `}
                <code className="text-[#6D5DFC]">POST /api/brief</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trend Selector */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                01. Live Search & YouTube Trend
              </label>
              <select
                value={selectedTrendId}
                onChange={(e) => setSelectedTrendId(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-[#6D5DFC]"
              >
                {trends.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (7d: +{(t.growth_7d * 100).toFixed(0)}%)
                  </option>
                ))}
              </select>
              {currentTrend && (
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FFC94A]"></span>
                  <span>{currentTrend.summary}</span>
                </div>
              )}
            </div>

            {/* Creator Selector */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                02. Creator Match Profile
              </label>
              <select
                value={selectedCreatorId}
                onChange={(e) => setSelectedCreatorId(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-[#6D5DFC]"
              >
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.channel_name} · {c.subscribers.toLocaleString()} subs · Trust: {c.scores.reception}/100)
                  </option>
                ))}
              </select>
              {currentCreator && (
                <div className="mt-2 text-xs flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Tier: <strong className="capitalize">{currentCreator.tier}</strong></span>
                  <span className="text-[#6D5DFC] font-bold">Trust Score: {currentCreator.scores.reception}/100</span>
                  <span className="text-emerald-600 font-semibold">{((currentCreator.intent_mix.purchase) * 100).toFixed(0)}% Buy Intent</span>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Details Collapsible / Edit */}
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Campaign Inputs (Sent to Gemini)
              </div>
              <span className="text-[11px] text-neutral-400">Stride & Co. Official Launch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">Brand & Product:</span>
                <input
                  type="text"
                  value={campaign.product_name}
                  onChange={(e) => setCampaign({ ...campaign, product_name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-medium"
                />
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">Budget Range:</span>
                <input
                  type="text"
                  value={campaign.budget_range}
                  onChange={(e) => setCampaign({ ...campaign, budget_range: e.target.value })}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-medium"
                />
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">Target Core Goal:</span>
                <input
                  type="text"
                  value={campaign.core_goal}
                  onChange={(e) => setCampaign({ ...campaign, core_goal: e.target.value })}
                  className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateBrief}
              disabled={isLoading}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#6D5DFC] hover:bg-[#5848e5] text-white font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FFC94A]" />
                  <span>Gemini is analyzing trend signals & comments...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFC94A]" />
                  <span>{briefResult ? 'Regenerate Brief' : 'Generate Shared Brief with Gemini'}</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs text-center">
              {errorMsg}
            </div>
          )}

          {/* Generated Brief Display */}
          {briefResult && (
            <div className="space-y-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 animate-in fade-in duration-300">
              {/* Trend Card & Deal Structure Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Trend Card */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-[#FFF1CC] dark:bg-[#3D2C10] border border-[#FFC94A]/40 text-[#2A1435] dark:text-[#FFF7EF]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC94A] text-[#2A1435]">
                      {briefResult.trend_card?.growth_label || '+320% this week'}
                    </span>
                    <span className="text-xs text-[#6B4A00] dark:text-[#FFC94A] font-semibold">
                      ID: {briefResult.trend_card?.trend_id}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-heading mb-1 text-[#2A1435] dark:text-white">
                    {briefResult.trend_card?.trend_name}
                  </h4>
                  <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
                    {briefResult.trend_card?.cultural_context}
                  </p>
                </div>

                {/* Deal Structure Card */}
                {(() => {
                  const badge = dealTypeBadge(briefResult.deal_type);
                  return (
                    <div className={`p-5 rounded-2xl border ${badge.bg}`}>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        Deal Recommendation
                      </div>
                      <div className="text-base font-extrabold font-heading mb-2">
                        {badge.label}
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        {briefResult.deal_reason}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Key Messages & Guardrails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Messages */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D5DFC] mb-3">
                    <FileText className="w-4 h-4" />
                    Key Messages (Creator Tone)
                  </div>
                  <ul className="space-y-2 text-xs">
                    {briefResult.key_messages?.map((msg: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#6D5DFC]/10 text-[#6D5DFC] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">{msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guardrails (What NOT to say) */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF8B6A] mb-3">
                    <ShieldAlert className="w-4 h-4" />
                    Guardrails (Anti-Cringe Guidelines)
                  </div>
                  <ul className="space-y-2 text-xs">
                    {briefResult.guardrails?.map((guard: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          ✕
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">{guard}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Format & Timing Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 flex items-center gap-3">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-neutral-400 block font-semibold text-[10px] uppercase">Format</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{briefResult.format}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#6D5DFC] shrink-0" />
                  <div>
                    <span className="text-neutral-400 block font-semibold text-[10px] uppercase">Post Window</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{briefResult.post_window}</span>
                  </div>
                </div>
              </div>

              {/* Bilateral Outreach Pitch Message */}
              <div className="p-5 rounded-2xl bg-[#F1EDFF] dark:bg-[#251D44] border border-[#6D5DFC]/30 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-[#6D5DFC] dark:text-[#A69BFF]">
                    <Send className="w-3.5 h-3.5" />
                    Bilateral Outreach Pitch (Creator Opt-In Note)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">
                      Best Send Time: <strong>{briefResult.send_time}</strong>
                    </span>
                    <button
                      onClick={() => copyToClipboard(briefResult.outreach_message, 'outreach')}
                      className="px-2 py-1 rounded-md bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold flex items-center gap-1 hover:text-[#6D5DFC]"
                    >
                      {copiedKey === 'outreach' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'outreach' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans italic bg-white/70 dark:bg-black/20 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/40">
                  &ldquo;{briefResult.outreach_message}&rdquo;
                </p>
              </div>

              {/* Action Buttons: Double Opt-in Simulation & JSON Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(briefResult, null, 2), 'json')}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'json' ? 'Copied Full JSON' : 'Copy JSON Payload'}
                </button>

                <div className="flex items-center gap-3">
                  {optInAccepted ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <UserCheck className="w-4 h-4" />
                      Both Sides Opted In · Campaign Room Active!
                    </div>
                  ) : (
                    <button
                      onClick={() => setOptInAccepted(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6D5DFC] hover:bg-[#5848e5] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <UserCheck className="w-4 h-4 text-[#FFC94A]" />
                      Simulate Creator Opt-In & Activate
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
