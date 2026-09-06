import React, { Suspense, useEffect, useState } from 'react';

const LottiePlayer = React.lazy(() => import('lottie-react'));

interface PassBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Animated "pass badge" (Lottie). Loads player + JSON lazily so the
 * landing bundle stays lean. Renders nothing until hydrated (safe for
 * prerender) and respects prefers-reduced-motion.
 */
const PassBadge: React.FC<PassBadgeProps> = ({ size = 200, className = '' }) => {
  const [animationData, setAnimationData] = useState<unknown | null>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    fetch('/animations/pass-badge.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setAnimationData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!animationData) return null;

  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden="true">
      <Suspense fallback={null}>
        <LottiePlayer animationData={animationData} loop={true} autoplay={true} />
      </Suspense>
    </div>
  );
};

export default PassBadge;
