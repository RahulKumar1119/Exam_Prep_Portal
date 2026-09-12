import React from 'react';

/**
 * Certification-body logo tile (self-drawn SVG, no external assets).
 *
 * Microsoft: authentic 4-square mark. IIBF / PMI: styled wordmark badges —
 * we name the exam body (nominative fair use) without copying their artwork.
 */
export type ExamOrg = 'IIBF' | 'Microsoft' | 'PMI' | 'QUANT';

export function orgForExam(exam: string): ExamOrg {
  if (exam === 'AI-300') return 'Microsoft';
  if (exam === 'CAPM') return 'PMI';
  if (exam === 'QUANT') return 'QUANT';
  return 'IIBF';
}

export function orgForProvider(provider: string): ExamOrg {
  if (provider === 'Microsoft') return 'Microsoft';
  if (provider === 'PMI') return 'PMI';
  return 'IIBF';
}

interface ExamOrgLogoProps {
  exam?: string;
  org?: ExamOrg;
  size?: number;
  className?: string;
}

const ExamOrgLogo: React.FC<ExamOrgLogoProps> = ({ exam, org, size = 48, className = '' }) => {
  const resolved: ExamOrg = org || orgForExam(exam || '');
  const label = resolved === 'Microsoft' ? 'Microsoft' : resolved === 'PMI' ? 'PMI' : resolved === 'QUANT' ? 'Quantitative Aptitude' : 'IIBF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${label} logo`}
      className={`rounded-xl flex-shrink-0 ${className}`}
    >
      <rect x="0" y="0" width="48" height="48" rx="10" fill="#ffffff" />
      {resolved === 'Microsoft' && (
        <g>
          <rect x="10" y="10" width="13" height="13" fill="#F25022" />
          <rect x="25" y="10" width="13" height="13" fill="#7FBA00" />
          <rect x="10" y="25" width="13" height="13" fill="#00A4EF" />
          <rect x="25" y="25" width="13" height="13" fill="#FFB900" />
        </g>
      )}
      {resolved === 'IIBF' && (
        <g>
          <text
            x="24"
            y="26"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="12"
            fill="#1B3A6B"
          >
            IIBF
          </text>
          <rect x="12" y="30" width="24" height="2.5" rx="1.25" fill="#C9A227" />
          <text
            x="24"
            y="39"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="600"
            fontSize="5.5"
            fill="#5B6B85"
          >
            EST. 1928
          </text>
        </g>
      )}
      {resolved === 'PMI' && (
        <g>
          <text
            x="24"
            y="27"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="14"
            fill="#003057"
          >
            PMI
          </text>
          <rect x="12" y="31" width="24" height="2.5" rx="1.25" fill="#00A9CE" />
        </g>
      )}
      {resolved === 'QUANT' && (
        <g>
          <text
            x="24"
            y="32"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="24"
            fill="#E11D48"
          >
            %
          </text>
        </g>
      )}
    </svg>
  );
};

export default ExamOrgLogo;
