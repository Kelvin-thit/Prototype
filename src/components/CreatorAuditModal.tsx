import React from 'react';
import { X, CheckCircle2, AlertTriangle, Play, Sparkles, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface CreatorAuditModalProps {
  creator: any;
  isOpen: boolean;
  onClose: () => void;
  onOpenBrief: (creatorId: string) => void;
  isDark: boolean;
}

export const CreatorAuditModal: React.FC<CreatorAuditModalProps> = ({
  creator,
  isOpen,
  onClose,
  onOpenBrief,
  isDark,
}) => {
  if (!isOpen || !creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-auto max-h-[90vh] flex flex-col ${
          isDark
            ? 'bg-[#2A1435] border-[#4A275E] text-[#FFF7EF]'
            : 'bg-white border-[#E8DFD3] text-[#2A1435]'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={creator.thumbnail}
              alt={creator.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#6D5DFC]/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading">{creator.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#6D5DFC]/10 text-[#6D5DFC] font-bold capitalize">
                  {creator.tier} Tier
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {creator.channel_name} · {creator.subscribers.toLocaleString()} subscribers · {creator.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Audience Trust</span>
              <div className="text-2xl font-black text-[#6D5DFC] font-heading mt-0.5">
                {creator.scores.reception}/100
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Authentic Tone</span>
              <div className="text-2xl font-black text-emerald-600 font-heading mt-0.5">
                {creator.scores.authentic_pct}%
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Brand Fit</span>
              <div className="text-2xl font-black text-[#FF8B6A] font-heading mt-0.5">
                {creator.scores.fit}%
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Lead Time</span>
              <div className="text-2xl font-black text-neutral-700 dark:text-neutral-300 font-heading mt-0.5">
                {creator.scores.lead_time_days} days
              </div>
            </div>
          </div>

          {/* Ad Style and Analysis */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#6D5DFC] uppercase text-[11px]">
                Integration Style: {creator.ad_analysis.style}
              </span>
              <span className="text-neutral-400">
                Avg Length: {creator.ad_analysis.avg_length_sec}s · {creator.ad_analysis.placement}
              </span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {creator.ad_analysis.insight}
            </p>
          </div>

          {/* 3 to 5 Sponsored Videos Audit */}
          <div>
            <h4 className="font-bold text-sm font-heading mb-3 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-[#6D5DFC]" />
              Sponsored Videos Analyzed ({creator.sponsors?.length || 0} videos)
            </h4>
            <div className="space-y-2">
              {creator.sponsors?.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {s.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                      <span>Sponsor: <strong className="text-neutral-700 dark:text-neutral-300">{s.sponsor_brand || s.brand}</strong></span>
                      <span>·</span>
                      <span>{s.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {s.is_repeat_sponsor && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                        Repeat Sponsor
                      </span>
                    )}
                    {s.is_competitor && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                        Competitor
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Comments */}
          <div>
            <h4 className="font-bold text-sm font-heading mb-3 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-600" />
              Audience Evidence Comments
            </h4>
            <div className="space-y-2">
              {creator.evidence_comments?.map((comment: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3"
                >
                  <p className="italic text-neutral-700 dark:text-neutral-300">
                    &ldquo;{comment.text}&rdquo;
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    comment.label === 'purchase' ? 'bg-emerald-100 text-emerald-800' :
                    comment.label === 'question' ? 'bg-sky-100 text-sky-800' :
                    comment.label === 'annoyance' ? 'bg-red-100 text-red-800' :
                    'bg-neutral-200 text-neutral-800'
                  }`}>
                    {comment.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenBrief(creator.id);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6D5DFC] hover:bg-[#5848e5] text-white font-bold text-xs shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#FFC94A]" />
            Generate Brief for {creator.name}
          </button>
        </div>
      </div>
    </div>
  );
};
