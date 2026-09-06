import React, { Suspense, useEffect, useState } from 'react';

// lottie-react v3 exports the component as the named export `Lottie` (no default),
// so map it to `default` for React.lazy — a plain import resolves to `undefined`
// and crashes with "element type is invalid".
const LottiePlayer = React.lazy(() =>
  import('lottie-react').then((m) => ({ default: m.Lottie }))
);

const ANIMATION_SRC = '/animations/pass-badge.json';

interface PassBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Animated "pass badge" (Lottie). Loads the player lazily so the landing
 * bundle stays lean. Renders nothing until mounted (safe for prerender/
 * hydration) and respects prefers-reduced-motion.
 */
const PassBadge: React.FC<PassBadgeProps> = ({ size = 200, className = '' }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only animate after mount (avoids SSR/prerender hydration mismatch) and
    // when the user hasn't asked for reduced motion.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden="true">
      <Suspense fallback={null}>
        {/* lottie-react v3 API: pass the JSON URL via `src` */}
        <LottiePlayer src={ANIMATION_SRC} autoplay loop />
      </Suspense>
    </div>
  );
};

export default PassBadge;
