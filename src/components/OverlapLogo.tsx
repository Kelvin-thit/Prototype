import React from 'react';

interface OverlapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
  theme?: 'berry' | 'lagoon' | 'citrus';
  showText?: boolean;
  className?: string;
}

export const OverlapLogo: React.FC<OverlapLogoProps> = ({
  size = 'md',
  isDark = false,
  theme = 'berry',
  showText = true,
  className = '',
}) => {
  // Theme color palettes according to style guide
  const palette = {
    berry: {
      left: '#6D5DFC',    // Periwinkle (brand)
      right: '#FF8B6A',   // Peach (creator)
      match: '#2A1435',   // Plum (match)
      text: isDark ? '#FFFFFF' : '#2A1435',
      xColor: '#6D5DFC',
    },
    lagoon: {
      left: '#00A389',    // Lagoon teal
      right: '#FF8B6A',   // Peach
      match: '#123B38',
      text: isDark ? '#FFFFFF' : '#123B38',
      xColor: '#00A389',
    },
    citrus: {
      left: '#FF5C38',    // Citrus orange
      right: '#FFB800',   // Sun
      match: '#8A1550',
      text: isDark ? '#FFFFFF' : '#2A1435',
      xColor: '#FF5C38',
    },
  }[theme];

  const dimensions = {
    sm: { svgSize: 24, r: 8, cx1: 9, cx2: 15, cy: 12, textClass: 'text-lg font-bold' },
    md: { svgSize: 32, r: 11, cx1: 12, cx2: 20, cy: 16, textClass: 'text-xl font-bold' },
    lg: { svgSize: 44, r: 15, cx1: 17, cx2: 27, cy: 22, textClass: 'text-2xl font-bold tracking-tight' },
    xl: { svgSize: 64, r: 22, cx1: 25, cx2: 39, cy: 32, textClass: 'text-4xl font-extrabold tracking-tight' },
  }[size];

  const maskId = `overlap-clip-${size}-${theme}-${isDark ? 'dark' : 'light'}`;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Venn diagram SVG with genuine intersection */}
      <svg
        width={dimensions.svgSize}
        height={dimensions.svgSize}
        viewBox={`0 0 ${dimensions.svgSize} ${dimensions.svgSize}`}
        className="shrink-0 drop-shadow-xs"
        aria-label="CreatorXchange Overlap Logo"
      >
        <defs>
          <clipPath id={maskId}>
            <circle cx={dimensions.cx1} cy={dimensions.cy} r={dimensions.r} />
          </clipPath>
        </defs>

        {/* Brand circle (left) */}
        <circle
          cx={dimensions.cx1}
          cy={dimensions.cy}
          r={dimensions.r}
          fill={palette.left}
        />

        {/* Creator circle (right) */}
        <circle
          cx={dimensions.cx2}
          cy={dimensions.cy}
          r={dimensions.r}
          fill={palette.right}
        />

        {/* Overlap intersection (Plum match) */}
        <circle
          cx={dimensions.cx2}
          cy={dimensions.cy}
          r={dimensions.r}
          clipPath={`url(#${maskId})`}
          fill={palette.match}
          opacity={0.88}
        />
      </svg>

      {showText && (
        <span
          className={`font-heading ${dimensions.textClass}`}
          style={{ color: palette.text }}
        >
          Creator<span style={{ color: palette.xColor }}>X</span>change
        </span>
      )}
    </div>
  );
};
